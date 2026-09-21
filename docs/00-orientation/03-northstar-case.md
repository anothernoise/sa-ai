# The Northstar recurring case

> _Last reviewed: 2026-09-20 — see the [freshness policy](../appendix/maintenance.md). Northstar Logistics is fictional. Its figures are case-file facts chosen to make trade-offs concrete; they are not benchmarks._

## Learning objectives

After this chapter you will be able to:

- state the Northstar facts every later chapter, lab, and worked example relies on;
- separate what Northstar has told us, what we have measured, and what we are still assuming;
- recognise the two use profiles the book keeps distinguishing: *shipment advice* and *refund execution*.

## Decision this chapter teaches

Which facts about a client are stable enough to design against, and which must stay on an assumption register until evidence replaces them.

## Why a recurring case

Architecture advice detached from a client reads as a catalogue. Northstar keeps the constraints constant — sensitive data, uneven source quality, legacy systems, latency, cost, regulation — so a decision in Part 3 (retrieval) visibly constrains a decision in Part 7 (security) and Part 9 (economics). The synthetic data pack for the labs is generated from this chapter; if the two ever disagree, this chapter wins.

## The company

Northstar Logistics is a multi-region freight and last-mile logistics provider. It moves goods for retailers and manufacturers and answers to two kinds of customer: the shipper who booked the freight, and the consignee who is waiting for it.

| Attribute | Case-file fact |
|---|---|
| Headquarters | Toronto, Canada |
| Regions | Canada (English and French, with Québec data-handling expectations), United States, European Union (hub in Rotterdam) |
| People | About 9,500 employees; about 380 customer-support agents across three regional queues |
| Support volume | About 46,000 support contacts per month across all reasons; peak season (November–December) is roughly 2.6× that |
| Shipment-support contacts | About 30,000 per month (status, delay, and policy questions) — the population the book's shipment agent handles |
| Delayed-shipment contacts | About 18,000 per month — the first use profile's baseline, with a median touch time of 11 minutes and an 18% repeat-contact rate |
| Refunds | Goodwill and service-failure refunds, capped by role; above the cap a supervisor approves |
| Channels | Web chat, email, and a French/English phone line |

## Systems landscape

| System | What it holds | Architecture consequence |
|---|---|---|
| Microsoft Entra ID | Workforce identity and groups | The identity source for user-delegated authorisation; there is no second directory to trust |
| Order management API | Orders, shipment status, refunds | Non-standard: mixed pagination, inconsistent status enums, no idempotency keys on writes |
| Carrier portals and EDI feeds | Scan events and delay reasons | Eventually consistent; a status can lag the truth by hours |
| Supplier and carrier notices | Delay and disruption announcements | Unstructured PDFs and emails; the authoritative source for *why* something is late |
| Policy documents | Service terms, refund policy, regional variants | Fragmented across four locations, with expired revisions still readable |
| Power BI and Microsoft Fabric | Operational analytics and cost reporting | An existing analytics estate to reuse rather than replace |

## Stakeholders

| Stakeholder | Wants | Bears the cost of an error |
|---|---|---|
| VP Customer Operations (sponsor) | Lower cost per contact and shorter delay-case resolution | Owns the service-level and budget outcome |
| Support agent (frontline) | Less time hunting across tools | Answers to the customer for a wrong statement |
| Customer / consignee | A correct answer about their shipment, fast | Waits longer, or receives a wrong refund decision |
| Head of Security and Privacy | No cross-tenant or cross-region data exposure | Personally accountable for an incident |
| Finance (FP&A) | A bounded, attributable AI spend | Absorbs uncontrolled token and retry cost |
| Legal and Compliance | A defensible position under privacy law and the EU AI Act | Carries regulatory exposure |
| Regional operations leads | Regional rules respected | Handle escalations when regional rules are broken |

## What Northstar asked for

Northstar asks for "an AI customer-service platform in three months." Read closely, that is four different requests with different risk:

| Request | Nature | First profile to qualify |
|---|---|---|
| Knowledge assistant | Answer policy and shipment questions from governed sources | Advisory, read-only |
| Workflow automation | Do multi-step tasks such as investigating a delayed order | Bounded, human-approved actions |
| Document processing | Extract fields from damage photos, notices, and claims | Advisory extraction feeding a person |
| Customer-facing AI | Talk to consignees directly by chat or voice | Highest exposure; later |

The SA qualifies **shipment advice** first and deliberately separates **refund execution** as a higher-risk future profile. The two may share a chat interface. They do not share a risk classification, an authority level, or a release gate.

## Constraints that do not move

- **Residency.** Canadian customer data stays in Canada unless a documented, approved transfer applies; EU data stays in the EU.
- **Identity.** Every action is attributable to a person and a workload identity; no shared API keys.
- **Language.** French and English must both meet the quality bar. A French-language regression is a release blocker, not an averaged-away detail.
- **Reversibility.** A refund cannot be silently retried, and a customer email cannot be unsent.
- **Cost.** Budget is expressed per *resolved qualified case*, not per token.

## Initial assumption register

Every assumption names how it will be tested and what changes if it is false.

| # | Assumption | Confidence | How to test | If false |
|---|---|---|---|---|
| A1 | Most delay questions are answerable from notices, policy, and shipment status without new integrations | Medium | Label 100 real delay contacts by answer source | Integration scope grows; the timeline slips |
| A2 | The order API exposes enough status history to explain a delay | Low | Trace ten cases end to end | A workflow must reconcile carrier feeds itself |
| A3 | Current policy documents are authoritative and unambiguous | Low | Find conflicting or expired revisions in the four locations | A curation project comes before retrieval |
| A4 | Peak volume is 2.6× normal | Low | Pull twelve months of contact data | Capacity and cost estimates change |
| A5 | Agents will trust and use a cited answer | Medium | Shadow-mode observation with frontline agents | Adoption, not accuracy, is the constraint |
| A6 | Refund volume justifies automation | Unknown | Count refunds above and below the supervisor cap | The autonomous-refund profile is dropped |

## Practical artifact

A one-page **case brief**: the decision requested, the two use profiles, the top five constraints, the stakeholder map, and the assumption register above with owners and test dates added.

## Lab

Apply the decision to Northstar. Submit the case brief, the assumptions behind your framing, at least two alternatives to an AI system, the dominant quality attribute, and the evidence that would change your recommendation. The synthetic Northstar data pack in the [`sa-ai-evals` lab](https://github.com/anothernoise/sa-ai-evals) gives you cases and policy documents to test A1 and A3 yourself.

## Check yourself

1. Which two Northstar requests would you refuse to combine into one release, and why?
2. Which assumption above is cheapest to test and most likely to change the design?
3. The sponsor wants "AI in three months." What would you say is the earliest defensible scope, and what evidence would let you widen it?
4. Which stakeholder bears the cost of a wrong refund, and how does that change who signs off?

## Further reading

- [Discovery workshop playbook](../11-sa-craft/00-discovery-workshop.md)
- [Worked discovery transcript](../11-sa-craft/07-worked-discovery-transcript.md)
- [Northstar ADR set](../11-sa-craft/08-northstar-adr-set.md)
