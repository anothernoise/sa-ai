# Prompt injection & tool abuse

> _Editorial blueprint — last reviewed: 2026-07-16. See the [freshness policy](../appendix/maintenance.md)._

## Learning objectives

After this chapter you will be able to:

- frame the architecture decision in measurable terms;
- compare viable options and expose their trade-offs;
- produce an artifact that can survive design and governance review.

## Decision this chapter teaches

Layer defenses so untrusted content cannot silently obtain authority or exfiltrate data.

## Scope

This chapter will develop the durable mental model, walk through the Northstar case, map the design to representative platform choices, and show how the system fails. It will explicitly cover data flow, trust boundaries, evaluation, operability, cost, and human accountability where they apply.

## Practical artifact

A control map covering input, context, tools, output, and monitoring.

## Planned lab

Apply the decision to the Northstar case. Submit the artifact, the assumptions behind it, at least two alternatives, the dominant quality attribute, and the evidence that would change the decision.

## Check yourself

1. What evidence is required before making this decision?
2. Which quality attributes are in tension, and which one wins ties?
3. What is the safest useful fallback when the AI component is unavailable or uncertain?
4. Which assumption is most likely to invalidate the design?

## Authoring notes

- Lead with a realistic failure or decision, not a product catalog.
- Keep the main explanation vendor-neutral; date all product mappings.
- Include one decision table or diagram and one worked example.
- Prefer primary standards, documentation, and research in further reading.
