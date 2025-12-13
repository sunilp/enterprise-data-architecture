# Glossary

Precise definitions for terms that are commonly confused, conflated, or misused in enterprise data architecture. Each term includes what it is, what it is not, and where it fits in the [target-state architecture](blueprints/target-state.md).

---

### Bronze / Silver / Gold

Data refinement stages within the EDP: raw ingestion (bronze), cleansed and conformed (silver), business-ready (gold). **Not:** business process stages or a workflow model. **Architecture layer:** Layer 4 (EDP).

### Data Fabric

A vendor-marketed architectural approach emphasizing metadata-driven data integration across distributed systems. **Not:** a single product or platform. Not the same as data mesh. Included here for disambiguation -- this guide does not prescribe data fabric as a pattern.

### Data Lake

A storage system for raw, unprocessed data in native formats (Parquet, JSON, CSV). **Not:** a data warehouse. Not governed by default. **Architecture layer:** Layer 4 (EDP), typically the bronze/raw tier.

### Data Mesh

An organizational model for decentralized data ownership where domain teams own and publish data products. **Not:** a technology platform. Not a replacement for centralized infrastructure. See [Data Mesh positioning](decisions/data-mesh.md) (Phase 2) for detailed treatment. **Architecture layer:** organizational overlay across Layers 4--5.

### Data Products

Governed, documented, discoverable datasets with defined ownership, schema, SLA, and quality contract. **Not:** raw tables, API endpoints, or "any data someone published." **Architecture layer:** Layer 5 (Semantic / Data Product Layer).

### Data Warehouse

A structured analytical data store optimized for SQL queries, aggregations, and reporting. **Not:** an operational database. Not a data lake (though lakehouses blur this line). **Architecture layer:** Layer 4 (EDP).

### Enterprise Data Platform (EDP)

An integrated analytical platform that ingests, historizes, governs, and serves data across business domains for analytics, AI, and regulatory reporting. **Not:** an operational platform, a transaction processing system, or a workflow engine. **Architecture layer:** Layer 4.

### Feature Store

An ML-specific data system that manages the computation, storage, and serving of features for model training (offline) and inference (online). **Not:** a general-purpose data store. Bridges the analytical and operational worlds. **Architecture layer:** between Layer 5 and Layer 6.

### Lakehouse

A platform combining data lake storage flexibility with data warehouse query capabilities, typically using open table formats (Delta Lake, Apache Iceberg). **Not:** a replacement for operational databases. **Architecture layer:** Layer 4 (EDP).

### Operational Data Store (ODS)

A purpose-built store for current-state, operational access patterns with low latency and transactional consistency. Holds denormalized, access-optimized data for operational use. **Not:** the EDP. Not a data warehouse. **Architecture layer:** Layer 3a.

### Raw / Curated / Consumption

Alternative naming for bronze/silver/gold. Same concept: data refinement stages within the EDP. Some organizations prefer this naming to avoid the "gold = final product" misconception. **Architecture layer:** Layer 4 (EDP).

### Serving Layer

Infrastructure that sits between data products and operational consumers, optimized for low-latency, high-concurrency access. APIs, caches, materialized views, feature stores. **Not:** the EDP. Not the data product itself. **Architecture layer:** between Layer 5 and operational consumers.

### Transaction Processing Platform

Systems designed for ACID-compliant, low-latency business transactions: payments, orders, bookings, settlements. **Not:** the EDP. Not analytical. **Architecture layer:** Layer 3.

### Workflow Platform

Systems for orchestrating multi-step business processes with state management, human tasks, exception handling, and SLA tracking. Temporal, Camunda, or purpose-built BPM. **Not:** dbt. Not Airflow (which is a pipeline orchestrator, not a business workflow engine). **Architecture layer:** Layer 3.

---

Terms with dedicated pages in this guide (e.g., Data Mesh) are defined briefly here with a link to the full treatment.
