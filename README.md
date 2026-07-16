# SA AI — AI Solution Architect Bootcamp

> A hands-on book and bootcamp for solution architects who must turn AI ambition into secure, reliable, economically defensible production systems.

**Status:** curriculum and repository scaffold. Chapters will be developed in public, with practical labs and a portfolio-grade capstone.

SA AI is not a prompt-engineering handbook and not a catalog of vendor features. It teaches the architecture work around AI: framing the decision, choosing the right system pattern, engineering context and data, constraining agents, evaluating behavior, managing risk, operating at scale, and defending the business case.

The book braids three strands:

1. **The SA craft** — discovery, requirements, trade-offs, diagrams, ADRs, stakeholder communication, and delivery.
2. **AI systems engineering** — models, retrieval, agents, evaluation, safety, platforms, observability, and FinOps.
3. **Hands-on delivery** — every part produces an artifact or working lab that becomes part of the capstone portfolio.

## Who this is for

You already understand software, cloud, data, or enterprise architecture. By the end you will be able to:

- decide whether a problem needs rules, classical ML, generative AI, agents, or no AI at all;
- translate an ambiguous AI request into measurable functional and non-functional requirements;
- design RAG, tool-using, agentic, multimodal, and hybrid AI systems;
- select models and platforms based on evidence instead of benchmark marketing;
- build an evaluation strategy before production rollout;
- threat-model prompt injection, data leakage, excessive agency, and supply-chain risk;
- design for latency, reliability, observability, governance, and cost;
- explain the same architecture to engineering, security, legal, product, and finance leaders.

## Bootcamp format

- **Module 0 plus eleven parts.** Start with orientation and Parts 1–3. Later parts can be taken selectively, but Part 11 integrates everything.
- **Pace.** Designed for 10–12 cohort weeks or self-paced study. Budget 20–30 minutes per chapter and 1–3 hours per lab.
- **Assessments.** Every chapter ends with *Check yourself*. Every part produces a decision artifact, experiment, or implementation.
- **Capstone.** Design an enterprise AI platform and one production use case from discovery through evaluation, security review, operating model, and executive defense.

## The recurring case

The book follows **Northstar**, a fictional multi-region enterprise. Its teams want an AI knowledge assistant, workflow automation, document processing, and customer-facing AI. Each part revisits the same constraints—sensitive data, uneven source quality, legacy systems, latency, cost, and regulatory obligations—so architecture decisions accumulate rather than appearing as isolated examples.

## Labs

The intended two-repository model mirrors the reference bootcamp:

- **Public starter repositories** contain briefs, synthetic data, scaffolding, and instructions.
- **Private solution repositories** contain reference implementations, instructor notes, rubrics, and answer keys.

Planned public starters:

| Lab | Purpose | Used in |
| --- | --- | --- |
| `sa-ai-discovery` | AI opportunity canvas, requirements, NFRs, and ADRs | Parts 1–2 |
| `sa-ai-rag` | Evidence-grounded RAG with citations and evals | Parts 3–4, 6 |
| `sa-ai-agents` | Tool contracts, approvals, state, and failure recovery | Part 5 |
| `sa-ai-evals` | Offline, online, adversarial, and regression evaluation | Part 6 |
| `sa-ai-guardrails` | Prompt-injection and data-loss defenses | Part 7 |
| `sa-ai-platform` | Gateway, routing, observability, quotas, and cost controls | Parts 8–9 |
| `sa-ai-capstone` | Final brief and submission templates | Part 11 |

## Book design principles

- **Problem before model.** Architecture begins with the decision or workflow being improved.
- **Evaluation before scale.** A system is not production-ready until its behavior is measurable.
- **Least agency.** Grant the minimum autonomy and privileges required for the task.
- **Evidence over demos.** Compare options with representative tasks, failure modes, and economics.
- **Portable concepts, concrete examples.** Teach vendor-neutral patterns, then map them to current platforms.
- **Artifacts over opinions.** Each part produces something an SA can use in a real review.

## Local development

```bash
npm install
npm run serve
```

Build the static book with `npm run build`. GitHub Actions publishes the `_book` output to GitHub Pages.

## Initial content roadmap

The detailed curriculum is in [SUMMARY.md](SUMMARY.md), and the authoring contract is in [Chapter template](docs/appendix/chapter-template.md). The first writing milestone is Module 0 plus Parts 1, 4, 6, and 11: enough to teach the end-to-end spine before filling specialist depth.

## Licensing

Proprietary — all rights reserved. See [LICENSE](LICENSE).
