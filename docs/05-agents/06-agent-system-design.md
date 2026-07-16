# Agent system design: patterns, context & control

> _Last reviewed: 2026-07-16 — see the [freshness policy](../appendix/maintenance.md)._

## Learning objectives

After this chapter you will be able to:

- choose between a deterministic workflow, a single agent, and a multi-agent system;
- map a workload to routing, parallel, sequential, critique, coordinator, or autonomous patterns;
- design context, tools, state, budgets, stop conditions, and human control as explicit subsystems;
- identify when multi-agent decomposition adds ceremony rather than capability;
- produce an agent design record that can be evaluated and operated.

## The decision

> **What is the least autonomous control structure that can solve this task reliably within its risk, latency, and cost limits?**

This chapter synthesizes two complementary primary guides: Anthropic's [*Building effective agents*](https://www.anthropic.com/engineering/building-effective-agents) and Google Cloud's [agentic architecture component](https://docs.cloud.google.com/architecture/choose-agentic-ai-architecture-components) and [design-pattern](https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system) guides. Product names differ; the durable architecture lessons largely agree:

- use simple composition before open-ended autonomy;
- make control flow and stopping behavior explicit;
- give agents well-designed tools and just enough context;
- evaluate the whole harness and environment, not only the model;
- accept multi-agent cost and complexity only for a measurable benefit.

## Workflow and agent are different control choices

Anthropic distinguishes:

- **workflows** — models and tools follow control flow predefined in code;
- **agents** — the model dynamically chooses its process and tool use.

Both are agentic systems in the broad sense, but they have different failure surfaces. A deterministic sequence is easier to test, resume, and explain. Dynamic agents are useful when the correct path cannot be enumerated economically in advance.

Use ordinary code for arithmetic, validation, authorization, state transitions, and known business rules. Use model judgment where language ambiguity, open-ended planning, or semantic interpretation makes fixed rules brittle.

## A unified pattern catalog

| Pattern | Control flow | Use when | Avoid when |
| --- | --- | --- | --- |
| Prompt chain / sequential | Fixed ordered stages | Each stage has a clear contract and gate | Later stages need to skip or reorder dynamically |
| Router | Classifier selects a known path | Inputs fall into stable categories | Categories overlap heavily or change constantly |
| Parallel fan-out / gather | Independent work runs concurrently | Subtasks are independent and latency matters | Synthesis is harder than the original task |
| Orchestrator-workers | Model decomposes and delegates | Number and shape of subtasks are not known ahead | A fixed decomposition works |
| Evaluator-optimizer | Draft and critique repeat | Criteria are explicit and iteration measurably helps | There is no reliable evaluator or stop rule |
| Review-and-critique | Separate validation step | A distinct checker catches meaningful failures | Reviewer shares the same blind spot and evidence |
| Human-in-the-loop | Workflow pauses for a person | Consequence, uncertainty, or accountability demands review | Review is ceremonial and reviewers lack context/time |
| Autonomous tool loop | Model plans, acts, observes, adapts | Environment is open-ended and steps cannot be scripted | Actions are high impact, irreversible, or poorly observable |
| Hierarchical / swarm | Multiple dynamic agents coordinate | Specialized context or parallel search shows measured gains | Adopted because “multi-agent” sounds scalable |

Google's pattern guide distinguishes deterministic sequential/parallel flows from dynamic coordinator, hierarchical, swarm, ReAct, iterative-refinement, and custom-logic patterns. Anthropic describes prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer, and autonomous agents. The naming is less important than answering: **who chooses the next step—code, a model, or a human?**

## The agent architecture is more than the loop

| Component | Required decision |
| --- | --- |
| Interface | How users provide goals, constraints, consent, and corrections |
| Policy enforcement | What the agent may see, decide, spend, and do |
| Controller / harness | How calls, tools, retries, checkpoints, and stop rules work |
| Model | Which capability, context, latency, and deployment profile fits |
| Context builder | Which instructions, evidence, history, and tool metadata enter each step |
| Tools | Narrow operations with typed contracts and independent authorization |
| Working state | Current plan, observations, outputs, budgets, and task status |
| Memory | Explicitly selected facts allowed to persist beyond the immediate task |
| Runtime | Isolation, networking, credentials, concurrency, and resource limits |
| Evaluation | Tasks, trials, outcomes, graders, and release thresholds |
| Observability | Traces, state changes, tool calls, policy decisions, outcomes, and cost |
| Human control | Approval, correction, cancellation, escalation, and recovery |

An agent framework may implement parts of this table. It does not make the decisions for you.

## Write the loop contract

Before choosing a framework, specify:

```text
Goal:
Success state:
Allowed observations:
Allowed tools and scopes:
Prohibited actions:
Maximum steps / model calls / tool calls:
Token, cost, and wall-clock budget:
Checkpoint frequency:
Conditions requiring approval:
Conditions requiring clarification:
Stop conditions:
Cancellation and compensation behavior:
Final evidence required:
```

A vague goal plus unrestricted tools is not flexibility; it is an undefined control system.

## Context engineering for long-running agents

Anthropic's [context-engineering guidance](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) describes context as a finite resource and highlights compaction, structured notes, and subagents for longer horizons.

Apply four rules:

1. **Keep stable policy separate from transient evidence.** System instructions, permissions, and task state should not disappear during summarization.
2. **Retrieve just in time.** Do not preload every document, tool description, or conversation into every step.
3. **Compact with provenance.** Summaries should link to the original event, artifact, or source so critical detail can be recovered.
4. **Externalize durable state.** Store plans, completed steps, decisions, tests, and open questions in a typed task store—not only in conversation tokens.

For context resets, create a handoff packet containing objective, verified state, artifacts, decisions, failed approaches, remaining work, budgets, and next safe action. Anthropic's [long-running harness guidance](https://www.anthropic.com/engineering/harness-design-long-running-apps) similarly emphasizes context resets plus structured handoffs to preserve coherence.

## Tools are interfaces for an unfamiliar caller

An agent selects tools from names, descriptions, schemas, and previous results. Anthropic's [tool-design guide](https://www.anthropic.com/engineering/writing-tools-for-agents) recommends treating tool descriptions and specifications as a major performance surface.

Good tools are:

- narrow enough to authorize and understand;
- typed and explicit about units, formats, and identifiers;
- clear about read versus write behavior;
- idempotent where retries are possible;
- concise in their returned context;
- explicit about errors and partial success;
- backed by server-side validation and authorization;
- observable without logging unnecessary sensitive content.

Prefer `preview_refund` and `execute_approved_refund` over one broad `manage_account` tool. The split creates a security boundary and a useful approval point.

## Single agent before multi-agent

Multi-agent architecture is justified when at least one is true:

- subtasks require genuinely different tools, permissions, or context;
- independent work can run in parallel and reduce wall-clock time;
- context isolation prevents one large prompt from becoming polluted;
- a separate verifier has independent evidence or executable checks;
- teams or organizations own agents behind stable delegation contracts.

It is not justified merely because software microservices are successful. Each additional agent introduces another stochastic call, context boundary, state transition, failure mode, and cost center.

The peer-reviewed [AgentBench study](https://proceedings.iclr.cc/paper_files/paper/2024/hash/e9df36b21ff4ee211a8b71ee8b7e9f57-Abstract-Conference.html) found long-term reasoning, decision-making, and instruction following to be common obstacles in interactive environments. The [τ-bench study](https://arxiv.org/abs/2406.12045) further shows why repeated reliability and policy following matter in tool-agent-user interactions. Neither result supports adding more agents by default; both support measuring complete trajectories and outcomes.

## Reliability math is unforgiving

If a workflow has five required stages and each independently succeeds 95% of the time, the idealized end-to-end success rate is:

```text
0.95^5 ≈ 77%
```

Real stages are not independent, and recovery can improve the result, but the example exposes why “each agent looked good in a demo” is insufficient. Measure end-to-end success, not the average score of subagents.

Parallelism also changes budgets. Four simultaneous workers may reduce latency but multiply tokens, provider rate-limit pressure, tool contention, and synthesis conflicts.

## Safety and control plane

Keep these outside model discretion:

- authentication and authorization;
- tenant and data-policy enforcement;
- spending and time limits;
- allowed network destinations;
- destructive-action approvals;
- idempotency and transactional invariants;
- secrets and credential issuance;
- audit retention;
- emergency stop and task cancellation.

Anthropic's [trustworthy-agents principles](https://www.anthropic.com/research/trustworthy-agents) emphasize human control, secure interactions, transparency, privacy, and alignment. Translate principles into mechanisms: preview modes, staged execution, narrow scopes, visible state, reversible operations, and independent policy checks.

## Northstar pattern selection

Northstar wants an agent to resolve delayed-shipment requests.

### Candidate A: one autonomous agent

The agent reads account data, contacts logistics, decides compensation, and changes the order. It is flexible but has excessive authority and a large failure surface.

### Candidate B: bounded hybrid

1. A deterministic router classifies the request and checks identity.
2. Account and order data are retrieved through read-only tools.
3. A single agent interprets the customer's goal and selects an approved workflow.
4. Shipment investigation is delegated to the logistics agent through A2A.
5. Code calculates policy-allowed compensation.
6. The agent drafts options and evidence.
7. The customer or authorized employee approves consequential action.
8. A narrow tool executes an idempotent transaction.
9. Outcome checks confirm the state before the agent reports completion.

Candidate B uses model judgment where language is ambiguous and deterministic control where money and state change.

## Agent design review questions

1. Can this be a normal workflow with a model inside one or two steps?
2. Which decisions truly require dynamic planning?
3. What observable state proves success?
4. What prevents a model from acquiring or exercising excess authority?
5. Which context must be stable, retrieved, compacted, or persisted?
6. What are the maximum depth, fan-out, retries, time, and spend?
7. How does a human understand, interrupt, correct, and recover the task?
8. Which failures are contained locally, and which cascade?
9. Does each extra agent improve measured quality, latency, isolation, or ownership?
10. Can the design degrade to a safe workflow when models or tools fail?

## Architecture artifact: agent pattern ADR

Include:

- workload and uncertainty characteristics;
- selected control-flow pattern;
- rejected simpler pattern and evidence for rejection;
- model-controlled versus code-controlled decisions;
- context, state, memory, and handoff design;
- tools, identities, and authorization boundaries;
- budgets and stopping rules;
- approval and recovery points;
- end-to-end evaluation and SLOs;
- complexity budget for every additional agent.

## Lab

Implement the Northstar delayed-shipment workflow three ways:

1. deterministic chain with one model interpretation step;
2. single tool-using agent;
3. coordinator plus two specialized workers.

Run the same evaluation suite across all three. Compare task success, policy violations, p95 latency, model/tool calls, cost per successful task, failure localization, and operator debugging time. Select the simplest design whose evidence clears the release gates.

## Check yourself

1. What is the operational difference between a workflow and an agent?
2. When is an orchestrator-workers pattern better than a fixed parallel workflow?
3. Why should stable policy survive context compaction unchanged?
4. Name three valid reasons to introduce another agent.
5. Which parts of an agent system must remain outside model discretion?

## Further reading

- Anthropic, [*Building effective agents*](https://www.anthropic.com/engineering/building-effective-agents).
- Anthropic, [*Effective context engineering for AI agents*](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).
- Anthropic, [*Writing effective tools for agents*](https://www.anthropic.com/engineering/writing-tools-for-agents).
- Anthropic, [*Harness design for long-running application development*](https://www.anthropic.com/engineering/harness-design-long-running-apps).
- Google Cloud Architecture Center, [*Choose your agentic AI architecture components*](https://docs.cloud.google.com/architecture/choose-agentic-ai-architecture-components).
- Google Cloud Architecture Center, [*Choose a design pattern for your agentic AI system*](https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system).
- Liu et al., [*AgentBench: Evaluating LLMs as Agents*](https://proceedings.iclr.cc/paper_files/paper/2024/hash/e9df36b21ff4ee211a8b71ee8b7e9f57-Abstract-Conference.html), ICLR 2024.
- Yao et al., [*τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains*](https://arxiv.org/abs/2406.12045), 2024 preprint.
