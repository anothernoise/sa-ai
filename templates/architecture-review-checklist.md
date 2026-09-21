# AI architecture review — [system, version]

Reviewer: [name]   Date: [YYYY-MM-DD]   Materials read: [list]

Review the decision, the evidence, and operability. Mark each line **Met**, **Gap**, or **Not evidenced**. *Not evidenced* is not a pass.

## Decision and purpose
- [ ] The decision requested, and its owner, are stated in one sentence
- [ ] The use profile names its users, affected people, authority, and prohibited uses
- [ ] Non-AI alternatives were compared, including abstaining
- [ ] The stop condition is measurable and dated

## Architecture
- [ ] Context and container views exist and agree with each other
- [ ] Every authority — who or what can act — is visible in the diagrams
- [ ] Critical sequences show failure and retry behaviour, not just the happy path
- [ ] Data lineage shows where each store comes from and how deletion propagates
- [ ] Tenant, region, and residency boundaries are drawn

## Evidence
- [ ] Evaluation covers representative, adversarial, and incident cases
- [ ] Results are sliced (language, tenant, risk tier) and carry uncertainty
- [ ] Release gates are defined *before* results are seen
- [ ] The weakest evidence is named, with what would replace it

## Security and privacy
- [ ] A threat model exists and each high threat has a tested control
- [ ] No consequential action relies on a control inside the prompt
- [ ] Secrets, identity, and least privilege are demonstrated, not asserted

## Operability
- [ ] SLOs, capacity, and an error budget are defined
- [ ] Traces attribute cost, model version, and tool calls to a task
- [ ] Rollback and graceful degradation were exercised
- [ ] Named owners run the system after the project ends

## Economics and governance
- [ ] Cost is expressed per qualified outcome, with sensitivity
- [ ] A risk classification and accountable approver exist
- [ ] Vendor exit or portability was considered

## Findings

| # | Severity (critical / major / minor) | Finding | Evidence reference | Recommendation | Owner |
|---|---|---|---|---|---|
| | | | | | |

## Decision

Approve | Approve with conditions | Redesign | Do not deploy — conditions, expiry date, and next review: [...]
