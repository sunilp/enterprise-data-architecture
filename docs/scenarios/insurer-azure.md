---
description: "Scenario blueprint: a mid-size European insurer on Azure. Solvency II, IFRS 17, and EU AI Act pressure; an accidental ODS unwound; a governed claims copilot."
---

# Scenario: A European Insurer on Azure

An illustrative composite, like every scenario in this section: a realistic organization assembled from the patterns this guide describes, so the frameworks can be shown deciding real questions. It is a teaching architecture, not a client report.

## Who This Is

**Regulatory applicability.** EU-domiciled insurer, so [Solvency II](../compliance/insurance.md) applies in full: Pillar 1 capital calculations, Pillar 2 governance and ORSA, Pillar 3 QRT reporting. IFRS 17 reporter, so contract-level granularity and CSM history are non-negotiable. Risk-based pricing with machine learning makes it an [EU AI Act](../compliance/eu-ai-act.md) deployer for a named high-risk category, with Article 10 data-governance obligations in force since August 2026. DORA applies as an EU financial entity.

**The organization.** Mid-size: several million policies across life and non-life, operations in three EU countries, a data team of about forty. Cloud posture is Azure by corporate standard: Azure Databricks with Unity Catalog as the analytical estate, ADLS Gen2 storage, Power BI everywhere, a Fabric evaluation underway, and core insurance systems (policy admin, claims, billing) that are a mix of packaged software and one stubborn mainframe.

**The starting mess.** Two years ago the Databricks estate was branded the "insurance data hub." It now runs actuarial workloads, QRT preparation, and, because the gold layer had the best claims data in the company, the claims department's status dashboards. Case workers refresh Power BI to see whether a claim moved. The refresh is every 15 minutes; the complaints about "wrong data" are actually complaints about stale data. Two teams have asked for write access to gold tables so their apps can "update statuses faster." This is the [accidental ODS](../position/edp-is-not-an-ods.md), caught mid-formation.

## Target Architecture

The seven layers of the [reference architecture](../blueprints/target-state.md), instantiated on the [Azure mapping](../blueprints/target-state.md#microsoft-azure):

| Layer | This insurer's instantiation |
|---|---|
| 1. Sources | Policy admin, claims platform, billing, reinsurance, the mainframe (via CDC), broker feeds |
| 2. Backbone | Event Hubs for claim and policy events; DMS-style CDC from the mainframe; schema registry enforced |
| 3. Operational | Claims workflow moves to a workflow engine; policy and claims services keep their own SQL stores |
| 3a. Serving | New: an operational claims-status store (Azure SQL) with an API, fed by claim events |
| 4. EDP | Databricks medallion layers; policy-level, historized silver (IFRS 17 demands it); Unity Catalog |
| 5. Products | Actuarial data products (policy, claims, exposure), QRT products per template, semantic definitions for the copilot |
| 6. Consumption | Actuarial models, Power BI, QRT submission tooling, the claims copilot |

Three scenario-specific commitments, each traceable to a framework page:

**Policy-level historization in silver is the load-bearing decision.** IFRS 17's CSM calculation requires the full history of assumptions and adjustments since contract inception, and Solvency II's technical provisions require policy-level granularity. The regulations mandate those outcomes, not a physical design; append-only, SCD-tracked silver is the architectural control this insurer chooses to satisfy them, because it makes recalculation, audit, and source reconciliation queries instead of projects. The mapping is worked through on the [insurance compliance page](../compliance/insurance.md).

**QRTs are data products.** Each Quantitative Reporting Template is a gold-layer product with a schema contract matching the template, a freshness SLO aligned to the reporting calendar, and lineage back to source. When the supervisor queries a cell, the answer is a [lineage walk](../blueprints/control-plane.md), not an investigation.

**The claims copilot reads the semantic layer, never the tables.** The insurer's first agent pilot answers case-worker questions ("what is the settlement history for claims like this one?"). It gets a scoped service identity, governed metric and view definitions as its interface, and read-only data products exposed as tools, exactly per [Agents as Consumers](../blueprints/agent-access.md). Its guardrails are explicit: read-only tools, no free-text case notes in its context (claimant-sensitive), every response logged with the tool calls behind it, and an evaluation set maintained in the EDP. Its training and evaluation datasets are versioned there too, because the pricing models next door already carry [Article 10 obligations](../compliance/eu-ai-act.md) and the copilot will be assessed with the same discipline.

## The Five Hardest Decisions

**ADR-1: Claims status leaves the gold layer.** Context: case workers using analytical dashboards as their work interface; freshness complaints rising. Decision: an operational claims-status store fed by claim events from the backbone, serving a typed API; dashboards stay analytical. Framework: [EDP Is Not an ODS](../position/edp-is-not-an-ods.md), [serving layer](../blueprints/serving-layer.md). Expected effect: status reads become current and sub-second; the analytical estate stops carrying an operational SLA it never signed.

**ADR-2: Claims workflow gets an engine.** Context: claim states advanced by scheduled jobs and status flags in silver. Decision: a workflow engine owns claim state; the EDP ingests its events for analytics. Framework: [Anti-Pattern 2](../position/anti-patterns.md), [workload routing](../decisions/decision-tree.md). Expected effect: human tasks, deadlines, and exceptions get a real state machine; silver returns to refinement.

**ADR-3: Fabric coexists, it does not replace.** Context: corporate pressure to consolidate onto Fabric. Decision: run the [convergence test](../position/convergence-and-exceptions.md) per workload; Power BI semantic models move to Fabric, the governed medallion estate stays on Databricks and Unity Catalog, and no workload moves without its contract moving intact. Framework: [vendor evaluation](../decisions/vendor-framework.md), convergence and exceptions. Expected effect: consolidation where contracts allow it, not where the license bundle suggests it.

**ADR-4: Write access to gold is refused, with an alternative.** Context: two teams requesting write access to "update statuses." Decision: refusal plus the sanctioned path: their systems emit events to the backbone, and both the operational store and the EDP consume them. Framework: [coexistence patterns](../blueprints/coexistence-patterns.md), the boundary discipline in [What EDP Is](../position/what-edp-is.md). Expected effect: one authoritative flow instead of two write paths and an unexplainable audit trail.

**ADR-5: Pricing-model datasets become governed artifacts.** Context: AI Act high-risk obligations on risk-based pricing. Decision: training, validation, and evaluation datasets for pricing models are versioned data products with lineage, composition documentation, and recorded bias-examination gates. Framework: [EU AI Act mapping](../compliance/eu-ai-act.md), [AI/ML blueprint](../blueprints/ai-ml-platform.md). Expected effect: the Article 10 evidence is a query, not a quarterly archaeology project.

## What Was Routed Where

| Workload | Destination | Deciding factor |
|---|---|---|
| Claims status lookup (case workers) | Serving store + API (3a) | Current-state authority, sub-second, operational SLA |
| Claims approval workflow | Workflow engine (3) | Human tasks, deadlines, mutation |
| Actuarial modeling and reserving | EDP (4) + actuarial data products (5) | Historical, cross-domain, batch |
| QRT preparation and submission | Gold products (5) + submission tool (6) | Lineage, calendar SLOs, auditability |
| IFRS 17 CSM calculation inputs | Historized silver (4) | Full contract history, append-only |
| Claims copilot | Semantic layer + tools (5/6) | Agent consumer; governed access, scoped identity |
| Fraud flags at claim intake | Streaming score + operational store | Event-time reaction; EDP gets the events afterward |

## What to Measure First

From the [metrics page](../proof/metrics.md), the four baselines worth capturing before any migration: platform team time on unplanned work (the claims dashboards drive it), claims-status freshness complaints logged as data-quality tickets (they will disappear from the wrong queue and reappear in the right one), QRT preparation lead time per cycle, and analytical query performance during claims-department peak hours.

## What This Scenario Deliberately Ignores

Group-level consolidation across entities, the reinsurance data exchange, MDM for party data (see the coexistence patterns for the shape), multi-region DR, the Fabric evaluation's full scope, and migration runbooks with owner-level metric tables (deliberately: this is an architecture blueprint, not an execution plan). A real program has all of these; this scenario holds the boundary story still so the framework applications stay visible.

## Try It on Your Own Estate

Take one workload currently running on your analytical platform and route it through the [decision tree](../decisions/decision-tree.md), then the [convergence exceptions matrix](../position/convergence-and-exceptions.md). If it lands operational, the serving-layer blueprint is the build list.
