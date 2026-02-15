# Insurance: Solvency II

## Executive Summary

- Solvency II is the EU regulatory framework for insurance and reinsurance companies, structured around three pillars that each impose distinct data platform requirements
- It imposes data quality, reporting, and risk management requirements that directly shape data platform architecture -- not just policy, but structural design decisions
- Pillar 1 (quantitative requirements) drives actuarial data needs, Pillar 2 (governance) drives data governance, Pillar 3 (reporting) drives data product requirements
- The EDP provides the integrated, historized, governed foundation that Solvency II reporting demands -- without it, insurers are rebuilding these capabilities from scratch for every regulatory submission
- IFRS 17 (the insurance contracts accounting standard) adds additional data granularity and historization requirements that compound on top of Solvency II

## Solvency II Pillars Mapped to Platform Design

Solvency II is not one regulation. It is three pillars, each with different data requirements. Teams that treat it as a single compliance checkbox end up building a platform that satisfies one pillar well and the others poorly. Map each pillar to specific platform design decisions.

### Pillar 1: Quantitative Requirements

Pillar 1 defines capital and reserve calculations. These are not simple aggregations -- they require granular, integrated data across risk types that most insurers do not have in one place.

**Technical provisions require granular policy-level data.** Calculating best estimate liabilities means working with individual policy data: coverage terms, premium schedules, claims history, lapse assumptions. Aggregate summaries are not sufficient. The platform must ingest and store policy-level detail, not just the totals that source systems expose through APIs.

**SCR (Solvency Capital Requirement) needs integrated risk data across all risk types.** The standard formula SCR covers market risk, credit risk, underwriting risk (life, non-life, health), and operational risk. Each risk type typically lives in a different source system. The SCR calculation requires joining them. Without an integrated data layer, actuarial teams spend most of their time on data preparation, not on modelling.

**Platform design: fine-grained data ingestion, cross-domain risk integration, actuarial data products.** Ingest at the policy level, not the portfolio level. Integrate across risk domains in the silver layer. Produce actuarial-ready data products in gold that join policy, claims, investment, and exposure data into a single governed view.

**EDP pattern: policy-level historized data in silver, aggregated risk metrics in gold.** Silver holds the conformed, historized policy and claims data with SCD Type 2 tracking. Gold holds the actuarial data products -- pre-joined, quality-checked, and ready for the SCR calculation engine. The distinction matters: actuaries need both the granular detail (for model calibration) and the aggregated view (for capital reporting).

### Pillar 2: Governance and Risk Management

Pillar 2 is where regulators ask how you govern data, not just what the numbers say. Most insurers have a data governance policy document. Few have a data governance platform.

**ORSA (Own Risk and Solvency Assessment) requires documented data governance.** The ORSA report must describe how data quality is managed, who owns which data, and how data flows through the organization. These are not questions you can answer from a PowerPoint deck. You need a living system that tracks ownership, quality, and lineage.

**Data quality must be assessed and reported to the board.** Solvency II requires that the administrative, management, or supervisory body (AMSB) oversees data quality. This means board-level data quality reporting, not just pipeline alerts that go to engineers. Quality metrics must be aggregated, trended, and presented in business terms.

**Platform design: data quality framework with board-reportable metrics, ownership model, lineage.** Build quality checks at bronze-silver and silver-gold boundaries. Aggregate quality scores by domain and data product. Maintain a data ownership registry that maps every data product to a business owner. Track lineage end-to-end so the ORSA report can describe exactly how data moves from source to regulatory output.

**EDP pattern: quality dashboards, ownership registry, automated lineage tracking.** Quality dashboards that show pass/fail rates, trend lines, and domain-level scores. An ownership registry that ties every dataset to a named owner (not a team alias). Lineage that is captured automatically during transformation, not documented manually after the fact.

### Pillar 3: Supervisory Reporting

Pillar 3 is where the data platform delivers (or fails to deliver) the regulatory output. QRTs are the most visible deliverable, and they are where data problems surface publicly.

**QRTs (Quantitative Reporting Templates) require standardized regulatory submissions.** QRTs are highly structured templates with specific field definitions, validation rules, and cross-referencing requirements. There are over 60 QRT templates covering balance sheets, premiums, claims, investments, and reinsurance. Each is a data product with a defined schema.

**Reporting must be timely, accurate, and auditable.** Annual and quarterly deadlines are firm. Late or inaccurate submissions attract regulatory scrutiny. More importantly, every number in a QRT must be traceable back to its source data -- auditors will follow the trail.

**Platform design: governed data products for each QRT, automated generation, lineage to source.** Each QRT should be a defined data product in the gold layer with a schema that matches the regulatory template. Generation should be automated, not manual. Lineage from every cell in the QRT back to its source records should be queryable.

**EDP pattern: gold-layer regulatory data products with defined schemas, freshness SLOs, quality gates.** Each QRT data product has a schema contract, a freshness SLO aligned to the regulatory reporting calendar, and quality gates that prevent publication of data that fails validation. The data product is owned by the regulatory reporting function, consumed by the submission tool, and traceable to silver-layer source data.

## IFRS 17 Data Requirements

IFRS 17 replaced IFRS 4 as the accounting standard for insurance contracts. Its data requirements are substantially more demanding, and they compound on top of Solvency II -- you cannot satisfy one and ignore the other.

**Contract-level granularity.** IFRS 17 treats every insurance contract as a distinct data entity. This is a fundamental shift from the portfolio-level accounting that IFRS 4 allowed. The platform must store and process individual contract data, including measurement at initial recognition and subsequent measurement at each reporting period.

**Historical measurement: CSM (Contractual Service Margin) requires full history.** The CSM tracks unearned profit on a contract and is adjusted over the coverage period. Calculating the CSM at any reporting date requires the full history of assumptions, actual experience, and adjustments since inception. This is not optional -- without history, you cannot calculate CSM correctly.

**Cohort grouping: contracts grouped by year of issue, profitability, and risk.** IFRS 17 requires contracts to be grouped into portfolios of similar risk, then divided into annual cohorts, then further divided by profitability (onerous, no significant risk of becoming onerous, remaining). These groupings drive measurement and presentation. The platform must support flexible grouping logic on top of contract-level data.

**Platform design: append-only historization is critical, SCD Type 2 for contract state changes.** Every contract state change -- premium adjustment, assumption update, claims event, CSM recalculation -- must be captured as a new record with effective dates. Overwriting contract records makes IFRS 17 calculations impossible. Append-only is not a preference, it is a requirement.

**EDP pattern: Data Vault or equivalent historization at silver layer, IFRS 17 calculation engine consuming from gold.** Silver stores the full history of contracts, claims, assumptions, and experience adjustments using a historization pattern (Data Vault, SCD Type 2, or event sourcing). Gold produces the inputs for the IFRS 17 calculation engine: grouped contracts with current and historical measurement data, CSM roll-forward inputs, and experience adjustments. The calculation engine itself sits outside the EDP but depends entirely on the quality and completeness of EDP data.

## Architecture Patterns for Insurance

These patterns appear in every insurance data platform that takes Solvency II and IFRS 17 seriously. Skip any of them and you will feel the pain at the next regulatory reporting cycle.

**Actuarial data lake: raw granular data for actuarial models.** Actuaries need access to granular, historical data for model calibration, experience studies, and assumption setting. This is the bronze and silver layer -- raw policy data, claims triangles, exposure data, and investment returns. The key requirement is that the data is complete, historized, and accessible without going through aggregation layers that lose detail.

**Regulatory reporting pipeline: source to QRT with full lineage.** A dedicated pipeline from source systems through bronze, silver, and gold to QRT output. Every transformation is versioned and traceable. The pipeline runs on a schedule aligned to regulatory deadlines, with buffer time for quality review and correction. This is not the same as the general analytics pipeline -- it has stricter quality gates and audit requirements.

**Risk aggregation: cross-product, cross-geography risk views.** Solvency II SCR requires risk aggregation across all products and geographies. The platform must support joining policy data from life, non-life, and health businesses, across all operating entities, into a single risk view. This is an integration problem that the EDP is designed to solve, but only if ingestion is designed for it from the start.

**Claims analytics: historical claims data for pricing and reserving.** Claims triangles, development patterns, and severity distributions are foundational for actuarial work. The platform must store claims at the individual claim level with full event history (reported, reserved, paid, closed, reopened). Aggregated claims summaries are useful for dashboards but insufficient for actuarial analysis.

## Architecture Checklist for Insurance

Use this checklist to evaluate whether your data platform is ready for Solvency II and IFRS 17 compliance. Each item maps to a specific regulatory requirement.

- [ ] Policy-level data historized with full SCD tracking
- [ ] Cross-risk-type data integration (market, credit, underwriting, operational)
- [ ] QRT data products with automated generation and lineage
- [ ] Data quality framework with board-reportable metrics
- [ ] IFRS 17 contract grouping and CSM calculation data available
- [ ] Actuarial model data accessible from governed EDP datasets
- [ ] Audit trail from regulatory submission back to source data
- [ ] Timeliness SLOs for regulatory reporting deadlines
