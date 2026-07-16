# Build and operate agents on AWS

> _Last reviewed: 2026-07-16 — see the [freshness policy](../appendix/maintenance.md). Product names, availability, quotas, and preview status change quickly; verify the linked AWS documentation before implementation._

## Learning objectives

After this chapter you will be able to:

- choose between a managed AgentCore harness, code-based AgentCore Runtime, and ordinary AWS compute;
- create, test, deploy, invoke, and observe a code-based agent with the AgentCore CLI;
- map tools, memory, identity, isolation, networking, and telemetry to AWS services;
- avoid starting a new architecture on Bedrock Agents Classic;
- produce an AWS agent deployment and operations checklist.

## Decision in one sentence

> **Use Bedrock AgentCore when you want a purpose-built, framework- and model-flexible agent control plane; use Lambda, ECS, or EKS when ordinary compute gives a better operational fit.**

## The 2026 product transition

AWS's [CreateAgent API documentation](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent_CreateAgent.html) states that Amazon Bedrock Agents is now **Bedrock Agents Classic** and will stop accepting new customers on July 30, 2026. Existing customers can continue using it, but new architectures should evaluate [Amazon Bedrock AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/).

Do not confuse the layers:

| Layer | AWS choice | Purpose |
| --- | --- | --- |
| Model access | Amazon Bedrock or another provider | Foundation-model inference |
| Agent framework | Strands, LangGraph, ADK, OpenAI Agents, or custom | Agent loop and orchestration code |
| Purpose-built runtime | AgentCore Runtime | Secure, serverless agent hosting |
| Tool control plane | AgentCore Gateway | MCP, API, Lambda, HTTP, and agent connectivity |
| Identity | AgentCore Identity plus IAM or external IdP | Workload and user-bound credentials |
| Memory | AgentCore Memory or application data stores | Short- and long-term context |
| Built-in execution | AgentCore Browser and Code Interpreter | Isolated browser and code tools |
| Telemetry | AgentCore Observability and CloudWatch | Traces, metrics, logs, and audit |
| General compute | Lambda, ECS/Fargate, or EKS | Custom runtime and infrastructure control |

AgentCore services can be adopted independently. A team can host an agent elsewhere while using Gateway or Observability.

## Choose a build path

| Path | Choose when | Trade-off |
| --- | --- | --- |
| AgentCore managed harness | Configuration is sufficient and speed matters | Less orchestration control; documented as preview at review date |
| AgentCore code-based agent | You need custom logic with managed runtime operations | Own agent code and dependencies |
| Lambda | Runs are short, event-driven, and naturally stateless | Long agent sessions and streaming need careful design |
| ECS/Fargate | You need container control without Kubernetes | You own more runtime integration |
| EKS | Platform already standardizes on Kubernetes or needs deep control | Highest operational burden |

The current [AgentCore quickstart](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html) describes code-based agents as GA and the managed harness as preview. Pin the decision date and service status in the ADR.

## Reference architecture

```text
Client / channel
      |
API Gateway or application endpoint ---- Cognito / enterprise IdP
      |
AgentCore Runtime -- agent session and framework loop
      |       |        |          |
      |       |        |          +-- Observability --> CloudWatch / OTEL export
      |       |        +------------- Memory --> scoped events and records
      |       +---------------------- Identity --> IAM, OAuth, API credentials
      +------------------------------ Gateway --> MCP / Lambda / APIs / A2A
      |
Amazon Bedrock or approved external model provider
```

Keep the application authorization decision outside the model. Gateway and downstream services verify what the workload and represented user may do.

## Create the agent

The official CLI flow requires Node.js 20+, Python 3.10+, configured AWS credentials, and appropriate IAM permissions:

```bash
npm install -g @aws/agentcore
agentcore --version
agentcore create
```

The wizard selects the framework, model provider, memory option, and zip or container build. It creates agent code under `app/` and infrastructure configuration under `agentcore/`.

Keep the first implementation small:

- one goal and explicit success condition;
- one or two read-only tools;
- no durable memory until a memory contract exists;
- maximum model calls, tool calls, wall time, and spend;
- typed output and deterministic validation;
- safe behavior when a model, tool, or memory service is unavailable.

## Test locally

```bash
cd MyAgent
agentcore dev
```

The CLI starts a local development server and inspector with traces. Add tests for:

- correct and incorrect tool selection;
- malformed tool results and timeouts;
- prompt injection in retrieved data;
- retries and idempotency;
- user and session isolation;
- budget and stop-condition enforcement;
- cancellation and partial completion.

Local success does not prove IAM, VPC, quota, concurrency, or managed-runtime behavior. Retest after deployment.

## Deploy and invoke

```bash
agentcore deploy --plan
agentcore deploy
agentcore status
agentcore invoke --prompt "Investigate shipment 184 and cite carrier events."
```

The current CLI packages the agent, uses AWS CDK to provision resources, creates a Runtime endpoint, and configures CloudWatch observability. Direct code deployment uses a zip; container deployment gives more runtime control but makes the team responsible for rebuilding images and patching dependencies. See the [direct deployment responsibility model](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy.html).

## Connect tools safely

[AgentCore Gateway](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html) can expose Lambda functions, OpenAPI or Smithy services, MCP servers, HTTP targets, other agents, and model routes through a managed gateway.

Apply these rules:

- expose narrow read and write operations rather than broad administrative APIs;
- separate preview from execute tools;
- validate every argument server-side;
- use IAM or OAuth scopes per tool and represented user;
- make mutations idempotent;
- retain tool input, authorization result, result status, and business outcome;
- restrict outbound network destinations and secrets;
- require approval for consequential or irreversible actions.

## Identity, memory, and isolation

AgentCore Identity brokers IAM SigV4, OAuth, and API credentials. Do not place long-lived credentials in prompts, environment variables, or skill files. Bind authorization to workload identity and, when required, the end-user identity.

AWS's [agent security reference guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture-generative-ai/gen-auto-agents.html) describes Runtime session isolation, Gateway authentication, Identity credential brokering, VPC endpoints, and scoped memory namespaces. Confirm current limits and retention behavior when defining memory deletion and residency requirements.

Memory keys must derive from authenticated tenant, actor, session, and strategy identifiers. A model-supplied user ID is untrusted input. Test deletion across records, indexes, caches, logs, and application projections.

## Observability and evaluation

[AgentCore Observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html) emits CloudWatch telemetry and supports OpenTelemetry-compatible data. Trace:

- authenticated principal, session, agent, and version;
- model calls and token usage;
- tool selection, authorization, retries, and results;
- memory reads and writes;
- guardrail and approval decisions;
- outcome, latency, error class, and cost.

Do not log chain-of-thought or unnecessary sensitive content. Store useful decision summaries, evidence references, and structured state transitions instead.

Release gates should include repeated task success, policy compliance, zero cross-tenant leakage, tool correctness, safe cancellation, p95 latency, and cost per successful task.

## Production checklist

1. Use separate AWS accounts or strong environment boundaries for development, staging, and production.
2. Provision with reviewed CDK, CloudFormation, or Terraform and prevent console drift.
3. Pin agent, framework, skill, prompt, model, and dependency versions.
4. Scope IAM roles and Gateway targets to minimum actions and resources.
5. Use VPC endpoints and egress controls where required.
6. Store secrets in managed secret and identity services.
7. Define concurrency, rate, token, time, and cost limits.
8. Create offline evaluations and post-deploy smoke and canary tests.
9. Alert on tool failures, policy denials, latency, token growth, and outcome regressions.
10. Test rollback, memory outage, model fallback, tool outage, and emergency disable.

## Northstar lab

Build a read-only shipment-investigation agent:

1. scaffold a code-based AgentCore project;
2. connect one Bedrock model and two Gateway tools for shipment events and facility incidents;
3. use IAM least privilege and separate tenant/session scopes;
4. add source-linked responses and an abstention path;
5. run local adversarial and failure tests;
6. deploy with a reviewed plan and invoke the managed endpoint;
7. inspect CloudWatch traces and calculate cost per successful investigation;
8. demonstrate safe behavior when Gateway or Memory is unavailable.

## Check yourself

1. Why should a new AWS customer avoid Bedrock Agents Classic?
2. When is Lambda a better runtime than AgentCore Runtime?
3. Which authorization decisions must remain outside the agent loop?
4. What additional evidence is required after local tests pass?
5. Which AgentCore components can be adopted without hosting on Runtime?

## Further reading

- AWS, [Amazon Bedrock AgentCore overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/).
- AWS, [AgentCore CLI quickstart](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-cli.html).
- AWS, [AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html).
- AWS, [AgentCore Gateway](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html).
- AWS, [AgentCore Observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html).
- AWS Prescriptive Guidance, [Security for agentic AI on AWS](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/best-practices-system-design.html).

