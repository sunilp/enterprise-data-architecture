---
description: "Three illustrative enterprise data architecture case studies. Insurance, banking, and healthcare transformation shapes with failure modes and outcomes."
---

# Case Studies

These three case studies are illustrative composites: common transformation shapes assembled from the anti-patterns and frameworks this guide describes, with plausible magnitudes. They are teaching devices, not client reports. If any of them sound familiar, that is the point; these mistakes repeat across industries because the underlying anti-patterns are structural, not situational.

---

### Case Study 1: The Lakehouse That Became a Transaction Engine

**Context:** Global insurance company. 15M+ policies under management. Azure Databricks bronze/silver/gold enterprise data platform. 200+ data engineers across six business units. The platform had been running successfully for two years as the backbone of analytics, regulatory reporting, and actuarial modeling.

**Problem:** The claims processing team discovered that gold-layer tables contained near-complete claim status data. Case workers started querying Databricks SQL dashboards as their operational interface for looking up current claim status during customer calls. Business leadership saw the dashboards and expected sub-second claim lookups. Nobody asked whether this was what the platform was designed for.

**Wrong design attempted:** The platform team built "operational views" in the gold layer with scheduled 15-minute refreshes. When case workers complained about stale data, the team added more Databricks SQL warehouses to handle the concurrent load. This seemed reasonable: the data was already there, the tooling was familiar, and spinning up more compute felt like a scaling problem with a scaling solution.

**Failure mode observed:** 15-minute data staleness caused incorrect claim status decisions. Case workers would tell a customer their claim was pending when it had already been approved, or vice versa. Concurrent case worker queries (hundreds of users hitting the same tables simultaneously) degraded analytical workloads that finance and actuarial teams depended on for month-end close. Monthly platform costs climbed quarter over quarter. The platform team spent most of its time firefighting operational SLA breaches on a platform designed for 99.5% availability, a target never meant to cover real-time operational serving.

**Decision made:** Applied the EDP vs Operational comparison framework and identified Anti-Pattern #1 (Lakehouse as System of Record). The core issue was straightforward: claims status lookup is an operational workload requiring current-state, sub-second access. That is a fundamentally different access pattern than analytical querying. Running both on the same platform meant neither worked well.

**Target-state chosen:** Introduced Azure SQL as the operational claims store, purpose-built for transactional lookups. The EDP continued to ingest claims events for analytics and regulatory reporting; that was always the right use case. Claims status was served from Azure SQL with a 99.9% SLA. The gold layer returned to its intended purpose: historical claims analytics, fraud pattern detection, and actuarial reserving.

**Result:** Platform costs came back down once operational traffic left the analytical engine. Claim status moved from 15-minute batch staleness to sub-second reads against the operational store. The platform team got most of its time back for data product development, and analytical query performance recovered because queries were no longer competing with hundreds of concurrent operational lookups.

---

### Case Study 2: One Platform Because Strategic

**Context:** Tier-1 European bank. Enterprise data hub on GCP BigQuery. 50+ data domains across retail banking, corporate banking, wealth management, and operations. BigQuery had been mandated by the architecture review board as the "single strategic data platform," a decision driven by vendor consolidation goals and the desire to maximize ROI on the GCP commitment.

**Problem:** Every team (analytics, operations, ML, regulatory, customer-facing apps) was told to build on BigQuery. Customer-facing APIs queried BigQuery directly for real-time balance checks. Payment reconciliation ran as BigQuery batch jobs. Fraud scoring happened in BigQuery ML with results queried at transaction time. The platform was doing everything, which meant it was doing nothing particularly well.

**Wrong design attempted:** The architecture review board doubled down on consolidation. They added reserved slots to guarantee SLA for operational queries. They created priority tiers. They wrote runbooks for capacity management. All of this assumed the problem was resource allocation rather than architectural mismatch. It seemed reasonable: BigQuery can scale massively, reserved slots provide guaranteed capacity, and fewer platforms means less operational overhead. On paper, it worked.

**Failure mode observed:** Reserved slots for operations starved analytical workloads during month-end reporting, exactly when both mattered most. A single expensive regulatory query (scanning years of transaction history) degraded customer-facing API response times because they shared the same underlying capacity pool. Fraud scoring latency measured in seconds per query was too slow for real-time transaction decisions, so the fraud team started caching results, which introduced its own staleness problems. Incident prioritization became impossible: every outage affected both operations and analytics simultaneously. The on-call rotation became a burnout machine.

**Decision made:** Applied the Capability Map and Decision Tree. Classified 40+ workloads by access pattern, latency requirement, concurrency profile, and SLA. The result was clear: roughly a third of the workloads were operational or serving workloads running on the wrong platform. They did not need petabyte-scale analytical compute. They needed low-latency, high-concurrency transactional access.

**Target-state chosen:** BigQuery remained the EDP for analytics, reporting, ML training, and data products, the workloads it was built for. Introduced Cloud SQL and Memorystore for operational serving. Deployed a Feature Store for real-time fraud scoring. Built an API layer on Cloud Run between data products and consumers, so no downstream system queried the warehouse directly. Event-driven architecture via Pub/Sub decoupled producers from consumers, eliminating the tight coupling that made every incident a multi-team crisis.

**Result:** Customer API latency dropped from whole seconds to tens of milliseconds. Fraud scoring moved to millisecond-range reads from the online feature store. Month-end reporting no longer impacted customer-facing operations, and warehouse costs came down because operational queries stopped consuming analytical capacity. The architecture review board updated its policy: "strategic platform" was redefined as "strategic for analytical workloads," a small but critical distinction that prevented the same mistake from recurring.

---

### Case Study 3: Data Mesh Without a Platform

**Context:** Large healthcare organization. 12 clinical and operational domains spanning inpatient care, outpatient clinics, pharmacy, radiology, billing, and patient access. Leadership mandated data mesh after the CDO read Zhamak Dehghani's book and attended a conference talk. Each domain was told to own and publish data products. The vision was compelling. The execution skipped several chapters.

**Problem:** No shared data platform existed. Each domain team chose their own tools: some used PostgreSQL dumps to shared drives, others built custom Spark pipelines on ad-hoc EMR clusters, two teams used Excel exports uploaded to S3 buckets. There were no common data quality standards, no shared governance framework, no discoverability mechanism. "Data product" meant whatever each team decided it meant.

**Wrong design attempted:** The organization went straight to "domain ownership" without first building the self-serve data platform that data mesh assumes exists. They hired data engineers into every domain without centralized standards or shared tooling. The reasoning was that domain ownership should come first and infrastructure would follow organically. Dehghani's book describes four principles: domain ownership, data as a product, self-serve platform, and federated governance. They implemented the first one and assumed the other three would emerge.

**Failure mode observed:** 12 domains produced 40+ "data products" in incompatible formats with no quality guarantees. Cross-domain analytics, specifically patient journey analysis across clinical, billing, and pharmacy data, required manual joins across five different systems and took weeks of data engineering effort each time. HIPAA compliance could not be verified because there was no centralized lineage or access control; each domain managed access differently, and two domains had no access logging at all. The annual regulatory audit took far longer than the previous year because data provenance was scattered across a dozen systems with no unified view. The newly hired data engineers spent most of their time on infrastructure plumbing rather than domain logic.

**Decision made:** Applied the Data Mesh decision framework with an honest assessment. They had 12 domains with real domain expertise (check). But they had no self-serve platform (fail), no federable governance (fail), and domain teams lacked data engineering depth to operate independently (fail). Three of four data mesh prerequisites were unmet. Data mesh was the right destination but the wrong starting point.

**Target-state chosen:** Built a centralized EDP first: cloud data warehouse, orchestration, governance tooling, and a data catalog. Established central data quality standards, automated lineage capture, and unified access control. Domain teams retained ownership of their data product schemas, quality contracts, and business logic, the parts where domain expertise actually matters. But they published through the central platform rather than maintaining independent infrastructure. Governance was centrally defined, locally enforced. This was the pragmatic middle ground: federated ownership on centralized infrastructure. Not pure data mesh, but a realistic path toward it.

**Result:** Cross-domain patient analytics went from a multi-week project each time to routine delivery on the shared platform. HIPAA audit preparation shrank because lineage and access control finally had a single home. Data product discoverability went from "ask around and hope someone knows" to a searchable catalog with quality scores and lineage. Early domains adopted the central platform voluntarily; the rest followed as it proved cheaper than autonomy. The organization still plans to move toward full data mesh, but now with the platform and governance foundations in place first.
