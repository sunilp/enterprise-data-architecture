---
description: "EU AI Act for data platforms. Article 10 data governance and Article 12 record-keeping mapped to EDP lineage, quality, and audit capabilities."
---

# EU AI Act: What Lands on the Data Platform

## Executive Summary

- The EU AI Act entered into force on 1 August 2024 and becomes fully applicable on 2 August 2026, when the high-risk system obligations bite.
- Article 10 imposes data governance requirements on high-risk AI systems: provenance, representativeness, bias examination, and documented data preparation.
- Article 12 requires automatic event logging over the system's lifetime; Article 26 puts obligations on deployers, not just vendors.
- Most of the evidence these articles demand is produced, or not, by the data platform's lineage, quality, catalog, and audit design.

## Why This Page Exists

The AI Act regulates AI systems, not data platforms. But when an enterprise deploys a high-risk system (credit scoring, insurance pricing and risk assessment, employment screening, and the other Annex III categories), the obligations reach backward into wherever the training, validation, and testing data came from. In most enterprises, that is the EDP. A platform that already implements the lineage, quality gates, and audit trails described in this guide can produce the required evidence as a query. A platform without them faces a manual archaeology project per AI system, per audit.

Banks and insurers should read this alongside the [banking](banking.md) and [insurance](insurance.md) pages: creditworthiness scoring and risk-based pricing are named high-risk categories, so the same institutions carrying BCBS 239 and Solvency II obligations now carry these too.

## What Applies When

The Act phased in over four years:

| Date | What applies |
|---|---|
| 2 February 2025 | Prohibited practices banned; AI literacy obligations |
| 2 August 2025 | Obligations for general-purpose AI models; governance structures |
| 2 August 2026 | Full application, including high-risk system requirements (Articles 8-15) and deployer obligations (Article 26) |
| 2 August 2027 | Extended transition for high-risk AI embedded in already-regulated products |

Two roles matter for scoping. **Providers** build or substantially modify AI systems and carry the full conformity burden. **Deployers** use them under their own authority and carry lighter but real obligations: using systems per instructions, ensuring input data is relevant and sufficiently representative for the intended purpose, monitoring operation, and retaining logs. An enterprise that fine-tunes a model for a high-risk purpose can cross from deployer into provider territory. That classification is a legal call; the data evidence either way comes from the platform.

## Article 10 Mapped to Platform Capabilities

Article 10 requires that training, validation, and testing datasets for high-risk systems meet quality criteria and are governed by documented practices. The obligations map directly onto capabilities this guide already prescribes:

| Article 10 obligation | What it demands | EDP capability that produces the evidence |
|---|---|---|
| Documented data governance practices | Design choices, collection processes, and data origin are documented | Catalog with ownership, source registration, dataset documentation |
| Provenance of data | Where the data came from, through what processing | End-to-end lineage from source system to training dataset |
| Data preparation transparency | Annotation, labelling, cleaning, enrichment, and aggregation are traceable | Transformation lineage; versioned pipeline code; dataset versioning |
| Relevance and representativeness | Data matches the intended purpose and deployment context | Dataset composition documentation; profiling metrics tied to purpose |
| Examination for bias | Possible biases identified, and mitigation measures documented | Profiling by protected attributes where lawful; documented review gates |
| Completeness and errors | Datasets are, to the best extent possible, free of errors and complete | Quality gates with recorded pass/fail history per dataset version |

The right-hand column is the [control plane](../blueprints/control-plane.md) doing its job. Nothing in Article 10 requires capabilities this guide does not already treat as baseline; what it changes is the consequence of not having them.

## Article 12: Record-Keeping

High-risk systems must automatically log events over their lifetime, sufficient to identify situations that present risk and to support post-market monitoring. Deployers must retain these logs (at least six months, longer where other law demands it).

For the data platform this lands in familiar places:

- **Log ingestion and retention.** AI system logs are a source system. They flow into governed storage with defined retention, immutability, and access control, the same design the [audit trail](../blueprints/control-plane.md) section prescribes.
- **Traceability joins.** The value of the logs is in the joins: which model version, trained on which dataset version, produced which decision, for which input. That join is only possible if dataset versions and lineage were captured at training time.
- **Queryability under pressure.** Market surveillance authorities can request evidence. "Available within days from a governed store" and "reconstructable in weeks from scattered logs" are different compliance postures with the same nominal data.

## Intersections with DORA and GDPR

The same institutions answer to multiple regimes, and the platform evidence overlaps but does not substitute:

- **DORA** governs the operational resilience of the ICT systems the AI runs on: incident handling, resilience testing, third-party risk. An AI system can be Act-conformant and still fail DORA obligations if the platform under it is fragile. See [Banking](banking.md).
- **GDPR** applies in parallel, not instead. Lawful basis for processing personal data in training sets is a GDPR question; Article 10 conformity does not answer it. Data minimization and right-to-erasure obligations constrain what can sit in training corpora and how deletion propagates, which is an argument for the lineage and soft-delete designs this guide already recommends.

## What the Platform Cannot Carry

The EDP produces evidence; it does not produce compliance. Conformity assessment, risk management systems, human oversight design, technical documentation of the AI system itself, and the provider-versus-deployer classification all live outside the data platform. The honest framing for an architecture review: the platform determines whether the data-governance and logging articles are cheap or expensive to satisfy, and that is all it determines. This page is architecture guidance, not legal advice.

## Checklist for Platform Teams

- [ ] Every dataset feeding a high-risk AI system is a registered, owned data product with documented sources
- [ ] Training, validation, and testing datasets are versioned, with lineage from source to dataset version
- [ ] Quality gate results are retained per dataset version, not just current-state
- [ ] Dataset composition and representativeness documentation exists for each intended purpose
- [ ] Bias examination is a recorded review step in the dataset production pipeline
- [ ] AI system event logs are ingested, retained per policy, and joinable to model and dataset versions
- [ ] Evidence for any of the above is producible by query, not by manual investigation
