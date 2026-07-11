---
description: "EDP control plane architecture. Metadata services, lineage engine, policy engine, contract registry, audit trail, and observability layer."
---

# EDP Control Plane

The control plane is the governance and observability infrastructure of the data platform: metadata, lineage, policy, contracts, audit, and observability. Six service groups with different owners and operational characteristics, none of which move data. Without a control plane you have a data lake; with one you have a governed platform. Every regulatory conversation, cost allocation question, and incident investigation starts and ends here.

```mermaid
graph TB
    subgraph "CONTROL PLANE"
        direction TB
        META[Metadata Services<br/>Technical · Operational · Business]
        LIN[Lineage Engine<br/>Column-level · Impact Analysis · Regulatory]
        POL[Policy Engine<br/>Access · Retention · Quality · Masking]
        CON[Contract Registry<br/>Schemas · SLAs · Versions · Consumers]
        AUD[Audit Trail<br/>Query · Access · Change · Evidence]
        OBS[Observability<br/>Freshness · Quality · Cost · Health]
    end

    subgraph "DATA PLANE"
        direction LR
        SRC[Sources] --> ING[Ingestion]
        ING --> RAW[Bronze / Raw]
        RAW --> CUR[Silver / Curated]
        CUR --> SEM[Gold / Semantic]
        SEM --> PRD[Data Products]
        PRD --> CON2[Consumers]
    end

    META -.-> |governs| ING
    LIN -.-> |traces| RAW
    POL -.-> |enforces| CUR
    CON -.-> |contracts| PRD
    AUD -.-> |audits| CON2
    OBS -.-> |monitors| SEM
```

## What the Control Plane Contains

Six service groups. Each has a single responsibility, a distinct set of consumers, and a measurable outcome.

### Metadata Services

The platform's memory. Without metadata services, every question about the data platform requires someone to look at code.

| Category | What It Captures |
|---|---|
| Technical metadata | Schemas, column types, partitioning strategies, storage formats, table statistics |
| Operational metadata | Pipeline run history, job durations, data volumes processed, last successful refresh timestamps |
| Business metadata | Human-readable descriptions, ownership assignments, domain classification, sensitivity and confidentiality tags |

Treat metadata as machine-readable state that drives automation, not as documentation. A wiki page describing a table is prose; a registry entry the platform can act on is metadata.

### Lineage Engine

The platform's nervous system. Lineage answers three questions that every regulated enterprise must answer: where did this data come from, what happened to it, and who consumed it.

| Capability | Description |
|---|---|
| Column-level lineage | Automated tracing from source column to every downstream transformation, aggregation, and consumption point |
| Impact analysis | Given a source change, identify every downstream dataset, report, model, and consumer affected |
| Regulatory lineage | Trace any reported metric, regulatory filing, or executive dashboard number back to its source records |

Lineage that stops at the table level cannot answer regulatory questions. Column-level lineage is the minimum for traceability: the engine must be able to answer "which source rows contributed to this number."

### Policy Engine

Executable rules that the platform enforces automatically. A policy that exists only in a document will be violated; policies must be code, evaluated at query time or ingestion time, with violations logged and alerted on.

| Policy Type | What It Governs |
|---|---|
| Access policies | Who can access what data, at what granularity (row, column, cell), under what conditions |
| Retention policies | How long data is retained at each storage tier, when it moves to cold storage, when it is permanently deleted |
| Quality policies | What quality thresholds apply to each data product: completeness, accuracy, timeliness, uniqueness |
| Masking policies | Which columns are dynamically masked for which roles: PII, financial, health data |

### Contract Registry

Data contracts formalize the interface between producers and consumers. Without them, every schema change is a surprise.

| Capability | Description |
|---|---|
| Contract store | Central registry of all active data contracts: schema definition, SLA commitments, quality guarantees, ownership |
| Version history | Complete audit trail of every contract change: what changed, who changed it, when, and why |
| Consumer registration | Registry of every consumer of every data product: who depends on what, through which interface |
| Breaking change detection | Automated identification of schema or SLA changes that would violate existing consumer contracts, with notification before deployment |

A data product without a contract is an unmanaged dependency, and consumer registration is what makes impact assessment possible: you cannot assess impact if you do not know who consumes what.

### Audit Trail

Every action on the platform is recorded. In regulated industries this is a compliance requirement, not a preference.

| Audit Type | What It Records |
|---|---|
| Query audit | Who ran what query, when, against which dataset, how many rows returned |
| Access audit | Who was granted or revoked access, by whom, through what approval process |
| Change audit | What pipeline, schema, policy, or configuration changes were made, by whom, with what justification |
| Evidence export | Regulatory-ready audit reports, pre-formatted for SOX, GDPR, APRA, BCBS 239, and internal audit consumption |

Audit logs must be immutable and retained independently of the data they describe. If an administrator can delete audit records, you do not have an audit trail.

### Observability Layer

Observability answers three questions: is the platform healthy, is it meeting its commitments, and what is it costing.

| Dashboard | What It Shows |
|---|---|
| Data freshness | Is each data product within its SLA? Time since last successful refresh vs committed SLA |
| Quality health | Are quality thresholds met? Trend of quality scores over time, breach alerts |
| Cost allocation | What is each workload, domain, and data product costing? Compute, storage, egress, broken down by owner |
| Platform health | Infrastructure utilization, job queue depth, error rates, query concurrency, storage growth |

Every dashboard must show its numbers against targets. A freshness chart with no SLA line is decoration; the same chart with the committed SLA marked is accountability.

## Control Plane vs Data Plane

The data plane moves, transforms, and stores data. The control plane ensures that movement is governed. They are distinct infrastructure with distinct ownership.

| Concern | Data Plane | Control Plane |
|---|---|---|
| Purpose | Move, transform, store data | Govern, observe, audit data |
| What changes | Data values and schemas | Policies, contracts, access rules |
| Latency requirement | Throughput-optimized | Near-real-time for alerts, batch for reports |
| Failure impact | Data is stale or missing | Governance is blind, compliance is at risk |
| Owned by | Platform engineering | Governance and platform engineering jointly |
| Change frequency | Every pipeline run | Policy reviews, contract negotiations, access requests |
| Testing approach | Data quality assertions | Policy simulation, contract compatibility checks |

Control plane failures are silent. A failed pipeline is visible immediately, but a broken lineage tracker or a misconfigured access policy may not surface for weeks, until an auditor asks a question you cannot answer.

## Why the Control Plane Matters

### Compliance

Regulators do not ask "what database do you use." They ask: can you trace this reported number to its source? Can you prove who accessed customer data last quarter? Can you demonstrate that deleted data is actually deleted? Every one of these questions is answered by the control plane, not the data plane.

### Operations

Incident response without lineage is guesswork. Cost optimization without allocation is politics. Capacity planning without utilization data is budgeting in the dark. The control plane converts a reactive platform team into a proactive one.

### Trust

Analysts, data scientists, and business users trust data they can verify. When a consumer can see lineage, check freshness, read the contract, and verify quality scores, adoption accelerates. When they cannot, they build their own extracts and shadow pipelines. The control plane is what makes a platform a platform, rather than a collection of pipelines.
