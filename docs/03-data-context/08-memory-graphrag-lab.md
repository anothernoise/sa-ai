# Lab — compare vector RAG, GraphRAG and temporal agent memory

> _Last reviewed: 2026-07-16 — see the [freshness policy](../appendix/maintenance.md)._

## Purpose

Build three versions of the same Northstar knowledge assistant and choose the simplest architecture that meets the evidence-based release gates.

This is an architecture experiment, not a framework tutorial. Any implementation stack is acceptable if all three candidates use the same source data, model family where practical, evaluation set, security rules, and measurement method.

## Learning objectives

After completing this lab you will be able to:

- implement comparable vector, graph, and temporal-memory retrieval pipelines;
- design local, global, temporal, update, abstention, and isolation tests;
- attribute failures to indexing, retrieval, context assembly, or generation;
- compare quality, latency, freshness, operations, security, and cost;
- defend an adoption or rejection decision with an ADR and reproducible evidence.

## Scenario

Northstar has support cases, shipment events, carrier notices, facility records, policies, and customer conversations. It needs to answer:

- direct questions about a known case;
- multi-hop questions connecting shipments, facilities, incidents, and policies;
- corpus-wide questions about recurring themes;
- temporal questions about what changed and when;
- multi-session questions that use permitted customer preferences;
- questions that should be answered by an authoritative API or refused.

## Candidate architectures

### A — Vector RAG baseline

- parse and chunk the permitted document corpus;
- embed chunks with source, time, tenant, and document metadata;
- retrieve and rerank top-k chunks;
- generate an answer with citations and abstention behavior.

### B — GraphRAG

- retain candidate A's vector index;
- extract and resolve entities, relationships, and source-linked claims;
- detect communities and generate provenance-linked summaries;
- route between vector, entity-local, and community-global retrieval.

### C — Temporal agent memory plus GraphRAG

- retain candidate B's knowledge indexes;
- add task, episodic, semantic, and artifact memory contracts;
- implement write validation, consolidation, temporal supersession, and deletion;
- add user and tenant scope enforcement;
- assemble memory and retrieved evidence within a fixed context budget.

Candidate C is not automatically the winner. It has the highest capability ceiling and the largest safety and operations burden.

## Common data model

Create at least:

- 100 support-case documents;
- 300 timestamped shipment events;
- 20 carrier or facility notices;
- 10 policy documents with two superseded versions;
- 20 users across at least two tenants;
- 10 multi-session conversations per selected test user;
- deliberate aliases, contradictions, corrections, and poisoned passages.

Use synthetic or approved non-sensitive data. Record the generator, seed, schema, and expected answers so the experiment is reproducible.

## Required question set

Create at least 60 questions:

| Category | Minimum | Example |
| --- | ---: | --- |
| Direct semantic | 8 | Which notice mentions frozen packages? |
| Authoritative structured | 6 | What is shipment 184's current status? |
| Entity-local | 8 | Which incidents involved facility SEA-02? |
| Multi-hop | 8 | Which carrier connects the affected products and facilities? |
| Corpus-global | 6 | What are the dominant causes of escalations? |
| Temporal | 6 | Which route did we believe on July 14, and what was corrected? |
| Multi-session memory | 6 | Which update channel did the user confirm previously? |
| Update and forgetting | 4 | What preference remains after correction or deletion? |
| Abstention | 4 | Which unsupported claim should the assistant refuse? |
| Isolation and attack | 4 | Can tenant A retrieve tenant B's similar case or poisoned instruction? |

Keep a hidden test split. Do not tune prompts or routes against every evaluation answer.

## Experiment controls

Hold constant:

- source corpus and effective-time cutoff;
- model version and generation settings where feasible;
- answer and citation format;
- tenant and authorization policy;
- timeout and retry policy;
- judge rubrics and human-review sample;
- infrastructure region and cache state reported for each run.

Run multiple trials for stochastic stages. Save configuration, prompts, extractor versions, index snapshots, and raw measurement outputs.

## Required measurements

### Quality

- indexing/extraction precision and recall;
- entity false-merge and fragmentation rates;
- Recall@k and precision@k;
- multi-hop path correctness;
- global-answer coverage and minority-exception preservation;
- temporal and update correctness;
- grounded answer and citation correctness;
- appropriate abstention;
- end-to-end task success.

### Security and governance

- cross-user and cross-tenant leakage;
- poisoned-memory write rate;
- prompt-injection success rate;
- deleted-memory retrieval rate;
- provenance completeness;
- unauthorized scope request denial rate.

### Operations and economics

- ingestion and reindex duration;
- correction and deletion propagation time;
- p50 and p95 retrieval and end-to-end latency;
- tokens and model calls per question class;
- index size and storage growth;
- cost per query and per successful answer;
- operator time to diagnose injected failures.

## Failure attribution

Label each failed answer with one primary and any contributing causes:

```text
SOURCE_GAP
PARSE_OR_EXTRACTION_ERROR
ENTITY_RESOLUTION_ERROR
INDEX_FRESHNESS_ERROR
ROUTING_ERROR
RETRIEVAL_MISS
RERANK_ERROR
TEMPORAL_FILTER_ERROR
SCOPE_OR_POLICY_ERROR
CONTEXT_ASSEMBLY_ERROR
GENERATION_ERROR
CITATION_ERROR
JUDGE_OR_DATASET_ERROR
```

This prevents “the model failed” from hiding an indexing or policy defect.

## Suggested release gates

Adapt thresholds to Northstar's risk classification, but define them before examining final results.

| Gate | Example threshold |
| --- | --- |
| Cross-tenant leakage | 0 observed cases |
| Deleted-memory retrieval | 0 after deletion SLO |
| Consequential-answer provenance | 100% |
| Current-state routing | 100% to authoritative source |
| Target-category improvement | Material gain over vector baseline with confidence interval |
| p95 latency | Within product SLO by route |
| Cost per successful answer | Within approved unit economics |
| Safe degradation | Passes graph and memory outage tests |

Do not average away a security failure with good answer quality.

## Architecture decision matrix

Score each candidate with measured evidence:

| Criterion | Weight | A: Vector | B: GraphRAG | C: Temporal memory | Evidence |
| --- | ---: | ---: | ---: | ---: | --- |
| Direct-question quality |  |  |  |  |  |
| Multi-hop quality |  |  |  |  |  |
| Global synthesis |  |  |  |  |  |
| Temporal/update quality |  |  |  |  |  |
| Isolation and safety |  |  |  |  |  |
| Freshness |  |  |  |  |  |
| Latency |  |  |  |  |  |
| Cost per success |  |  |  |  |  |
| Operability |  |  |  |  |  |
| Deletion and auditability |  |  |  |  |  |

Weight before scoring. Treat mandatory security gates as pass/fail, not weighted preferences.

## Deliverables

Submit:

1. three runnable candidate pipelines;
2. source and memory schemas plus the graph ontology;
3. the query-routing and memory contracts;
4. evaluation data with public and hidden splits;
5. raw results and a reproducible experiment manifest;
6. quality, security, latency, freshness, and cost analysis;
7. ten representative traces, including failures;
8. an ADR selecting or rejecting each capability;
9. a rollback and safe-degradation runbook;
10. a ten-minute architecture defense.

## ADR decision rule

Choose:

- **A** if direct semantic and structured retrieval meet the target;
- **B** if graph-local or global questions produce material business value and clear the cost and freshness gates;
- **C** only if cross-session continuity and temporal updates add measured value and governance controls pass;
- a **routed hybrid** when different question classes have different winners.

The most mature outcome may be rejecting GraphRAG or persistent memory for the first release while preserving an evidence-based path to add them later.

## Check yourself

1. Why must all candidates share the same dataset and answer contract?
2. Which metrics reveal a good retriever paired with a poor context reader?
3. Why is cost per successful answer more useful than cost per model call?
4. What result would justify GraphRAG for only one query class?
5. Which failure requires stopping the experiment rather than adjusting a weighted score?

## Research anchors

- Edge et al., [*From Local to Global: A Graph RAG Approach to Query-Focused Summarization*](https://www.microsoft.com/en-us/research/publication/from-local-to-global-a-graph-rag-approach-to-query-focused-summarization/), 2024 preprint.
- Wu et al., [*LongMemEval*](https://proceedings.iclr.cc/paper_files/paper/2025/hash/d813d324dbf0598bbdc9c8e79740ed01-Abstract-Conference.html), ICLR 2025.
- Maharana et al., [*Evaluating Very Long-Term Conversational Memory of LLM Agents*](https://aclanthology.org/2024.acl-long.747/), ACL 2024.
- Sarthi et al., [*RAPTOR*](https://proceedings.iclr.cc/paper_files/paper/2024/hash/8a2acd174940dbca361a6398a4f9df91-Abstract-Conference.html), ICLR 2024.
- Gutiérrez et al., [*HippoRAG*](https://proceedings.neurips.cc/paper_files/paper/2024/hash/6ddc001d07ca4f319af96a3024f6dbd1-Abstract-Conference.html), NeurIPS 2024.
