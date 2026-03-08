# What an Enterprise Data Platform Is -- and What It Is Not

## Executive Summary

- An enterprise data platform (EDP) exists to integrate, historize, and govern data across business domains for analytics, AI, and regulatory reporting
- An EDP is not a transaction processing system, a workflow engine, or an operational data store
- Bronze/silver/gold (or raw/curated/consumption) is a data refinement pattern, not a business process layer
- Analytical platforms and operational platforms have fundamentally different design goals -- conflating them creates architectural debt that compounds over years
- If your stakeholders expect the EDP to "run the business," your problem is not technology. It is positioning.

<!-- ![What EDP Is](../images/hero-what-edp-is.svg) -->

## What Problems EDP Solves

**Historical analysis across business domains.** No single source system holds a complete picture. The EDP integrates data from CRM, ERP, core banking, payments, and product systems into a single governed layer. This makes cross-domain questions answerable: "What is the lifetime revenue of customers who opened accounts in Q3 and also hold a mortgage?"

**Cross-domain analytics and integrated reporting.** Regulatory reports, executive dashboards, and business reviews all require data from multiple domains joined on common dimensions. The EDP provides the integrated, conformed layer that makes this possible without point-to-point integrations between source systems.

**Governed, reusable data products.** A well-run EDP produces data products with defined owners, schemas, SLAs, and quality contracts. These products are documented, discoverable, and reusable across teams. Without them, every analytics team builds its own pipelines from source, duplicating effort and creating conflicting numbers.

**AI/ML training data and feature engineering.** ML models require clean, historized, integrated datasets for training. Complex features often join data across domains (customer behavior + product catalog + transaction history). The EDP is the only place where this cross-domain data exists in governed form. See [AI/ML Platform Relationship](../blueprints/ai-ml-platform.md) for the full picture.

**Regulatory lineage and audit trails.** Regulators ask: "Where did this number come from? What transformations were applied? What data was used?" The EDP's append-mostly design and lineage tracking answer these questions. Operational systems that overwrite current state cannot.

**Self-service analytics for business users.** When the consumption layer is well-designed, business users can query governed datasets without waiting for a data team to build a report. The EDP provides the curated, documented, access-controlled layer that makes self-service safe and productive.

## What Problems EDP Must Not Solve

**Real-time transaction processing.** Payments, order management, trade execution -- these require sub-second latency, ACID transactions, and strong consistency. The EDP is optimized for throughput and historical depth, not for processing individual transactions in real time.

*Example failure: Trade execution backed by warehouse serving layer. Stale state caused reconciliation breaks. Switching cost: 4 months.*

**Workflow orchestration and case management.** Business processes with human tasks, approval chains, exception queues, and SLA tracking need a workflow engine. A dbt pipeline cannot send an email, assign a task, or wait for a human decision.

*Example failure: Claims approval modeled as dbt status flags (submitted/reviewed/approved). No human task routing, no SLA tracking, no exception queue. Rework: full workflow engine introduction.*

**Mutable operational state.** The current account balance, live inventory count, or in-flight application status must be updated in place with transactional guarantees. The EDP's append-mostly model tracks history -- it does not serve as the authoritative current-state record.

*Example failure: Live account balance served from gold table with 15-minute refresh. Customer saw stale balance, initiated duplicate payment. Root cause: freshness mismatch, not data quality.*

**Sub-second API serving for customer-facing applications.** Customer portals, mobile apps, and operational dashboards need millisecond response times and high concurrency. Analytical query engines are not designed for thousands of concurrent small lookups.

*Example failure: Mobile app queried BigQuery for customer profile. p99 latency 2.1 seconds. Users abandoned before page loaded. Fix: serving store with <50ms reads.*

**Event-driven command processing.** Reacting to business events in real time (fraud detection during a transaction, dynamic pricing updates, inventory reservation) requires a streaming or event-processing platform, not a batch-oriented analytical layer.

*Example failure: Real-time fraud scoring via BigQuery ML query at transaction time. 3-second latency per score. Transactions queued, customer experience degraded. Fix: online feature store + model serving endpoint.*

## Why Bronze/Silver/Gold Is Not a Business Process Layer

Bronze/silver/gold describes data refinement stages: raw ingestion, cleansed and conformed, business-ready. It is an analytical processing pattern optimized for throughput, not latency.

The model assumes append-mostly, immutable data. Bronze captures raw source extracts. Silver applies cleaning, deduplication, and conformance. Gold produces business-ready aggregates and metrics. At no stage does this pipeline support in-place mutation, transactional updates, or real-time state management.

When teams treat gold-layer tables as operational systems of record, they inherit batch latency (data is minutes to hours stale), eventual consistency (no ACID guarantees), and no rollback mechanism for operational errors. A gold table can tell you what the account balance was at the last refresh. It cannot tell you the balance right now, and it cannot process a withdrawal.

The right framing: bronze/silver/gold prepares data for analytical consumption. It does not serve live business operations. If your workflow depends on the gold layer being "current," you have an architectural mismatch, not a data freshness problem.

## The Three Systems

Enterprise architecture has three distinct system types. Most failures happen when one platform is expected to serve all three:

**Systems of Record** -- Source systems that own operational truth. ERP, core banking, CRM, claims management. They process transactions and manage current state.

**Systems of Insight** -- The enterprise data platform. It integrates, historizes, and governs data from systems of record for analytics, AI, and regulatory reporting. It does not own operational state.

**Systems of Action** -- Operational services, workflow engines, serving layers, and APIs that execute business processes and serve live users. They consume insights but operate under their own SLAs.

The EDP is a system of insight. It is not a system of record and not a system of action. When organizations collapse all three into one platform, every system inherits the constraints of the other two. The result is a platform that is too slow for operations, too unstable for analytics, and too complex for anyone to own.

| System Type | Owns | Optimized For | Examples |
|---|---|---|---|
| System of Record | Current operational truth | Transaction integrity, consistency | ERP, core banking, CRM |
| System of Insight | Historical, integrated truth | Query throughput, governance, lineage | EDP, data warehouse, lakehouse |
| System of Action | Business process execution | Latency, availability, user experience | APIs, workflow engines, serving stores |

## Different Design Goals

| Design Goal | Analytical Platform (EDP) | Operational Platform |
|------------|--------------------------|---------------------|
| Optimization target | Query throughput, storage efficiency | Transaction latency, consistency |
| Data mutation | Append-mostly, immutable history | In-place updates, current state |
| Schema approach | Schema-on-read, evolving | Schema-on-write, strict |
| Consistency model | Eventual, batch windows | Strong, ACID transactions |
| Failure tolerance | Retry batch, reprocess | Must not lose a transaction |
| Scaling pattern | Scale storage and compute independently | Scale for concurrent operations |
| Time orientation | Historical, retrospective | Current, real-time |

## The Positioning Problem

The confusion between analytical and operational platforms is not a technology failure. It is a positioning failure.

"Strategic platform" language attracts every workload. When leadership calls the EDP the "single source of truth" and the "strategic data platform," operational teams hear: "build against this." Platform teams, incentivized to maximize adoption and justify investment, rarely push back. The result is an EDP that becomes load-bearing for workloads it was never designed to support.

Operational teams discover that the EDP has the best data -- integrated, governed, historized. They build against it because the data is there, not because the platform is designed for their access patterns. They inherit the wrong SLAs, the wrong latency, and the wrong mutation model. The platform degrades for everyone.

The fix is positional, not technical. Define what the EDP is. Define what it is not. Enforce the boundary. Provide alternatives for operational needs. The rest of this guide shows how.

## Platform Boundaries Are Funding Boundaries

The confusion between analytical and operational platforms is not just an architecture problem. It is a funding problem.

When the EDP is labeled the "strategic platform," it attracts every workload. It also attracts every cost. The result is a single budget line that covers analytics, operations, ML, compliance, and serving -- with no way to distinguish which workloads drive which costs.

Separating platforms creates clarity:

- **EDP** is funded for shared data integration, governance, and analytics reuse. Its value is measured in data product adoption, regulatory compliance, and time-to-insight.
- **Operational platforms** are funded for customer journeys, transaction processing, and domain reliability. Their value is measured in uptime, latency, and transaction throughput.
- **Serving layers** are funded by the consumers they serve. Their value is measured in consumer satisfaction and operational SLA compliance.

When each platform has its own budget, its own success metrics, and its own team, ownership becomes clear. When everything runs on one platform with one budget, nobody owns anything.
