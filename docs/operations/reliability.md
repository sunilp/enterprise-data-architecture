# Platform Reliability Model

## Executive Summary

- Reliability for a data platform is not uptime. It is data freshness, pipeline success, query availability, and recovery speed -- measured against explicit SLOs.
- Every data product must have a defined SLA. The platform must have SLOs that ensure those SLAs are achievable.
- Incident classification must distinguish between platform-wide failures, critical data product issues, and non-critical operational noise.
- Recovery is deterministic when source data is immutable. Bronze-layer preservation makes reprocessing a pattern, not a prayer.
- Post-incident process is not optional. Every P1 and P2 incident gets a blameless post-mortem with root cause classification, action items, and runbook updates.

## Platform SLOs

SLOs define what "reliable" means. Without them, reliability is a feeling, not a measurement.

| SLO | Target | Measurement |
|---|---|---|
| Pipeline success rate | > 99.5% | Successful runs / total scheduled runs per day |
| Data freshness | Within SLA per product | Time since last successful refresh vs product-level SLA |
| Query availability | > 99.5% | Successful queries / total queries per hour |
| Recovery time (P1) | < 2 hours | Time from detection to resolution for platform-wide incidents |
| Recovery time (P2) | < 4 hours | Time from detection to resolution for critical product incidents |

**Key principle:** SLOs are not aspirations. They are commitments with error budgets. When the error budget is consumed, the team stops feature work and focuses on reliability. If leadership does not enforce this, SLOs are decorative.

### SLO Measurement Rules

- Pipeline success rate excludes intentionally disabled pipelines. It includes retries -- a pipeline that fails twice and succeeds on the third attempt counts as one failure and one success.
- Data freshness is measured continuously, not at a point in time. A product that is within SLA for 23 hours and stale for 1 hour has a freshness breach.
- Query availability counts only platform-caused failures. A malformed user query that returns an error is not an availability failure.

## Incident Classification

| Priority | Definition | Example | Response Time | Resolution Time |
|---|---|---|---|---|
| P1 | Platform-wide failure or regulatory data unavailable | All pipelines down, audit data inaccessible, query engine offline | 15 minutes | 2 hours |
| P2 | Critical data product stale or quality breach | Customer 360 more than 4 hours stale, regulatory report data quality below threshold | 30 minutes | 4 hours |
| P3 | Non-critical pipeline failure | One domain's daily refresh failed, single non-critical product stale | 2 hours | Next business day |
| P4 | Minor issue, workaround available | Slow query performance, non-blocking metadata sync delay | 4 hours | Planned sprint |

### Escalation Rules

- P1 incidents trigger immediate page to on-call platform engineer and engineering manager. If no acknowledgment in 15 minutes, escalate to platform lead.
- P2 incidents trigger page to on-call platform engineer. If no acknowledgment in 30 minutes, escalate to engineering manager.
- P3 and P4 incidents are handled during business hours via the standard ticket queue.
- Any incident that is not resolved within its resolution window is automatically escalated one priority level.

## Recovery Patterns

Recovery is not improvised. Each failure mode maps to a known recovery pattern.

### Reprocessing

Replay from bronze. Source data in the landing zone is immutable, so recovery is deterministic -- the same input produces the same output. This is why bronze-layer immutability is a non-negotiable architectural principle.

| Consideration | Detail |
|---|---|
| When to use | Transformation logic was incorrect, silver/gold data is corrupted, pipeline produced wrong output |
| Prerequisite | Bronze data is intact and immutable |
| Impact | Downstream products are temporarily stale during reprocessing |
| Validation | Compare reprocessed output against known-good state or business rules |

### Backfill

Re-ingest from source for a specific time window. Used when bronze data itself is missing or corrupted, or when a new source field must be historically populated.

| Consideration | Detail |
|---|---|
| When to use | Bronze data is missing, source schema changed and history must be re-extracted |
| Prerequisite | Source system supports historical extraction for the required time window |
| Impact | Source system load increases during backfill; coordinate with source team |
| Validation | Row count reconciliation and checksum comparison against source |

### Rollback

Revert to a previous version of a data product -- both schema and data. This is table-level time travel, not pipeline rollback.

| Consideration | Detail |
|---|---|
| When to use | A bad deployment corrupted a data product, consumers need immediate restoration |
| Prerequisite | Table format supports time travel (Delta Lake, Iceberg) with sufficient retention |
| Impact | Consumers see previous version immediately; reprocessing can happen in parallel |
| Validation | Confirm rolled-back version matches expected state, notify consumers |

### Failover

Switch to a disaster recovery region or replica. Used for infrastructure-level failures, not data quality issues.

| Consideration | Detail |
|---|---|
| When to use | Primary region is unavailable, infrastructure failure, cloud provider incident |
| Prerequisite | DR region is provisioned, data replication is current, DNS/routing can be switched |
| Impact | RPO determines data loss; RTO determines downtime |
| Validation | Confirm DR environment serves current data, test consumer connectivity |

## Dependency Management

A data platform does not exist in isolation. It depends on upstream source systems and serves downstream consumers. Both directions must be mapped and managed.

### Upstream Dependencies

| Dependency | What to Track | Failure Behavior |
|---|---|---|
| Source systems (ERP, CRM, core banking) | Availability, schema version, data freshness | Retry with exponential backoff, alert after N failures |
| Event backbone (Kafka, Pub/Sub) | Consumer lag, partition health, throughput | Buffer locally if possible, alert on lag threshold breach |
| Third-party data vendors | Delivery schedule, file format, data quality | Hold processing, alert data steward, serve stale data with flag |
| Identity and access management | Authentication availability | Cache tokens, fail open for reads with audit, fail closed for writes |

### Downstream Dependencies

| Dependency | What to Track | Failure Behavior |
|---|---|---|
| Data products and consumers | Consumer count, query patterns, SLA commitments | Notify consumers of staleness, serve stale data with metadata flag |
| ML model training pipelines | Feature freshness, training schedule | Delay training, do not serve stale features without explicit acknowledgment |
| Regulatory reporting | Report deadlines, data quality thresholds | Escalate immediately to P1 if regulatory deadline is at risk |
| Operational serving stores | Replication lag, consistency | Alert on lag, switch to direct source if replication fails |

### Circuit Breaker Pattern

Stop processing when upstream quality drops below an acceptable threshold. This prevents bad data from propagating through the platform.

- **Trigger:** Upstream data fails quality checks (null rate spike, volume anomaly, schema drift) beyond a configured threshold.
- **Action:** Halt downstream processing for that source, serve last-known-good data, alert data steward and source team.
- **Reset:** Manual or automatic after upstream quality is restored and validated. Never auto-reset without quality validation.
- **Key principle:** It is better to serve stale data with a freshness warning than to serve wrong data silently. The circuit breaker enforces this.

## Post-Incident Process

Every P1 and P2 incident triggers a structured post-incident process. This is not optional, and it is not blame-assignment. It is organizational learning.

### Blameless Post-Mortem

Conducted within 48 hours of incident resolution. Attendance includes the responders, the platform lead, and affected consumers.

| Section | Content |
|---|---|
| Timeline | Minute-by-minute account: detection, response, diagnosis, resolution, verification |
| Root cause | The actual technical cause, not "human error." If a human made a mistake, ask what system allowed that mistake to have impact |
| Contributing factors | What made detection slow, response difficult, or resolution complex |
| Impact | Data products affected, consumers impacted, duration of impact, regulatory implications |

### Root Cause Classification

Every incident root cause is classified into one of four categories. This enables trend analysis across incidents.

| Category | Example |
|---|---|
| Source | Upstream schema change without notice, source system outage, data quality degradation at source |
| Platform | Infrastructure failure, capacity exhaustion, configuration drift, deployment error |
| Transformation | Logic bug in pipeline, incorrect join, failed schema evolution handling |
| Consumer | Consumer query overloading the platform, consumer not respecting rate limits |

### Action Items

Every post-mortem produces action items. Every action item has an owner, a deadline, and a verification method.

- **Runbook update:** If this failure mode was not in the runbook, add it. If the runbook was wrong, fix it.
- **Monitoring gap:** If detection was slow, add the missing alert or dashboard.
- **Architectural fix:** If the failure was structural, schedule the fix with a deadline -- do not leave it as tech debt without a timeline.
- **Process change:** If the failure was procedural, update the process and communicate the change.

**Key principle:** A post-mortem without action items is a storytelling session. Action items without deadlines are wishes. Deadlines without owners are fiction.
