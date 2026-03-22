# Enterprise Data Architecture

**For CIOs, CDOs, enterprise architects, and platform leaders** designing the boundary between analytical and operational systems.

Built to help organizations avoid the most expensive data architecture mistake: turning the enterprise data platform into a general-purpose runtime.

<div class="proof-strip" markdown>
32 pages · 7-layer architecture · 35+ capabilities · 3 industry compliance · 5 coexistence patterns · 3 case studies · 5 review checklists
</div>

Every enterprise builds a data platform. Most of them also accidentally try to make it run their business operations. This is the guide to not doing that.

This is an architecture position pack -- not a tutorial, not a vendor comparison, not a certification study guide. It draws hard boundaries between enterprise data platforms and operational platforms, provides decision frameworks backed by evidence, and includes reference blueprints with real cloud provider mappings.

## Start Here

### I need to explain platform boundaries to leadership

Your stakeholders think the data platform should run everything. Start with the positioning documents:

- [**What EDP Is**](position/what-edp-is.md) -- The problems an enterprise data platform solves and the problems it must not solve
- [**EDP vs Operational Platform**](position/edp-vs-operational.md) -- Side-by-side comparison across 12 dimensions
- [**Anti-Patterns**](position/anti-patterns.md) -- What breaks when EDP becomes everything

### I need a reference blueprint

You are designing a target-state architecture or evaluating how platforms coexist:

- [**Target-State Architecture**](blueprints/target-state.md) -- Seven-layer reference architecture with GCP and Azure service mappings
- [**Capability Architecture**](blueprints/capability-architecture.md) -- 35+ capabilities the EDP must provide, with components mapping
- [**Control Plane**](blueprints/control-plane.md) -- Metadata, lineage, policy, contracts, audit, and observability infrastructure
- [**AI/ML Platform Relationship**](blueprints/ai-ml-platform.md) -- How the EDP feeds ML/AI, feature stores, and the feedback loop
- [**Coexistence Patterns**](blueprints/coexistence-patterns.md) -- How EDP and operational platforms connect through five integration patterns

### I need to make an architecture decision

- [**Decision Tree**](decisions/decision-tree.md) -- "Where does this workload belong?" flowchart with quick reference table
- [**Capability Map**](decisions/capability-map.md) -- 15 business capabilities mapped to platform owners
- [**Data Mesh**](decisions/data-mesh.md) -- When data mesh works, when it doesn't, and the pragmatic middle ground
- [**Maturity Model**](decisions/maturity-model.md) -- Five levels across six dimensions
- [**Vendor Evaluation**](decisions/vendor-framework.md) -- 10-dimension evaluation framework with platform archetypes
- [**Capability Maturity**](decisions/capability-maturity.md) -- 15 capabilities x 4 maturity levels assessment

### I need integration patterns

- [**Data Contracts**](patterns/data-contracts.md) -- Schema, SLAs, ownership, and evolution rules between producers and consumers
- [**Cost Architecture**](patterns/cost-architecture.md) -- FinOps patterns for data platforms

### I need regulatory compliance guidance

- [**Compliance Overview**](compliance/overview.md) -- Cross-industry regulatory matrix mapped to platform design
- [**Banking**](compliance/banking.md) -- BCBS 239 and DORA mapped to architecture decisions
- [**Healthcare**](compliance/healthcare.md) -- HIPAA mapped to data platform design
- [**Insurance**](compliance/insurance.md) -- Solvency II and IFRS 17 data requirements

### I need an operating model

- [**Operating Model**](operations/operating-model.md) -- Roles, processes, measures, and support tiers for running the EDP
- [**Reliability Model**](operations/reliability.md) -- Platform SLOs, incident classification, recovery patterns

### I need a transformation plan

- [**Transformation Roadmap**](transformation/roadmap.md) -- Four stages from current-state confusion to governed coexistence

### I need proof this works

- [**Case Studies**](proof/case-studies.md) -- Three anonymized enterprise architecture transformations
- [**Evidence Tables**](proof/evidence.md) -- Claims, counter-arguments, failure modes, and measurable outcomes
- [**Decision Records**](proof/decision-records.md) -- Worked ADR examples applying these frameworks
- [**Metrics and Outcomes**](proof/metrics.md) -- Before/after measurements across 13 dimensions
- [**Review Checklists**](proof/checklists.md) -- Five operational checklists for architecture review boards

## Terminology

If the terms in this guide are unclear, start with the [Glossary](glossary.md). It defines 14 commonly confused terms and maps each to the target-state architecture.

## Related Implementation

This repo is the **strategy layer**. For working implementations:

- [reference-data-platform-gcp](https://github.com/sunilp/reference-data-platform-gcp) -- Production-grade EDP on GCP (Data Vault 2.0, dbt, BigQuery, Terraform)
- [dbt-data-vault-starter](https://github.com/sunilp/dbt-data-vault-starter) -- Opinionated dbt template for Data Vault 2.0
