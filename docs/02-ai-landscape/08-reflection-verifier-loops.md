# Reflection, metacognition, and verifier loops

> _Reliability pattern — last reviewed: 2026-07-25._

## Learning objectives

- distinguish resampling, critique, verification, repair, and search;
- decide when extra inference improves expected value;
- prevent self-review from becoming unbounded, expensive theater.

## The decision in one sentence

Spend test-time compute only when an independent, task-relevant verifier can select or repair candidates better than the generator alone.

## Patterns

“Reflect” is too vague for architecture. Choose a concrete loop:

| Pattern | Mechanism | Good fit | Weakness |
|---|---|---|---|
| Retry/resample | generate another candidate | stochastic creative tasks | no selection signal |
| Self-critique | model identifies issues | style and checklist repair | correlated blind spots |
| External verifier | tests facts, code, math, schema | executable constraints | verifier coverage |
| Debate/ensemble | compare diverse candidates | ambiguous analysis | cost and shared bias |
| Search/planning | explore branches with scores | high-value combinatorial tasks | latency explosion |
| Human escalation | adjudicate uncertainty or harm | consequential exceptions | queue and consistency |

## Bounded verifier architecture

```mermaid
flowchart TB
    accTitle: Bounded generate verify repair loop
    accDescr: A generator creates a candidate, independent checks score it, and a controller either accepts, repairs within a budget, or escalates.
    A["Task, evidence and acceptance criteria"] --> B["Generate candidate"]
    B --> C["Independent deterministic and model verifiers"]
    C --> D{"Thresholds pass?"}
    D -- "Yes" --> E["Return candidate plus evidence"]
    D -- "No" --> F{"Repair budget remains?"}
    F -- "Yes" --> G["Structured defect feedback"]
    G --> B
    F -- "No" --> H["Fallback or human escalation"]
    E --> I["Record attempts, scores, cost and outcome"]
    H --> I
```

| Step | Design requirement | Metric |
|---|---|---|
| Generate | diversity without changing task contract | candidate success |
| Verify | independent evidence or executable oracle | verifier precision/recall |
| Control | maximum attempts, latency, cost | amplification factor |
| Repair | structured defects, not vague “think harder” | repair yield |
| Terminate | accept, fallback, or escalate | unresolved-risk rate |

## Independence matters

Asking the same model to “check itself” may improve formatting but can reproduce the original misconception. Prefer deterministic tools, retrieved primary evidence, a separately prompted or different model, or a qualified human. Measure verifier error explicitly: false acceptance creates harm; false rejection creates cost and frustration.

Use a controller outside the model. Set maximum candidates, rounds, wall time, token and tool budget, and a monotonic acceptance rule. Do not expose verifier secrets or expected answers in untrusted context. Cache verification where inputs and versions match.

Evaluate the complete policy against a single-pass baseline: task success, harmful acceptance, false rejection, latency p95, cost per successful task, escalation, and user value. A loop that adds 3× cost for a negligible gain should be removed or restricted to high-risk cases.

## Northstar example

Northstar’s recommendation generator outputs policy claims and calculations. A citation verifier checks that quoted policy text entails each claim; deterministic code recomputes benefit amounts; a second rubric evaluator checks completeness. One repair is allowed. Remaining calculation or entitlement conflicts go to an adjudicator rather than another reflection round.

## Practical artifact: verifier contract

Document accepted input, output schema, evidence source, independence assumptions, coverage, thresholds, error costs, retry budget, fallback, model/tool versions, and calibration dataset.

Use the contract with [evaluation measurement science](../06-evaluation/06-measurement-science.md) and the [synthetic trajectory factory](../06-evaluation/10-synthetic-trajectory-factories.md).

## Check yourself

1. When does a self-critique loop reproduce the original error, and what would you substitute for it?
2. A verify-and-repair loop triples cost for a one-point gain in success. What do you do, and what do you measure first?
3. Why does the controller sit outside the model, and what must it enforce?
4. Compare verifier design for a code-generation agent with a unit-test suite and a legal-summary assistant. What is the residual risk in each?

<details>
<summary>What a strong answer covers</summary>

<ol>
<li>When the critic shares the generator's blind spots — the same model, prompt, and misconception. Substitute an independent verifier: a deterministic tool, retrieved primary evidence, a differently prompted or different model, or a qualified human.</li>
<li>Compare the whole policy against a single-pass baseline on task success, harmful acceptance, false rejection, p95 latency, cost per successful task, and escalation. If the gain does not justify the cost, remove the loop or restrict it to high-risk cases.</li>
<li>A model cannot be trusted to bound its own loop. The controller enforces maximum candidates, rounds, wall time, and token and tool budget, applies a monotonic acceptance rule, and keeps verifier secrets and expected answers out of untrusted context.</li>
<li>Code has an executable oracle: run the tests; the residual risk is incomplete test coverage. A legal summary has no oracle, so use a citation-entailment verifier plus human escalation; the residual risk is correlated bias in any model-based rubric evaluator.</li>
</ol>

</details>

## Further reading

- [Self-Refine](https://arxiv.org/abs/2303.17651)
- [Reflexion](https://arxiv.org/abs/2303.11366)
- [Tree of Thoughts](https://arxiv.org/abs/2305.10601)
