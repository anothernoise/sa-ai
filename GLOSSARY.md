# Glossary

## Agent Card

A machine-readable A2A document describing an agent's identity, skills, endpoints, protocol capabilities, and authentication requirements. Discovery metadata does not itself grant trust or authority.

## Agent runtime

The compute and control environment that executes agent application logic, including its framework loop, sessions, tools, isolation, scaling, and telemetry integrations.

## AgentOps

The engineering and operating discipline for versioning, evaluating, releasing, observing, securing, recovering, and retiring agent systems, including their models, tools, identities, state, memory, policies, and human controls.

## Architecture fitness function

An automated or repeatable check that detects whether a system continues to satisfy an architectural property, such as tenant isolation, latency, fallback compatibility, deletion or cost per successful outcome.

## Barge-in

A voice-interaction event in which a user begins speaking while the system is speaking. Correct handling can require stopping playback, cancelling generation, truncating unheard conversation state and reconciling—not blindly cancelling—any in-flight business action.

## Agent Skill

A versioned package of reusable procedural knowledge that an agent loads when relevant. In the open Agent Skills format, a skill is a directory with a required `SKILL.md` and optional scripts, references, and assets. A skill does not itself grant tool or data authority.

## Agent2Agent protocol

An open protocol, abbreviated A2A, for delegating stateful tasks and exchanging messages and artifacts between independently implemented, opaque agentic applications.

## Agent

An AI-enabled system that selects and invokes tools, observes results, and iterates toward a goal within defined authority.

## AI gateway

A control point between applications and model providers that can apply routing, policy, quotas, logging, and fallback behavior.

## AI management system

An organizational system of policies, roles, processes, controls, evidence, review, and continual improvement for the responsible development, provision, or use of AI.

## Context engineering

The design of the information, instructions, tools, memory, and state supplied to a model for a task.

## Cost per successful task

The complete attributable cost of model, retrieval, tools, compute, retries, human work and operations divided by verified tasks that meet the defined success contract.

## Data contract

A versioned agreement defining a data product's owner, semantics, schema, authority, permitted purpose, quality, access, freshness, retention, deletion and change obligations.

## Distillation

Training a smaller student model to reproduce selected behavior of a larger teacher model or ensemble, usually to reduce latency or serving cost within a bounded task.

## Evaluation

A repeatable measurement of system behavior against representative tasks, rubrics, safety constraints, and operational requirements.

## Endpointing

The decision that a speaker has completed a turn and the system may respond. Unlike voice activity detection, endpointing can use acoustic, linguistic, semantic and interaction context to distinguish a completed thought from a pause.

## Episodic memory

A timestamped representation of a particular interaction or event, retained so an agent can use relevant prior experience in later tasks.

## Foundation model

A broadly trained model that can be adapted or prompted for many downstream tasks.

## Grounding

Connecting generated output to trusted evidence, tool results, or system-of-record data.

## GraphRAG

A retrieval-augmented generation pattern that indexes entities, relationships, claims, communities, or graph paths so a system can answer relationship-heavy and corpus-wide questions that flat chunk retrieval handles poorly.

## Hallucination

Fluent output that is unsupported, fabricated, or inconsistent with available evidence.

## Human-in-the-loop

A workflow in which a person reviews, approves, corrects, or takes responsibility for a system decision or action.

## LoRA

Low-Rank Adaptation, a parameter-efficient fine-tuning method that freezes base-model weights and trains low-rank update matrices for selected layers.

## Idempotency

The property that repeating an operation with the same identity and parameters produces no additional effect beyond the first successful application.

## Hosted agent

Agent application code packaged and deployed to a managed agent runtime, where the platform provides an endpoint, scaling, isolation, identity, state, or observability integrations.

## Inference

Running a trained model to produce an output from an input.

## LLM-as-a-judge

Using a language model to grade or compare another system's output against a rubric. Model judges require calibration because they can exhibit position, verbosity, self-preference, and reasoning biases.

## Large language model

A model trained on large text or multimodal corpora to predict and generate sequences, often abbreviated LLM.

## Model routing

Selecting a model or provider for each request based on task, policy, quality, latency, availability, or cost.

## Model portfolio

A governed set of deterministic, small, frontier, specialized, adapted, hosted, or self-hosted model routes and human fallbacks assigned to workload classes by evaluated quality, risk, latency, capacity, cost, and policy.

## Multimodal system

An AI system that accepts, relates or produces more than one modality—such as text, image, document layout, audio or video—while preserving modality-specific provenance and controls.

## Model Context Protocol

An open protocol, abbreviated MCP, through which host applications discover and use tools, resources, and prompts exposed by MCP servers.

## Memory consolidation

The governed process of deduplicating, summarizing, reflecting on, correcting, superseding, or forgetting stored experiences and facts while preserving provenance.

## Memory contract

A specification for a memory class defining its purpose, owner, scope, permitted sources, write and read authority, conflict behavior, retention, user controls, evaluation, and fallback.

## pass@k

An evaluation measure asking whether at least one of `k` attempts succeeds; useful when a system is permitted to generate and select among alternatives.

## pass^k

An evaluation measure asking whether all `k` repeated trials succeed; useful for measuring consistent reliability.

## Prompt injection

Instructions embedded in user or retrieved content that attempt to override the intended policy or redirect model and tool behavior.

## Provenance

Information describing the entities, activities and agents involved in creating, transforming or using data and artifacts, enabling authority, lineage, correction, audit and deletion analysis.

## Quantization

Representing model parameters or computation at reduced numeric precision to lower memory or improve inference efficiency, with quality and hardware-dependent trade-offs.

## Sandbox

A disposable, least-privileged execution environment that restricts an agent's filesystem, network, credentials, processes, resources, and lifetime. It contains execution consequences but does not replace authorization or business policy.

## Sender-constrained token

An access token whose use requires proof of possession of key material by the authorized client, reducing the value of a stolen bearer token.

## Service-level objective

A target for a user-relevant service measure—such as valid task success, harmful failure rate, latency, freshness, or cancellation—over a defined period.

## Unknown outcome

A durable workflow state in which an operation may have committed but its response was lost, requiring reconciliation by transaction or idempotency identity before retry.

## Prompt agent

A managed agent defined primarily through configuration—such as instructions, model, and tools—whose loop and hosting are supplied by the platform rather than custom application code.

## Procedural memory

Versioned knowledge of how to perform a recurring task, represented as an instruction, workflow, policy, or verified skill rather than a record of one event.

## Retrieval-augmented generation

A pattern that retrieves relevant evidence and supplies it to a generative model, often abbreviated RAG.

## Semantic memory

Durable facts, preferences, entities, and relationships selected from prior interactions or trusted sources for reuse across tasks.

## Temporal knowledge graph

A graph that records when facts and relationships are valid and, where needed, when the system observed them, enabling historical, correction-aware, and time-bounded queries.

## Test-time compute

Computation allocated while answering a request, including longer reasoning, multiple samples, search, revision, tool use, and verification. It is also called inference-time compute.

## Tool

A narrowly defined capability—such as search, database read, calculation, or workflow action—that a model or agent may invoke through a typed contract.

## Verifier

A deterministic check, executable test, evidence check, human review, or calibrated model grader used to assess a candidate result or intermediate state.

## Voice activity detection

The estimation of whether an audio interval contains speech, often abbreviated VAD. It detects speech presence rather than semantic completion of a conversational turn.

## Voice agent

An AI-enabled system that conducts spoken interaction through a real-time media channel. Its conversation plane may use cascaded speech recognition and synthesis or a native speech-to-speech model, while identity, policy and consequential actions remain governed by independent controls.

## Workflow

A system in which the control path is defined primarily by code or configuration, even when individual steps call models. This contrasts with an agent that dynamically selects its process and tools.
