# Phase 6 — Agent runtime patterns (tools, memory, safety rails)

## Objective
Define and implement standard patterns for agents operating under the kernel: tool access, memory, and safety rails.

## Key build activities
- Define tool invocation interface mediated by kernel.
- Define memory stores and PHI-safe caching rules.
- Add safety rails: refusal policies, escalation, bounded autonomy.
- Add evaluation harness hooks for agent behaviors.

## Risks
- Agents bypass kernel controls.
- Memory leaks PHI or causes stale actions.
- Tool misuse leads to unsafe state changes.

## Oversight checks applied
- Security review: tool permissions and isolation.
- Privacy review: memory retention and redaction.
- Clinical review: escalation thresholds.

## Judge decisions (J1/J2/J3)
- **J1:** Agent interface and tool mediation complete.
- **J2:** Safety rails enforce human oversight.
- **J3:** Actions + justifications are fully auditable.

## Exit criteria
- Agent SDK/patterns documented.
- Tool mediation enforced by kernel.
- Memory policy implemented.
