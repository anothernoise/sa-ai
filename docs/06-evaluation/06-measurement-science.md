# Evaluation measurement science

> _Last reviewed: 2026-07-16 — see the [freshness policy](../appendix/maintenance.md)._

## Learning objectives

After this chapter you will be able to:

- define the unit of analysis for a probabilistic or agentic evaluation;
- design representative tasks, repeated trials, graders, and slices;
- quantify uncertainty and determine whether a change is material;
- calibrate human and model graders against observable outcomes;
- turn evaluation results into release, rollback, and monitoring decisions.

## The decision

> **What evidence is strong enough to approve, reject, or roll back this AI system change?**

An eval score without a sampling plan, repeat policy, uncertainty estimate, and decision threshold is a number—not evidence.

## The evaluation object

Anthropic's practical guide [*Demystifying evals for AI agents*](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) usefully separates concepts that architecture reviews often blur:

| Object | Meaning |
| --- | --- |
| Task | One problem with inputs, environment, and success criteria |
| Trial | One stochastic attempt at a task |
| Transcript / trajectory | Messages, model outputs, tool calls, and intermediate observations |
| Outcome | The final externally observable state |
| Grader | Logic or a reviewer that scores one aspect of a trial |
| Harness | The runtime that executes tasks, captures traces, and applies graders |
| Suite | A versioned collection of tasks representing a capability or risk |

For agents, **grade the outcome before the story**. An agent can claim that a refund was issued even when no refund exists. The database state is the outcome; the confident final message is merely part of the transcript.

## Start with the decision and unit of analysis

Write the decision first:

- approve a new model for 10% traffic;
- permit an agent to draft but not execute refunds;
- promote a prompt and retrieval index to production;
- reject a release if safety failures exceed a threshold.

Then choose the unit of analysis. It might be a response, a completed user task, an agent trajectory, a conversation, a user session, or a business process. Do not mix these units in one headline metric.

## Build a representative task set

Random examples from logs usually overrepresent common easy traffic. Construct explicit slices:

- normal/common cases;
- difficult but valid cases;
- important customer or jurisdiction segments;
- long-context and stale-context cases;
- tool and dependency failures;
- ambiguous or underspecified requests;
- adversarial and policy-boundary cases;
- high-consequence actions;
- accessibility, language, and format variations.

Give every task provenance, owner, expected behavior, risk label, and last-reviewed date. Separate development examples from the locked evaluation set. Track contamination: if a task appears in a prompt, training set, public benchmark, or debugging transcript, its evidentiary value changes.

## Repeated trials: capability is not reliability

One successful run does not show that an agent is dependable. Run multiple trials per task when outputs or paths vary.

Two related metrics answer different questions:

- **pass@k** — does at least one of *k* attempts succeed? Useful when the system is allowed to generate alternatives and select one.
- **pass^k** — do all *k* trials succeed? Useful when users require consistent policy-following behavior.

The original [τ-bench paper](https://arxiv.org/abs/2406.12045) introduced `pass^k` to expose reliability across repeated tool-agent-user interactions. This matters because a system that succeeds once in eight trials is capable, but not reliable.

Record both task-level and trial-level results. Averages can hide a small set of tasks that fail almost every time.

## Choose graders by strength of evidence

| Grader | Strong use | Main weakness |
| --- | --- | --- |
| State assertion | Record exists, balance unchanged, permission preserved | Requires a controllable environment |
| Executable test | Code, calculation, schema, policy, or workflow invariant | Tests can be incomplete |
| Exact/structured match | Classification, required fields, canonical answers | Brittle for valid alternatives |
| Retrieval/evidence check | Citation support, source authority, freshness | Entailment and source quality can be subjective |
| Human expert | High-context correctness and harm | Slow, costly, inconsistent |
| LLM judge | Scalable rubric-based assessment | Bias, drift, shared blind spots, prompt sensitivity |

Use multiple graders when success is multidimensional. A customer-service agent may need all of these:

1. the correct account state;
2. no prohibited action;
3. required disclosures;
4. acceptable interaction quality;
5. task completion within a turn and cost budget.

## Calibrate model judges

LLM judges are measurement instruments. Validate them before trusting them.

The NeurIPS paper [*Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*](https://papers.neurips.cc/paper_files/paper/2023/hash/91f18a1287b398d378ef22505bf41832-Abstract-Datasets_and_Benchmarks.html) found that strong judges can approximate human preferences, but also documented position, verbosity, self-enhancement, and reasoning biases.

A defensible calibration process:

1. Write a task-specific rubric with observable anchors.
2. Blind the judge to model/provider identity.
3. Randomize or reverse pair order and test position sensitivity.
4. Include concise high-quality and verbose low-quality controls.
5. Compare judge scores with qualified human labels.
6. Measure agreement per slice, not only overall.
7. Review disagreements and revise the rubric or grader.
8. Pin judge model and prompt versions; recalibrate on change.

Never let the same model family silently generate, judge, and approve a high-consequence action without an independent control.

## Human agreement and label quality

For subjective tasks, create a grading guide with examples at each score level. Train reviewers, then double-label a sample.

Report:

- raw agreement for simple categories;
- Cohen's kappa for two categorical raters when chance agreement matters;
- Krippendorff's alpha for multiple raters, missing labels, or different measurement scales;
- adjudication rate and recurring disagreement themes.

Low agreement usually means the requirement is ambiguous, the rubric is weak, the task lacks context, or experts genuinely disagree. Do not hide that product uncertainty behind a model-generated score.

## Quantify uncertainty

Always pair a point estimate with sample size and uncertainty.

- For binary pass rates, use an interval suitable for proportions, such as a Wilson interval; avoid treating `72/100` as exact truth.
- For continuous or composite metrics, use bootstrap confidence intervals when distributional assumptions are unclear.
- For comparisons, prefer paired tests or paired bootstrap samples because both candidates face the same tasks.
- Predefine the minimum effect that matters. A statistically detectable 0.2% gain may have no product value.
- Correct or constrain multiple comparisons when testing many prompts, models, and slices; otherwise some apparent wins arise by chance.

The architecture question is practical: **Is the evidence precise enough to distinguish the proposed change from noise at the decision threshold?**

## Slice before averaging

Suppose a new Northstar support agent improves overall resolution from 78% to 81%, but success for French requests falls from 75% to 58% and unauthorized refund attempts double. The overall score says “ship”; the risk slices say “stop.”

Define hard gates for safety, authorization, privacy, and severe harm. These should not be traded away by gains in tone or average task completion.

## Capability, regression, and production evaluation

| Suite | Question | Expected behavior |
| --- | --- | --- |
| Capability | What can the system do now? | Includes hard tasks and should leave room to improve |
| Regression | Did a previously reliable behavior break? | Near-perfect performance on protected cases |
| Safety/adversarial | Can the system cross a prohibited boundary? | Zero tolerance for defined critical failures |
| Production sample | Does lab performance transfer to real use? | Monitored by slice, time, provider, and version |

When a capability suite saturates, graduate stable tasks into regression and add more discriminating tasks. Do not celebrate a benchmark that no longer distinguishes meaningful changes.

## Agent evaluation needs an environment

AgentBench, introduced in the peer-reviewed paper [*AgentBench: Evaluating LLMs as Agents*](https://proceedings.iclr.cc/paper_files/paper/2024/hash/e9df36b21ff4ee211a8b71ee8b7e9f57-Abstract-Conference.html), evaluates decision-making across interactive environments rather than isolated responses. That shift is essential: the agent, tools, state, model, and harness form the evaluated system.

Build reproducible environments with:

- seeded starting state;
- fake or sandboxed external services;
- deterministic clocks and identifiers where possible;
- fault injection for timeouts, partial writes, and stale data;
- full state snapshots before and after;
- idempotent reset between trials;
- versioned model, prompt, tools, policies, data, and harness.

Infrastructure noise is measurement error. Track environment failures separately from agent failures and never silently rerun only the failures.

## Northstar release example

Northstar proposes a new model and prompt for its refund agent.

**Decision:** allow 10% production traffic if the candidate improves completion without weakening policy compliance.

**Design:** 240 tasks across product, language, ambiguity, tool failure, and adversarial slices; five trials for 60 high-variance tasks; paired baseline/candidate execution.

**Graders:** database end-state assertions, policy invariants, disclosure checks, cost/turn limits, and a calibrated interaction-quality judge.

**Gates:**

- no critical unauthorized refund or cross-account access;
- lower bound of the candidate's paired completion improvement must exceed zero;
- no protected slice may regress by more than the predefined tolerance;
- p95 cost and latency remain within budget;
- human review confirms a sample of judge disagreements.

The release packet includes results, intervals, failures by taxonomy, transcripts for severe cases, and the exact artifact versions.

## Practical artifact: evaluation specification

```text
Decision:
System boundary and versions:
Unit of analysis:
Population and traffic assumptions:
Task sources and slices:
Trials per task:
Graders and calibration evidence:
Primary metric:
Hard safety and policy gates:
Minimum material improvement:
Uncertainty method:
Infrastructure-error policy:
Release / rollback rule:
Owner and review date:
```

## Lab

Create a 40-task Northstar agent suite with at least five slices. Compare a baseline and candidate using paired tasks and repeated trials for the ten most variable cases.

Deliver:

- dataset card and task provenance;
- grader rubric and 20-item human calibration set;
- pass rate with intervals;
- `pass@k` and `pass^k` for repeated tasks;
- slice-level results;
- a release recommendation with explicit uncertainty.

## Check yourself

1. Why is the final environment state stronger evidence than an agent's final statement?
2. What different questions do `pass@k` and `pass^k` answer?
3. How would you detect position and verbosity bias in a model judge?
4. Why is a paired comparison normally preferable for a prompt or model change?
5. When should a slice-level safety failure override an overall quality improvement?

## Further reading

- Anthropic, [*Demystifying evals for AI agents*](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), 2026 practitioner guidance.
- Zheng et al., [*Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*](https://papers.neurips.cc/paper_files/paper/2023/hash/91f18a1287b398d378ef22505bf41832-Abstract-Datasets_and_Benchmarks.html), NeurIPS 2023.
- Liu et al., [*AgentBench: Evaluating LLMs as Agents*](https://proceedings.iclr.cc/paper_files/paper/2024/hash/e9df36b21ff4ee211a8b71ee8b7e9f57-Abstract-Conference.html), ICLR 2024.
- Yao et al., [*τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains*](https://arxiv.org/abs/2406.12045), 2024 preprint and benchmark.
- Zhang et al., [*Agent-SafetyBench: Evaluating the Safety of LLM Agents*](https://arxiv.org/abs/2412.14470), 2024 preprint; use as a source of safety-task ideas, not a universal release score.
