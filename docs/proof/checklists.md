# Architecture Review Checklists

Operational checklists for architecture review boards, platform teams, and transformation offices. Print them. Use them in review meetings. They are designed to surface misplaced workloads and unclear boundaries before they become expensive.

---

## Checklist 1: Workload Classification

For each new workload request, answer:

- [ ] Does this workload need sub-second response for a live user or process?
- [ ] Does this workload need ACID transactions or in-place updates?
- [ ] Does this workload need to be available 99.9%+ of the time?
- [ ] Does this workload serve a customer-facing application?
- [ ] Does this workload need to react to events in real time?

**If any answer is YES:** This is not an EDP workload. Route to operational platform or serving layer.

- [ ] Does this workload need historical, cross-domain integrated data?
- [ ] Does this workload produce governed, reusable datasets?
- [ ] Is this workload for analytics, reporting, or regulatory purposes?
- [ ] Does this workload feed ML model training?

**If any answer is YES:** This belongs on the EDP.

- [ ] Does this workload need both current-state AND historical data?

**If YES:** This spans both platforms. Define the boundary: who owns the data, who owns the SLA, how data flows between platforms.

**Classification result:** Analytical / Operational / Serving / Shared (circle one)

---

## Checklist 2: Platform Boundary Review

For existing platforms, review annually:

- [ ] Can you name every operational workload running on the EDP?
- [ ] Are any customer-facing applications querying the EDP directly?
- [ ] Has the EDP experienced SLA breaches caused by non-analytical workloads?
- [ ] Are platform costs growing faster than data volume?
- [ ] Does the platform team spend more than 30% of time on unplanned operational support?
- [ ] Can the platform team distinguish analytical incidents from operational incidents?
- [ ] Are there workloads on the EDP that nobody owns?
- [ ] Is there a published document defining what the EDP is and is not?

**If 3+ answers are concerning:** You have a boundary problem. Start with Stage 1 of the Transformation Roadmap.

---

## Checklist 3: Serving Layer Readiness

Before adding a serving layer between EDP and operational consumers:

- [ ] Is the data product contract defined (schema, SLA, quality, ownership)?
- [ ] Is the refresh frequency for the serving layer agreed with consumers?
- [ ] Is the serving layer SLA independent of the EDP SLA?
- [ ] Is there a fallback if the serving layer is unavailable?
- [ ] Is the serving layer sized for peak concurrent consumers?
- [ ] Is monitoring in place for serving layer latency, availability, and freshness?
- [ ] Is the data flow from EDP to serving layer automated and tested?
- [ ] Is there an owner for the serving layer (distinct from the EDP team)?

**If fewer than 6 are checked:** You are not ready. Address gaps before routing operational consumers to the serving layer.

---

## Checklist 4: Data Contract Readiness

Before publishing a data product with a contract:

- [ ] Is the schema documented with column descriptions and types?
- [ ] Is there a named owner (team, not individual)?
- [ ] Is the freshness SLA defined and monitored?
- [ ] Are quality thresholds defined (completeness, uniqueness, validity)?
- [ ] Is the evolution policy documented (additive-only, deprecation window)?
- [ ] Are consumers registered and notified of changes?
- [ ] Is there a CI/CD gate that validates schema changes against the contract?
- [ ] Is there a data quality dashboard visible to both producers and consumers?

**If fewer than 6 are checked:** The contract is not production-ready. Fix gaps before advertising the data product.

---

## Checklist 5: Compliance Readiness

Before a regulatory audit:

- [ ] Can you trace any reported number to its source system in under 1 hour?
- [ ] Is lineage automated (not manually maintained)?
- [ ] Are access controls column-level for PII/restricted data?
- [ ] Are access reviews automated (quarterly minimum)?
- [ ] Is the data retention policy enforced (not just documented)?
- [ ] Are quality metrics board-reportable (not just in dashboards)?
- [ ] Is there a documented DR plan tested in the last quarter?
- [ ] Can you identify who accessed any dataset in the last 90 days?

**If fewer than 6 are checked:** You have compliance gaps. Prioritize based on regulatory deadline.
