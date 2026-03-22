---
description: "Healthcare HIPAA compliance for data platforms. Privacy, security, and breach notification rules mapped to EDP design. PHI handling and de-identification."
---

# Healthcare: HIPAA

## Executive Summary

- HIPAA governs the use, disclosure, and safeguarding of protected health information (PHI) in the United States. It applies to covered entities and their business associates -- which includes any cloud platform processing health data on their behalf.
- Data platform design decisions directly determine HIPAA compliance posture. Encryption, access controls, audit logging, and de-identification are not afterthoughts bolted onto a finished platform. They are architectural requirements that shape the platform from day one.
- The key challenge is enabling analytics and AI on health data while maintaining strict access controls. Health data is enormously valuable for population health analytics, clinical decision support, and operational optimization. HIPAA does not prohibit these uses -- it constrains how they are done.
- PHI requires encryption at rest and in transit, minimum necessary access, and comprehensive audit trails. These are non-negotiable technical safeguards under the Security Rule.
- De-identification enables analytical use cases without the full weight of PHI controls. A well-designed de-identification pipeline is the single highest-leverage investment for healthcare data platforms.

## HIPAA Rules Mapped to Platform Design

HIPAA has three rules that matter for data platform architecture. Each one translates directly into design decisions.

### Privacy Rule

The Privacy Rule governs who can access PHI and under what conditions. The operative principle is "minimum necessary" -- users should access only the PHI required for their specific role and task.

**Platform design implications:**

- **Column-level security on PHI fields.** Not all consumers need all columns. A billing analyst needs diagnosis codes and procedure codes but not clinical notes. A population health researcher needs demographics and outcomes but not patient names. Column-level access control enforces this at the platform level rather than relying on application logic or good intentions.
- **Role-based access with granular policies.** Define roles that map to HIPAA use cases: treatment, payment, operations, research, public health. Each role gets access to a specific set of PHI fields. No blanket "analyst" role that sees everything.
- **Data masking for non-essential fields.** When a consumer needs to see a table structure but not the actual PHI values, dynamic masking returns redacted or tokenized values. The underlying data remains intact for authorized users.

**EDP pattern:** Gold-layer views with PHI filtered or masked per consumer role. A single physical table serves multiple logical views -- one for clinical users with full PHI, one for billing with payment-relevant fields, one for research with de-identified data. The platform enforces the boundary, not the consumer's query.

### Security Rule

The Security Rule requires administrative, physical, and technical safeguards for electronic PHI (ePHI). For data platforms, the technical safeguards carry the most design weight.

**Platform design implications:**

- **Encryption at rest and in transit.** AES-256 for storage, TLS 1.2+ for all data movement. This includes data in object storage, databases, processing engines, and any intermediate staging areas. No exceptions for "temporary" or "internal" data.
- **Access logging.** Every access to ePHI must be logged -- who, what, when, from where. This is not optional logging you enable in production. It is a baseline requirement for every environment that holds real PHI.
- **Automatic session timeout.** Idle sessions with PHI access must terminate after a defined period. This applies to query tools, notebooks, dashboards, and API connections.
- **Key management and rotation.** Encryption keys must be managed through a dedicated key management service with automatic rotation. Keys should never be stored alongside the data they protect.

**EDP pattern:** Encryption managed at the platform level, not delegated to individual pipelines or teams. A single encryption configuration covers all data at rest. Network isolation (VPC, private endpoints, no public internet exposure) protects data in transit. Key rotation happens on a schedule without pipeline changes.

### Breach Notification Rule

The Breach Notification Rule requires reporting breaches affecting 500+ individuals to HHS within 60 days, and notifying affected individuals without unreasonable delay. Smaller breaches must be logged and reported annually.

**Platform design implications:**

- **Access anomaly detection.** Automated monitoring that flags unusual access patterns -- bulk downloads of PHI, access outside normal hours, queries from unexpected IP ranges, access to patient records outside a user's normal scope.
- **Automated alerting.** Anomaly detection must trigger alerts to security teams immediately, not surface in a weekly report. The 60-day clock starts when the breach is discovered, and delayed detection shortens your response window.
- **Incident classification.** Not every anomaly is a breach. The platform should support rapid investigation -- was this access authorized? Was the data actually exposed? Classification determines whether breach notification is required.

**EDP pattern:** Query audit logs analyzed for unusual access patterns using automated rules and statistical baselines. Integration with the organization's incident response workflow. Pre-built investigation queries that answer "what PHI was accessed, for how many individuals, and was it authorized?"

## PHI in the Data Platform

### What Counts as PHI

HIPAA defines 18 identifiers that, when combined with health information, constitute PHI. Platform teams need to know these cold because they determine which columns need protection:

| # | Identifier | Common Column Names |
|---|-----------|-------------------|
| 1 | Names | patient_name, first_name, last_name |
| 2 | Geographic data (smaller than state) | address, city, zip_code (3-digit zips OK) |
| 3 | Dates (except year) related to an individual | date_of_birth, admission_date, discharge_date, death_date |
| 4 | Phone numbers | phone, mobile, fax |
| 5 | Fax numbers | fax_number |
| 6 | Email addresses | email, patient_email |
| 7 | Social Security numbers | ssn, social_security |
| 8 | Medical record numbers | mrn, medical_record_id |
| 9 | Health plan beneficiary numbers | beneficiary_id, plan_member_id |
| 10 | Account numbers | account_number |
| 11 | Certificate/license numbers | license_number, cert_id |
| 12 | Vehicle identifiers and serial numbers | vehicle_vin |
| 13 | Device identifiers and serial numbers | device_serial, udi |
| 14 | Web URLs | patient_portal_url |
| 15 | IP addresses | ip_address, source_ip |
| 16 | Biometric identifiers | fingerprint_hash, retinal_scan |
| 17 | Full-face photographs | photo_url, image_path |
| 18 | Any other unique identifying number | any system-generated ID linkable to an individual |

The 18th category is the catch-all. Any identifier that could reasonably be used to identify an individual counts. When in doubt, treat it as PHI.

### Where PHI Lives in the Medallion Architecture

PHI flows through the platform differently at each layer, and the controls tighten as data moves toward consumption.

**Bronze (raw ingestion).** Raw PHI lands here from source systems -- EHRs, claims systems, lab systems, patient portals. Bronze holds the unmodified source data, including all 18 identifiers. Access to bronze is restricted to data engineering teams and automated pipelines. No analyst, no dashboard, no notebook should query bronze directly.

**Silver (cleansed and conformed).** Silver may contain masked or partially de-identified PHI depending on the use case. Standardize date formats, normalize codes (ICD-10, CPT, SNOMED), and apply initial data quality rules. PHI columns carry sensitivity tags in the data catalog. Row-level and column-level security policies begin here.

**Gold (consumption-ready).** Gold should contain either de-identified data for analytical use or role-restricted PHI for authorized clinical and operational use. De-identified gold datasets are the primary consumption target for most analytics and ML workloads. PHI-bearing gold datasets exist behind strict access controls for use cases that genuinely require identified data.

### De-Identification Methods

HIPAA provides two paths to de-identification, and the choice between them has real implications for data utility.

**Safe Harbor method.** Remove all 18 identifiers listed above. The remaining data is no longer PHI under HIPAA, which means it can be used for analytics, shared with researchers, and processed without the full weight of PHI controls. The trade-off: removing dates (except year), zip codes (except first 3 digits for populations over 20,000), and ages over 89 reduces analytical utility. Safe Harbor is conservative by design.

**Expert Determination method.** A qualified statistical expert certifies that the risk of identifying any individual from the remaining data is "very small." This allows retaining more data elements -- partial dates, broader geographic information, derived features -- as long as the re-identification risk stays below the threshold. Expert Determination preserves more analytical value but requires ongoing assessment as data volumes and linkage techniques evolve.

**When to use each:**

- **Safe Harbor for broad analytical access.** Population health dashboards, operational metrics, quality reporting, and any dataset that will be widely accessible. The mechanical nature of Safe Harbor makes it auditable and repeatable.
- **Expert Determination for ML and advanced analytics.** Training clinical ML models, survival analysis, epidemiological research -- use cases where dates, granular geography, and age distributions matter. Expert Determination preserves the signal that Safe Harbor strips out.
- **Neither for treatment and payment operations.** Clinical care, claims processing, and care coordination require identified data. These use cases operate under HIPAA's treatment, payment, and operations (TPO) provisions with full PHI access behind appropriate controls.

## Architecture Patterns for HIPAA

### Separate PHI and Non-PHI Zones

Physically separate PHI from non-PHI data at the storage layer. This is not just a logical separation with access controls -- it is separate storage accounts, separate encryption keys, separate network boundaries, and separate audit streams.

Why physical separation matters: it reduces the blast radius of a misconfiguration. If a non-PHI zone has a permissive access policy, no PHI is exposed. It also simplifies compliance audits -- auditors can scope their review to the PHI zone rather than auditing the entire platform.

The de-identification pipeline is the bridge between zones. Raw PHI enters the PHI zone, gets processed through bronze and silver, and de-identified data flows into the non-PHI zone for broad consumption. The pipeline is a one-way gate -- identified data flows in, de-identified data flows out.

### Row-Level Security for Multi-Tenant Health Data

Healthcare platforms often serve multiple provider organizations, health plans, or research institutions from a shared infrastructure. Row-level security ensures that each tenant sees only their own patients and members.

Implementation approach: a mapping table associates each user or service account with the organizations whose data they can access. Every query against PHI tables is automatically filtered by this mapping. The platform enforces this -- individual queries do not include the filter manually.

This pattern is particularly important for health information exchanges (HIEs), accountable care organizations (ACOs), and multi-facility health systems where data from independent organizations coexists in the same platform.

### Tokenization for Linking Records

Patient matching across systems is a core healthcare data problem. The same patient appears in the EHR, claims system, pharmacy system, and lab system with slightly different identifiers. Tokenization allows linking these records without exposing the underlying identifiers.

The pattern: a tokenization service generates a consistent, non-reversible token for each patient based on their identifying attributes (name, DOB, SSN). The token replaces the identifiers in analytical datasets. Records with the same token belong to the same patient, enabling longitudinal analysis without PHI exposure.

The tokenization service itself is a PHI system -- it holds the mapping between identifiers and tokens. It lives in the PHI zone with the strictest access controls. Downstream consumers never interact with it directly. They receive pre-tokenized data.

### Consent Management Integration

HIPAA permits certain uses of PHI without patient consent (treatment, payment, operations), but many valuable use cases -- research, marketing, data sharing with third parties -- require explicit patient authorization.

The data platform must integrate with the organization's consent management system to enforce authorization-based access. This means:

- Consent records are ingested as a data source and maintained as a reference dataset
- Query policies reference consent status -- a research query automatically excludes patients who have not consented to research use
- Consent changes propagate to access policies within a defined SLA (not "eventually" -- within hours)
- Audit logs capture the consent basis for each PHI access, not just the technical authorization

### Audit Trail Requirements

HIPAA requires the ability to answer: who accessed what PHI, when, and for what purpose. This is not a "nice to have" logging feature. It is a regulatory requirement that must be provable during an audit.

What to capture:

- **User identity** -- authenticated user or service account, not just an IP address
- **Action** -- read, write, export, query, download
- **Data accessed** -- which tables, which columns, which patient records (row-level if feasible)
- **Timestamp** -- when the access occurred
- **Purpose** -- the business justification mapped to HIPAA categories (treatment, payment, operations, research)
- **Result** -- success, failure, partial access due to masking or filtering

Audit logs are themselves sensitive data. They reveal access patterns and must be stored in append-only, tamper-evident storage with their own access controls. Retention should align with your organization's policies and state requirements, but six years is a common baseline aligned with the HIPAA statute of limitations.

## Architecture Checklist for Healthcare

- [ ] All PHI encrypted at rest (AES-256) and in transit (TLS 1.2+)
- [ ] Column-level security on all PHI columns
- [ ] Role-based access with minimum necessary principle enforced
- [ ] Comprehensive audit logging for all PHI access
- [ ] De-identification pipeline for analytical datasets
- [ ] Breach detection monitoring with automated alerting
- [ ] BAA (Business Associate Agreement) in place with cloud provider
- [ ] Data retention and disposal policies aligned with state and federal requirements
- [ ] PHI and non-PHI zones physically separated at the storage layer
- [ ] Row-level security for multi-tenant health data
- [ ] Tokenization service for cross-system patient linking
- [ ] Consent management integration with propagation SLA
- [ ] Audit logs stored in append-only, tamper-evident storage
- [ ] Incident response workflow integrated with platform alerting
- [ ] De-identification method documented and justified (Safe Harbor vs Expert Determination)
