---
description: "Scenario blueprint: a tier-1 European bank on GCP. BCBS 239 and DORA; unwinding a one-platform mandate; fraud features; the risk-report lineage walk."
---

# Scenario: A Tier-1 Bank on GCP

An illustrative composite: a realistic organization assembled from the patterns this guide describes, so the frameworks can be shown deciding real questions. A teaching architecture, not a client report.

## Who This Is

**Regulatory applicability.** EU-headquartered bank designated globally systemically important, so [BCBS 239](../compliance/banking.md) risk data aggregation principles apply through its supervisor's expectations, and [DORA](../compliance/banking.md) applies as an EU financial entity: ICT risk management, incident reporting, resilience testing, and third-party oversight, cloud concentration included. Its models assessing the creditworthiness of natural persons fall in the AI Act's named high-risk category (Annex III; fraud-detection systems carry an exception), making it an [EU AI Act](../compliance/eu-ai-act.md) deployer there.

**The organization.** Tier-1 scale: tens of millions of customers, retail and corporate lines, several thousand engineers. Cloud posture is GCP-primary for data: BigQuery as the analytical estate, Dataplex governance, Pub/Sub eventing, with core banking still split between packaged systems and mainframes feeding via CDC.

**The starting mess.** Three years ago the architecture review board mandated BigQuery as the "single strategic data platform," a decision driven by vendor consolidation and the GCP commitment. Every team complied. Customer-facing APIs read balances from BigQuery. Payment reconciliation runs as BigQuery batch jobs. Fraud scores are computed by BigQuery ML queries at transaction time, cached when they proved too slow. Reserved slots were bought to guarantee operational SLAs, and month-end risk reporting now fights customer traffic for them. Every outage is a two-department incident. This is [Anti-Pattern 4](../position/anti-patterns.md) at institutional scale, defended by a mandate with the word "strategic" in it.

## Target Architecture

The seven layers on the [GCP mapping](../blueprints/target-state.md#google-cloud-platform):

| Layer | This bank's instantiation |
|---|---|
| 1. Sources | Core banking, payments, cards, trading, CRM; mainframe CDC via Datastream |
| 2. Backbone | Pub/Sub domain events; schema registry; Dataflow ingestion |
| 3. Operational | Payment and account services on their own stores (Cloud SQL, Spanner where scale demands) |
| 3a. Serving | Customer-profile API on Cloud Run + Memorystore/Bigtable; online feature store for fraud |
| 4. EDP | BigQuery medallion estate; append-only risk data; Dataplex governance and cataloging |
| 5. Products | Risk aggregation products, regulatory report products, customer analytics products, semantic definitions |
| 6. Consumption | Risk reporting, Vertex AI training, dashboards, governed agent access via managed MCP tooling |

Scenario-specific commitments:

**The mandate is rewritten, not repealed.** "Strategic platform" becomes "strategic for analytical workloads." The [business capability map](../decisions/capability-map.md) goes on the review board's wall, and every workload on the estate gets classified through the [decision tree](../decisions/decision-tree.md). Roughly a third turn out to be operational or serving workloads on the wrong platform; they get destinations and migration order by blast radius, worst first.

**Risk aggregation is designed backwards from the supervisor's question.** BCBS 239's hardest demands are completeness and adaptability: every material risk source ingested through governed pipelines, and ad-hoc supervisory questions answerable without a six-week project. Cross-domain silver integration plus versioned risk products in gold, with [column-level lineage](../blueprints/control-plane.md) from report cell to source extract, is the design answer.

**Fraud gets the feature-store pattern, permanently.** Transaction-time scoring moves to an online feature store fed by the EDP offline store, with the model served from an endpoint, per the [AI/ML blueprint](../blueprints/ai-ml-platform.md). The BigQuery-ML-in-the-request-path era ends. The failure path is designed, not hoped for: if features are stale or the store is unreachable, scoring degrades to a rules-based fallback and the transaction is never blocked on the model. Scores and outcomes flow back through Pub/Sub into bronze as evaluation data.

## The Five Hardest Decisions

**ADR-1: Balance reads leave the warehouse.** Context: customer API p99 measured in seconds during analytical peaks; reserved slots papering over an architectural mismatch. Decision: balances served from the operational estate through a serving API; BigQuery keeps the historized ledger for analytics. Framework: [convergence and exceptions](../position/convergence-and-exceptions.md) (fails the authority, latency, and failure-isolation rows), [serving layer](../blueprints/serving-layer.md). Expected effect: customer reads decouple from analytical load; slot spend drops to analytical need.

**ADR-2: The reserved-slot arms race ends.** Context: buying capacity to make an analytical engine meet operational SLAs. Decision: slots sized for analytical workloads only; operational consumers move to the serving layer; [cost architecture](../patterns/cost-architecture.md) chargeback makes the subsidy visible while it lasts. Expected effect: the platform bill stops encoding the boundary violation.

**ADR-3: Payment reconciliation stays, as a batch product.** Context: temptation to move everything off in one purge. Decision: reconciliation is genuinely analytical (cross-domain, historical, batch); it stays on the EDP as a governed product with a contract. The purge instinct is the same error in reverse. Framework: [decision tree](../decisions/decision-tree.md) run honestly in both directions. Expected effect: credibility; the boundary is a routing rule, not a grudge.

**ADR-4: Credit-scoring datasets become regulated artifacts.** Context: AI Act high-risk obligations meet BCBS 239 model-input expectations. Decision: training and evaluation datasets for credit models are versioned, lineage-tracked products with documented composition and bias-examination gates, shared between the model risk and platform teams. Framework: [EU AI Act mapping](../compliance/eu-ai-act.md). Expected effect: one evidence chain serves two regimes.

**ADR-5: Agent access goes through managed MCP with bank-issued identities.** Context: pilot copilots for relationship managers; vendors offering direct warehouse access for agents. Decision: agents consume governed data products and semantic definitions through managed MCP tooling, one scoped service identity per agent, logged like any other consumer. Framework: [Agents as Consumers](../blueprints/agent-access.md). Expected effect: the audit answer to "which agent read this customer's data, on whose authority" is a query.

## What Was Routed Where

| Workload | Destination | Deciding factor |
|---|---|---|
| Customer balance and profile reads | Serving API + cache (3a) | Sub-second, customer-facing, own failure domain |
| Fraud scoring at transaction time | Online feature store + model endpoint | Millisecond reaction; EDP supplies features offline |
| Payment reconciliation | EDP batch product (4/5) | Cross-domain, historical, batch: genuinely analytical |
| Risk aggregation and reporting | EDP + versioned gold products | BCBS 239 lineage, completeness, adaptability |
| Case management (disputes) | Workflow engine (3) | Human tasks, state, deadlines |
| Relationship-manager copilot | Semantic layer via managed MCP (5/6) | Agent consumer; scoped identity, governed views |
| Real-time transaction monitoring | Stream processor on the backbone (2/3) | Event-time; EDP ingests outcomes afterward |

## What to Measure First

Baseline before migration, from the [metrics page](../proof/metrics.md): customer API p99 during month-end close (the number that justifies the program), reserved-slot spend attributable to operational consumers, incident count where analytics and operations shared a root cause, and time-to-answer for the last three supervisory data requests.

## What This Scenario Deliberately Ignores

Group entities outside the EU, the trading estate's market-risk stack, MDM and party deduplication, data residency for non-EU branches, the mainframe exit program, and cutover mechanics for the balance-read migration (shadow reads, reconciliation, rollback), which belong in an execution plan rather than a blueprint. Each is real; none changes the boundary story being shown.

## Try It on Your Own Estate

Pick the workload your reserved capacity actually protects and run it through the [exceptions matrix](../position/convergence-and-exceptions.md). If it fails the failure-isolation row, you are buying slots to rent a boundary you could build.
