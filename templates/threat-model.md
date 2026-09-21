# Threat model — [system, version]

Scope: [what is inside the boundary]   Owner: [role]   Reviewed: [YYYY-MM-DD]

## 1. System map

List every component and trust boundary. For an agent, include the model, prompts, retrieval, memory, tools, other agents, human approvers, and every place untrusted text can enter.

| Component | Trust level | Holds data of class | Can it act? (which tools, which authority) |
|---|---|---|---|
| | | | |

## 2. Untrusted inputs

[Every path by which content the system did not author reaches the model: user text, documents, web pages, tool output, another agent's message, memory.]

## 3. Threats

| # | Threat | Entry point | Impact | Existing control | Residual risk | Owner |
|---|---|---|---|---|---|---|
| T1 | Direct prompt injection | | | | | |
| T2 | Indirect injection via retrieved or tool content | | | | | |
| T3 | Excessive agency (a tool can do more than the task needs) | | | | | |
| T4 | Cross-tenant or cross-region data exposure | | | | | |
| T5 | Memory or index poisoning | | | | | |
| T6 | Supply chain (model, skill, dependency, corpus) | | | | | |
| T7 | Approval manipulation or replay | | | | | |
| T8 | Lost or duplicated side effects | | | | | |

## 4. Control layers

Say where each control is enforced. A control enforced *inside the prompt* is a request, not a control.

| Layer | Control | Enforced by | Test that proves it |
|---|---|---|---|
| Identity and authorisation | | | |
| Data and retrieval | | | |
| Tool gateway / policy | | | |
| Sandbox / network | | | |
| Human approval | | | |
| Detection and response | | | |

## 5. Adversarial test plan

| Attack | Success criterion for the attacker | Result | Date |
|---|---|---|---|
| | | | |

## 6. Residual risk and acceptance

[Risks that remain, who accepted each, until when.]
