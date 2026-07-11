---
description: "Target ranges for enterprise data architecture transformations. 13 dimensions covering latency, cost, compliance, ownership, and adoption."
---

# Metrics and Outcomes

Target ranges an architecture review should expect when the boundaries in this guide are enforced. These are directional planning numbers, not measured results. Use them to set expectations and to decide what to baseline before a transformation starts, not to report outcomes you have not measured.

| Metric | Typical before (EDP as everything) | Target after (governed coexistence) | What to measure |
|---|---|---|---|
| Customer-facing API p99 latency | Seconds (warehouse query) | Tens of milliseconds (serving store) | p99 per endpoint, daily |
| Platform team time on unplanned work | More than half | Under a quarter | Planned vs unplanned time split, monthly |
| Analytical query performance during business hours | Degraded by operational load | Stable, predictable | Query runtimes during and outside operational peaks |
| Monthly platform cost growth | Uncontrolled, compounding | Governed, tracking data growth | Cost growth vs data volume growth |
| Regulatory audit preparation | Weeks | Days | Time from regulator request to evidence package |
| End-to-end data lineage coverage | Partial, manually documented | Near-complete, automated | Share of data products with automated lineage |
| Mean time to identify data owner | Days (ask around) | Minutes (catalog lookup) | Time from question to named owner |
| Cross-domain analytics delivery | Months | Weeks | Request-to-delivery lead time |
| Unplanned downstream breakages from schema changes | Several per quarter | Near zero (with contracts) | Breakages traced to upstream changes, quarterly |
| Data product discoverability | Tribal knowledge | Searchable catalog | Share of products findable via catalog search |
| ML feature reuse across models | None (every model recomputes) | Majority served from a shared feature store | Share of production features served from the store |
| Incident priority conflicts (analytics vs operations) | Weekly | Rare (separate SLAs) | Conflicts logged per month |
| Platform SLA for operational consumers | Analytical grade (99.5%) | Operational grade (99.9%+) | SLA attainment per consumer class |

## How to Measure Your Own Baseline

Four metrics tell you whether you have a boundary problem.

**Start with platform team time allocation.** Track the split between planned and unplanned work for one month. If much more than a third of your platform team's time goes to unplanned requests, firefighting, or ad-hoc operational support, you have a boundary problem. Planned work means roadmap items, platform improvements, and proactive governance. Unplanned work means "the dashboard is broken," "we need this table refreshed faster," and "can you add a column for the operational team."

**Then classify your workloads.** How many workloads on the EDP are analytical (reporting, dashboards, ad-hoc queries, ML training) vs operational (serving APIs, powering customer-facing apps, driving workflow decisions)? If a meaningful share of your workloads is operational, the platform is being used outside its design envelope. Each operational workload brings latency expectations, uptime requirements, and mutation patterns that the analytical platform was not built for.

**Then break down costs.** What percentage of platform cost is driven by analytical workloads vs operational workloads? In organizations with a boundary problem, operational workloads consume a disproportionate share of the platform budget relative to the users they serve. They dominate compute because they run continuously, not in batch windows. They dominate storage because they require fresher data and more frequent refreshes. When you cannot separate these cost lines, you cannot make rational investment decisions.

**Then audit SLA compliance.** Are your analytical SLAs adequate for all consumers? If your platform promises 99.5% uptime and 15-minute data freshness, that works for a weekly executive dashboard. It does not work for a customer-facing balance inquiry or a real-time fraud score. When operational consumers inherit analytical SLAs, they either accept inadequate service or pressure the platform team to upgrade the entire platform to operational grade, at analytical scale and cost.

These four measurements (time allocation, workload classification, cost breakdown, and SLA compliance) will tell you whether your EDP has a boundary problem and how severe it is.
