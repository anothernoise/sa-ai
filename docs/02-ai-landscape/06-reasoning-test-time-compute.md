# Reasoning systems & test-time compute

> _Last reviewed: 2026-07-16 — see the [freshness policy](../appendix/maintenance.md)._

## Learning objectives

After this chapter you will be able to:

- distinguish a reasoning-capable model from a reasoning *system*;
- allocate inference-time compute according to task difficulty, consequence, and verifiability;
- compare single-pass, decomposition, sampling, search, and verifier-based strategies;
- design latency, cost, evaluation, and fallback controls for reasoning workloads.

## The decision

> **How much computation should this request receive, and what mechanism will turn that computation into a more trustworthy result?**

The wrong default is either “always use the strongest model” or “let the model think as long as it wants.” Reasoning quality is a property of the complete system: model, prompt, context, tools, candidate-generation strategy, verifier, stopping rule, and budget.

## Reasoning model vs reasoning system

A model may have been trained to spend more computation on difficult problems. The surrounding system still decides what evidence it receives, whether it may use tools, how many attempts are allowed, how results are checked, and what happens when confidence is insufficient.

| Layer | Architecture responsibility |
| --- | --- |
| Base or reasoning model | Generate candidate conclusions, plans, or actions |
| Context | Supply relevant facts, constraints, examples, and tool results |
| Controller | Allocate attempts, tokens, wall-clock time, and tools |
| Decomposer | Split a task into explicit subproblems when useful |
| Verifier | Check constraints, calculations, evidence, tests, or policy |
| Selector | Choose, merge, reject, or escalate candidates |
| Guardrail | Enforce action, data, and resource boundaries independently of reasoning |

Do not treat hidden reasoning text as an audit log. Store the evidence used, tools invoked, decisions made, validation results, and a concise user-facing rationale. Those are stable system artifacts; free-form internal reasoning is not.

## Ways to spend test-time compute

| Strategy | Best fit | Main cost or failure |
| --- | --- | --- |
| Single pass | Easy, reversible, low-consequence tasks | Insufficient work on genuinely difficult cases |
| Longer deliberate generation | Problems helped by sequential reasoning | Latency; the model may elaborate without improving |
| Decomposition | Tasks with separable, checkable subproblems | Bad decomposition propagates error |
| Self-revision | Drafts with clear critique criteria | Repeated polishing can preserve the same misconception |
| Parallel sampling / best-of-N | Several plausible approaches and a reliable selector | Candidates are correlated; cost grows roughly with attempts |
| Majority or weighted voting | Answers with a canonical discrete result | Agreement is not proof; shared bias can win unanimously |
| Search | Large decision spaces with useful intermediate scoring | Branch explosion and difficult stopping rules |
| External verification | Code, math, policy, database state, schemas, or citations | The verifier can be incomplete, gamed, or wrong |

The ICLR 2025 paper [*Scaling LLM Test-Time Compute Optimally Can Be More Effective than Scaling Parameters for Reasoning*](https://proceedings.iclr.cc/paper_files/paper/2025/hash/1b623663fd9b874366f3ce019fdfdd44-Abstract-Conference.html) found that the best inference strategy depends strongly on problem difficulty. Its key architecture implication is not that “more thinking always wins,” but that **compute should be allocated adaptively**. A second ICLR 2025 study, [*Inference Scaling Laws*](https://proceedings.iclr.cc/paper_files/paper/2025/hash/8c3caae2f725c8e2a55ecd600563d172-Abstract-Conference.html), likewise shows different cost-performance frontiers across model sizes and inference strategies.

## An adaptive reasoning policy

Route each request through a policy that considers four variables:

1. **Difficulty** — Is the task routine, ambiguous, compositional, or novel?
2. **Consequence** — Is the output advisory, externally visible, financially material, or capable of triggering action?
3. **Verifiability** — Can the system run tests, query authoritative state, check citations, enforce a schema, or apply deterministic policy?
4. **Budget** — What are the maximum latency, cost, token, tool-call, and energy budgets?

| Tier | Example | Reasoning policy |
| --- | --- | --- |
| 0: deterministic | Validate an account identifier | No generative reasoning; use code or rules |
| 1: routine | Classify an internal ticket | Small/fast model, one attempt, schema validation |
| 2: analytical | Compare three migration options | Reasoning model or decomposition, evidence retrieval, one critique pass |
| 3: consequential | Recommend a production failover plan | Multiple candidates, independent checks, explicit assumptions, human approval |
| 4: action | Change a production routing policy | Reasoning may draft; deterministic authorization and approval control execution |

The escalation signal should come from observable features—not a model merely declaring that a task is hard. Useful signals include input length, number of constraints, retrieval uncertainty, disagreement between candidates, failed validation, tool errors, and risk classification.

## Build a verifier before buying more reasoning

Additional generation is most valuable when the system can recognize improvement. Prefer verifiers in this order:

1. **Authoritative state:** did the intended record, reservation, or configuration actually exist at the end?
2. **Executable tests:** do calculations, schemas, policies, and code tests pass?
3. **Evidence checks:** are claims supported by allowed, current sources?
4. **Human rubric:** does a qualified reviewer agree against explicit criteria?
5. **Model judge:** does a calibrated judge model prefer the candidate for stated reasons?

Model judges are useful but are not ground truth. They can reproduce the candidate model's blind spots and reward verbosity or familiar phrasing. See [Evaluation measurement science](../06-evaluation/06-measurement-science.md).

## Reliability, latency, and cost budgets

Reasoning changes the request path from a predictable call into a variable-duration computation. Define:

- maximum model calls and parallel branches;
- maximum input, reasoning, and output tokens;
- tool-call and retry budgets;
- soft and hard wall-clock deadlines;
- cancellation behavior;
- cost per task and cost per *successful* task;
- a safe fallback for timeout, disagreement, or verification failure.

For interactive traffic, reserve a fast path and stream status without claiming success prematurely. For deep analysis, use asynchronous jobs with checkpoints and resumability. Never let a client retry an uncertain consequential operation without an idempotency key.

## Failure modes

### Overthinking

More tokens can introduce new assumptions, drift away from the question, or turn a correct simple answer into an incorrect elaborate one. Measure quality as a function of budget instead of assuming monotonic improvement.

### Correlated candidates

Five samples from one model and prompt are not five independent experts. Vary evidence, decomposition, prompts, or model families only when the diversity justifies its cost—and still use an external verifier.

### Verifier gaming

If the generator learns the scoring rule, it may optimize the metric rather than the real outcome. Keep critical policy checks deterministic and examine unexpected high-scoring trajectories.

### Unbounded loops

Reflection and search require stop conditions: verified success, no material improvement, budget exhaustion, repeated state, or human escalation.

### Confident presentation

Reasoning effort is not calibrated confidence. Present evidence, unresolved assumptions, and verification state instead of implying that a longer process guarantees correctness.

## Northstar worked example

Northstar wants an assistant to recommend incident-remediation steps.

**Bad design:** send every alert to the largest model, allow unrestricted retries, and publish the first confident plan.

**Defensible design:** classify the incident, retrieve the current runbook and service state, then select a tier:

- routine known alert: retrieve the approved procedure and validate referenced resources;
- ambiguous multi-service incident: generate two candidate hypotheses in parallel, run read-only diagnostic tools, and rank candidates against observed telemetry;
- proposed production change: produce a change plan and rollback plan, validate policy and syntax, then require an authorized operator to approve execution.

The dominant quality attribute is safety. Extra latency is accepted for production-changing recommendations, while routine advisory responses stay on the fast path.

## Architecture artifact: reasoning budget ADR

Record:

- task and risk tier;
- baseline model and strategy;
- escalation signals;
- verifier and its known blind spots;
- token, attempt, tool, latency, and cost ceilings;
- stopping and cancellation rules;
- timeout, disagreement, and failure behavior;
- evaluation slices and release threshold.

## Lab

Implement three policies for a mixed set of easy and difficult Northstar incident questions:

1. one model call for every task;
2. fixed best-of-N with a judge;
3. adaptive routing with executable or evidence-based verification.

Compare task success, p50/p95 latency, model calls, cost per task, cost per successful task, and failure severity. Your recommendation must name where additional inference compute helps and where it wastes resources or increases risk.

## Check yourself

1. Why is a reasoning model not, by itself, a reasoning architecture?
2. When can a smaller model with verification be preferable to a larger single-pass model?
3. Why does majority agreement among samples fail as proof of correctness?
4. Which observable signals would move a request from Tier 1 to Tier 3?
5. What should the system expose to auditors if hidden model reasoning is not an audit log?

## Further reading

- Snell et al., [*Scaling LLM Test-Time Compute Optimally Can Be More Effective than Scaling Parameters for Reasoning*](https://proceedings.iclr.cc/paper_files/paper/2025/hash/1b623663fd9b874366f3ce019fdfdd44-Abstract-Conference.html), ICLR 2025.
- Wu et al., [*Inference Scaling Laws: An Empirical Analysis of Compute-Optimal Inference for LLM Problem-Solving*](https://proceedings.iclr.cc/paper_files/paper/2025/hash/8c3caae2f725c8e2a55ecd600563d172-Abstract-Conference.html), ICLR 2025.
- Zhu et al., [*Scaling Test-time Compute for LLM Agents*](https://arxiv.org/abs/2506.12928), 2025 preprint; useful emerging evidence, not yet treated here as settled practice.
