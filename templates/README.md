# SA AI artifact templates

Plain-text, copy-and-fill versions of the artifacts the book asks each part to produce. They are intentionally short: a template that takes an hour to fill in gets skipped, and a skipped artifact is worse than a thin one.

| Template | Use it when | Book chapter |
|---|---|---|
| [`adr.md`](adr.md) | You are recording one significant architecture decision | [C4, sequence diagrams & AI ADRs](../docs/01-ai-sa-foundations/03-diagrams-adrs.md) |
| [`ai-opportunity-canvas.yaml`](ai-opportunity-canvas.yaml) | You are framing a candidate use profile | [AI discovery & problem framing](../docs/01-ai-sa-foundations/01-discovery-framing.md) |
| [`nfr-scorecard.md`](nfr-scorecard.md) | You are turning "make it good" into measurable requirements | [Requirements, NFRs & quality attributes](../docs/01-ai-sa-foundations/02-requirements-nfrs.md) |
| [`threat-model.md`](threat-model.md) | You are threat-modelling an agent or RAG system | [Agentic AI threat modeling](../docs/07-security-governance/00-threat-modeling.md) |
| [`architecture-review-checklist.md`](architecture-review-checklist.md) | You are reviewing someone else's AI design | [AI architecture review](../docs/11-sa-craft/02-architecture-review.md) |
| [`capstone-submission.md`](capstone-submission.md) | You are assembling the capstone dossier | [Capstone brief](../docs/11-sa-craft/03-capstone.md) |

## Conventions

- **Fill in or delete, never leave the prompt.** Placeholders are written in [square brackets] (and in `<angle brackets>` in the YAML canvas, where square brackets would change its meaning). A line that still has one is unfinished work.
- **Evidence over assertion.** Wherever a template asks for evidence, put an ID, a link, or the words *none yet*. "None yet" is an honest answer; a blank is not.
- **Date everything time-sensitive.** Model names, prices, limits, and regulatory positions get an as-of date.
- **Version the artifact with the release it describes.** An ADR is superseded, never edited in place.

## Licence

These templates follow the repository [LICENSE](../LICENSE). If you want to reuse them beyond personal study, ask the copyright holder first.
