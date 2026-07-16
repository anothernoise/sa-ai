# Build and operate agents on Google Cloud

> _Last reviewed: 2026-07-16 — see the [freshness policy](../appendix/maintenance.md). Product names, availability, quotas, and preview status change quickly; verify the linked Google Cloud documentation before implementation._

## Learning objectives

After this chapter you will be able to:

- choose among Agent Runtime, Cloud Run, and GKE for an agent workload;
- build an agent with ADK and move it through local, evaluation, infrastructure, and deployment stages;
- connect models, MCP tools, A2A agents, Sessions, Memory Bank, and observability;
- design least-privilege agent identity and private connectivity;
- produce a Google Cloud agent production checklist.

## Decision in one sentence

> **Use Gemini Enterprise Agent Platform Agent Runtime for a managed Python agent lifecycle, Cloud Run for serverless container flexibility, and GKE only when deeper runtime control justifies Kubernetes operations.**

## Current platform map

Google's current [agent architecture component guide](https://docs.cloud.google.com/architecture/choose-agentic-ai-architecture-components) separates the agent framework, agent runtime, model runtime, tools, memory, and user interface.

| Layer | Google Cloud choice | Purpose |
| --- | --- | --- |
| Framework | Agent Development Kit (ADK), LangGraph, or custom | Agent logic and orchestration |
| Managed agent runtime | Gemini Enterprise Agent Platform Agent Runtime | Deploy, scale, manage, and observe Python agents |
| General serverless runtime | Cloud Run | Any containerized framework and language |
| Kubernetes runtime | GKE | Maximum infrastructure and networking control |
| Model runtime | Agent Platform models or external provider | Gemini, partner, open, or custom model access |
| Tools | ADK tools, functions, MCP, API management | Data access and actions |
| Agent interoperability | A2A | Delegation across agent boundaries |
| Session and memory | Agent Platform Sessions and Memory Bank | Conversation state and long-term memory |
| Execution | Agent Platform Code Execution | Managed isolated code sandbox |
| Telemetry | Cloud Trace, Monitoring, and Logging | Traces, metrics, logs, and alerts |

The current API may still use the historical `ReasoningEngine` resource name for compatibility even where documentation says Agent Runtime.

## Choose the runtime

| Requirement | Agent Runtime | Cloud Run | GKE |
| --- | --- | --- | --- |
| Fully managed agent lifecycle | Strongest | Build it from services | Build it from services |
| Language flexibility | Python at review date | Container language of choice | Container language of choice |
| Custom MCP server hosting | Use another runtime | Yes | Yes |
| Infrastructure control | Lowest | Medium | Highest |
| Scale-to-zero serverless | Managed | Native | Requires design |
| Complex networking or sidecars | Limited by service | Moderate | Strongest |
| Operational burden | Lowest | Medium | Highest |

Use the ordinary runtime already trusted by the platform team unless Agent Runtime's managed sessions, memory, execution, and agent lifecycle create clear value.

## Reference architecture

```text
Web / mobile / enterprise channel
               |
 Load balancer, IAP, API gateway, or application backend
               |
 Agent Runtime | Cloud Run | GKE ---- per-agent identity / service account
       |            |           |
       +------------+-----------+---- Agent Platform model endpoint
       |            |           +---- MCP / function tools / API management
       |            +---------------- A2A agents
       +----------------------------- Sessions / Memory Bank
       +----------------------------- Trace / Logging / Monitoring
```

Authorization belongs in IAM, API management, tool servers, and data systems. Model instructions do not grant Google Cloud permissions.

## Build with ADK and Agents CLI

Google recommends the open-source ADK for its managed platform, while supporting other frameworks. The current [Agents CLI documentation](https://google.github.io/agents-cli/guide/getting-started/) provides a lifecycle toolchain for scaffolding, evaluation, infrastructure, and deployment.

A representative flow is:

```bash
agents-cli setup
agents-cli create northstar-agent -d agent_runtime
agents-cli playground
agents-cli eval generate
agents-cli eval grade
gcloud config set project YOUR_DEV_PROJECT_ID
agents-cli deploy --project YOUR_DEV_PROJECT_ID --region YOUR_REGION
agents-cli deploy --status
```

The exact generated files and commands evolve. Review the manifest, Dockerfile, infrastructure, IAM, model, and region before deployment.

The current [deployment guide](https://google.github.io/agents-cli/guide/deployment/) can target `agent_runtime`, `cloud_run`, or `gke`. Keep the agent contract portable so changing runtime does not require rewriting business policy.

## Agent implementation contract

Begin with:

- a bounded goal and typed input/output;
- clear success, abstention, and stop conditions;
- one or two narrow read-only tools;
- deterministic validation outside the model;
- explicit model, tool, token, time, and cost budgets;
- external task state and idempotent retries;
- no persistent memory until ownership and retention are defined.

ADK tools can be plain functions, built-in tools, MCP tools, or agent tools. Use MCP when protocol-level reuse and discovery matter; use a function for an internal operation that does not need a separate protocol boundary.

## Identity and permissions

Google's current [Agent Runtime environment guide](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime/setup) recommends per-agent IAM identity where available and also supports shared or custom service accounts. At the review date, some agent identity features are preview.

Apply:

- one agent identity per distinct authority boundary;
- minimum roles at the narrowest resource scope;
- user-delegated authorization for user-owned data and actions;
- Secret Manager rather than credentials in code or prompts;
- VPC Service Controls and controlled egress where required;
- separate deployment and runtime identities;
- audit tests proving denied access remains denied.

A shared service account across many agents expands blast radius and makes attribution harder.

## Sessions, memory, and tools

[Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime) provides managed Sessions, Memory Bank, Code Execution, observability, and governance integrations. Sessions store interaction state; Memory Bank stores selected long-term information. Do not treat either as a system of record.

For memory:

- derive scope from authenticated identity;
- store source, time, confidence, and revision;
- validate writes and prevent retrieved instructions from becoming policy;
- implement inspection, correction, TTL, and deletion;
- test cross-tenant isolation and stale-memory handling;
- account for separate usage charges.

For tools:

- use narrow function schemas and server-side validation;
- use Google Cloud MCP servers or self-hosted servers only after security review;
- centralize high-scale API protection and observability with API management;
- use A2A for opaque agent delegation, not ordinary function calls;
- preserve the end-user authorization context when actions occur on a user's behalf.

## Deploy from source, image, or Git

The current [Agent Runtime deployment documentation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/deploy-an-agent) supports deployment from an agent object, local source, Dockerfile, Artifact Registry image, or a connected Git repository. Choose:

- object deployment for experiments;
- source or Git deployment for reviewed CI/CD;
- Dockerfile or image deployment for controlled runtime dependencies;
- Cloud Run or GKE when the managed runtime's language or hosting constraints do not fit.

Promote immutable artifacts through environments. Do not rebuild different dependency graphs for staging and production.

## Observability and evaluation

Trace:

- agent and deployment version;
- authenticated principal and session scope;
- model, prompt, skill, and tool versions;
- tool arguments, authorization outcome, and result status;
- memory reads, writes, revisions, and policy decisions;
- latency, tokens, errors, retries, and cost;
- business outcome and human correction.

Use Cloud Trace with OpenTelemetry, Cloud Logging, and Cloud Monitoring. Configure content logging only where privacy and retention policy permit it.

Evaluate before deployment and continuously after:

- task success across repeated trials;
- tool selection and argument correctness;
- groundedness and citation quality;
- policy and safety violations;
- session and tenant isolation;
- safe recovery from tool, model, memory, and network faults;
- p95 latency and cost per successful task.

## Production checklist

1. Separate projects and identities by environment.
2. Select Agent Runtime, Cloud Run, or GKE with explicit rejection criteria.
3. Pin model, agent, skill, prompt, tool, and dependency versions.
4. Provision APIs, IAM, networks, registries, and telemetry with reviewed IaC.
5. Enforce least privilege and private connectivity where required.
6. Externalize task state and define session and memory retention.
7. Set token, tool, concurrency, time, and spend budgets.
8. Run evaluation and security gates before promotion.
9. Deploy canaries and monitor quality as well as infrastructure.
10. Test rollback, kill switch, deletion, fallback, and regional failure behavior.

## Northstar lab

Build a shipment-investigation agent with ADK:

1. scaffold it for Agent Runtime;
2. add two read-only tools and source-linked output;
3. use a dedicated identity with minimum access;
4. create offline evaluation and adversarial cases;
5. deploy to a development project and inspect traces;
6. deploy the same contract to Cloud Run and compare operations;
7. compare task success, p95 latency, cost, scaling, and operator effort;
8. select the simplest runtime that clears the release gates.

## Check yourself

1. Why might Cloud Run be a better choice than Agent Runtime?
2. What does the legacy `ReasoningEngine` API name imply for portability?
3. When should an ADK function become an MCP server?
4. Why should each high-authority agent have a distinct identity?
5. Which tests must run again after managed deployment?

## Further reading

- Google Cloud, [Agentic AI architecture guides](https://docs.cloud.google.com/architecture/agentic-ai-overview).
- Google Cloud, [Choose agent architecture components](https://docs.cloud.google.com/architecture/choose-agentic-ai-architecture-components).
- Google Cloud, [Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime).
- Google Cloud, [Deploy an agent](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/deploy-an-agent).
- Google, [Agents CLI deployment guide](https://google.github.io/agents-cli/guide/deployment/).
- Google Cloud, [Host AI agents on Cloud Run](https://docs.cloud.google.com/run/docs/ai-agents).

