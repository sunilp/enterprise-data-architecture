# Vendor Evaluation Framework

## Executive Summary

- This is not a "Platform A vs Platform B vs Platform C" comparison. Those comparisons age in months. Evaluation frameworks are durable.
- The right vendor depends on your organizational context -- your team's skills, your regulatory constraints, your workload characteristics, your budget model. Feature matrices cannot answer those questions.
- This framework provides the dimensions and questions that matter, not the answers. The answers change with every release cycle. The dimensions do not.
- Use this to structure your own evaluation, not to skip it. Any framework that tells you which vendor to pick without knowing your organization is selling you something.

## Evaluation Dimensions

Ten dimensions. Each one describes what it means, what questions to ask, and what separates a strong position from a weak one.

### 1. Cost Model

**What it means.** How the platform charges for usage and how predictable those charges are over time. The difference between consumption-based and provisioned pricing changes how teams behave, how finance plans, and how costs scale with growth.

**Key questions to ask.**

- Is pricing consumption-based, provisioned, or hybrid? Can you switch between models?
- How is compute billed separately from storage? Can you scale them independently?
- What happens to costs when query volume doubles? When data volume doubles? Are these linear or exponential?
- What does cost transparency look like? Can you attribute costs to teams, projects, or data products without building custom tooling?
- Are there hidden costs -- egress charges, API call charges, metadata operation charges -- that only appear at scale?

**What good looks like.** Clear separation of compute and storage costs. Per-team or per-workload cost attribution out of the box. Predictable scaling behavior that finance can model 12 months out. No surprise charges that only surface after production deployment.

**What to watch for.** Pricing that looks cheap in a proof of concept but scales unpredictably. Consumption models where a single poorly-written query can burn through a quarterly budget. Vendor pricing pages that require a sales call to understand.

---

### 2. Governance Maturity

**What it means.** How deeply governance is built into the platform versus bolted on after the fact. This covers cataloging, lineage, access control, data quality, and policy enforcement.

**Key questions to ask.**

- Does the platform include a built-in data catalog, or does governance require a separate product?
- Is lineage automatic (captured from query execution) or manual (someone has to document it)?
- Does column-level security work natively, or does it require workarounds with views and role hierarchies?
- Can data quality rules be enforced at write time, or only detected after the fact?
- How are PII and sensitive data tagged? Is classification automated or manual?

**What good looks like.** Lineage captured automatically from query execution. Column-level security enforced natively without view proliferation. Data quality rules that prevent bad data from landing in production tables. Classification that runs on write, not on schedule.

**What to watch for.** Governance features that exist in the product but require a separate license tier. Lineage that only works for the platform's own query engine and breaks for external tools. Access control models that are technically capable but operationally unmanageable at scale.

---

### 3. Multi-Cloud and Portability

**What it means.** The degree to which your data, workloads, and operational knowledge transfer across cloud providers -- or whether choosing this platform locks you into a single cloud's ecosystem permanently.

**Key questions to ask.**

- Does the platform store data in open formats (Parquet, Iceberg, Delta, Hudi) that other engines can read?
- Can you run the same platform on multiple cloud providers? With feature parity?
- What does migration look like if you need to move? Is it a data copy, or a full re-architecture?
- How tightly coupled is the platform to a specific cloud's identity, networking, and storage services?
- If the vendor disappears tomorrow, can you still read your data?

**What good looks like.** Data stored in open table formats that any engine can query. Multi-cloud deployment with consistent APIs and feature sets. Migration path that involves data movement, not application rewrite.

**What to watch for.** Proprietary storage formats that require the vendor's engine to read. "Multi-cloud" marketing that means "available on multiple clouds" but with significant feature gaps between them. Exit costs -- both financial and technical -- that grow with tenure.

---

### 4. Real-Time Support

**What it means.** The platform's ability to handle streaming data ingestion, low-latency queries, and event-driven processing. Not every organization needs real-time, but the ones that do need it to work without architectural gymnastics.

**Key questions to ask.**

- Can the platform ingest streaming data natively, or does it require a separate ingestion layer?
- What is the realistic latency from event occurrence to query availability? Minutes? Seconds? Sub-second?
- Does the platform support incremental materialization, or does every update require a full table rebuild?
- Can streaming and batch workloads share the same tables and governance, or are they separate worlds?
- What happens to streaming ingestion during platform maintenance windows?

**What good looks like.** Native streaming ingestion with seconds-level latency to query availability. Shared tables between streaming and batch workloads. Incremental materialization that does not require reprocessing the full dataset. Governance that applies equally to streaming and batch data.

**What to watch for.** "Real-time" that actually means "micro-batch every 5 minutes." Streaming support that works in demos but requires dedicated engineering effort to keep stable in production. Separate governance models for streaming vs batch data that create compliance gaps.

---

### 5. Ecosystem and Integrations

**What it means.** How well the platform connects to the rest of your technology stack -- source systems, BI tools, orchestration engines, ML platforms, and the broader open source ecosystem.

**Key questions to ask.**

- How many source system connectors exist natively? What is the quality of those connectors -- are they maintained, documented, and production-grade?
- Does the platform support standard interfaces (JDBC, ODBC, Arrow Flight) that BI tools expect?
- Can popular orchestration tools (Airflow, Dagster, Prefect, and others) manage workloads on this platform?
- Is the platform's ecosystem open enough that you can swap components without rewriting everything?
- How active is the community? Are third-party integrations built by the vendor, by partners, or by the community?

**What good looks like.** Broad native connector library with production-grade quality. Standard SQL interfaces that every BI tool can use without custom drivers. Active ecosystem where third parties build and maintain integrations because the platform is worth integrating with.

**What to watch for.** A connector catalog that counts quantity over quality -- 500 connectors where 50 actually work reliably. Proprietary APIs that require vendor-specific SDKs for basic operations. An ecosystem that is technically open but practically closed because the documentation is inadequate.

---

### 6. Data Product Support

**What it means.** The platform's native capabilities for publishing, sharing, discovering, and governing data as a product -- not just as tables in a warehouse.

**Key questions to ask.**

- Can data producers publish datasets with schemas, SLAs, and quality contracts?
- Is there a built-in marketplace or sharing mechanism for cross-team data consumption?
- Can consumers discover datasets without knowing which database and schema to look in?
- Does the platform support data contracts that enforce compatibility between producer and consumer?
- Can data products be shared across organizational boundaries (with external partners or subsidiaries)?

**What good looks like.** Native data sharing that works across accounts and organizations without data copying. Published schemas with versioning and deprecation policies. Discoverability that lets a business analyst find the right dataset without asking the data team.

**What to watch for.** "Data products" that are just tables with better documentation. Sharing mechanisms that require data duplication across accounts. Discovery features that only work within a single project or namespace.

---

### 7. AI/ML Integration

**What it means.** How well the platform supports the full machine learning lifecycle -- from training data preparation through feature engineering, model training, inference serving, and feedback loops.

**Key questions to ask.**

- Can data scientists access governed training data without extracting it to a separate environment?
- Does the platform provide or integrate with a feature store for feature reuse across models?
- Is model training supported natively, or does it require exporting data to a separate ML platform?
- Does the platform support vector search and embeddings for RAG and generative AI workloads?
- Can model predictions flow back into the platform to close feedback loops?

**What good looks like.** Governed training data accessible in-place. Feature store integration that enables cross-team feature reuse. Native or tightly-integrated vector search for AI workloads. Feedback loops that flow predictions back into the data platform for monitoring and retraining.

**What to watch for.** AI features that are announced in keynotes but require six months of engineering to make production-ready. "Built-in ML" that only supports basic algorithms while real workloads require external compute. Vector search bolted on as an afterthought with different governance and access control models.

---

### 8. Operational Maturity

**What it means.** How well the platform supports production operations -- monitoring, alerting, incident response, SLA management, and the day-to-day work of keeping a data platform healthy.

**Key questions to ask.**

- What monitoring is built in? Can you see query performance, pipeline health, and data freshness without building custom dashboards?
- Does the platform provide SLA guarantees for uptime, query performance, and data availability?
- What does the support model look like? Response times, escalation paths, dedicated account teams?
- How does the platform handle failures? Automatic retries, dead letter queues, circuit breakers?
- What is the platform's track record on unplanned downtime over the past 24 months?

**What good looks like.** Built-in monitoring for queries, pipelines, and data freshness. Contractual SLA guarantees with financial penalties for violations. Enterprise support with defined escalation paths and response time commitments. Transparent incident history with root cause analysis published for major outages.

**What to watch for.** "Enterprise support" that routes through offshore call centers with no product expertise. SLA guarantees that exclude planned maintenance windows broad enough to drive a truck through. Status pages that report "all systems operational" during user-reported outages.

---

### 9. Organizational Fit

**What it means.** How well the platform aligns with your organization's existing skills, hiring market, and capacity to absorb a new technology -- not just whether the technology is good, but whether your teams can actually operate it.

**Key questions to ask.**

- Does your existing team have experience with this platform, or does adoption require retraining?
- How easy is it to hire practitioners for this platform in your market? What does the talent pipeline look like?
- Does the platform's primary interface (SQL, Python, Spark, proprietary DSL) match your team's strengths?
- What does the training and certification ecosystem look like? Are there quality third-party training resources?
- How steep is the operational learning curve? Can your platform team manage it within 90 days, or does it require 6 months of ramp-up?

**What good looks like.** Platform's primary interface aligns with your team's existing skills. Active hiring market with available talent at reasonable cost. Strong training ecosystem with vendor-provided and third-party resources. Operational patterns that your team can internalize within a quarter.

**What to watch for.** Choosing a platform because it is technically superior while ignoring that nobody on your team knows how to operate it. Underestimating the 12-month productivity dip during platform transitions. Assuming that "we will hire for it" is a viable strategy in a tight labor market.

---

### 10. Regulatory and Compliance

**What it means.** The platform's ability to meet regulatory requirements for data residency, audit trails, access control, and industry-specific compliance frameworks.

**Key questions to ask.**

- What compliance certifications does the platform hold (SOC 2, ISO 27001, HIPAA, FedRAMP, and others)?
- Can the platform enforce data residency -- keeping data in specific geographic regions with provable controls?
- Does the platform produce audit trails sufficient for regulatory examination? Are they tamper-proof?
- How does the platform handle right-to-delete and right-to-access requests under GDPR and similar regulations?
- Can the platform demonstrate compliance continuously, or only during point-in-time audits?

**What good looks like.** Comprehensive certifications relevant to your industry. Data residency controls that are provable, not just documented. Audit trails that regulators accept without supplementary evidence. GDPR and privacy operations (deletion, access requests) supported natively without custom engineering.

**What to watch for.** Certifications that cover the platform but not the specific deployment configuration you use. Data residency claims that do not account for metadata, backups, or disaster recovery replicas. Audit capabilities that require exporting data to a separate system for analysis.

## Evaluation Matrix Template

Copy this table. Fill it in for each vendor you evaluate. Weight the dimensions based on your organization's priorities -- not every dimension matters equally in every context.

| Dimension | Weight (1-5) | Vendor A | Vendor B | Vendor C | Notes |
|---|---|---|---|---|---|
| Cost Model | | | | | |
| Governance Maturity | | | | | |
| Multi-Cloud and Portability | | | | | |
| Real-Time Support | | | | | |
| Ecosystem and Integrations | | | | | |
| Data Product Support | | | | | |
| AI/ML Integration | | | | | |
| Operational Maturity | | | | | |
| Organizational Fit | | | | | |
| Regulatory and Compliance | | | | | |
| **Weighted Total** | | | | | |

**How to use it.** Assign weights before evaluating vendors. If you weight dimensions after seeing scores, you are reverse-engineering a justification for a decision you already made. Score each vendor 1-5 per dimension based on evidence from proofs of concept, reference calls, and production experience -- not from slide decks and demos.

## Common Evaluation Mistakes

### Evaluating features instead of operational characteristics

Feature lists tell you what a platform can do in a demo. Operational characteristics tell you what it does in production at 3 AM when something breaks. The right question is never "does it support X?" -- it is "how does X behave under load, at scale, when things go wrong?"

### Letting the vendor's demo drive the decision

Demos are engineered to impress. The vendor's sales engineer spent days building a workflow that highlights strengths and avoids weaknesses. Your evaluation should be driven by your workloads, your data, your access patterns. Run your proof of concept on your terms, not theirs.

### Ignoring total cost of ownership

Licensing is roughly 30% of the total cost of operating a data platform. The rest is engineering time, training, migration effort, integration development, ongoing operational overhead, and the opportunity cost of delayed projects during platform transitions. A cheaper license that requires twice the engineering effort is not cheaper.

### Choosing based on existing skills without considering hiring trajectory

"Our team knows Platform X" is a valid input, not a complete answer. If Platform X's talent market is shrinking while Platform Y's is growing, choosing Platform X optimizes for the next 6 months at the expense of the next 3 years. Evaluate the trajectory, not just the snapshot.

### Evaluating for today's workload instead of next year's

Your workload profile will change. If you are evaluating purely on current requirements, you are buying a platform that fits today and constrains tomorrow. Include anticipated workloads -- AI/ML pipelines, real-time use cases, cross-organizational data sharing -- even if they are 12-18 months out.

## Platform Archetypes

Three dominant architectural patterns exist in the modern data platform market. Every major platform fits one of these archetypes, though the boundaries blur with each release cycle. Understanding the archetype helps you evaluate fit before you evaluate features.

### The Unified Lakehouse

**What it is.** A single platform that combines scalable object storage, a query engine, a governance layer, and compute management into one integrated experience. Data lives in open formats on cloud storage. The platform provides the engine, the catalog, and the runtime.

**Strengths.** One platform to learn, operate, and govern. Unified governance across structured and unstructured data. Strong support for both SQL analytics and code-first workloads (Python, Spark, ML). Open storage formats reduce lock-in at the data layer. Good fit for organizations that want data engineering, analytics, and data science on the same platform.

**Weaknesses.** "Unified" can mean "coupled" -- when the platform has issues, everything has issues. The breadth of capabilities means some individual features are less mature than best-of-breed alternatives. Operational complexity is high because the platform does so many things. Cost optimization requires understanding multiple compute surfaces.

**Best fit.** Organizations with diverse workloads (SQL analytics, data engineering, ML) that want a single platform with unified governance. Teams that value open formats and want to avoid proprietary storage lock-in. Environments where data scientists and data engineers need to collaborate on the same datasets.

---

### The Cloud-Native Warehouse

**What it is.** A fully managed, serverless (or near-serverless) analytical database tightly integrated with a specific cloud provider's ecosystem. Compute scales on demand. Administration is minimal. The platform prioritizes ease of use and operational simplicity.

**Strengths.** Low operational overhead -- the vendor manages infrastructure, scaling, and patching. Tight integration with the parent cloud's identity, networking, storage, and ML services. SQL-first interface that aligns with the broadest talent pool. Rapid time to value because there is less to configure and manage. Cost model is straightforward for SQL-heavy workloads.

**Weaknesses.** Deep cloud provider coupling makes multi-cloud or migration scenarios expensive. Code-first workloads (Spark, Python, heavy ML training) may require leaving the platform for a separate compute environment. The managed nature means less control -- you accept the vendor's choices on storage format, optimizer behavior, and scaling policies. Feature parity across clouds (when available) is often incomplete.

**Best fit.** Organizations committed to a single cloud provider with primarily SQL-based analytical workloads. Teams that prioritize operational simplicity over maximum flexibility. Environments where the platform team is small and cannot absorb the operational burden of a more complex architecture.

---

### The Open Ecosystem Approach

**What it is.** A composable architecture assembled from best-of-breed components -- a separate query engine, a separate catalog, a separate orchestrator, a separate governance tool. Data lives in open formats. Each component is chosen independently and integrated deliberately.

**Strengths.** Maximum flexibility and zero vendor lock-in at any layer. Each component can be the best tool for its specific job. Open source foundations mean deep community support and rapid innovation. Cost control is granular because each component is sized and priced independently. You can swap any component without replacing the whole stack.

**Weaknesses.** Integration is your problem. Every connection between components is a surface area you own -- upgrades, compatibility, security patching, version management. Governance across components requires deliberate engineering; it does not come for free. Operational overhead is highest because you are running multiple systems. The "best of breed" promise only delivers if your team has the skill to assemble and operate the pieces.

**Best fit.** Organizations with strong platform engineering teams that can build and maintain integrations. Environments where vendor lock-in is a strategic risk that must be minimized. Teams that need capabilities no single platform provides and are willing to invest in composability. Situations where specific components (a particular query engine, a particular catalog) are non-negotiable requirements.

---

### Choosing Between Archetypes

The archetype decision is upstream of the vendor decision. Pick the archetype first based on your organizational capabilities, workload diversity, and risk tolerance. Then evaluate vendors within that archetype.

If your team is small and operationally lean, the cloud-native warehouse reduces burden. If your workloads span analytics, engineering, and ML, the unified lakehouse consolidates complexity. If your organization treats vendor independence as a strategic requirement and has the engineering depth to back it up, the open ecosystem approach gives you control.

No archetype is universally superior. The right answer depends on who you are, not on what the platform can do.
