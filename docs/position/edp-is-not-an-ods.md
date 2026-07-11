---
description: "The enterprise data platform is not an operational data store. Why the confusion happens, the five differences that bite, and how to spot an accidental ODS."
---

# EDP Is Not an ODS

Of all the ways an enterprise data platform gets misused, one is so common it deserves its own page: treating the EDP as an operational data store. Nobody decides to do this. It happens one convenient query at a time, and by the time anyone names it, customer-facing processes depend on batch tables and the platform team is firefighting SLAs it never signed up for.

## What an ODS Actually Is

The operational data store is an old idea with a precise job. It holds **current state**, shaped for **operational access**: denormalized records, indexed for point lookups, updated in place as the business changes, and served at the latency and concurrency that live processes need. A case worker checking a claim, an API returning a customer profile, a screen showing the balance right now. That is ODS territory.

An ODS makes narrow promises and keeps them: this record is current, this read is fast, this update is consistent. It typically does not integrate across many domains, does not keep deep history, and does not carry analytical governance. It does not need to; those promises belong to other systems.

## Why the EDP Gets Mistaken for One

The EDP makes the opposite promises: integrated across domains, historized over years, governed for analytics and regulation. And that is exactly why operational teams reach for it. From a distance, the gold layer looks like the best ODS in the company: the data is integrated, documented, quality-checked, and there is even a "current view" table.

The word "current" is doing dishonest work in that sentence. A gold table's current view means "as of the last successful refresh." An ODS's current means "as of the last committed transaction." The gap between those two meanings has a familiar incident shape: a customer profile API reads the gold customer table, one night the identity-resolution job fails quietly, and every contact-center screen spends the morning showing yesterday's addresses. Nothing was wrong with the data. Everything was wrong with the contract.

## Five Differences That Bite

**Freshness semantics.** The EDP refreshes on a schedule; the ODS reflects transactions as they commit. A 15-minute-old claim status is perfectly fresh for analytics and dangerously stale for a customer call. Same table, same data, different contract.

**Mutation model.** The ODS updates in place with transactional guarantees. The EDP appends and historizes; that is what makes it auditable. You can build both behaviors into one product, but not under one contract: something has to decide whether a read sees the corrected present or the preserved past, and each consumer needs to know which it is getting.

**Latency and concurrency.** Analytical engines are built for scans and joins across large data, not for thousands of concurrent point lookups. Serving operational reads from the warehouse works in the demo and degrades in production, taking the month-end reports down with it.

**Failure domain.** When the EDP takes a maintenance window, analytics waits and nobody is harmed. If operational reads depend on the same platform, the maintenance window is now a customer-facing outage. Sharing infrastructure means sharing failure, and analytical platforms fail on an analytical schedule.

**Consistency.** An operational process that writes then reads expects to see its own write. A platform fed by batch pipelines cannot promise that, and no amount of refresh-frequency tuning gets you from "eventually" to "now."

## How to Tell You Have Built One by Accident

- Operational staff use dashboards as their work interface, refreshing to see if a status changed
- "Data quality" tickets that are actually freshness complaints: the number was right, just old
- Refresh schedules tightening (daily to hourly to 15 minutes) under pressure from a single consuming team
- An API or app reading gold tables directly, discovered only when its traffic degrades analytical queries
- The platform team on-call for incidents whose impact is described in customer terms, not in reporting terms

Each of these is the same finding: an operational workload consuming an analytical contract.

## What to Do Instead

The reference architecture in this guide gives the ODS its own home: [Layer 3a](../blueprints/target-state.md), a purpose-built store for operational access, fed by source systems or by the EDP through the [serving patterns](../blueprints/coexistence-patterns.md). The EDP computes and historizes; the ODS or serving layer delivers current state at operational latency, under an operational SLA, in an operational failure domain. Caches, search indexes, and read-model projections are the same answer at different grains: purpose-built serving structures fed by systems of record or by the EDP, never the analytical tables themselves. Route the workload with the [decision tree](../decisions/decision-tree.md), and put a [contract](../patterns/data-contracts.md) on the flow between the two.

One modern wrinkle. Converged platforms now offer a managed operational database beside the lakehouse, so the ODS can live under the same vendor roof as the EDP. That changes the hosting, not the argument: it is still a separate store with separate semantics, a separate SLO regime, and a separate failure domain. The [convergence argument](edp-vs-operational.md#the-convergence-argument) covers why the distinction survives the procurement.

The design rule fits in one sentence. If a consumer needs read-your-writes, customer-facing latency, or an operational incident SLA, it does not read the EDP directly.
