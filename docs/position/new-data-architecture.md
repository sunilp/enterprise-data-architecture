---
description: "What changed in data architecture by 2026: open formats and catalogs, operational-analytical convergence, agents as consumers, AI data as regulated evidence."
---

# The New Data Architecture

Four shifts hit data architecture between 2024 and 2026, and all four are real enough to design for. What has not changed matters just as much, because the vendors selling the shifts would prefer you forget it.

## Shift 1: Storage Opened, the Catalog Took the Crown

The table format war is over. Iceberg's REST API became the interoperability surface of the lakehouse, Delta interop followed, and data on object storage is now readable by whichever engine you point at it. Storage stopped being the lock-in surface, so the competition moved up a layer: the catalog now carries table discovery, credential vending, access policy, and increasingly the semantic definitions everything else consumes.

The contenders are concrete: Apache Polaris, Unity Catalog, AWS Glue, BigLake metastore, each speaking its own dialect of the Iceberg REST API. The design consequence: choose your catalog as deliberately as you once chose your warehouse, and treat it as part of the [control plane](../blueprints/control-plane.md), not as a feature of an engine. The zero-ETL and streaming-lakehouse developments that ride on open formats are covered in [Open Formats and Catalogs](../patterns/open-formats.md).

## Shift 2: The Infrastructure Gap Closed, the Workload Gap Did Not

The clean old separation (operational databases here, analytical platform there) is being collapsed on purpose. Lakehouse vendors now ship managed Postgres beside the analytical engine and market transactional-plus-analytical processing on one governed foundation. Zero-ETL integrations replicate operational stores into the warehouse without a pipeline. Kafka topics materialize directly as governed tables.

All of it is useful; none of it merges the workloads. Failure domains, SLO regimes, mutation semantics, on-call, and budget lines still divide operational from analytical work, because those properties belong to workloads and to the teams accountable for them, not to infrastructure. Buying convergence is a procurement decision; operating convergence is an organizational one. The reasoning is in [the convergence argument](edp-vs-operational.md#the-convergence-argument), and the companion piece [EDP Is Not an ODS](edp-is-not-an-ods.md) covers the specific confusion that convergence makes easier to commit.

## Shift 3: A New Consumer Class Arrived

For twenty years the data platform served people and their tools: analysts, dashboards, scheduled jobs. It now also serves agents, which consume at machine speed, without a human reviewing each query, with the results feeding actions rather than slides. MCP became the standard connection layer and moved to vendor-neutral governance under the Linux Foundation in December 2025; warehouse vendors expose governed tools through managed MCP servers.

The parts worth an architect's attention are the ones MCP does not solve: authorization, identity, and audit for autonomous consumers. The emerging answers (semantic layers as the agent interface, data products exposed as narrow tools, guarded text-to-SQL, scoped identity per agent) are covered in [Agents as Consumers](../blueprints/agent-access.md). The placement rule does not move: agents consume the platform; they do not run on it. Scoped read tools over governed data products, yes. Agent memory, session state, and runtimes inside the warehouse, no.

## Shift 4: AI Data Became Regulated Evidence

Training, fine-tuning, and evaluation datasets used to be internal artifacts. Under the EU AI Act, whose [high-risk obligations apply from 2 August 2026](../compliance/eu-ai-act.md), they are evidence: provenance, representativeness, bias examination, and lifetime event logs, producible on request. Most of that evidence is generated (or silently not generated) by the data platform's lineage, quality, versioning, and audit design.

This lands hardest on the industries this guide already serves, since credit scoring and risk-based insurance pricing are named high-risk categories. The obligation-by-obligation mapping is in [EU AI Act](../compliance/eu-ai-act.md), and the supply-side view of LLM data (RAG corpora as data products, embedding lineage, datasets as governed artifacts) is in the [AI/ML blueprint](../blueprints/ai-ml-platform.md).

## What Did Not Change

Every failure mode in this guide predates all four shifts and survives them:

- The [three systems](what-edp-is.md) are still three systems. Record, insight, action. Collapsing them still produces a platform that serves none well.
- [Workload routing](../decisions/decision-tree.md) still comes down to latency, mutation, and failure domain, whatever the infrastructure looks like.
- [Contracts](../patterns/data-contracts.md) still beat trust, and now there is a standard shape for them (ODCS).
- Ownership, [operating discipline](../operations/operating-model.md), and [cost governance](../patterns/cost-architecture.md) still decide whether any of the new capabilities produce value or invoices.

The stack changed. The failure modes did not. New technology gets adopted by the same organizations, with the same incentives, making the same category errors at higher speed. The boundary discipline this guide argues for is not nostalgia for the old stack; it is the part of the old answers that was never about the stack.

## What to Do With This

Four actions, one per shift:

1. **Make the catalog decision explicit.** If you cannot name who chose your catalog and why, it was chosen for you. Run it through the [evaluation criteria](../patterns/open-formats.md).
2. **Classify converged-platform workloads the old way.** For anything running on or moving to a converged platform, write down its failure domain and SLO regime. If the answer is "operational," it needs operational discipline regardless of where it is hosted.
3. **Inventory agent access.** List every agent or copilot touching platform data, what identity it uses, and what it can reach. Shared credentials and open SQL are the findings to expect.
4. **Version the datasets feeding high-risk AI.** If a regulator asked tomorrow which data trained the model making credit decisions, the answer should be a query. The [checklist](../compliance/eu-ai-act.md) is seven items.

Each action should leave an artifact: a catalog decision record, a workload classification list, an agent-access register, and a lineage query that answers the regulator.
