---
description: "Scenario blueprint: a US healthcare provider on AWS. HIPAA zones, de-identification placement, tokenized patient linking, research data products on Iceberg."
---

# Scenario: A US Healthcare Provider on AWS

An illustrative composite: a realistic organization assembled from the patterns this guide describes, so the frameworks can be shown deciding real questions. A teaching architecture, not a client report.

## Who This Is

**Regulatory applicability.** US health system, a [HIPAA](../compliance/healthcare.md) covered entity, with business associate agreements covering AWS and every SaaS vendor that touches PHI. State privacy laws add retention and consent wrinkles this scenario acknowledges but does not detail. No EU footprint, so GDPR and the AI Act appear only as a horizon note for the research partnerships team.

**The organization.** A multi-facility health system: hospitals, outpatient clinics, pharmacy, labs. Epic-centric clinical estate, separate claims and revenue-cycle systems, a research arm with growing data appetite. Cloud posture is AWS: S3 with Iceberg tables, Glue Data Catalog and Lake Formation, Redshift and Athena for analytics, MSK for eventing, SageMaker for the data science group.

**The starting mess.** Data mesh was declared two years ago without a platform underneath. Twelve clinical and operational domains produced forty-odd "data products" in incompatible formats: PostgreSQL dumps on shared drives, ad-hoc EMR clusters, two teams exporting spreadsheets to S3. Patient-journey analysis across clinical, billing, and pharmacy takes weeks of manual joins. Worse, HIPAA compliance is unverifiable: access logging differs per domain, two domains have none, and nobody can answer "every system this patient's data flows through" without an investigation. (The target architecture answers that question through pipeline-derived lineage in the catalog plus unified audit streams; complete answers still require the SaaS inventory the BAA register carries, and the design is honest about that seam.) This is [data mesh without a platform](../decisions/data-mesh.md), with PHI in the blast radius.

## Target Architecture

The seven layers on the [AWS mapping](../blueprints/target-state.md#amazon-web-services):

| Layer | This provider's instantiation |
|---|---|
| 1. Sources | EHR, claims, revenue cycle, pharmacy, labs, patient portal |
| 2. Backbone | MSK domain events; DMS change capture from clinical ancillaries; EventBridge routing |
| 3. Operational | Clinical systems stay authoritative; care-coordination workflow gets an engine |
| 3a. Serving | Care-team lookup APIs on DynamoDB/ElastiCache, fed by events, PHI-scoped |
| 4. EDP | S3 + Iceberg medallion estate in two zones (PHI and de-identified), Glue Catalog + Lake Formation grants |
| 5. Products | Clinical, claims, and pharmacy products in the PHI zone; de-identified research products in the open zone |
| 6. Consumption | Population health analytics, quality reporting, SageMaker research workloads |

Scenario-specific commitments:

**Two physical zones, one architecture.** PHI and de-identified estates are separate storage, separate encryption keys, separate audit streams, exactly per the [healthcare compliance page](../compliance/healthcare.md). The de-identification pipeline is the only bridge, and it runs one way. This is the single highest-leverage design decision in the scenario: it shrinks every audit, caps every misconfiguration, and makes the research estate fast-moving because it is provably out of HIPAA's strictest scope.

**Mesh principles return with a platform underneath.** Domain ownership survives: clinical, claims, and pharmacy teams own their product schemas, quality contracts, and documentation. What changes is the substrate: one governed platform, central standards enforced computationally through Lake Formation and the catalog, per the [pragmatic middle ground](../decisions/data-mesh.md). Federated ownership, centralized infrastructure.

**Tokenized linking makes cross-domain analysis useful without spreading identifiers.** A tokenization service in the PHI zone issues random tokens per patient, holding the crosswalk in its own store under the strictest access controls; nothing derivable from identifiers leaves the zone, and whether tokenized records qualify as de-identified is an Expert Determination question, assessed and documented rather than assumed. Research products join on tokens, never identifiers, and patient-journey analysis becomes a governed query instead of a weeks-long manual join with compliance exposure.

## The Five Hardest Decisions

**ADR-1: The zones come before the migration.** Context: temptation to lift the forty products onto the platform first and harden later. Decision: PHI/de-identified zone structure, Lake Formation grants, and audit logging land first; products migrate into a governed target, not another ungoverned pile. Framework: [security posture from the compliance page](../compliance/healthcare.md), [control plane](../blueprints/control-plane.md). Expected effect: the migration is also the remediation.

**ADR-2: De-identification method is chosen per consumption class.** Context: Safe Harbor strips dates and geography that research needs. Decision: Safe Harbor for broadly accessible analytics products; Expert Determination for the research estate, with re-identification risk reassessed on a schedule. Framework: the [de-identification treatment](../compliance/healthcare.md). Expected effect: analytical utility without gambling the certification.

**ADR-3: Care-team lookups get a serving path, not Athena.** Context: care coordinators need current medication and appointment context in seconds; Athena queries were the prototype. Decision: event-fed serving store with a scoped API; the analytical estate never sits in a clinical workflow's request path. Framework: [EDP Is Not an ODS](../position/edp-is-not-an-ods.md), [exceptions matrix](../position/convergence-and-exceptions.md) (fails blast-radius and degraded-mode rows: a stale medication list is a patient-safety issue, not a refresh complaint). Expected effect: clinical staff get operational-grade reads; the platform team stops carrying clinical risk.

**ADR-4: Research access is a data product boundary, not a database grant.** Context: researchers requesting "access to the lake." Decision: research consumption happens through versioned de-identified products with documented composition, IRB linkage in metadata, and usage logging; no raw-zone access outside the platform team. Framework: [data contracts](../patterns/data-contracts.md), [capability map](../decisions/capability-map.md). Expected effect: research velocity goes up because the sanctioned path is the fast path.

**ADR-5: The catalog is chosen as the control point, consciously.** Context: Glue Catalog by default, Iceberg REST options multiplying. Decision: Glue + Lake Formation as the enforcement point now, with table formats kept open (Iceberg) so the catalog decision remains reversible; criteria recorded per the [open formats page](../patterns/open-formats.md). Expected effect: the estate's most consequential lock-in surface has an ADR instead of a default.

## What Was Routed Where

| Workload | Destination | Deciding factor |
|---|---|---|
| Care-team patient lookup | Serving API on DynamoDB (3a) | Clinical blast radius, current state, seconds matter |
| Care-coordination workflow | Workflow engine (3) | Human tasks, deadlines, escalation |
| Population health analytics | De-identified products (5) + Athena/Redshift (6) | Cross-domain, historical, batch |
| Patient-journey research | Tokenized research products (5) + SageMaker (6) | De-identified, IRB-scoped, reproducible |
| Quality and regulatory reporting | PHI-zone gold products (5) | Identified data, strict access, lineage |
| Claims operations | Claims platform (1/3), events to EDP | Operational system stays authoritative |
| Readmission-risk model features | Offline features (4) to endpoint serving | Inference-time reads never touch the lake |

## What to Measure First

Baseline before migration: time for one patient-journey analysis end to end (the weeks-long join), share of domains with complete access logging (the audit answer), audit preparation time for the last HIPAA review, and count of PHI-bearing stores outside the platform (the shadow inventory; expect the number to hurt).

## What This Scenario Deliberately Ignores

Consent management integration, HL7/FHIR interface engineering, medical-device telemetry, state-law retention variance, the research arm's multi-institution data sharing agreements, and the token service's full key-management and rotation design (an implementation specification, not a blueprint decision). All real; all separable from the boundary-and-zones story shown here.

## Try It on Your Own Estate

Open the [healthcare architecture checklist](../compliance/healthcare.md#architecture-checklist-for-healthcare) and score your estate line by line. Every unchecked box in the first five lines is a finding waiting for an auditor to write it first.
