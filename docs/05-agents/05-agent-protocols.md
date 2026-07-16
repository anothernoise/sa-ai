# MCP, A2A & enterprise agent interoperability

> _Last reviewed: 2026-07-16 — see the [freshness policy](../appendix/maintenance.md)._

## Learning objectives

After this chapter you will be able to:

- distinguish tool interoperability from agent-to-agent delegation;
- place MCP and A2A at appropriate boundaries in an enterprise architecture;
- design discovery, identity, authorization, tenancy, and audit controls;
- handle protocol versioning, long-running work, failure, and cancellation;
- decide when a normal API or event contract is the better choice.

## The decision

> **Should this boundary expose a tool, delegate a task to an opaque agent, or remain an ordinary application API?**

MCP and A2A solve related but different problems. They are not a replacement for authorization, workflow design, service contracts, or domain APIs.

## The protocol layers

| Boundary | Best abstraction | Typical contract |
| --- | --- | --- |
| Model/application needs data or a narrow capability | Tool interoperability | MCP tool, resource, or prompt |
| One agent delegates a goal to another autonomous service | Agent interoperability | A2A task, message, artifact, and Agent Card |
| Application needs a stable business operation | Service interoperability | REST, gRPC, GraphQL, event, or workflow API |
| Internal code calls a local function | In-process contract | Typed function/module interface |

A useful shorthand is: **MCP connects an agent to capabilities; A2A connects an agent to another agent.** An A2A server may itself use MCP servers to reach tools and data.

## MCP: capability access

The Model Context Protocol defines a host-client-server structure. A host application manages one or more MCP clients; each client connects to an MCP server that exposes capabilities.

Core capability types include:

- **tools** — invocable operations with typed arguments;
- **resources** — addressable context or data the client can read;
- **prompts** — reusable prompt templates exposed by a server.

MCP standardizes discovery and invocation, but the architect still owns:

- whether a tool should exist;
- which identity is represented;
- authorization for each invocation;
- input validation and output handling;
- data classification and logging;
- network and execution isolation;
- retry, idempotency, and compensation behavior.

The [MCP 2025-11-25 authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) uses OAuth-based discovery and resource indicators to bind tokens to their intended server. Its [security guidance](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) explicitly forbids token passthrough: accepting a token without validating that it was issued for the MCP server, then forwarding it downstream, breaks audience controls and auditability.

As of this review date, the announced MCP `2026-07-28` specification is a **release candidate**, not the final stable version. It proposes a more stateless HTTP core, long-running Tasks, MCP Apps, and authorization changes. Track it, test it, but do not represent the RC as a finalized production standard. See the [official release-candidate notice](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/).

## A2A: task delegation between opaque agents

The Agent2Agent protocol treats a remote agent as an enterprise application that can accept work without exposing its internal memory, framework, tools, or reasoning.

Important concepts in the [current A2A specification](https://a2a-protocol.org/latest/specification/) include:

- **A2A client** — initiates work on behalf of a user or system;
- **A2A server / remote agent** — accepts and manages work;
- **Agent Card** — declares identity, skills, endpoints, protocol versions, capabilities, and authentication requirements;
- **message** — a communication turn containing one or more typed parts;
- **task** — a stateful unit of work that can progress, fail, complete, or be cancelled;
- **artifact** — a result produced by the task;
- **streaming and push notification** — optional mechanisms for long-running progress.

Agent Cards support discovery, not trust by themselves. Use curated registries, TLS verification, allowlists, signed cards where appropriate, and authenticated extended cards for non-public capabilities.

## Enterprise reference pattern

```text
User / service identity
        |
        v
Agent host and policy enforcement point
  |          |                 |
  |          |                 +--> Audit / eval / telemetry
  |          |
  |          +--> A2A client --> Remote specialist agent
  |
  +--> MCP client --> MCP server --> System-of-record API
                         |
                         +--> Narrow tool authorization
```

The host owns the user experience, policy, task state, and approval flow. MCP servers adapt controlled capabilities. A2A delegates bounded tasks to independently operated agents. Systems of record retain authoritative business state.

## Identity is a chain, not one token

Represent at least four identities explicitly:

1. **Human or calling service** — who requested the work?
2. **Agent workload** — which deployed agent instance is acting?
3. **Protocol client** — which MCP/A2A client made this request?
4. **Target resource** — for which server or downstream system was authority granted?

Do not flatten these into a shared API key. The audit record should distinguish “Alice asked the Northstar support agent” from “support-agent workload invoked refund-preview MCP tool against account 123.”

### Authorization rules

- Validate token issuer, signature, audience, expiry, scopes, and tenant.
- Authorize every tool, skill, and business object server-side.
- Prefer short-lived, audience-bound credentials.
- Use incremental or step-up consent for new consequential scopes.
- Never infer authorization from an Agent Card, tool description, prompt, or model output.
- Do not forward the user's broad token to downstream systems.
- Re-check authority when a long-running task resumes after credentials or policy may have changed.

## Capability discovery without capability escalation

Discovery metadata is untrusted input. A malicious or compromised server could advertise persuasive tool descriptions, changed schemas, or unexpected skills.

Controls:

- admit servers and agents through a registry review;
- pin owner, endpoint, protocol version, and expected capability hashes;
- restrict which descriptions enter model context;
- validate schemas and impose argument limits;
- separate read, draft, and execute capabilities;
- require approval for newly discovered high-risk capabilities;
- monitor changes to Agent Cards and MCP server manifests.

## Protocol versioning and compatibility

Protocols evolve independently of your business contract. For each connection, record:

- protocol and exact version;
- supported transport and optional features;
- capability/schema version;
- authentication scheme;
- extension URIs;
- fallback and deprecation date.

Negotiate capabilities; do not optimistically call optional operations. Run contract tests against every supported client/server pair. Treat changes to tool schemas, Agent Cards, authentication metadata, or task states as production changes even when the protocol version is unchanged.

## Long-running tasks and failure semantics

Define these states at the application layer even if a protocol transports them:

- accepted, running, waiting for input, waiting for approval;
- completed, failed, rejected, expired, cancelled;
- cancellation requested but not yet confirmed;
- outcome uncertain after timeout or disconnect.

Every task needs an idempotency key, owner, deadline, budget, checkpoint policy, and authoritative result location. Push notifications and webhooks must be authenticated, replay-resistant, rate-limited, and safe from server-side request forgery. Duplicate notifications should be processed idempotently.

Cancellation is not rollback. If a remote agent has already changed external state, the caller needs a compensating operation or human recovery path.

## MCP, A2A, or ordinary API?

| Question | If yes |
| --- | --- |
| Does a model need to discover and call several narrow capabilities? | Consider MCP |
| Is work delegated to a remote agent that chooses its own internal plan? | Consider A2A |
| Is the operation stable, deterministic, and directly called by normal software? | Prefer a normal typed API |
| Must every step follow a fixed regulated workflow? | Prefer workflow orchestration; agents may assist inside bounded steps |
| Is there only one client and one local implementation? | A protocol layer may be unnecessary |

Avoid protocol maximalism. A stable `POST /refund-previews` operation does not become better merely because a model can discover it dynamically.

## Northstar worked example

Northstar's support agent needs account data, a policy interpretation, and shipping assistance from a logistics partner.

- Account lookup and refund preview are narrow MCP tools backed by Northstar APIs.
- Refund execution is a separate high-risk tool requiring step-up authorization and human approval.
- The logistics partner exposes an A2A agent that accepts a bounded “investigate delayed shipment” task and returns artifacts.
- The Northstar host keeps the customer conversation and authoritative task state.
- The partner receives only the order and customer fields required for the task, not the entire conversation or account token.
- Every cross-boundary call records user, workload, client, tenant, target, scope, task ID, policy decision, and resulting state.

If the A2A agent is unavailable, Northstar creates a normal partner-service ticket. If the MCP refund tool is unavailable, the agent may explain the outage and prepare a draft; it may not claim the refund occurred.

## Threat and failure checklist

| Risk | Required design response |
| --- | --- |
| Confused deputy / token passthrough | Audience-bound tokens and server-side authorization |
| Malicious tool description | Registry, manifest review, schema validation, context isolation |
| Agent Card spoofing | TLS verification, trusted registry, optional signature verification |
| Cross-tenant access | Tenant binding in identity, storage, task IDs, and every query |
| SSRF through callbacks | Destination allowlists, verification, egress controls |
| Duplicate or reordered messages | Idempotency and monotonic state transitions |
| Unbounded delegation | Depth, fan-out, cost, time, and domain limits |
| Protocol downgrade | Version policy and rejection of unsupported security modes |
| Partial completion | Outcome reconciliation and compensation plan |
| Sensitive trace data | Redaction, access control, retention, and purpose limitation |

## Architecture artifact: protocol boundary record

For every MCP or A2A connection, document:

- why a protocol is justified over an ordinary API;
- owner and trust classification;
- data classes crossing the boundary;
- human, workload, client, and target identities;
- authorization and consent flow;
- protocol/capability versions and extensions;
- task state, idempotency, cancellation, and compensation;
- network, runtime, and egress isolation;
- audit events, evals, SLOs, and incident owner;
- fallback and exit plan.

## Lab

Extend the Northstar support agent with:

1. a read-only account MCP server;
2. a refund-preview tool with a typed output;
3. a mock A2A logistics agent exposing an Agent Card and long-running task;
4. tenant and audience validation;
5. a simulated timeout, duplicate callback, and changed capability manifest.

Deliver a boundary diagram, authorization sequence, contract tests, audit sample, and explanation of why refund execution remains outside the default tool set.

## Check yourself

1. Why are MCP and A2A complementary rather than competing protocols?
2. Why must an MCP server reject a valid token issued for a different audience?
3. What does an Agent Card establish, and what does it *not* establish?
4. How does task cancellation differ from compensation?
5. When should you retain an ordinary business API instead of wrapping it in an agent protocol?

## Further reading

- [MCP specification, 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/).
- [MCP authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) and [security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices).
- [MCP 2026-07-28 release candidate notice](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) — track as pre-release until finalized.
- [A2A current specification](https://a2a-protocol.org/latest/specification/) and [project overview](https://a2a-protocol.org/latest/).
- Anthropic, [*Code execution with MCP: building more efficient AI agents*](https://www.anthropic.com/engineering/code-execution-with-mcp), an implementation pattern that reduces repeated tool-result context but increases the importance of sandboxing.
