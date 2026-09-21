# Worked discovery transcript: Northstar shipment support

> Last reviewed: 2026-09-20. See the [freshness policy](../appendix/maintenance.md). This is a constructed transcript of a fictional workshop, edited for length. The dialogue is illustrative; the moves are the point.

## Learning objectives

After this chapter you will be able to:

- recognise the facilitation moves that turn a vague request into a scoped, testable use profile;
- spot the moments where a discovery session drifts toward a solution, and recover;
- convert a raw workshop into a decision log, an assumption register, and one bounded experiment.

## Decision this chapter teaches

Whether a discovery workshop has produced a decision or only enthusiasm — and what to do in the room when it is heading for the second.

## Setting

The [discovery workshop playbook](00-discovery-workshop.md) gives the 120-minute agenda. Here is what the middle of it sounds like. Northstar has asked for "an AI customer-service platform in three months" (see the [case file](../00-orientation/03-northstar-case.md)). The pre-read carried the decision, ten anonymised delay cases, and the explicit non-goals.

| Role | Person |
|---|---|
| Solution architect (facilitator) | Sam |
| VP Customer Operations (sponsor) | Priya |
| Frontline support agent, Canadian queue | Marc |
| Head of Security and Privacy | Elena |
| FP&A partner | Tomasz |
| Order-systems engineer | Dana |

## Excerpt 1 — Refusing the abstract (minute 12)

> **Priya:** We need an assistant that handles delayed shipments end to end. Answer, decide compensation, fix the order. Customers shouldn't wait for a human.
>
> **Sam:** That's the outcome you want, and I'd like to test it against real work. Marc, can you show us the last delayed-shipment contact you handled? Not a typical one — the last one.

> **SA move — "show us the last case."** An abstract goal has no failure modes. A real case has a trigger, a lookup chain, and a place where time is lost. Asking the frontline person, in front of the sponsor, also shows everyone that the workflow will be described by the people who do it.

> **Marc:** A consignee in Montréal, parcel stuck at a hub. First I check the order in the order system. Status says "in transit." That's not helpful, so I open the carrier portal. Scan shows an exception. The reason is in a supplier notice — usually an email PDF — so I search the shared drive. There are two refund-policy documents that disagree. I ask my team lead. Then I write the reply, in French.
>
> **Sam:** How long?
>
> **Marc:** Fourteen minutes, that one. Maybe eleven on average.

> **SA move — record the number and its source.** Sam writes "median touch 11 min — Marc's estimate; verify from contact data" on the wall. The number is useful, but it is an *assumption* until someone pulls the data. That distinction goes into the register at the end.

## Excerpt 2 — Finding the real bottleneck (minute 31)

> **Sam:** In that case, where did the eleven minutes go?
>
> **Marc:** Mostly searching. Four places for policy. And I never trust the order status.
>
> **Dana:** The order API's status enum is inconsistent — "in transit" covers three different real states. And the carrier scan can lag hours.
>
> **Sam:** So two causes so far: fragmented policy, and slow, unreliable order lookup. Priya — before we talk about AI, would fixing those two causes without AI change the number?

> **SA move — separate cause from solution.** Sam writes the causes on the wall as *problems*, not features. The question "would fixing this without AI help?" keeps a non-AI alternative alive. It also earns trust: the room sees the architect is not selling a model.

> **Priya:** Better search would help. But it wouldn't write the reply.
>
> **Sam:** Agreed — so writing the reply is where a generative component might earn its place. I'll write that down as a hypothesis, not a decision.

## Excerpt 3 — The sponsor pushes on authority (minute 52)

> **Priya:** And the refund? Marc spends time on that too. If the system already knows the policy, why wait for a human?
>
> **Sam:** Let's separate two things. Suppose the assistant drafts a reply that says "we'll refund you." If it's wrong, what happens?
>
> **Marc:** We can't unsend an email. The customer holds us to it.
>
> **Elena:** And a refund is a payment. I need to know *who* authorised it and against *which* policy revision.
>
> **Sam:** That's the difference. A wrong draft costs an agent a correction. A wrong refund costs money and can't be silently retried. I'd propose two use profiles: *shipment advice* — the assistant drafts, a trained agent decides — and *refund execution*, which we treat as a separate, later profile with its own evidence and approvals.

> **SA move — an authority ladder, not a yes/no.** Sam does not say "no autonomous refunds." Sam draws a ladder — read-only, draft-only, approved action, autonomous — and asks the room where each profile starts. The sponsor's ambition stays on the map, but at a rung that can be earned. Recording *who bears each error* (agent, customer, Northstar) makes the reason visible instead of sounding like caution.

> **Priya:** So refunds stay manual for now.
>
> **Sam:** For the first release, and with a stated condition to revisit: we count how many refunds fall above and below the supervisor cap and see whether automation is even worth the risk.

## Excerpt 4 — Drift toward a demo (minute 70)

> **Tomasz:** I saw a vendor demo last month that did all of this. Can we just buy that?
>
> **Sam:** Good question, and I don't want to dismiss it. Let's park the vendor question until we've written down what we'd measure them against. Otherwise the demo defines the requirements. Can I take it to the options step in twenty minutes?

> **SA move — park, don't kill.** A demo is the fastest way to lose a discovery session, because it replaces the problem with a solution. Sam names the risk out loud, commits to a slot, and keeps the promise. At minute 90 the vendor option appears in the comparison table as *buy*, alongside *unified search*, *grounded copilot*, and *bounded agent*.

## Excerpt 5 — The absent voice and the constraint that kills a plan (minute 84)

> **Sam:** Who is affected by this who isn't in the room?
>
> **Elena:** The customers, obviously. And the French-speaking ones — our Québec queue handles a large share, and any quality gap there is a privacy and language-rights problem, not just a service one.
>
> **Sam:** Then French quality is a release blocker, not an average. And Canadian data residency?
>
> **Elena:** Non-negotiable. If a model call leaves Canada with customer data in it, that's an incident.
>
> **Sam:** Then residency is a constraint on hosting, and hosting is now an architecture decision I'll write up as an ADR, with a date on it.

> **SA move — turn a constraint into an artifact.** A constraint stated aloud and not recorded evaporates. Sam names the decision it forces, the artifact that will hold it, and the review date.

## What the workshop produced

| Output | Content |
|---|---|
| Use profile 1 | *Shipment advice*: draft-only, trained agents, Canada residency, p95 first response ≤ 3 s |
| Use profile 2 | *Refund execution*: deferred; excluded from release one |
| Baseline | 18,000 delayed-shipment cases per month, median touch 11 minutes (**assumption** — verify), repeat contact 18% |
| Root causes | Fragmented policy; slow, inconsistent order lookup |
| Alternatives kept alive | Unified search; rules; buy; bounded agent |
| Blocking constraints | Canada residency; French quality as a slice gate; Entra identity |
| Decision owner | Priya, VP Customer Operations |
| Experiment | 30-day controlled comparison: unified search versus grounded draft-only copilot, on the same 200 cases |
| Stop condition | No qualified improvement after 12 weeks |

### The assumption register at the close

The IDs match the [Northstar case file](../00-orientation/03-northstar-case.md), so a later chapter can cite "A6" without ambiguity. A7 is new: it came out of this workshop.

| # | Assumption | Test | Owner | Due |
|---|---|---|---|---|
| A1 | Most delay questions are answerable from notices, policy, and status without new integrations | Label 100 real delay contacts by answer source | Marc + Dana | Day 10 |
| A2 | The order API exposes enough status history to explain a delay | Trace ten cases end to end | Dana | Day 10 |
| A3 | Current policy documents are authoritative and unambiguous | Find conflicting revisions across the four locations | Marc + Elena | Day 10 |
| A5 | Agents will trust and use a cited draft | Shadow-mode observation | Marc | Day 20 |
| A6 | Refund volume justifies automation | Count refunds above and below the supervisor cap | Tomasz | Day 15 |
| A7 | Median touch time is 11 minutes | Pull twelve months of contact data | Dana | Day 5 |

A4 (peak volume) was not raised and stays open. Leaving a known unknown on the register, rather than dropping it, is part of the discipline.

## What went wrong, and how it was recovered

Two things nearly went wrong, and both are common.

1. **The sponsor set the scope.** The first request was "end to end." It was recovered by asking for a real case and drawing the authority ladder — not by arguing.
2. **A number entered the room unsourced.** "Eleven minutes" was quoted twice and could have been repeated in a steering deck as fact. Writing its source next to it kept it an assumption until measured.

## Practical artifact

The workshop's **decision log** (one page) and **assumption register**, as above. Run the same agenda on a different Northstar profile — for example, damage-claim document processing — and produce your own.

## Lab

Role-play the excerpts with three colleagues, each taking a stakeholder who wants something different. Then write the closing decision log from your own transcript. Acceptance criteria: at least one assumption you had to demote from fact, one constraint turned into a named artifact, and one non-AI option that survived.

## Check yourself

1. Sam does not say "no" to autonomous refunds. What does Sam do instead, and why is it more durable?
2. Which statement in the transcript should you distrust the most until it is measured?
3. A stakeholder introduces a vendor demo at minute 30. How do you handle it differently than at minute 70?
4. Which constraint became an ADR, and what made it ready to become one?

## Further reading

- [Discovery workshop playbook](00-discovery-workshop.md)
- [AI discovery & problem framing](../01-ai-sa-foundations/01-discovery-framing.md)
- [Northstar ADR set](08-northstar-adr-set.md)
- [Assumption register and opportunity canvas templates](../../templates/README.md)
