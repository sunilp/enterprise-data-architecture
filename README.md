# Enterprise Data Architecture

> Architecture position pack for enterprise data platforms -- strategy, blueprints, and decision frameworks for data architects and technology leaders.

<!-- Hero image placeholder: ![Target State Architecture](docs/images/hero-target-state.svg) -->

## Who This Is For

- **Business and technology leaders** who need to understand where enterprise data platforms end and operational platforms begin
- **Data architects and platform engineers** who need blueprints, decision frameworks, and anti-patterns to make and defend architecture decisions

## What's Inside

| Section | What It Covers |
|---------|---------------|
| [What EDP Is](https://sunilp.github.io/enterprise-data-architecture/position/what-edp-is/) | The problems an enterprise data platform solves and the problems it must not solve |
| [EDP vs Operational](https://sunilp.github.io/enterprise-data-architecture/position/edp-vs-operational/) | Side-by-side comparison across 12 dimensions |
| [Anti-Patterns](https://sunilp.github.io/enterprise-data-architecture/position/anti-patterns/) | What breaks when EDP becomes everything |
| [Target State Blueprint](https://sunilp.github.io/enterprise-data-architecture/blueprints/target-state/) | Layered enterprise architecture with cloud-specific variants |
| [AI/ML Platform](https://sunilp.github.io/enterprise-data-architecture/blueprints/ai-ml-platform/) | How EDP feeds the ML/AI world |
| [Glossary](https://sunilp.github.io/enterprise-data-architecture/glossary/) | Precise definitions for 14 commonly confused terms |

## Related Repositories

| Repo | What It Is |
|------|-----------|
| [reference-data-platform-gcp](https://github.com/sunilp/reference-data-platform-gcp) | Production-grade EDP implementation on GCP (Data Vault 2.0, dbt, BigQuery, Terraform) |
| [dbt-data-vault-starter](https://github.com/sunilp/dbt-data-vault-starter) | Opinionated dbt project template for Data Vault 2.0 on BigQuery |

This repo is the **strategy layer**. The repos above are the **implementation layer**.

## Local Development

```bash
pip install -r requirements.txt
mkdocs serve
# Open http://localhost:8000
```

## License

This work is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
