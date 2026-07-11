---
description: "Open table formats and the catalog layer. Iceberg as the interchange standard, catalog selection as the new control point, zero-ETL vs CDC, streaming lakehouse."
---

# Open Formats and the Catalog Layer

The table format war ended; the catalog war replaced it. This page covers what settled, what it changes about platform strategy, and the two ingestion developments (zero-ETL and the streaming lakehouse) that ride on open formats.

## Iceberg as the Interchange Layer

Apache Iceberg's REST catalog API has become the interoperability surface of the lakehouse. Every major engine reads and writes Iceberg tables, the format's V4 work is aimed squarely at streaming latency and AI workloads, and metadata convergence between Iceberg and Delta Lake means the storage-format decision no longer walls off half the vendor market.

The strategic consequence: storage stopped being the lock-in surface. When your data sits in an open format on object storage that any engine can query, switching or mixing engines is a data-pointer exercise, not a migration. Vendors know this, which is why the competition moved up a layer.

For platform strategy this settles an old question in this guide's favor. The [vendor framework](../decisions/vendor-framework.md) asks whether a platform stores data in formats other engines can read, and "yes" is now the market default. If a vendor's answer is still no, that is a deliberate choice about you.

## The Catalog Is the New Control Point

The catalog began as a metadata directory. It now carries table discovery, credential vending, access policy, and increasingly the semantic definitions agents and BI tools consume. Whoever operates your catalog operates the gate every engine passes through, which makes the catalog decision the new vendor decision.

The current landscape: Apache Polaris (an open, Iceberg-REST implementation that graduated to an Apache Top-Level Project in early 2026), Databricks Unity Catalog, AWS Glue, and Google's BigLake metastore, all speaking varying dialects of the Iceberg REST API. Interoperability at the format layer is real; interoperability at the catalog layer is where the fine print lives.

Choose the catalog as deliberately as you once chose the warehouse:

| Criterion | What to ask |
|---|---|
| Engine neutrality | Can every engine you run (and might run) read and write through this catalog with full capability, or is one engine privileged? |
| Policy enforcement point | Are access policies enforced in the catalog for all engines, or re-implemented per engine? |
| Credential vending | Does the catalog broker scoped, short-lived storage credentials, or do engines hold standing storage access? |
| Lineage and audit integration | Do catalog events feed your lineage and audit systems, or is it a silo? |
| Exit cost | If you left this catalog, what moves with you (the tables) and what do you rebuild (grants, semantics, lineage history)? |

A useful discipline: treat the catalog as part of the [control plane](../blueprints/control-plane.md), not part of the engine. That framing makes the trade-offs visible before the procurement, not after.

## Zero-ETL and Managed Mirroring

The coexistence patterns in this guide assume you build the pipe: [CDC into the event backbone](../blueprints/coexistence-patterns.md), then into bronze. Cloud vendors now sell the pipe pre-built. Zero-ETL integrations and mirroring replicate operational databases into the analytical store continuously, with no pipeline to write.

Both patterns move the same data; they differ in what you control and what you are coupled to.

| Dimension | CDC pipeline (build) | Zero-ETL / mirroring (buy) |
|---|---|---|
| Transformation point | You shape data in flight (contracts, quality gates at ingestion) | Data lands raw; shaping happens after landing |
| Reuse | The event stream feeds many consumers, not just analytics | Point-to-point: source to one analytical destination |
| Vendor coupling | Portable pattern, more moving parts | Tied to the provider pair on each end |
| Operations | Your pagers, your backfills | Provider-managed, opaque failure modes |
| Cost visibility | Explicit infrastructure you can meter | Bundled, sometimes invisible until scale |

When to use which: zero-ETL is a good default for getting a single vendor-aligned operational store into the warehouse quickly, especially where no other consumer needs the change stream. Build CDC when multiple consumers need the events, when contracts and quality gates must apply before landing, or when the source and destination do not share a friendly vendor pairing. The mistake to avoid is letting a convenience feature silently become your integration architecture: a dozen zero-ETL links with no contracts is the batch-file anti-pattern with better marketing.

## The Streaming Lakehouse

The second development open formats enabled: Kafka topics materialized directly as Iceberg tables, registered in a catalog, with no batch pipeline in between (Confluent's Tableflow is the visible example, and the Iceberg V4 latency work pushes the same direction). Event data becomes queryable, governed tables at ingestion time.

This collapses a real seam. The old argument for separating the streaming estate from the governed analytical estate was partly mechanical: different storage, different tooling, a pipeline between them. When the stream *is* the table, the mechanical separation fades, and what remains is the part that was always the point: governance and workload discipline. A topic auto-materialized into the lakehouse still needs an owner, a contract, quality gates, and a decision about who may query it. And real-time operational decisions still belong in the streaming layer, not in analytical queries against fresh tables; the [workload boundary](../position/edp-vs-operational.md) is about failure domains and SLOs, not about plumbing.

What changes in practice is the cost of the bronze layer for event data: closer to zero pipeline code, faster freshness, one less copy. Take the win, and keep the governance gate where it was.
