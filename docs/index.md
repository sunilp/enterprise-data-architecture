# Enterprise Data Architecture

Every enterprise builds a data platform. Most of them also accidentally try to make it run their business operations. This is the guide to not doing that.

This is an architecture position pack -- not a tutorial, not a vendor comparison, not a certification study guide. It draws hard boundaries between enterprise data platforms and operational platforms, provides decision frameworks, and includes reference blueprints with real cloud provider mappings.

## Start Here

### I need to explain platform boundaries to leadership

Your stakeholders think the data platform should run everything. Start with the positioning documents:

- [**What EDP Is**](position/what-edp-is.md) -- The problems an enterprise data platform solves and the problems it must not solve
- [**EDP vs Operational Platform**](position/edp-vs-operational.md) -- Side-by-side comparison across 12 dimensions
- [**Anti-Patterns**](position/anti-patterns.md) -- What breaks when EDP becomes everything

### I need a reference blueprint

You are designing a target-state architecture or evaluating how platforms coexist:

- [**Target-State Architecture**](blueprints/target-state.md) -- Seven-layer reference architecture with GCP and Azure service mappings
- [**AI/ML Platform Relationship**](blueprints/ai-ml-platform.md) -- How the EDP feeds ML/AI, feature stores, and the feedback loop

### I need to make an architecture decision

Decision trees, capability maps, data mesh positioning, and vendor evaluation frameworks are coming in Phase 2.

## Terminology

If the terms in this guide are unclear, start with the [Glossary](glossary.md). It defines 14 commonly confused terms and maps each to the target-state architecture.

## Related Implementation

This repo is the **strategy layer**. For working implementations:

- [reference-data-platform-gcp](https://github.com/sunilp/reference-data-platform-gcp) -- Production-grade EDP on GCP (Data Vault 2.0, dbt, BigQuery, Terraform)
- [dbt-data-vault-starter](https://github.com/sunilp/dbt-data-vault-starter) -- Opinionated dbt template for Data Vault 2.0
