---
description: "Architecture decision record examples. Four worked ADRs: serving store, reverse ETL, online feature store, and workflow engine decisions."
---

# Architecture Decision Record Examples

These worked examples show how the frameworks in this guide apply to real architecture decisions. Each follows the ADR format: context, decision drivers, options, decision, consequences.

---

## ADR-001: Should Customer 360 serving stay on the warehouse or move to a serving store?

### Context

Customer 360 dataset computed in EDP gold layer. Customer-facing app needs to display customer profile with <200ms latency.

### Decision Drivers

- Latency requirement (<200ms for profile display)
- Query concurrency (hundreds of concurrent app users)
- SLA mismatch between warehouse batch workloads and real-time app serving

### Options

| Option | Description |
|---|---|
| **A. Query warehouse directly** | App queries BigQuery/Snowflake gold table on every request. |
| **B. Materialized view + cache** | Create materialized view in warehouse, add application-level cache. |
| **C. Dedicated serving store fed by EDP** | Publish gold layer output to a low-latency serving store (e.g., Bigtable, DynamoDB, Redis). |

### Decision

**Option C -- Dedicated serving store fed by EDP.**

The warehouse is optimized for analytical throughput, not point lookups at app-serving concurrency. Materialized views help with query speed but do not solve the concurrency or SLA isolation problem. A dedicated serving store decouples the app SLA from the warehouse SLA entirely.

### Consequences

- Adds a serving layer to build and maintain.
- Decouples app SLA from warehouse SLA -- warehouse maintenance windows no longer cause app outages.
- Customer profile latency drops from 1.2s to 35ms.
- Warehouse compute is no longer affected by app traffic patterns.

---

## ADR-002: When is reverse ETL acceptable?

### Context

Marketing team needs customer segmentation scores (computed in EDP) pushed to CRM for campaign targeting. The CRM is the marketing team's primary workspace.

### Decision Drivers

- CRM cannot query the EDP directly.
- Marketing team operates in CRM, not BI tools.
- Segmentation scores change daily, not real-time.

### Options

| Option | Description |
|---|---|
| **A. Give marketing access to BI dashboard** | Marketing views scores in a dashboard and manually applies segments in CRM. |
| **B. API from EDP** | Build a REST API that CRM calls to fetch scores on demand. |
| **C. Reverse ETL to CRM** | Push scores from EDP gold layer to CRM on a daily schedule. |

### Decision

**Option C -- Reverse ETL to CRM, with a data contract.**

Marketing should not have to leave their primary tool to act on data. An API adds latency and integration complexity that is not justified for daily-refresh data. Reverse ETL is the right pattern here, provided a data contract governs the interface.

### Consequences

- Segmentation scores refresh daily in CRM without manual intervention.
- Marketing operates in their native tool -- no workflow change required.
- Data contract defines schema, freshness SLA (daily by 6am), and ownership (data platform team owns pipeline, marketing owns segment definitions).
- If the contract breaks, both sides know immediately rather than discovering stale data weeks later.

---

## ADR-003: Should feature retrieval come directly from the lakehouse?

### Context

Fraud detection model needs 15 features at transaction scoring time. Features are computed in EDP gold layer. The model runs in a real-time serving environment.

### Decision Drivers

- Inference latency requirement: <50ms per transaction
- Peak throughput: 10K transactions/second
- Feature consistency between training and serving is critical for model accuracy

### Options

| Option | Description |
|---|---|
| **A. Query BigQuery/Databricks at inference time** | Model calls lakehouse for features on every transaction. |
| **B. Pre-compute and cache in application** | Application loads features into an in-memory cache, refreshes periodically. |
| **C. Online feature store** | Offline store computes features from EDP. Online store (Redis/Bigtable) serves features at inference time. |

### Decision

**Option C -- Online feature store.**

Querying the lakehouse at inference time adds 500ms-2s of latency per request -- 10x to 40x over budget. Application-level caching works at small scale but creates consistency problems between training and serving (training/serving skew). A feature store solves both problems: the offline store guarantees training and batch features come from the same computation, and the online store serves at single-digit millisecond latency.

### Consequences

- Offline feature store computes from EDP daily, ensuring training and serving use identical feature definitions.
- Online store (Redis/Bigtable) serves at <5ms -- well within the 50ms budget.
- Feature consistency between training and serving is guaranteed, eliminating a common source of model degradation.
- Feature compute costs are shared across all models that use the same features, rather than each model recomputing independently.
- Lakehouse compute is no longer affected by inference traffic.

---

## ADR-004: When should a workflow engine be introduced?

### Context

Claims processing currently implemented as a series of dbt models with status flags (submitted/reviewed/approved/rejected) in the silver layer. The pipeline runs on a schedule, advancing claims through stages based on conditional logic in SQL.

### Decision Drivers

- Claims require human review at multiple stages
- Exception routing needed (escalation, reassignment, timeout handling)
- SLA tracking required (regulatory deadline for claim resolution)
- Notifications needed at state transitions

### Options

| Option | Description |
|---|---|
| **A. Continue with dbt status flags** | Keep status columns in silver layer tables, advance via scheduled dbt runs. |
| **B. Add Airflow for orchestration** | Use Airflow DAGs to manage claim state transitions and trigger notifications. |
| **C. Introduce workflow engine (Temporal/Camunda)** | Move claims processing to a purpose-built workflow engine. EDP ingests claim events for analytics. |

### Decision

**Option C -- Introduce workflow engine.**

dbt is a data transformation tool, not a workflow engine. Using status flags in SQL to model a business process with human tasks, exceptions, and SLA tracking is a category error. Airflow is better but still fundamentally a DAG scheduler -- it does not natively support human tasks, long-running workflows, or durable state. A workflow engine like Temporal or Camunda is purpose-built for exactly this problem.

### Consequences

- Claims workflow moves to Temporal with explicit state machines, human task assignments, and SLA timers.
- EDP ingests claim events (via CDC or event stream) for analytics and reporting -- the analytical use case is preserved.
- Silver layer no longer carries operational state -- it returns to being a data refinement layer.
- Pipeline complexity reduced: dbt models are simpler without conditional business logic.
- Human task management properly supported: assignment, escalation, timeout, audit trail.
- Regulatory SLA tracking is built into the workflow engine rather than approximated by query timestamps.
