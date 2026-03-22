---
description: "Banking compliance for data platforms. BCBS 239 principles 3-6 and DORA articles mapped to EDP architecture decisions with compliance checklist."
---

# Banking: BCBS 239 and DORA

## Executive Summary

- BCBS 239 governs risk data aggregation and reporting for systemically important banks -- it dictates how risk data must flow from source systems to board-level reports
- DORA (Digital Operational Resilience Act) governs ICT risk management for financial entities in the EU -- it dictates how data platforms must handle failure, testing, and vendor risk
- Both regulations create architectural requirements that directly shape how data platforms are designed, not just how they are operated
- The EDP's core design properties -- lineage, historization, quality gates, governed access -- satisfy the hardest BCBS 239 principles out of the box
- DORA adds operational resilience requirements that affect both the EDP and operational platforms, with specific implications for cloud-hosted infrastructure

## BCBS 239: Risk Data Aggregation

BCBS 239 (Principles for effective risk data aggregation and risk reporting) was published by the Basel Committee in 2013. Banks have had over a decade to comply. Most still struggle. The problem is not awareness. The problem is that compliance requires architectural decisions that many banks never made -- and retrofitting them is expensive.

The four principles below are the ones that most directly constrain data platform design. Other principles (governance, reporting accuracy, distribution) matter, but they follow naturally from getting these four right.

### Principle 3: Accuracy and Integrity

**What the regulator wants.** Risk data must be accurate, reliable, and free from material error. Data must be reconciled against source systems. Automated processes should be favored over manual adjustments.

**Platform design implications.** Data quality is not a dashboard problem. It is a pipeline problem. Quality must be enforced at the point of transformation, not discovered after the fact in a report.

- Quality gates at the silver layer reject or quarantine records that fail validation rules before they reach consumption
- Automated reconciliation between bronze (raw ingestion) and source system totals catches drift early
- Quality metrics (completeness, validity, consistency) are computed per pipeline run and stored as first-class metadata
- Dashboards surface trends in quality metrics over time -- they do not replace enforcement

**Architecture pattern: quality-as-code.** Quality rules live in transformation pipelines as code, versioned and tested like any other logic. Manual quality checks do not scale, do not provide audit trails, and do not satisfy regulators who want to see systematic controls. Every quality rule should be traceable to a regulatory requirement or business rule, and that traceability should be automated.

### Principle 4: Completeness

**What the regulator wants.** Risk data aggregation must capture all material risks across the organization. No business unit, legal entity, or risk type should be excluded due to data gaps.

**Platform design implications.** Completeness is an ingestion problem first and a measurement problem second. If a source system is not connected to the EDP, its risk data does not exist for aggregation purposes.

- Cross-domain integration in the EDP must cover all material source systems -- core banking, trading, treasury, lending, and any system that generates or holds risk-relevant data
- Governed ingestion pipelines ensure that new source systems are onboarded through a defined process, not through ad-hoc extracts
- Completeness metrics at the gold layer track coverage: what percentage of expected entities, time periods, and risk categories are present in each data product

**Architecture pattern: domain-complete ingestion.** Map every material risk data source. Track ingestion status per source per cycle. Flag gaps before they reach regulatory reports. Completeness is measurable -- treat it as a metric, not an aspiration.

### Principle 5: Timeliness

**What the regulator wants.** Risk data must be available within defined timeframes for both normal reporting and stress scenarios. During a crisis, banks must be able to produce risk reports on an accelerated schedule.

**Platform design implications.** Pipeline SLAs are not optional. Every regulatory data product needs a defined freshness target, and the platform must enforce it.

- SLA-driven pipeline orchestration ensures that critical risk pipelines complete before reporting deadlines
- Freshness monitoring tracks the age of data in each layer and alerts when thresholds are breached
- Stress-scenario playbooks define accelerated refresh schedules -- if the normal cycle is T+1, the stress cycle might be T+4 hours, and the platform must support both

**Architecture pattern: pipeline SLOs with escalation.** Define SLOs per data product (e.g., "credit risk positions refreshed by 06:00 CET daily"). Monitor against SLOs continuously. Escalate breaches automatically. For stress scenarios, maintain pre-tested accelerated pipeline configurations that can be triggered without re-engineering.

### Principle 6: Adaptability

**What the regulator wants.** Risk data systems must be flexible enough to adapt to changes in regulation, business structure, and stress scenarios. Banks should be able to produce ad-hoc reports without prolonged IT development.

**Platform design implications.** Rigid schemas and hardcoded report definitions are the enemy of adaptability. The platform must support change without requiring re-architecture.

- Schema evolution support means that adding new fields, new entities, or new risk categories does not break existing pipelines or consumers
- Parameterized reports and data products allow business users to adjust scope, granularity, and time windows without code changes
- Ad-hoc query capability over governed datasets lets risk teams answer new questions without waiting for a new pipeline to be built

**Architecture pattern: schema-on-read for flexibility, versioned data products for stability.** The bronze and silver layers tolerate schema evolution gracefully. The gold layer provides versioned, stable interfaces for consumers. When regulation changes, new versions of data products can be published alongside existing ones, with a managed deprecation path. This gives risk teams the flexibility regulators demand without destabilizing production reporting.

## DORA: Digital Operational Resilience

DORA (Regulation (EU) 2022/2554) applies to financial entities operating in the EU -- banks, insurers, investment firms, and their critical ICT service providers. It took effect in January 2025. Unlike BCBS 239, which is principles-based, DORA is prescriptive. It specifies what must be done, how it must be documented, and how it will be supervised.

For data platform teams, DORA means your platform is an ICT asset subject to formal risk management, incident reporting, resilience testing, and third-party oversight. This is not theoretical. Supervisory audits will ask for evidence.

### ICT Risk Management (Articles 5-16)

**What the regulation requires.** Financial entities must identify and classify all ICT assets, including data platforms. They must assess risks to availability, integrity, and confidentiality, and implement controls proportionate to those risks.

**Platform design implications.**

- Every component of the data platform -- compute, storage, orchestration, transformation, catalog, access control -- must be inventoried as an ICT asset with a defined owner and risk classification
- Risk assessments must cover availability (what happens if the platform is down for 4 hours?), integrity (what happens if data is corrupted or tampered with?), and confidentiality (what happens if restricted data is exposed?)
- Infrastructure as code provides reproducible, auditable deployments -- no manual configuration that cannot be traced or reconstructed
- Vulnerability scanning covers not just operating systems and containers but also pipeline code, dependencies, and data access configurations
- Access controls follow least-privilege principles with regular access reviews

### Incident Management (Article 17)

**What the regulation requires.** Financial entities must classify and report ICT-related incidents. Major incidents must be reported to supervisory authorities within defined timeframes. This includes data platform failures that affect risk reporting or customer-facing services.

**Platform design implications.**

- Monitoring must classify incidents by severity using predefined criteria -- a failed nightly risk pipeline is a different severity level than a metadata catalog outage
- Automated incident routing ensures that platform failures reach the right response teams without manual triage
- Audit logging captures every relevant event: pipeline failures, data quality breaches, access anomalies, configuration changes
- Post-incident reports must document root cause, impact, and remediation -- the platform must produce the telemetry that makes these reports possible

### Resilience Testing (Articles 24-27)

**What the regulation requires.** Financial entities must regularly test the resilience of their ICT systems. For critical platforms, this includes threat-led penetration testing (TLPT). The testing must cover disaster recovery, backup restoration, and failover scenarios.

**Platform design implications.**

- DR testing must be executed at least quarterly with documented results -- RTO (recovery time objective) and RPO (recovery point objective) must be tested, not just estimated
- Backup restoration should be tested end-to-end: can you restore the platform from backups and verify data integrity?
- Chaos engineering for data pipelines tests what happens when individual components fail: a transformation step crashes, a source system delivers corrupt data, storage becomes temporarily unavailable
- All testing must produce documented evidence -- test plans, execution records, findings, remediation actions

### Third-Party Risk (Articles 28-44)

**What the regulation requires.** Financial entities must manage risks from ICT third-party service providers, including cloud providers and SaaS vendors. Critical providers may be subject to direct regulatory oversight. Contracts must include audit rights, exit strategies, and subcontracting controls.

**Platform design implications.**

- Vendor lock-in is a regulatory risk, not just a commercial preference. Using open data formats (Parquet, Delta, Iceberg) instead of proprietary formats makes exit feasible
- Multi-cloud readiness does not mean running on multiple clouds simultaneously. It means the architecture does not contain hard dependencies that make migration prohibitively expensive
- Exit strategy documentation must exist for every critical platform component: if you had to leave your cloud provider in 12 months, what would it take?
- Concentration risk matters -- if your data platform, orchestration, catalog, and access control all come from the same vendor, that is concentration risk that DORA requires you to assess and mitigate

## Architecture Checklist for Banking

A practical checklist for data platform teams operating in banking. This is not exhaustive -- it covers the architectural decisions that regulators most frequently examine.

- [ ] End-to-end lineage from source systems to regulatory reports, queryable and auditable
- [ ] Quality gates at each medallion layer with automated alerting on threshold breaches
- [ ] Freshness SLOs defined and monitored for all regulatory data products
- [ ] Column-level security enforced for PII, restricted data, and material non-public information
- [ ] Audit logging for all data access, transformation executions, and configuration changes
- [ ] DR plan tested quarterly with documented RTO/RPO results and remediation tracking
- [ ] Vendor risk assessment completed for all platform components, with exit strategies for critical dependencies
- [ ] Schema versioning in place to support regulatory adaptability without breaking existing consumers
