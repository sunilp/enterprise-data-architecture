---
description: "Evidence tables for enterprise data architecture claims. Six core theses with counter-arguments, failure signals, recommended patterns, and target outcomes."
---

# Evidence Tables

For each major thesis in this guide, these tables show the claim, why teams believe the opposite, what breaks, how to detect the problem, the recommended pattern, and what good looks like. The last row of each table is a target to hold your platform to, not a reported result.

---

## Claim 1: EDP and operational platforms have fundamentally different design goals

| Dimension | Detail |
|---|---|
| **Claim** | EDP and operational platforms have fundamentally different design goals. |
| **Why teams believe the opposite** | "One platform is simpler, cheaper, and avoids data silos." |
| **What breaks** | Operational workloads get analytical SLAs. Analytical workloads compete for capacity with operational queries. Cost model becomes unpredictable. |
| **Signal to detect** | SLA breaches on queries that should be sub-second. Platform team firefighting operational issues. Analytical reports delayed by operational load. |
| **Recommended pattern** | Separate platforms with well-defined integration (events, APIs, feature serving). See Target-State Architecture. |
| **What good looks like** | Operational p99 latency in the tens of milliseconds. Analytical query performance unaffected by operational load. Most platform team time on planned work. |

---

## Claim 2: Bronze/silver/gold is a data refinement pattern, not a business process layer

| Dimension | Detail |
|---|---|
| **Claim** | Bronze/silver/gold is a data refinement pattern, not a business process layer. |
| **Why teams believe the opposite** | Layer names sound like workflow stages (raw/validated/approved). |
| **What breaks** | Business logic embedded in dbt models. Process changes require pipeline changes. No human task model. |
| **Signal to detect** | dbt models contain business rules. Teams request "hold/release" logic in transformation layer. Exception handling is "rerun the pipeline." |
| **Recommended pattern** | Workflow engine for business process, EDP for data refinement. See Anti-Pattern #2. |
| **What good looks like** | Business process changes deploy independently from data pipeline changes. Exceptions route to a workflow queue instead of pipeline reruns. |

---

## Claim 3: "Just query the lakehouse from the model" breaks at production scale

| Dimension | Detail |
|---|---|
| **Claim** | "Just query the lakehouse from the model" breaks at production scale. |
| **Why teams believe the opposite** | Data is already in the lakehouse, seems efficient to query directly. |
| **What breaks** | Query costs explode. Compute contention with analytics users. Latency orders of magnitude too slow for inference. No feature reuse. |
| **Signal to detect** | ML serving latency >1s. Lakehouse compute costs spike during inference. Same features recomputed for every model. |
| **Recommended pattern** | Feature store (offline from EDP, online for serving). See AI/ML Platform Relationship. |
| **What good looks like** | Inference latency in the tens of milliseconds. Feature compute costs shared across models. Lakehouse compute stable. |

---

## Claim 4: Data contracts are not optional

| Dimension | Detail |
|---|---|
| **Claim** | Data contracts are not optional. |
| **Why teams believe the opposite** | "We trust our upstream teams" or "contracts slow us down." |
| **What breaks** | Schema changes break downstream consumers without warning. Quality degrades silently. No one knows who owns what. |
| **Signal to detect** | Downstream pipeline failures caused by upstream schema changes. Multiple teams producing conflicting versions of the same metric. "Who owns this table?" has no answer. |
| **Recommended pattern** | Formal contracts with schema, quality, SLA, ownership, evolution rules. See Data Contracts. |
| **What good looks like** | Near-zero unplanned downstream breakages from schema changes. Data owner identifiable in minutes via the catalog. |

---

## Claim 5: Compliance is an architecture feature, not a bolt-on

| Dimension | Detail |
|---|---|
| **Claim** | Compliance is an architecture feature, not a bolt-on. |
| **Why teams believe the opposite** | "We'll add compliance controls after we build the platform." |
| **What breaks** | Audit preparation takes weeks/months. Lineage gaps make regulatory submissions unreliable. Retrofitting access controls disrupts existing consumers. |
| **Signal to detect** | Regulatory audit preparation >2 weeks. "Where did this number come from?" requires manual investigation. Access reviews reveal over-provisioned accounts. |
| **Recommended pattern** | Lineage, quality gates, column-level security, audit logging designed in from day one. See Compliance Overview. |
| **What good looks like** | Audit preparation measured in days. End-to-end lineage from source to report automated. Access reviews automated quarterly. |

---

## Claim 6: Most enterprises need centralized platform with federated ownership, not pure data mesh

| Dimension | Detail |
|---|---|
| **Claim** | Most enterprises need centralized platform with federated ownership, not pure data mesh. |
| **Why teams believe the opposite** | Data mesh promises domain autonomy and reduced bottlenecks. |
| **What breaks** | Domains produce incompatible products. No cross-domain analytics. No centralized governance. Compliance unverifiable. |
| **Signal to detect** | Cross-domain queries require manual joins across systems. Data quality varies wildly by domain. Central team cannot answer regulatory questions. |
| **Recommended pattern** | Central EDP with self-serve tooling, domain-owned schemas and contracts, centrally defined governance. See Data Mesh. |
| **What good looks like** | Cross-domain analytics delivered in weeks, not months. Data product discoverability from tribal knowledge to searchable catalog. |
