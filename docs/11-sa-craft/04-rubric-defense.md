# Capstone rubric & defense

> Last reviewed: 2026-07-16. See the [freshness policy](../appendix/maintenance.md).

## Scoring rubric

Score each dimension 0–4: absent, asserted, partially evidenced, defensible, or exemplary. Multiply by weight.

| Dimension | Weight | A defensible submission demonstrates |
|---|---:|---|
| Problem/value/alternatives | 10 | observed baseline, scoped hypothesis, counterfactual, stop rule |
| Requirements/trade-offs | 10 | measurable populations, thresholds, uncertainty, priority |
| Architecture/data | 15 | coherent views, contracts, lineage, freshness, boundaries |
| Agent/identity/human control | 10 | least authority, durable state, approval/recovery |
| Security/privacy/supply chain | 15 | threat-led controls, tests, residency, provenance, response |
| Evaluation/safety | 15 | representative evidence, slices, adversarial and release gates |
| Reliability/operations | 10 | SLOs, capacity, telemetry, degradation, incident and rollback |
| Governance/responsibility | 5 | risk card, assurance, contestability, accountable decisions |
| Economics/operating model | 5 | qualified unit, value attribution, owners, exit |
| Communication/ADRs | 5 | concise decision, alternatives, consequences, traceability |

A submission cannot pass if it proposes prohibited/unsupported use, lacks an accountable owner, retrieves or acts without authorization, has no evaluation evidence, cannot recover consequential effects, or conceals material risk—regardless of total score.

## Twenty-minute defense

| Time | Focus |
|---|---|
| 0–2 | decision requested and recommendation |
| 2–5 | workflow, baseline, use profile, alternatives |
| 5–9 | architecture, data, identity, authority |
| 9–13 | evaluation, security, safety, human remedy |
| 13–16 | SLOs, incidents, cost/value, ownership |
| 16–18 | assumptions, residual risk, rollout/stop |
| 18–20 | strongest counterargument and response |

## Defense method

Answer with claim, evidence, limitation, and decision. If evidence is absent, say so and reduce scope. Do not invent product facts. Be ready to trace one request, one attack, one ambiguous action, one deletion, one provider failure, and one dollar of cost end to end.

Reviewers should ask what would falsify the recommendation, where a policy is enforced, who can stop the system, how a model/index/tool change is detected, and why the rejected alternative loses on the dominant attribute.

## Calibration and artifact

Two reviewers score independently, cite dossier evidence, reconcile large differences, and record critical findings separately from preferences. Produce the scored rubric, finding log, and final decision with conditions and expiry.

## Check yourself

1. Can you name the strongest reason not to deploy?
2. Which diagram proves the highest-consequence path?
3. Which result would change your ADR?
4. Are you defending evidence or attachment to the design?
