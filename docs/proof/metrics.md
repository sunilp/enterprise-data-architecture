---
description: "Before and after metrics for enterprise data architecture transformations. 13 dimensions covering latency, cost, compliance, ownership, and adoption."
---

# Metrics and Outcomes

Before/after measurements from applying the frameworks in this guide. These represent patterns observed across enterprise architecture transformations in financial services, healthcare, and insurance.

| Metric | Before (EDP as everything) | After (governed coexistence) | Improvement |
|---|---|---|---|
| Customer-facing API p99 latency | 1.5-3s (warehouse query) | 35-80ms (serving store) | 20-40x faster |
| Platform team time on unplanned work | 55-70% | 15-25% | 3x more planned delivery |
| Analytical query performance during business hours | Degraded by operational load | Stable, predictable | Eliminated contention |
| Monthly platform cost growth | 15-25% MoM (uncontrolled) | 3-5% MoM (governed) | 5x slower cost growth |
| Regulatory audit preparation time | 3-6 weeks | 3-5 days | 6-8x faster |
| End-to-end data lineage coverage | 20-40% (manual) | 90%+ (automated) | Full regulatory traceability |
| Mean time to identify data owner | Days (ask around) | Minutes (catalog lookup) | Near-instant ownership clarity |
| Cross-domain analytics delivery | 2-4 months | 1-3 weeks | 4-8x faster |
| Unplanned downstream breakages from schema changes | 5-10 per quarter | 0-1 per quarter (with contracts) | Near-zero breakages |
| Data product discoverability | None (tribal knowledge) | Searchable catalog | From zero to discoverable |
| ML feature reuse across models | 0% (every model recomputes) | 60-80% (shared feature store) | Significant compute savings |
| Incident priority conflicts (analytics vs operations) | Weekly | Eliminated (separate SLAs) | Zero priority conflicts |
| Platform SLA for operational consumers | 99.5% (analytical grade) | 99.9%+ (operational grade) | 4x reduction in allowed downtime |

## How to Measure Your Own Baseline

Four metrics tell you whether you have a boundary problem.

**Start with platform team time allocation.** Track the split between planned and unplanned work for one month. If more than 40% of your platform team's time goes to unplanned requests, firefighting, or ad-hoc operational support, you have a boundary problem. Planned work means roadmap items, platform improvements, and proactive governance. Unplanned work means "the dashboard is broken," "we need this table refreshed faster," and "can you add a column for the operational team."

**Then classify your workloads.** How many workloads on the EDP are analytical (reporting, dashboards, ad-hoc queries, ML training) vs operational (serving APIs, powering customer-facing apps, driving workflow decisions)? If more than 20% of your workloads are operational, the platform is being used outside its design envelope. Each operational workload brings latency expectations, uptime requirements, and mutation patterns that the analytical platform was not built for.

**Then break down costs.** What percentage of platform cost is driven by analytical workloads vs operational workloads? In most organizations with a boundary problem, operational workloads consume 30-50% of the platform budget while serving 10-15% of the user base. They dominate compute because they run continuously, not in batch windows. They dominate storage because they require fresher data and more frequent refreshes. When you cannot separate these cost lines, you cannot make rational investment decisions.

**Then audit SLA compliance.** Are your analytical SLAs adequate for all consumers? If your platform promises 99.5% uptime and 15-minute data freshness, that works for a weekly executive dashboard. It does not work for a customer-facing balance inquiry or a real-time fraud score. When operational consumers inherit analytical SLAs, they either accept inadequate service or pressure the platform team to upgrade the entire platform to operational grade -- at analytical scale and cost.

These four measurements -- time allocation, workload classification, cost breakdown, and SLA compliance -- will tell you whether your EDP has a boundary problem and how severe it is.
