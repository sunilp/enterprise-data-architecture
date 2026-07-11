# Enterprise Data Architecture

> Architecture position pack for enterprise data platforms: strategy, blueprints, and decision frameworks for data architects and technology leaders. 37 pages arguing one position, governed coexistence: explicit contracts between systems of record, insight, and action.

Live at [sunilprakash.com/enterprise-data-architecture](https://sunilprakash.com/enterprise-data-architecture/). Built with Astro; content lives in `docs/` as plain markdown.

## Who This Is For

- **Business and technology leaders** who need to understand where enterprise data platforms end and operational platforms begin
- **Data architects and platform engineers** who need blueprints, decision frameworks, and anti-patterns to make and defend architecture decisions

## What's Inside

| Section | What It Covers |
|---------|---------------|
| [Position](https://sunilprakash.com/enterprise-data-architecture/position/what-edp-is/) | What the EDP is and is not, anti-patterns, the ODS confusion, the 2026 landscape, convergence and its exceptions |
| [Blueprints](https://sunilprakash.com/enterprise-data-architecture/blueprints/target-state/) | Seven-layer target state (GCP/Azure/AWS), capabilities, control plane, AI/LLM supply chains, agent access, serving layer |
| [Decisions](https://sunilprakash.com/enterprise-data-architecture/decisions/decision-tree/) | Workload routing, capability maps, data mesh, maturity, vendor evaluation |
| [Patterns](https://sunilprakash.com/enterprise-data-architecture/patterns/data-contracts/) | Data contracts (ODCS), cost architecture, open table formats and catalogs |
| [Compliance](https://sunilprakash.com/enterprise-data-architecture/compliance/overview/) | BCBS 239, DORA, HIPAA, Solvency II, IFRS 17, EU AI Act |
| [Operations](https://sunilprakash.com/enterprise-data-architecture/operations/operating-model/) | Operating model, reliability, SLOs, incident discipline |
| [Evidence](https://sunilprakash.com/enterprise-data-architecture/proof/case-studies/) | Composite case studies, evidence tables, worked ADRs, target metrics, review checklists |
| [Glossary](https://sunilprakash.com/enterprise-data-architecture/glossary/) | Precise definitions for 20 commonly confused terms |

Live at **[sunilprakash.com/enterprise-data-architecture](https://sunilprakash.com/enterprise-data-architecture/)**.

Cite as: Prakash, Sunil. *Enterprise Data Architecture: A Position Pack for Governed Coexistence.* 2026.

## Related Repositories

| Repo | What It Is |
|------|-----------|
| [reference-data-platform-gcp](https://github.com/sunilp/reference-data-platform-gcp) | Production-grade EDP implementation on GCP (Data Vault 2.0, dbt, BigQuery, Terraform) |
| [dbt-data-vault-starter](https://github.com/sunilp/dbt-data-vault-starter) | Opinionated dbt project template for Data Vault 2.0 on BigQuery |

This repo is the **strategy layer**. The repos above are the **implementation layer**.

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:4321/enterprise-data-architecture/
```

## License

This work is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
