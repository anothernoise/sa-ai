# Worked executive narrative: the Northstar decision brief

> Last reviewed: 2026-09-20. See the [freshness policy](../appendix/maintenance.md). All figures are Northstar case-file values or labelled assumptions, not benchmarks. Labour rates and model prices vary widely; replace them with your own before reusing the arithmetic.

## Learning objectives

After this chapter you will be able to:

- turn an architecture and an evidence base into a decision an executive can make in ten minutes;
- present a thin business case honestly, without inflating it to win approval;
- prepare for the four questions every steering committee asks.

## Decision this chapter teaches

What to put in front of a sponsor who must decide whether to *fund a trial* — and how to make the recommendation survive scrutiny because it names what is uncertain.

## The brief's order

The [stakeholder communication chapter](01-stakeholder-communication.md) gives the sequence: decision required → problem and baseline → scoped use profile → options and recommendation → measurable benefit → risks and controls → cost and capacity → evidence confidence → owner and next gate. The deck below follows it, one slide per step, with an *assertion title* on each — a full sentence a reader can disagree with, rather than a topic label.

## The deck

### Slide 1 — Decision required

**Approve a 30-day controlled trial of a draft-only shipment-advice assistant on one support queue. Do not approve any autonomous action.**

The decision owner is the VP Customer Operations. The trial's spend is capped by FP&A. A go/no-go review happens at day 30 against the gates on slide 8.

> *Speaker note.* Say the ask before the context. If the room only remembers one sentence, it should be this one.

### Slide 2 — Delayed-shipment contacts are slow because policy is scattered and order status is unreliable

| Measure | Value | Status |
|---|---|---|
| Delayed-shipment contacts per month | 18,000 | Measured (contact system, trailing quarter) |
| Median touch time | 11 minutes | **Assumed** — frontline estimate, to be verified by day 5 |
| Repeat-contact rate | 18% | Measured |
| Causes observed in the discovery workshop | Policy held in four locations; order status inconsistent | Observed on ten sampled cases |

> *Speaker note.* Show the status column. The room learns which numbers to trust, and you avoid defending an estimate as if it were data.

### Slide 3 — We propose a narrow use profile, not "an AI platform"

Northstar asked for "an AI customer-service platform in three months." That is four requests with four risk levels. We propose the first and safest:

- **In scope:** trained agents in one queue get a cited draft reply and the evidence behind it.
- **Out of scope:** refund execution, customer-facing chat, and voice.
- **Authority:** the assistant drafts; a person decides and sends.

### Slide 4 — Three options were compared, and a non-AI option remains in the running

| Option | Benefit | Cost and risk | Verdict |
|---|---|---|---|
| Unified search only | Fixes the scattered-policy cause; no model risk | Does not draft replies | The **baseline** every other option must beat |
| Grounded draft assistant | Fixes search *and* drafts the reply | Model cost; grounding must be proven | **Recommended for the trial** |
| Bounded agent for unusual cases | Covers the long tail | Variable cost; harder to evaluate | Deferred to a later gate |
| Buy an end-to-end product | Fastest demo | Residency, exit, and control unknown | Assessed against the same gates before any contract |

The dominant quality attribute is *action integrity* for anything that touches a customer or a payment, and *residency* for where data goes.

### Slide 5 — The time saved alone is a modest number, so the trial tests more than speed

**The arithmetic, with every assumption visible:**

| Line | Calculation | Result |
|---|---|---|
| Time saved if median touch falls 20% | 18,000 cases × 2.2 min | 39,600 min ≈ 660 hours/month |
| Value at an assumed loaded cost of $38/hour | 660 × $38 | ≈ $25,100/month gross |
| Variable AI cost at a ceiling of $0.90 per resolved case | 18,000 × $0.90 | ≈ $16,200/month |
| Net on time saved alone | $25,100 − $16,200 | ≈ $8,900/month |
| Repeat contacts avoided if 18% falls to 15% | 540 contacts × 11 min ≈ 99 hours × $38 | ≈ $3,800/month |

**What this says.** On time saved alone, the case does not repay a build within twelve weeks. The value that matters is whether *released time becomes capacity* — fewer repeat contacts, and absorbing the November–December peak (roughly 2.6× normal volume) without extra temporary staff. That is what the trial measures. The $38 rate and the $0.90 ceiling are assumptions for FP&A to confirm.

> *Speaker note.* This is the slide most decks would inflate. Showing that the time-saving case is thin — and naming the two places real value might sit — is what makes the ask credible.

### Slide 6 — The principal risks each have a control that is tested, not promised

| Risk | Control | How we know it works |
|---|---|---|
| Wrong policy cited | Only current, authoritative policy is retrievable; every claim carries an evidence ID | Citation-precision gate on the trial set |
| A French-language regression | Per-language release gates, not an average | Lower-bound result per language slice |
| Data leaves Canada | Region pinned and asserted at runtime; fails closed | A regional-failure test |
| A hostile instruction in a supplier notice | A deterministic gate between the model and every tool; no write tools | Injection test in the release suite |
| Cost runaway | Per-case spend caps and step limits | Cost-per-resolved-case tracked daily |

### Slide 7 — Our confidence differs by claim

| Claim | Evidence | Confidence |
|---|---|---|
| The workflow is slow and scattered | Observed cases; contact data | High |
| Median touch is 11 minutes | Frontline estimate | Low until day 5 |
| A grounded draft will meet the quality gate | None yet | **Unknown** — this is what the trial answers |
| French quality will match English | None yet | **Unknown** |
| Agents will trust and use it | None yet | **Unknown** |

### Slide 8 — Owner, gates, and stop rule

- **Owner:** VP Customer Operations, with the platform lead accountable for operation.
- **Go criteria at day 30:** grounded-answer rate meets the pre-declared lower bound in *both* languages; policy violations at or below 0.1%; median touch down and repeat contact not up on the trial queue against the search baseline.
- **Stop rule:** no qualified improvement after 12 weeks of total effort, or any residency incident.
- **Not approved by this decision:** anything that acts on a customer's behalf.

## The one-page decision memo

For a sponsor who will not read the deck, the same content fits a page:

```text
DECISION       Approve a 30-day trial of a draft-only shipment-advice assistant
               on one queue. No autonomous actions.
WHY NOW        18,000 delayed-shipment contacts/month; median touch 11 min
               (to be verified); peak season is 2.6x normal.
RECOMMENDATION Grounded draft assistant, measured against unified search.
BENEFIT        ~660 hours/month if touch time falls 20%; the case rests on
               repeat-contact reduction and peak capacity, not time alone.
RISKS          Wrong citation, French regression, residency, hostile input,
               cost. Each has a tested control (see appendix).
EVIDENCE       Workflow and causes: high. Quality, French parity, adoption:
               unknown until the trial.
COST           Variable ceiling $0.90 per resolved case; trial spend capped
               by FP&A.
OWNER / GATE   VP Customer Operations; go/no-go review at day 30.
```

## Four questions to prepare for

| Question | A strong answer |
|---|---|
| *Why not just buy the demo we saw?* | We will, if it passes the same gates. The demo defines no requirements; the trial's gates do. Residency and exit terms are the first thing we would check. |
| *Why not let it issue refunds? That's where the money is.* | Refunds are payments that cannot be silently retried, and the order system has no idempotent writes. We are counting refunds above and below the supervisor cap; if automation is worth it, that becomes the next profile with its own evidence. |
| *What if it's wrong in French?* | A French regression blocks release on its own. We measure each language separately and use a lower confidence bound, so a good English score cannot hide a French gap. |
| *What does it cost if we do nothing?* | The baseline continues: 18,000 slow contacts a month and the peak-season pressure. The trial is the cheapest way to find out whether that cost can be reduced. |

## Practical artifact

A **decision brief** for one Northstar profile of your choice: the eight-slide structure or the one-page memo, with a status column on every number and a confidence slide.

## Lab

Take the discovery output for damage-claim document processing and write its brief. Acceptance criteria: an assertion title on every slide, one option you reject and why, one number you honestly label as assumed, and a case that does *not* depend on inflating the benefit.

## Check yourself

1. Slide 5 shows that time saved alone does not repay the build. Why is showing that a stronger recommendation than hiding it?
2. Which two claims on slide 7 does the trial itself answer?
3. The sponsor says "just cut the risk slide, it's scaring people." What do you do?
4. Rewrite slide 4's verdict on "buy" so that it is a decision rule rather than an opinion.

## Further reading

- [Stakeholder communication & executive narratives](01-stakeholder-communication.md)
- [Value hypotheses, KPIs & benefits realization](../09-economics-delivery/02-value-kpis.md)
- [Northstar ADR set](08-northstar-adr-set.md)
