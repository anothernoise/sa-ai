# Build and operate agents on Azure

> _Last reviewed: 2026-07-16 — see the [freshness policy](../appendix/maintenance.md). Product names, availability, quotas, and preview status change quickly; verify the linked Microsoft documentation before implementation._

## Learning objectives

After this chapter you will be able to:

- choose among Microsoft Foundry prompt agents, hosted agents, Responses API agents, and self-hosted runtimes;
- create, test, package, deploy, and invoke a Foundry agent through a reviewed lifecycle;
- map models, tools, state, identity, networking, observability, and evaluation to Azure services;
- apply Foundry control-plane and data-plane least privilege;
- produce an Azure agent deployment and operations checklist.

## Decision in one sentence

> **Use a prompt agent when declarative model-and-tool configuration is sufficient, a hosted agent when custom code needs managed execution, and your existing compute when platform ownership or runtime requirements dominate.**

## Current platform map

Microsoft's current [Foundry Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview) defines two hosted resource types and an API-driven alternative:

| Path | Definition | Best fit |
| --- | --- | --- |
| Prompt agent | Instructions, model, and tools; Foundry runs the loop | Fast managed delivery without custom orchestration |
| Hosted agent | Your agent code packaged for Foundry-managed execution | Custom frameworks, logic, and dependencies |
| Responses API agent | Definition lives in application code; call Foundry model and tools | Ephemeral, code-versioned agent without a persisted agent resource |
| App Service, Container Apps, AKS, or Functions | Self-hosted loop using Foundry models or other providers | Existing platform standards or maximum runtime control |

Hosted agents can use Microsoft Agent Framework, LangGraph, OpenAI Agents SDK, Anthropic Agent SDK, GitHub Copilot SDK, or custom code. Some hosted-agent, networking, identity, and observability features remain preview or region-dependent at the review date. Record exact status in the ADR.

## Reference architecture

```text
User
 |
Application Gateway + WAF / Front Door
 |
App Service, Container Apps, or application backend -- managed identity
 |
Private endpoint or governed Foundry endpoint
 |
Foundry Agent Service: prompt agent | hosted agent | Responses API
 |        |          |           |
Model   Tools     Conversation   Agent identity
 |        |          state       and Entra RBAC
 |        |
Foundry model   AI Search / Functions / Logic Apps / MCP / APIs
 |
Application Insights + Azure Monitor + evaluations
```

Microsoft's [baseline Foundry chat architecture](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/architecture/baseline-microsoft-foundry-chat) adds private endpoints, Azure Firewall egress, customer-owned state resources, managed identities, and zone-redundant application hosting. Use the basic reference only for learning or proof of concept.

## Choose prompt, hosted, or API-driven agents

### Prompt agent

Choose when instructions, model selection, and supported tools express the solution. Define it through the portal for discovery, then move the production definition into SDK, REST, or infrastructure-driven deployment so versions can be reviewed and promoted.

### Hosted agent

Choose when you need custom orchestration, framework code, packages, or protocol handlers while retaining a managed endpoint, scaling, session state, dedicated identity, and Foundry observability.

### Responses API

Choose when the application should own agent lifecycle and versioning. The current [Responses API quickstart](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/responses-api) describes an ephemeral definition in application code rather than a separately managed agent resource.

### Self-hosted

Choose App Service or Container Apps for conventional managed application hosting, AKS for Kubernetes control, or Functions for short event-driven steps. Do not adopt a purpose-built agent runtime merely because the workload calls a model.

## Prepare the Foundry environment

Create a Foundry account and project, deploy an approved model, and assign separate provisioning and runtime roles. Use separate projects or subscriptions for development, staging, and production where risk requires it.

For a hosted-agent development path, current prerequisites include Azure CLI, Azure Developer CLI, a Foundry project and model, Python, and the Foundry extension:

```bash
az login
azd auth login
azd ext install microsoft.foundry
```

Exact extension names and minimum versions have changed during the preview lifecycle; follow the current [hosted-agent quickstart](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/quickstart-hosted-agent) rather than copying an old tutorial.

## Implement a hosted agent contract

The current [bring-your-own-code guide](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/quickstart-deploy-own-code) expects an entry point and dependency file, then adds a Responses or Invocations protocol hosting library.

Begin with:

```text
my-agent/
├── main.py
├── requirements.txt
├── tests/
├── evals/
└── azure.yaml or deployment configuration
```

Use the Responses protocol when standard conversation history and an OpenAI-compatible interface fit. Use Invocations when the application needs full control of request and response schemas. Keep business authorization independent of either protocol.

Define:

- goal, success, abstention, escalation, and stop conditions;
- typed tool and output contracts;
- external task state and idempotency;
- model, tool, token, time, and spend budgets;
- source-linked evidence for consequential answers;
- cancellation, compensation, and safe-degradation behavior.

## Test, deploy, and invoke

The official flow supports the Foundry Toolkit, Azure Developer CLI, SDKs, or coding agents using Microsoft's Foundry Skill. Regardless of interface:

1. inspect the files, model, region, subscription, resource group, roles, and estimated cost;
2. run local unit, contract, adversarial, and failure tests;
3. preview infrastructure changes where the chosen tool permits it;
4. deploy an immutable version;
5. invoke it through the same identity and network path as production;
6. confirm traces, permissions, state isolation, and outcome metrics;
7. promote through environments only after release gates pass.

Typical `azd` hosted-agent workflows use local run, deployment, invocation, and status commands supplied by the installed extension. Run `azd ai agent --help` and the current quickstart in the pinned toolchain rather than assuming a prerelease command contract.

## Identity and RBAC

Azure separates ARM control-plane permissions from Foundry data-plane permissions. Owner or Contributor does not automatically grant agent creation or interaction rights.

The current [hosted-agent permissions reference](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agent-permissions) documents roles such as Foundry Project Manager for management and Foundry Agent Consumer for least-privilege interaction. Each hosted agent receives an Entra identity.

Apply:

- separate developer, deployer, application, and agent identities;
- minimum RBAC at project, agent, model, search, storage, and tool scope;
- managed identity rather than embedded keys;
- explicit end-user delegation when an agent acts for a person;
- server-side authorization in every tool;
- periodic role and connection review;
- audit tests for denied paths.

The agent identity should not inherit every permission of the project deployer.

## Tools, state, and knowledge

Foundry agents can connect to platform tools, Azure AI Search, functions, APIs, MCP services, and custom code. Treat each connection as a trust boundary.

- expose narrow operations with typed schemas;
- separate preview and mutation;
- use private endpoints and managed identities where possible;
- validate arguments and business invariants downstream;
- use idempotency and approval for consequential actions;
- preserve user and tenant context through the tool call;
- trace tool and business outcomes, not only HTTP success.

Conversation history supports continuity but is not automatically durable semantic memory or an authoritative record. Define retention, correction, deletion, export, and tenant-isolation behavior for Cosmos DB, Storage, Search, caches, and telemetry.

## Private networking

The current [Foundry private networking guide](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/how-to/virtual-networks) documents Standard Setup, private endpoints, delegated subnets, private registries, tool limitations, and region-specific behavior. Networking choices can be difficult to retrofit—especially hosted-agent VNet injection—so decide them before the production project is created.

For regulated or sensitive workloads:

- disable public network access where supported;
- route outbound traffic through Azure Firewall or approved egress controls;
- use private endpoints for Foundry, Search, Storage, Cosmos DB, Key Vault, and registries;
- plan subnet IP capacity for agent microVMs and data proxies;
- run CI/CD from a network path that can resolve and reach private endpoints;
- test DNS, failover, and dependency reachability.

## Observability and evaluation

Microsoft Foundry uses Application Insights and Azure Monitor. The current [observability documentation](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability) covers OpenTelemetry-based traces, framework integrations, evaluators, alerts, and production monitoring.

Trace:

- project, agent, version, and represented user;
- model and prompt/skill versions;
- tool invocations and authorization results;
- retrieval and conversation-state operations;
- approval and safety decisions;
- latency, exceptions, tokens, retries, and cost;
- task and business outcomes.

Run offline and trace-based evaluations for task success, groundedness, tool use, policy compliance, isolation, harmful actions, p95 latency, and cost per successful task. Validate evaluators against human-labeled cases and note which capabilities are preview.

## Production checklist

1. Choose prompt, hosted, Responses API, or self-hosted architecture explicitly.
2. Separate environments, subscriptions/projects, identities, and data.
3. Pin agent, model, prompt, skill, tool, and dependency versions.
4. Provision through reviewed Bicep or Terraform and CI/CD.
5. Apply Foundry data-plane and ARM control-plane least privilege.
6. Decide private networking and egress before creating production resources.
7. Define conversation state, memory, retention, correction, and deletion.
8. Enforce tool budgets, approvals, validation, and idempotency.
9. Gate promotion with evaluation, security, load, and failure tests.
10. Test canary, rollback, kill switch, model/tool outage, and regional recovery.

## Northstar lab

Implement the same read-only shipment agent twice:

1. as a prompt agent with supported tools;
2. as a hosted code-based agent with custom orchestration.

Use the same model deployment, tools, dataset, and evaluation set. Add managed identity, least-privilege RBAC, private data access, tracing, and adversarial cases. Compare task success, policy compliance, p95 latency, cost, operational burden, and debugging time. Select the prompt agent unless hosted code demonstrates a material benefit.

## Check yourself

1. What is the operational difference between a prompt and hosted agent?
2. Why does Azure Contributor not necessarily allow Foundry agent interaction?
3. When is the Responses API preferable to a persisted agent resource?
4. Which networking choices are difficult to retrofit?
5. What must a post-deployment test prove that a local test cannot?

## Further reading

- Microsoft, [Foundry Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview).
- Microsoft, [Choose how to build with Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/choose-build-approach).
- Microsoft, [Deploy a hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/quickstart-hosted-agent).
- Microsoft, [Deploy your own agent code](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/quickstart-deploy-own-code).
- Azure Architecture Center, [Baseline Foundry chat architecture](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/architecture/baseline-microsoft-foundry-chat).
- Microsoft, [Foundry Agent Service permissions](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agent-permissions).
- Microsoft, [Foundry observability](https://learn.microsoft.com/en-us/azure/foundry/concepts/observability).
