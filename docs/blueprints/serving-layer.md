---
description: "The serving layer blueprint. Four serving shapes, feeding patterns, SLO regime, and the operational destination taxonomy: where routed workloads actually go."
---

# The Serving Layer

Every fix in this guide ends the same way: "put a serving layer in front of it." This page is what that actually means. The serving layer is the most referenced and least specified component in most enterprise data architectures, and the gap matters, because a boundary is only as strong as the sanctioned alternative behind it. Teams reach past the boundary when the right path is harder than the wrong one.

The serving layer is [Layer 3a](target-state.md) in the reference architecture: purpose-built infrastructure that delivers data to operational consumers at operational latency, under an operational SLA, in an operational failure domain. The EDP computes and historizes; the serving layer delivers. It is not one technology. It is a small family of shapes, and choosing among them is the design work.

## The Four Serving Shapes

**API facade over a serving store.** A service exposing typed endpoints (`get_customer_profile`, `lookup_claim_status`) backed by a low-latency store that the EDP populates. The workhorse shape: it gives you a contract surface, versioning, authentication, rate limiting, and the freedom to change the store behind it. Use when multiple consumers need governed, current-ish reads and you want one accountable interface. This is [Pattern 4](coexistence-patterns.md) with its own hardware.

**Cache or read model.** Denormalized, query-shaped projections in a fast store (Redis, DynamoDB, Cloud SQL read replicas, materialized views), refreshed by pipeline or by events. Use when one consumer's access pattern is known and stable, and the API facade would be ceremony. The read model belongs to the consumer that needs it; that team owns its freshness expectations.

**Online feature store.** The ML-specific shape: features computed offline in the EDP, materialized to a key-value store, fetched at inference time in single-digit milliseconds. Covered in the [AI/ML blueprint](ai-ml-platform.md); listed here because it is the same pattern with a narrower contract (feature vectors, point lookups, training/serving consistency).

**Search and vector indexes.** Text search, similarity, and retrieval workloads served from purpose-built indexes (Elasticsearch, pgvector, managed vector search), built from EDP data products. Use when the access pattern is match-and-rank rather than lookup or scan. The index is derived data with a refresh contract, never the source of truth.

Across all four: the serving structure is **derived, disposable, and rebuildable** from governed sources. If losing it means losing data, it has quietly become a system of record, and something has gone wrong upstream.

## Where Routed Workloads Actually Go

The decision tree says "not the EDP" for operational workloads; this is the affirmative answer to "then where?" Five destinations cover nearly everything:

| The workload is... | It belongs on... | Example |
|---|---|---|
| A business process with human tasks, state, and deadlines | A workflow engine (Temporal, Camunda, purpose-built BPM) | Claims approval, onboarding, exception handling |
| Transactional state changes with integrity requirements | A domain service with its own OLTP store | Payments, orders, account management |
| A reaction to events within seconds | A stream processor (Flink, Kafka Streams) with its own state | Fraud scoring triggers, dynamic pricing, alerting |
| Low-latency reads of derived or current data | One of the four serving shapes above | Customer profile API, claim status lookup |
| A rule or model evaluated inside a transaction | A decision service or model endpoint fed by the feature store | Credit decisioning, next-best-action |

The pattern behind the table: **the platform that owns the workload owns its state, its SLO, and its pager.** The EDP feeds all five destinations and directly serves none of their request paths.

## Feeding the Serving Layer

Every feed is a contract point. Three patterns cover the supply side:

**Push from the EDP (batch or micro-batch).** Gold-layer products materialized outward on a schedule: the [reverse ETL pattern](coexistence-patterns.md). Right when freshness tolerance is minutes to hours. The [data contract](../patterns/data-contracts.md) on the feed specifies schema, refresh SLA, and what consumers may assume between refreshes.

**Event-driven projection.** The serving store consumes the same event backbone the EDP does and maintains its own projection. Right when freshness tolerance is seconds and the source events already exist. The serving team owns projection logic; the schema registry owns compatibility.

**Direct from source.** For pure current-state needs (live balance, live inventory), the serving store is fed by the operational system itself, not by the EDP at all. The EDP is not a mandatory waypoint; routing current-state reads through an analytical platform adds staleness and a failure domain for no benefit.

Choose per product, not per platform. A worked example of what "chosen per product" looks like: a customer profile API combines an event-driven projection of current contact details (freshness: seconds, fed from the CRM's event stream) with a nightly push of EDP-computed lifetime value and segment (freshness: stamped daily). One endpoint, two feeds, each response carrying its freshness stamps; owned by the customer-domain team, 99.9% SLO, and on upstream failure it serves last-known-good values flagged stale rather than failing the call.

The minimum contract for any serving structure fits on a card: named owner, schema, authorization model, freshness per field group, latency SLO, rebuild path, staleness behavior, and whose pager fires.

## The SLO Regime

The serving layer exists to make different promises than the platform behind it, so write them down separately:

| Property | EDP | Serving layer |
|---|---|---|
| Availability | 99.5% with maintenance windows | 99.9%+ always-on |
| Latency | Seconds to minutes, variance tolerated | Milliseconds, variance managed |
| Freshness | Batch refresh, documented | Per-product contract: seconds to daily, stamped |
| Failure mode | Delay; retry and reprocess | Serve last-known-good with a staleness flag; never silently wrong |
| Escalation | Data engineering on-call | Product or platform-serving on-call |

Degraded mode is a requirement, not a nice-to-have: during an upstream incident the serving layer returns last-known-good data with a freshness flag. One that fails closed because the warehouse is in a maintenance window has silently re-coupled the failure domains the design existed to separate.

## Anti-Patterns

**The pass-through serving layer.** An API that forwards each request to the warehouse. This is direct warehouse access with an extra network hop and a false sense of decoupling. If the request path touches the analytical engine, the serving layer is decorative.

**The accidental system of record.** Writes accepted into a cache or read model that exist nowhere else. Serving structures are derived; the moment they hold unique state, ownership and recovery become undefined.

**One serving store to rule them all.** A single shared Redis or DynamoDB for every consumer, with no per-product contracts. This recreates the shared-database anti-pattern one layer up. Serving structures are per-product or per-consumer-group, contract-bounded, and independently disposable.

**Skipping the layer because the platform got faster.** Converged platforms make direct analytical serving genuinely viable for some reads. Whether a specific read qualifies is exactly the test in [Convergence Does Not Eliminate Responsibility Boundaries](../position/convergence-and-exceptions.md): the platform's contract has to satisfy the workload's contract, in writing. When it does, that converged engine is your serving layer, and everything else on this page (ownership, SLOs, degraded mode, funding) still applies to it.

## Cost Shape

The serving layer converts variable analytical query cost into fixed serving cost. The crossover arithmetic is simple: daily reads multiplied by per-query scan cost against the fixed monthly cost of a small serving store, and for frequently read products the fixed cost wins early, before counting the analytical contention it removes. Run it for your own volumes with the framework in [cost architecture](../patterns/cost-architecture.md). Fund each serving structure from the consumer it serves; a serving layer nobody will pay for is a workload nobody actually needed at operational grade.
