# Production agent starter blueprint

This blueprint is a vendor-neutral review artifact for a first production-shaped agent slice. It deliberately contains contracts and gates rather than framework-specific application code.

## Required slice

- one named user population and measurable task;
- one authenticated `RunRequest` with tenant and idempotency key;
- durable states: accepted, running, waiting, succeeded, failed, cancelled, expired;
- one governed evidence source and one read-only typed tool;
- one structured artifact with provenance;
- external authorization, budgets, telemetry, evaluation, rollback, and service owner.

## Minimal run contract

```json
{
  "run_id": "01J...",
  "task_type": "northstar.policy_brief.v1",
  "principal": {"subject": "workload-or-user-id", "tenant": "northstar"},
  "idempotency_key": "case-123:policy-brief:v1",
  "input_refs": ["case://123", "policy://benefits/2026-07"],
  "limits": {"wall_seconds": 90, "tool_calls": 4, "cost_usd": 0.20},
  "approval_policy": "human_before_case_write"
}
```

## Release gate

| Gate | Evidence | Owner |
|---|---|---|
| Outcome | baseline and representative task evaluation | product |
| Safety/security | threat model, misuse tests, least privilege | security |
| Data | classification, lineage, ACL, retention | data owner |
| Reliability | SLO, capacity, fallback, recovery exercise | service owner |
| Economics | cost per successful outcome and budget alerts | FinOps |
| Governance | system card, risk acceptance, change record | accountable owner |

Copy this table into the delivery dossier and link every cell to durable evidence. A blank owner or evidence link blocks production promotion.

