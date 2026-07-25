# From prototype to production

> _Delivery guide — last reviewed: 2026-07-25._

## Learning objectives

- distinguish a demo, feasibility spike, proof of value, pilot, and production service;
- plan evidence gates across quality, safety, reliability, cost, and adoption;
- prevent prototype shortcuts from silently becoming production architecture.

## The decision in one sentence

Promote only when the system—not merely the model—has evidence for its intended users, load, harms, operations, and fallback.

## Name the stage correctly

| Stage | Question | Exit evidence |
|---|---|---|
| Demo | Can stakeholders understand the idea? | shared concept; no production claim |
| Feasibility spike | Can the hardest technical assumption work? | reproducible result and limitations |
| Proof of value | Does it improve a business outcome? | baseline comparison on representative work |
| Pilot | Can a bounded population use it safely in workflow? | operational, adoption, and incident evidence |
| Production | Can accountable teams operate it at committed service levels? | release review, SLOs, controls, runbooks |
| Scale | Does it remain economical and governable across domains? | platform, capacity, portfolio and benefits evidence |

## Productionization flow

```mermaid
flowchart TB
    accTitle: Prototype-to-production evidence gates
    accDescr: A prototype progresses through feasibility, value, bounded pilot, production readiness, and controlled scale with stop or redesign decisions at each gate.
    A["Outcome hypothesis and baseline"] --> B["Feasibility spike"]
    B --> C{"Technical assumption proven?"}
    C -- "No" --> D["Stop or redesign"]
    C -- "Yes" --> E["Proof of value"]
    E --> F{"Quality, value and risk thresholds pass?"}
    F -- "No" --> D
    F -- "Yes" --> G["Bounded pilot"]
    G --> H["Production readiness review"]
    H --> I{"Owners, SLOs, controls and rollback ready?"}
    I -- "No" --> J["Close readiness gaps"]
    I -- "Yes" --> K["Canary, monitor and scale by evidence"]
```

| Gate | Core evidence | Decision owner |
|---|---|---|
| Feasibility | hardest integration/capability test | architect and engineering |
| Value | task success, time, cost, user outcome | product/business owner |
| Risk | misuse, harmful error, privacy, security | risk and accountable owner |
| Pilot | real workflow, adoption, support, exception load | service owner |
| Production | SLO, capacity, observability, incident, rollback | production readiness board |

## Close the prototype gaps

Prototype code often uses shared credentials, copied data, synchronous calls, no durable state, one happy-path prompt, manual deployment, and notebook-only evaluation. Create a gap register across architecture, data, identity, threat model, evaluation, performance, resilience, cost, UX, accessibility, governance, support, and ownership. Decide whether to harden, replace, or discard each prototype component.

Build the production slice vertically: real identity, one governed data path, one tool with least privilege, durable state, versioned configuration, trace correlation, an evaluation gate, a fallback, and a runbook. This exposes systemic issues sooner than perfecting the prompt in isolation.

## Release by risk

Start read-only, narrow the eligible population and task, cap run duration and spend, and require approval for consequential actions. Shadow mode compares against the current process without affecting users. Then use internal, opt-in, limited, canary, and wider releases. Define automatic rollback for quality, safety, latency, cost, or dependency thresholds.

Production readiness must include: named service and model owners; data classification and retention; threat model; approved use and prohibited use; evaluation suite; capacity and quota; SLOs and dashboards; incident severity and on-call; graceful degradation; change management; support and user recourse; benefits tracking; and decommissioning.

## Northstar example

Northstar’s notebook showed credible recommendations on 20 clean cases. The proof of value adds 300 adjudicated cases and discovers missing-document failures. The pilot uses real identity, read-only evidence retrieval, citation validation, and human approval for one region. Production waits until trace retention, outage fallback, reviewer training, accessibility, cost limits, and provider-change regression are complete.

## Practical artifact: promotion dossier

Maintain one dossier containing the outcome contract, stage, architecture, risk tier, gap register, datasets and evaluation, operational readiness, pilot evidence, unresolved risks, approval record, rollback, and the date/criteria for the next gate.

## Further reading

- [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)
- [Google SRE: Production Readiness Reviews](https://sre.google/sre-book/evolving-sre-engagement-model/)
