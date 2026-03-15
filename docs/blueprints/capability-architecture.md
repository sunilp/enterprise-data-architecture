# EDP Capability Architecture

An enterprise data platform is not just a storage and transformation stack. It is a governed capability system with explicit operational, control, and service responsibilities.

## Executive Summary

- An EDP must deliver 7 distinct capability groups spanning acquisition, management, processing, storage, access, governance, and observability
- Capabilities are durable design concerns. Components (tools, products, services) are replaceable implementations of those capabilities.
- Most platform failures are not technology failures. They are capability gaps -- missing lineage, absent quality controls, no reprocessing path, no cost visibility.
- This model works as a gap assessment, vendor evaluation framework, team structure blueprint, and maturity scorecard.
- If you cannot name the component that delivers a capability, you have a gap. If you have a component but no one owns it, you have a risk.

## The Capability Model

Seven capability groups. Each group contains sub-capabilities with a single responsibility. Every sub-capability must have an owner, an implementation, and a measurable outcome.

### 1. Data Acquisition

| Sub-Capability | Description |
|---|---|
| Batch ingestion | Scheduled extraction from source systems (files, databases, APIs) |
| Change data capture (CDC) | Real-time or near-real-time capture of source system changes |
| Event ingestion | Streaming event consumption from message backbones |
| File onboarding | Structured and semi-structured file processing (CSV, JSON, Parquet, XML) |
| Third-party data onboarding | External data vendor integration with quality validation |

### 2. Data Management

| Sub-Capability | Description |
|---|---|
| Schema evolution | Handling schema changes without breaking downstream consumers |
| Metadata capture | Automated collection of technical, operational, and business metadata |
| Lineage tracking | End-to-end traceability from source to consumption |
| Quality controls | Automated validation at each refinement stage (completeness, accuracy, timeliness) |
| Retention management | Policy-driven data lifecycle (hot/warm/cold/archive/delete) |
| Historization | Time-variant data preservation (SCD Type 2, append-only, bitemporal) |
| Reconciliation | Cross-source and cross-layer data consistency verification |

### 3. Core Platform Processing

| Sub-Capability | Description |
|---|---|
| Transformation | Data cleaning, conforming, aggregation, and business logic execution |
| Orchestration | Workflow scheduling, dependency management, and retry logic |
| Pipeline execution | Reliable, scalable compute for batch and micro-batch workloads |
| Workload isolation | Preventing one workload from degrading another |
| Reprocessing and recovery | Ability to replay and rebuild any layer from source |
| Rules execution | Business rule application for derived calculations and classifications |

### 4. Storage and Modeling

| Sub-Capability | Description |
|---|---|
| Raw/landing zone | Immutable capture of source data in native format |
| Curated/integrated zone | Cleansed, conformed, deduplicated datasets |
| Semantic/business layer | Business-ready models, metrics, and governed views |
| Time-variant history | Full change history for audit, regulatory, and analytical use |
| Analytical serving structures | Pre-aggregated, denormalized datasets optimized for query patterns |

### 5. Access and Consumption

| Sub-Capability | Description |
|---|---|
| BI/reporting access | Governed access for dashboards and reporting tools |
| Self-service query | Ad-hoc SQL access for analysts and data scientists |
| Governed APIs and data sharing | Controlled data exposure to external consumers |
| ML feature access | Integration with feature stores for model training and inference |
| Downstream publish/export | Reverse ETL and operational sync to downstream systems |

### 6. Governance and Control

| Sub-Capability | Description |
|---|---|
| Access control | Role-based and attribute-based access at column and row level |
| Data masking and tokenization | PII protection for non-production and limited-access use |
| Auditability | Comprehensive logging of data access, transformations, and changes |
| Data contracts | Formal schema, quality, and SLA agreements between producers and consumers |
| Stewardship hooks | Integration points for human review, approval, and escalation |
| Policy enforcement | Automated application of governance rules across all layers |

### 7. Observability and Platform Operations

| Sub-Capability | Description |
|---|---|
| Freshness monitoring | Tracking data age against SLA thresholds |
| Pipeline monitoring | Job success, failure, duration, and resource utilization |
| Cost observability | Real-time and historical cost tracking by workload, domain, and data product |
| SLA/SLO monitoring | Automated tracking of platform service level commitments |
| Incident management | Detection, classification, routing, and resolution of platform issues |
| Platform telemetry | Usage metrics, adoption tracking, and capacity signals |

## Capabilities vs Components

A capability is what the platform must do. A component is one way to do it. Confusing the two is how platforms end up locked to a vendor with no understanding of what they actually need.

| Concept | Capability | Component (one realization) |
|---|---|---|
| Lineage | End-to-end data traceability | Dataplex, Unity Catalog, OpenLineage |
| Historization | Time-variant data preservation | SCD Type 2 tables, Data Vault satellites |
| Policy enforcement | Automated governance rules | Column-level security policies, tag-based masking |
| Orchestration | Workflow scheduling and dependency | Airflow, Cloud Composer, Dagster |
| Quality controls | Automated data validation | Great Expectations, dbt tests, Soda |
| Transformation | Data cleaning and business logic | dbt, Spark, Dataform |
| Freshness monitoring | Data age tracking | Custom dashboards, Monte Carlo, Bigeye |

**Capabilities are durable. Components change. Design for the capability, select the component.**

## How to Use This Model

**Gap assessment.** Walk through all 7 groups and 35+ sub-capabilities. For each one, name the component that delivers it. If you cannot, you have a gap. Gaps do not fix themselves.

**Vendor evaluation.** When evaluating a platform vendor or tool, map their feature set to these capabilities. Most vendors cover 3-4 groups well and leave the rest to you. Know what you are buying and what you still need to build or integrate.

**Team structure.** Each capability group suggests a team ownership boundary. Data acquisition is not the same team as governance. Observability is not the same team as transformation. Align teams to capability groups, not to tools.

**Maturity assessment.** For each sub-capability, score your current state: (0) absent, (1) manual/ad-hoc, (2) partially automated, (3) fully automated with monitoring. The distribution tells you where to invest. A platform that scores 3 on transformation but 0 on lineage is not mature -- it is blind.
