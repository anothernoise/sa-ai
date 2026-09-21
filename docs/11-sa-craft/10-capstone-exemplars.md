# Capstone exemplars: a strong and a weak submission, scored

> Last reviewed: 2026-09-20. See the [freshness policy](../appendix/maintenance.md). Both submissions are constructed. The evaluation figures in the strong one are real results from the [`sa-ai-evals` lab](https://github.com/anothernoise/sa-ai-evals) (v0.1.0, 59 synthetic cases) — small, synthetic, and labelled as such, exactly as the [capstone brief](03-capstone.md) requires.

## Learning objectives

After this chapter you will be able to:

- score a capstone dossier against the [rubric](04-rubric-defense.md) and cite the evidence for each score;
- tell a *defensible* dossier from an *impressive-looking* one;
- recognise the conditions that fail a submission regardless of its total.

## Decision this chapter teaches

How to calibrate your own judgment — as a candidate, a reviewer, or an instructor — against worked examples before scoring real work.

## How the arithmetic works

The rubric scores ten dimensions from 0 to 4 (*absent, asserted, partially evidenced, defensible, exemplary*) and multiplies each by its weight. The weights sum to 100, so the maximum is 400. A submission that is *defensible* (3) everywhere scores 300, or 75%.

| Dimension | Weight |
|---|---:|
| Problem / value / alternatives | 10 |
| Requirements / trade-offs | 10 |
| Architecture / data | 15 |
| Agent / identity / human control | 10 |
| Security / privacy / supply chain | 15 |
| Evaluation / safety | 15 |
| Reliability / operations | 10 |
| Governance / responsibility | 5 |
| Economics / operating model | 5 |
| Communication / ADRs | 5 |

The rubric sets no numeric pass mark. What it does set is a list of conditions that fail a submission *whatever its total*: proposing a prohibited or unsupported use; no accountable owner; retrieving or acting without authorisation; no evaluation evidence; being unable to recover consequential effects; concealing material risk. Read the score and the hard-fail check separately, and never let the first hide the second.

**Before you read the scores, try it.** Read each submission's summary, score it yourself on paper, then compare. The gap between your score and the reviewers' is the useful part.

---

## Exemplar A — the strong submission

### Decision brief (one page, as submitted)

**Use profile.** Draft-only shipment advice for trained Northstar agents in the Canadian English and French queues. The assistant proposes a cited draft reply; the agent decides and sends. Refund execution, customer-facing chat, and voice are out of scope.

**Recommendation.** **Constrain.** Run a 30-day shadow-then-live trial on one queue. Do not release more widely, and do not expose the assistant to customers.

**Why.** Delayed-shipment work is 18,000 cases a month; the observed causes are scattered policy and unreliable order status. A grounded draft is the smallest intervention that addresses both, and unified search remains the comparison baseline.

**Strongest reason not to deploy.** Grounding on French is the least-evidenced claim. The trial exists to measure it, and a French regression blocks release on its own.

**What would reverse this.** A French lower confidence bound below the baseline, any hard violation, or a residency incident.

### Dossier excerpts

**1. Opportunity canvas.** Baseline of 18,000 cases/month and an 18% repeat-contact rate measured from the contact system on a stated date. The 11-minute median touch time is labelled *assumed — verify by day 5*. Alternatives: unified search, rules, buy. Stop condition: no qualified improvement after 12 weeks.

**3. NFR scorecard.** Dominant attribute: action integrity for anything touching a customer; residency for data. Thresholds are written as scenarios with populations, for example *grounded-answer lower bound ≥ 0.70 in each language, p95 first response ≤ 3 s, zero known cross-tenant retrieval in adversarial tests*.

**4. Views.** Context and container diagrams; a sequence for the highest-consequence path (draft → agent review → send) with the refund path drawn as *absent*; a lineage view showing how a corrected policy invalidates derived chunks; a regional deployment view.

**6. Human control.** Authority ladder: read-only → draft-only, **stopping at draft-only for release one**. A deterministic policy gate sits between the model and every tool; there is no refund-write tool for it to call. The audit record separates "Alice asked the assistant" from "the workload invoked the tool."

**7. Security.** A threat path for a hostile instruction in a supplier notice, with a tested control: the gate ignores any destination the model authored. A sentence screen for injected text is *documented as a heuristic, not a control*, and the submission names what it relies on instead.

**8. Evaluation.** Run on the synthetic Northstar set (59 cases, both languages, labelled synthetic):

| Measure | v1 baseline | v2 candidate, as first submitted | v2 after one fix |
|---|---:|---:|---:|
| Task success | 0.63 | 0.75 | 0.92 |
| Lower 95% bound | 0.50 | 0.62 | 0.82 |
| Hard violations (retired/restricted source, injected text) | **20** | 0 | 0 |
| English slice (n=35) | 0.54 | 0.86 | 0.86 |
| French slice (n=24) | 0.75 | **0.58** | 1.00 |

The submission's account of the middle column matters most. The candidate beat the baseline overall and **the release gate blocked it** on French (a −0.17 difference, lower bound −0.42, against a −0.05 margin). Slicing the failures showed the cause: language was detected from accented characters, so French typed without diacritics was classified as English. One function was changed; the gate passed, and the French gain was confirmed to come from that slice.

The submission then lists what still fails and does not oversell: the two cases where a *customer* asks for restricted information get an answer instead of an abstention (the two agent-role cases in the same slice pass), and the high-risk slice's lower bound is only 0.50. It scopes these out honestly: the profile is agent-facing, so the customer-role cases do not apply to it, but they would **block any customer-facing profile**.

**9. Operations.** SLOs with an error budget; a regional-failure test that fails closed; a rollback to unified search — the non-AI baseline — not to an out-of-region model.

**10. Governance.** Risk card for the draft-only profile, classified separately from refund execution. An assurance claim ("the assistant cannot issue an unapproved refund") with argument, evidence, and two named defeaters. Obligations under the EU AI Act are marked *to be confirmed with counsel*, with a dated pointer to the [tracker](../07-security-governance/10-eu-ai-act-tracker.md).

**11. Economics.** Cost per resolved qualified case with a ceiling; the time-saving case is shown to be **thin on its own**, and the value case is placed on repeat-contact reduction and peak capacity. See the [worked executive narrative](09-worked-executive-narrative.md).

**12. ADRs and assumptions.** Three ADRs (regional hosting, hybrid retrieval, refunds human-executed), two *Proposed* pending evidence. Assumption register with owners and test dates. Roadmap with a stop decision.

**Demonstrations.** *Failure injection:* a regional outage. *Architecture-changing assumption:* the French slice — its failure changed the design.

### Reviewer scoring

| Dimension | Weight | Score | Evidence cited for the score | Points |
|---|---:|:---:|---|---:|
| Problem / value / alternatives | 10 | 4 | Baseline with date and source; non-AI counterfactual kept alive; dated stop rule | 40 |
| Requirements / trade-offs | 10 | 3 | Scenario requirements with populations; dominant attribute named. Would reach 4 with the uncertainty on each threshold stated | 30 |
| Architecture / data | 15 | 3 | Coherent views; the refund path drawn as absent; lineage covers correction. Deletion propagation across derived stores is shown for one store only | 45 |
| Agent / identity / human control | 10 | 4 | Authority ladder stops at draft-only; deterministic gate; no write tool exists to call | 40 |
| Security / privacy / supply chain | 15 | 3 | Injection control tested and the screen honestly demoted to a heuristic; supply chain covered lightly | 45 |
| Evaluation / safety | 15 | 3 | Sliced results with bounds; a blocked candidate and its root cause; but synthetic data only and 59 cases | 45 |
| Reliability / operations | 10 | 3 | SLOs, a failure test, rollback to the non-AI baseline; capacity modelled, not measured | 30 |
| Governance / responsibility | 5 | 3 | Separate risk cards; assurance claim with defeaters; regulation deferred to counsel | 15 |
| Economics / operating model | 5 | 4 | Honest thin business case; named owner; exit plan | 20 |
| Communication / ADRs | 5 | 4 | One-page brief a reviewer can reconstruct in five minutes; falsifiable ADRs with expiry | 20 |
| **Total** | **100** | | | **330 / 400 = 82.5%** |

**Hard-fail check:** no prohibited use, an accountable owner, authorisation enforced by the gate, evaluation evidence present, no consequential write to recover, no concealed risk. **None triggered.**

**Decision:** *Approve with conditions.* A 30-day trial on one queue; a French lower bound at or above the pre-declared floor; expiry 2026-12-20; a customer-facing profile is a separate submission.

### A calibration disagreement, reconciled

Two reviewers scored independently. Their scores matched within one point everywhere except one dimension, which is exactly the situation the rubric's calibration step exists for.

| Dimension | Reviewer 1 | Reviewer 2 | Reconciled |
|---|:---:|:---:|:---:|
| Evaluation / safety | 4 | 2 | **3** |

- **Reviewer 1** credited the blocked candidate, the root-cause slicing, and the honest list of remaining failures as *exemplary*.
- **Reviewer 2** noted the whole evaluation runs on 59 synthetic cases and treated that as *partially evidenced*.
- **Reconciliation.** Both are right. The *method* is exemplary; the *evidence* is limited by data the candidate could not obtain. The rubric scores evidence, so the score is 3 — and the finding log records, separately, "collect real, labelled French cases before the trial's go/no-go."

The lesson: a disagreement of two or more points is a signal to look for which reviewer is scoring the method and which is scoring the evidence.

---

## Exemplar B — the weak submission

### What it submits

*"Northstar Autonomous Support Agent."* A multi-agent system that "understands" customer requests, decides compensation, issues refunds, updates orders, and answers by voice in all three regions. It is presented as a single diagram with 23 boxes across three cloud providers, and a slide reading **"Secure, scalable, compliant, and fully autonomous."**

Representative statements, and what a reviewer should note about each:

| Statement in the dossier | Reviewer note |
|---|---|
| "The agent understands policy and always applies it correctly." | Anthropomorphic claim; no evidence; "always" is unfalsifiable |
| "We used a shared API key so every service can talk to the order system." | No per-user authority; no attribution; refund tool reachable by anything |
| "Refunds are issued instantly to improve customer experience." | Irreversible action with no approval, no idempotency, no recovery |
| "The model was tested and works well." | No dataset, no slices, no result: *no evaluation evidence* |
| "Latency will be under 2 seconds." | No measurement, no percentile, no population |
| "It is GDPR and AI-Act compliant." | An assertion, not evidence; obligations not identified |
| "Costs about $0.02 per conversation." | Per conversation, not per *qualified outcome*; retries and review omitted |
| "Owned by the AI team." | A team, not an accountable named owner |

### Reviewer scoring

| Dimension | Weight | Score | Evidence cited for the score | Points |
|---|---:|:---:|---|---:|
| Problem / value / alternatives | 10 | 1 | "Improve customer experience" asserted; no baseline, no alternative, no stop rule | 10 |
| Requirements / trade-offs | 10 | 1 | Adjectives, not thresholds | 10 |
| Architecture / data | 15 | 2 | A diagram exists, but authorities, stores, and failure paths are not visible | 30 |
| Agent / identity / human control | 10 | 1 | Shared key; the agent holds refund authority; no approval | 10 |
| Security / privacy / supply chain | 15 | 1 | "Secure" asserted; no threat model; hostile input in retrieved documents not considered | 15 |
| Evaluation / safety | 15 | 0 | **Absent** | 0 |
| Reliability / operations | 10 | 1 | A latency claim only; no SLO, no rollback | 10 |
| Governance / responsibility | 5 | 1 | Compliance asserted | 5 |
| Economics / operating model | 5 | 2 | A cost per conversation; no value hypothesis | 10 |
| Communication / ADRs | 5 | 2 | Clear slides; no alternatives, no ADRs | 10 |
| **Total** | **100** | | | **110 / 400 = 27.5%** |

**Hard-fail check — five conditions triggered:**

1. **No evaluation evidence.**
2. **Acts without authorisation** — a shared key gives every service the refund tool.
3. **Cannot recover consequential effects** — instant, irreversible refunds with no approval or idempotency.
4. **No accountable owner** — a team, not a person.
5. **Conceals material risk** — "secure and compliant" stands in for risk analysis.

**Decision:** *Do not deploy.* Any one of the five would fail the submission at any score.

### The path to a passing rewrite

None of this is unfixable, and the fix is mostly *subtraction*:

1. Narrow to one profile with one population and one authority — draft-only shipment advice.
2. Remove the refund tool from the model's reach entirely; put a deterministic gate in front of what remains.
3. Replace every adjective with a measured or *labelled-assumed* number.
4. Build even a small sliced evaluation and show one candidate it blocked.
5. Name an owner. Write three ADRs, two of them honestly *Proposed*.

The strong submission is not more ambitious than the weak one. It is smaller, and it can be defended.

---

## Why the strong one scores higher despite doing less

| | Strong (Exemplar A) | Weak (Exemplar B) |
|---|---|---|
| Scope | One profile, draft-only | Everything, autonomous |
| Diagram count | Few, each supporting a decision | One, dense |
| Numbers | Labelled measured / assumed | Unlabelled |
| Blocked candidate | Shown, with root cause | None — nothing was ever tested |
| Weakest evidence | Named | Not acknowledged |
| Stop rule | Dated and measurable | Absent |
| "Do not deploy" | A legitimate outcome it could reach | Never considered |

## Practical artifact

Your own **scored rubric and finding log** for one submission — a peer's, or a draft of your own dossier scored with the eyes of a reviewer. Use the [capstone submission template](../../templates/capstone-submission.md) and the [review checklist](../../templates/architecture-review-checklist.md).

## Lab

Score Exemplar B *before* reading the reviewers' table. Then score a colleague's (or your own) dossier independently with a second reviewer and reconcile. Acceptance criteria: a score and a cited piece of evidence for every dimension, the hard-fail check recorded separately, at least one disagreement of two or more points explained, and a finding log that distinguishes critical findings from preferences.

## Check yourself

1. Exemplar A scores 82.5% and is still only "approve with conditions." What in the submission stops it being a plain approval?
2. Two reviewers score Evaluation 4 and 2. What are the two most likely reasons, and how does the rubric tell you which one governs?
3. Exemplar B has a total that is not zero. Why does that not matter to its outcome?
4. Which single change would raise Exemplar B's score the most, and which would remove the most hard-fail conditions?

## Further reading

- [Capstone brief](03-capstone.md) and [rubric & defense](04-rubric-defense.md)
- [Northstar ADR set](08-northstar-adr-set.md)
- [`sa-ai-evals`](https://github.com/anothernoise/sa-ai-evals) — the lab behind the evaluation figures above
- [Failure-mode case studies](05-failure-modes.md)
