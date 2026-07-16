# Agent Skills: reusable expertise for agents

> _Last reviewed: 2026-07-16 — see the [freshness policy](../appendix/maintenance.md)._

## Learning objectives

After this chapter you will be able to:

- distinguish a skill from a prompt, tool, MCP server, agent, plugin, and memory;
- author a portable skill using the open Agent Skills format;
- design reliable discovery, activation, execution, validation, and composition behavior;
- evaluate both trigger quality and task-output quality against a no-skill baseline;
- govern skill supply chains, permissions, versions, and enterprise distribution.

## Decision in one sentence

> **Create a skill when reusable procedural knowledge measurably improves a class of tasks without requiring a new service, authority boundary, or autonomous agent.**

## Why skills matter

General-purpose agents know common patterns but not every organization's procedures, schemas, review conventions, templates, and failure history. Repeating those instructions in every prompt wastes context and produces inconsistent execution. Hard-coding them into an agent makes reuse and independent versioning difficult.

The open [Agent Skills specification](https://agentskills.io/specification) defines a lightweight directory with a required `SKILL.md` and optional scripts, references, and assets. Compatible clients progressively load the skill only when the task needs it. Skills therefore act as versioned, on-demand procedural knowledge.

## The top ten skill architecture topics

### 1. Skill boundaries: instruction is not capability or authority

| Component | Primary purpose | Can independently grant access? | Typical lifecycle |
| --- | --- | --- | --- |
| Prompt | Guide one interaction | No | Request or conversation |
| Skill | Reusable procedure, expertise, and resources | No | Versioned package |
| Tool | Read or change an external system | Only through its server-side authorization | Deployed interface |
| MCP server | Expose tools, resources, or prompts through a protocol | No; it transports capabilities and authentication context | Service or process |
| Agent | Select and use tools in a goal-directed loop | Only within granted identity and policy | Task or service |
| Memory | Persist selected facts or experience | No | Policy-defined |
| Plugin | Package skills plus integrations or distribution metadata | No; connected systems still enforce access | Installed package |

A skill can teach an agent how to request a refund, but only an authorized refund tool can execute it. Treating instructions as permissions is a critical design error.

### 2. Open format and progressive disclosure

A portable skill has this shape:

```text
shipment-investigation/
├── SKILL.md
├── scripts/
│   ├── validate_case.py
│   └── summarize_events.py
├── references/
│   ├── event-schema.md
│   └── failure-codes.md
├── assets/
│   └── investigation-report.md
└── evals/
    └── evals.json
```

The specification's progressive-disclosure model has three stages:

1. **Discovery:** load only name and description metadata.
2. **Activation:** load the complete `SKILL.md` when the task matches.
3. **Execution:** load scripts, references, or assets only when required.

This lets an agent discover many skills without placing all instructions in every context window. The specification recommends keeping the main instructions below 500 lines and approximately 5,000 tokens, then using focused referenced files.

### 3. Discovery and activation quality

The `description` is a routing contract. It must explain both what the skill does and when it applies.

Weak:

```yaml
description: Helps with shipment cases.
```

Stronger:

```yaml
description: Investigates delayed or misrouted shipments using Northstar carrier
  events and facility incident codes. Use for shipment-delay root-cause analysis,
  carrier-event timelines, and evidence-backed escalation reports. Do not use for
  refunds, address changes, or general order questions.
```

Test activation as an information-retrieval problem:

- **true positive:** a relevant prompt activates the skill;
- **false negative:** a relevant prompt misses it;
- **false positive:** an unrelated prompt activates it;
- **true negative:** an unrelated prompt leaves it unloaded.

Measure activation precision and recall using realistic prompts, paraphrases, terse requests, ambiguous cases, and negative examples. The official [description optimization guide](https://agentskills.io/skill-creation/optimizing-descriptions) identifies the description as the primary activation signal.

### 4. Structure and authoring contract

The required `SKILL.md` contains YAML frontmatter followed by Markdown instructions:

```yaml
---
name: shipment-investigation
description: Investigates delayed or misrouted Northstar shipments. Use for carrier
  timelines, facility incident correlation, and evidence-backed escalation reports.
license: Proprietary. See LICENSE.txt
compatibility: Requires Python 3.11 and read-only carrier event access.
metadata:
  owner: logistics-platform
  version: "1.3.0"
---
```

The open specification requires `name` and `description`; it also defines optional `license`, `compatibility`, `metadata`, and an experimental `allowed-tools` field. Treat `allowed-tools` as a client hint, not an enterprise authorization mechanism. Enforce tool access independently.

The body should include:

- exact scope and exclusions;
- prerequisites and expected inputs;
- the preferred stepwise procedure;
- decision and escalation points;
- validation and acceptance criteria;
- concrete examples and output templates;
- non-obvious gotchas;
- conditional links to focused references.

### 5. Granularity and composition

A skill should represent one coherent unit of work. Too narrow, and the agent must load many fragments with conflicting assumptions. Too broad, and activation becomes imprecise while irrelevant instructions consume context.

Good units resemble stable team procedures:

- investigate a shipment incident;
- prepare an architecture decision record;
- review a database migration;
- generate a compliant customer communication.

Avoid “enterprise-everything” skills that combine investigation, refund execution, infrastructure deployment, legal review, and reporting. Compose distinct skills through explicit prerequisites and artifact contracts. Define which skill wins when scopes overlap; never rely on file ordering.

### 6. Deterministic scripts and validation loops

Move repeated deterministic work into tested scripts:

- schema validation;
- file parsing and conversion;
- identifier normalization;
- report linting;
- policy or configuration checks;
- reproducible calculations.

A robust pattern is plan → validate → execute → verify:

```text
1. Read the case and produce investigation-plan.json.
2. Run scripts/validate_plan.py against references/event-schema.json.
3. Correct validation errors before calling any external tool.
4. Execute only approved read operations.
5. Render the report using assets/investigation-report.md.
6. Run scripts/verify_report.py and retain source event IDs.
```

The [Agent Skills authoring guide](https://agentskills.io/skill-creation/best-practices) recommends procedures, concrete defaults, templates, checklists, validation loops, and bundled scripts where agents otherwise reinvent the same logic.

### 7. Context, dependencies, versions, and portability

Every active skill competes for the model's attention. Keep stable procedure in `SKILL.md`, detailed knowledge in references, executable logic in scripts, and reusable output formats in assets.

Record:

- runtime and package requirements;
- network and filesystem assumptions;
- supported clients and models;
- tool names or protocols required;
- input and output schema versions;
- data residency and retention implications;
- migration notes and rollback behavior.

Pin skill versions for production workflows. “Latest” is convenient for experimentation but can change behavior without an application release. Use semantic versioning or another explicit contract, and treat breaking instruction changes like API changes.

Portability requires more than a common directory layout. Clients differ in runtime packages, network access, tool names, approval UX, context size, and support for optional fields. Maintain a portable core plus small client adapters when necessary.

### 8. Security and software supply chain

A skill is executable content when it includes scripts or causes tools to be used. Review it like code and automation—not like passive documentation.

Threats include:

- malicious scripts or obfuscated downloads;
- prompt injection embedded in references or assets;
- overbroad tool recommendations;
- environment-variable and credential harvesting;
- dependency confusion and unpinned packages;
- namespace impersonation and misleading provenance;
- silent behavior changes through mutable versions;
- data exfiltration through network or generated artifacts.

Controls:

1. accept skills only from trusted, traceable sources;
2. review instructions, scripts, binaries, dependencies, and outbound destinations;
3. scan and sign immutable release artifacts;
4. reserve verified publisher namespaces;
5. execute in a sandbox with minimum filesystem and network access;
6. derive permissions from authenticated policy, never from skill metadata;
7. require approval for consequential or destructive actions;
8. log skill ID, version, activated resources, tools, and outcomes;
9. support rapid disable, rollback, and incident investigation;
10. re-review when dependencies, runtime, tools, or ownership change.

Anthropic's [enterprise skills guidance](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/enterprise) treats scripts as high risk because they execute with environment access. Product-specific sandboxes reduce blast radius but do not replace package vetting or least privilege.

### 9. Evaluation: does the skill improve the task?

Evaluate two independent questions:

**Did the correct skill activate?**

- activation precision and recall;
- unnecessary activation rate;
- conflicts when several skills match;
- time and tokens spent selecting skills.

**Did activation improve the result?**

- task success with and without the skill;
- procedure and policy adherence;
- output schema and artifact quality;
- tool-selection accuracy;
- security violations and unsafe actions;
- latency, tokens, tool calls, and cost;
- robustness across supported models and clients.

The official [skill evaluation guide](https://agentskills.io/skill-creation/evaluating-skills) recommends paired `with_skill` and `without_skill` cases. Include positive, negative, edge, adversarial, and failure-recovery prompts. Inspect traces—not only final answers—to find wasteful or incorrect steps.

### 10. Enterprise catalog and lifecycle governance

Treat an enterprise skill catalog as a governed product:

```text
Propose → classify risk → review → evaluate → sign → publish → observe
   ↑                                                        ↓
   └────────── revise, deprecate, revoke, or retire ─────────┘
```

The catalog needs:

- owner, reviewer, publisher, and support contact;
- purpose, audience, risk tier, and permitted environments;
- immutable version and integrity digest;
- required tools, data classes, and permissions;
- evaluation evidence and approved model/client matrix;
- install count, activation rate, success rate, and incident history;
- deprecation, migration, revocation, and retention policies.

Separate authors from production publishers for high-risk skills. A catalog entry can describe required access, but the identity and tool control planes remain authoritative.

## Skills in current products

The format originated at Anthropic and is now published as the open [Agent Skills specification](https://agentskills.io/home). Anthropic's current [Agent Skills documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) supports custom skills across Claude products, with runtime and distribution behavior varying by surface. Other coding-agent and cloud ecosystems also package reusable workflow knowledge as skills, but compatibility and governance features vary rapidly.

Architect to the portable contract:

- metadata for discovery;
- Markdown procedure for activation;
- optional scripts, references, and assets;
- external authorization for real capabilities;
- independent evaluation, signing, cataloging, and rollback.

Date every product mapping and confirm current retention, network, package, workspace-sharing, and admin behavior before deployment.

## Northstar example

Northstar creates `shipment-investigation` from its actual incident runbooks and corrected support cases. The skill:

- activates only for delay and routing investigations;
- reads the event schema only when carrier data is involved;
- uses a tested script to normalize carrier timestamps;
- produces an evidence-linked report template;
- has no write or refund authority;
- escalates when events conflict or a system of record is unavailable;
- is evaluated against the same cases without the skill;
- is signed and pinned by production agent versions.

The refund procedure remains a different skill and the refund API remains a separately authorized tool.

## Practical artifact: skill design record

Record:

- task class and evidence that general prompting is insufficient;
- scope, exclusions, trigger phrases, and negative examples;
- directory and progressive-disclosure plan;
- required tools, data, runtime, and permissions;
- deterministic scripts and validators;
- composition and conflict rules;
- security review and supply-chain evidence;
- with-skill versus without-skill evaluation;
- ownership, versioning, publishing, rollback, and retirement;
- measurable criteria for keeping or removing the skill.

## Lab: build and evaluate one portable skill

Create `shipment-investigation` using the open specification.

Deliver:

1. a valid `SKILL.md`, one focused reference, one template, and one validator;
2. 20 activation prompts: relevant, irrelevant, ambiguous, adversarial, and paraphrased;
3. 10 paired output evaluations with and without the skill;
4. a threat model covering code, tools, network, dependencies, and publisher trust;
5. an immutable release manifest with owner, version, digest, and compatibility matrix;
6. a rollback demonstration using the previous skill version.

Acceptance criteria:

- trigger precision and recall meet predeclared targets;
- the skill materially improves its target tasks over the baseline;
- no negative prompt activates a consequential workflow;
- validation catches deliberately malformed plans and reports;
- the skill cannot acquire tool authority from its own metadata;
- the package can be disabled or rolled back without editing the agent.

## Check yourself

1. When should a reusable procedure become a skill rather than another agent?
2. Why is `allowed-tools` not an enterprise authorization mechanism?
3. How do activation precision and task success measure different failures?
4. Which content belongs in `SKILL.md`, references, scripts, and assets?
5. What must an enterprise catalog retain to revoke a compromised skill safely?

## Further reading

- Agent Skills, [overview](https://agentskills.io/home) and [format specification](https://agentskills.io/specification).
- Agent Skills, [best practices for creators](https://agentskills.io/skill-creation/best-practices).
- Agent Skills, [optimizing descriptions](https://agentskills.io/skill-creation/optimizing-descriptions).
- Agent Skills, [evaluating skill output quality](https://agentskills.io/skill-creation/evaluating-skills).
- Anthropic, [Agent Skills documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview).
- Anthropic, [Skills for enterprise](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/enterprise).
