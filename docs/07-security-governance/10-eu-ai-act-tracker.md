# EU AI Act tracker: dates, changes, and architectural controls

> **Last reviewed: 2026-09-20** — every fact below is as of that date; see the [freshness policy](../appendix/maintenance.md). Next scheduled review: **2026-11-15**, before the 2 December 2026 dates below. This page is architecture guidance, not legal advice. Whether and how the Act applies to a system depends on the operator's role and the system's risk classification — determine both with qualified counsel. Where a date matters to a decision, re-verify it against the [Official Journal](https://eur-lex.europa.eu/) before relying on it.

## Learning objectives

After this chapter you will be able to:

- state the AI Act's current application dates and which of them changed in 2026;
- map each obligation family to the architectural control that produces its evidence;
- keep a dated regulatory tracker that a governance review can trust.

## Decision this chapter teaches

Which regulatory facts belong in an architecture — as dated, sourced constraints — and which must stay with counsel.

## Why this page exists

The [governance chapter](05-governance-audit.md) deliberately carries no dates: "determine applicability, dates, role, and sectoral obligations with qualified legal counsel." That advice is right and incomplete. An architect still needs to know *what is currently true* to size the work, and the position moved in 2026. Dated facts decay fastest of anything in this book, so they live here, with a source and a review date each, rather than scattered through chapters where they would silently go stale.

## What changed in 2026

On **7 May 2026** the Council and Parliament reached a provisional agreement on the *Digital Omnibus on AI*. It was adopted as **Regulation (EU) 2026/1744 of 8 July 2026**, published in the Official Journal on **24 July 2026**, and — on the text of the Regulation — entered into force "as a matter of urgency" on the third day after publication, **27 July 2026**. It amends Regulation (EU) 2024/1689 (the AI Act).

| Topic | Position as amended | Confidence |
|---|---|---|
| General application | The AI Act applies from **2 August 2026** | Primary text (Art. 113) |
| High-risk obligations, stand-alone systems (Annex III) | Chapter III, Sections 1–3 apply from **2 December 2027** | Primary text (Art. 113(c)) |
| High-risk obligations, systems embedded in regulated products (Annex I) | Apply from **2 August 2028** | Primary text (Art. 113(c)) |
| Prohibited practices and AI literacy | Apply since **2 February 2025**; new prohibitions on non-consensual intimate imagery and child sexual abuse material apply from **2 December 2026** | Primary text (Art. 113(a)) |
| General-purpose AI model obligations | Apply since **2 August 2025**; the obligations themselves are unchanged, but the AI Office's supervisory powers over systems built on general-purpose models were expanded | Primary text (Art. 113(b)); Regulation 2026/1744; commentary |
| Transparency duties (Art. 50) | Apply from **2 August 2026** | Commission announcement; primary text |
| Machine-readable marking of AI-generated content, Art. 50(2) | A **four-month transition** for providers who placed systems on the market before 2 August 2026, i.e. to **2 December 2026** | Recital of 2026/1744; commentary |
| AI literacy (Art. 4) | Softened from a duty to ensure staff competence to a duty to take *measures supporting* AI literacy | Primary text; commentary |

Before the Omnibus, the high-risk obligations were scheduled on the general application date and, for Article 6(1) systems, 2 August 2027. They were **deferred, not cancelled**: the requirements themselves were not removed, only their start.

### What the Commission said about 2 August 2026

The Commission's announcement of 31 July 2026 states that enforcement by the AI Office and national authorities begins on 2 August, alongside new transparency requirements: chatbots and other interactive AI systems must tell users they are dealing with AI, deepfakes must be labelled, and AI-generated or altered content needs machine-readable marks. It notes that more than 180 organisations have signed the Code of Practice on transparency. The announcement does not itemise which other rules are enforced, and this page does not either.

## What this means for the architecture

The deferral is a trap for the unwary. It is tempting to read "December 2027" as "not our problem yet." Three reasons not to:

1. **The design is being made now.** Logging, human-oversight design, and data lineage are cheap to include at design time and expensive to retrofit. A system that will be in production in 2027 is being designed in 2026.
2. **Transparency applied on 2 August 2026, on the original schedule.** A customer-facing chatbot is squarely the kind of system the Commission says must tell users they are dealing with AI; confirm the exact scope for your case with counsel, but do not plan as if it were still deferred.
3. **Contracts and procurement move first.** Customers and regulators ask for evidence long before an enforcement date.

## Mapping obligations to architecture

This maps *families* of obligations to the control that generates their evidence. It does not decide whether an obligation applies to you — that is the role and classification question for counsel.

| Obligation family (AI Act reference) | Architectural control | Evidence it produces | Book chapter |
|---|---|---|---|
| Risk management system (Art. 9) | A lifecycle risk process with a risk card per use profile and a threat model | Risk register, risk cards, review dates | [Governance operating system](05-governance-audit.md), [Threat modeling](00-threat-modeling.md) |
| Data and data governance (Art. 10) | Data readiness, lineage, provenance, and deletion propagation | Dataset cards, lineage records, deletion tests | [Data readiness](../03-data-context/00-data-readiness.md), [Governance & provenance](../03-data-context/05-governance-provenance.md) |
| Technical documentation (Art. 11) | An audit dossier assembled from the release manifest, not written afterwards | Versioned dossier linked to a release | [Governance operating system](05-governance-audit.md) |
| Record-keeping / logging (Art. 12) | Structured traces that attribute each output to a model, prompt, data, and tool version | Retained trace store with a retention schedule | [Observability](../08-platform-operations/03-observability.md) |
| Transparency to deployers (Art. 13) | System and model cards; a documented intended purpose and limits | Cards versioned per release | [Responsible AI](04-responsible-ai.md) |
| Human oversight (Art. 14) | Approval gates, bounded authority, and a real ability to override or stop | Approval logs; oversight exercises; stop-drill records | [Human oversight](../04-llm-systems/05-human-oversight.md), [Approvals & recovery](../05-agents/04-approvals-recovery.md) |
| Accuracy, robustness, cybersecurity (Art. 15) | Sliced evaluation, adversarial testing, regression gates, secure execution | Evaluation reports, red-team findings, gate results | [Evaluation](../06-evaluation/00-quality-strategy.md), [Regression gates](../06-evaluation/05-regression-gates.md) |
| Transparency toward people (Art. 50) | Disclosure in the interface; content provenance and marking where AI generates content | UI disclosure tests; provenance records | [Agent product UX](../04-llm-systems/06-agent-product-ux.md), [Supply chain & provenance](07-ai-supply-chain.md) |
| AI literacy (Art. 4) | Training and guidance for the people who operate and oversee the system | Training records, role competencies | [Operating model](../09-economics-delivery/03-operating-model.md) |
| Quality management and post-market monitoring | Incident response, monitoring, and a change-control process | Incident log, monitoring reports, change records | [Incidents & degradation](../08-platform-operations/04-incidents-degradation.md), [Agent incident forensics](../08-platform-operations/12-agent-incident-forensics.md) |

## Applying it to Northstar (a worked reading)

This is an illustration of the method, not a legal conclusion.

| Northstar profile | An architect's provisional reading | Why counsel must confirm |
|---|---|---|
| **Shipment advice** — draft-only, for trained agents | Likely outside the high-risk categories; internal-facing; Art. 4 literacy for agents; keep logging and oversight as good practice | The classification depends on the Annex III list and on whether the assistant ever influences decisions about workers |
| **Customer-facing chat** (a later profile) | Art. 50 disclosure applies from 2 August 2026 if customers interact with the AI directly | Applicability turns on Northstar's role and on the precise scope of Art. 50 |
| **Refund execution** | Not obviously an Annex III use, but a consequential action; treated as high-consequence by *Northstar's* own risk classification regardless | Whether any part touches an Annex III category (for example, decisions about individuals' access to services) is a legal question |
| **Any use that scores agent performance** | Approaches the employment and worker-management category; avoid by design unless deliberately assessed | Annex III classification and any worker-consultation obligations |

The pattern is worth copying: classify each *use profile* separately, mark the reading as provisional, and record who confirmed it and when.

## Keep the tracker alive

A tracker that nobody reviews is worse than none, because it looks authoritative. Each review should:

1. re-check every date above against the Official Journal, not against this page;
2. record the review date and the reviewer;
3. check for new Commission guidelines, delegated or implementing acts, and harmonised-standards status — this page does not assert the state of any of these;
4. link any change to the ADRs or risk cards it affects, and open a review on those.

Dates to calendar now: **2 December 2026** (the Art. 50(2) marking transition ends and the new Art. 5 prohibitions apply), then **2 December 2027** and **2 August 2028** for the high-risk obligations.

## Practical artifact

An **obligations register** for one Northstar profile: the obligation family, whether it applies (with who confirmed and when), the control, the evidence, the owner, and the next review date. Seed it from the mapping table.

## Lab

Take the Northstar customer-facing chat profile. Produce (1) a provisional classification with the reasoning, (2) the Art. 50 disclosure requirement as a testable interface requirement, and (3) the entries it adds to the obligations register. Acceptance criteria: every claim about a date is sourced, and every applicability claim names who must confirm it.

## Check yourself

1. The high-risk dates were deferred. Give two reasons a team should still build logging and oversight now.
2. Which Northstar profile is affected by an obligation that was **not** deferred, and which obligation is it?
3. Why does this tracker cite the Official Journal for dates but not for whether a Northstar profile is high-risk?
4. A colleague says "we have until 2028." What questions would you ask before agreeing?

## Sources

- [Regulation (EU) 2024/1689 — the AI Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) (primary)
- [Regulation (EU) 2026/1744 — Digital Omnibus on AI](https://eur-lex.europa.eu/eli/reg/2026/1744/oj) (primary; amends the above)
- [Consolidated Article 113](https://artificialintelligenceact.eu/article/113/) (secondary, cross-checked against the Omnibus)
- [European Commission: enforcement and new transparency requirements from 2 August](https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august) (primary; 31 July 2026)
- [Cloud Security Alliance research note: the high-risk deadline, deferred not cancelled](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-high-risk-deadline-omnibus-20260/) and [Gibson Dunn: Omnibus agreement](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/) (secondary commentary; read for dates and context, not as legal authority)

## Further reading

- [AI governance operating system, audit & regulation](05-governance-audit.md)
- [Responsible AI & risk classification](04-responsible-ai.md)
- [Maintenance & freshness](../appendix/maintenance.md)
