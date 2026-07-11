---
description: "AI agents as consumers of the enterprise data platform. MCP, semantic layers as agent interfaces, governed text-to-SQL, agent identity, and workload placement."
---

# Agents as Consumers

AI agents are now a consumer class of the data platform, alongside dashboards, analysts, and model pipelines. They consume differently, and platforms designed around human consumption patterns are discovering the difference in production. This page covers what changes, how agents connect, and how to govern the connection without granting the EDP an operational mandate it should not have.

## What Changes When the Consumer Is an Agent

The access patterns that shaped every assumption in the consumption layer were human patterns: a person writes a query, reads the result, and decides what to do next. Agents break each of those assumptions.

**Volume and cadence.** A human analyst runs dozens of queries a day. An agent loop can run thousands, at machine speed, around the clock. Cost controls and rate limits sized for human exploration do not survive contact with an agent that retries failed queries enthusiastically.

**Autonomy.** No human reviews each query before it runs. A misunderstanding of the schema does not surface as a confused analyst asking a colleague; it surfaces as confidently wrong output, repeated at scale.

**Blast radius.** A BI user misreading a chart wastes a meeting. An agent misreading a table feeds an action: a customer message, a priced quote, a workflow decision. The consequence of a wrong read moves from a slide to a system.

**Credential model.** Agents authenticate as service identities, not people. A shared "agent service account" with broad read access is the new shared credential anti-pattern, and it defeats both least-privilege access and audit.

None of this changes where agent workloads run. It changes how strictly the consumption boundary has to be engineered.

## The Connection Layer

MCP (Model Context Protocol) has become the de facto standard for connecting agents to tools and data. Anthropic donated it to the Linux Foundation's Agentic AI Foundation in December 2025, which put it under vendor-neutral governance, and the major warehouse vendors now run managed MCP servers that expose governed query and search tools directly from the platform.

Be precise about what MCP is: a connectivity and discovery standard. It standardizes how an agent finds and calls a tool, the way USB-C standardizes a plug. It does not decide what the agent is authorized to do, does not record on whose authority a call was made, and does not enforce your data policies. Those remain your platform's job, enforced in the catalog, the policy engine, and the audit trail, exactly as they are for every other consumer. An MCP endpoint in front of an ungoverned table is an ungoverned table with better ergonomics.

## Governed Access Patterns

Four patterns keep agent access inside the platform's control plane. They compose; mature platforms use all of them.

**The semantic layer as the agent interface.** Agents should query governed metrics and views, not raw tables. A semantic layer gives the agent the same thing it gives a BI tool: business definitions, blessed joins, and a smaller surface to misunderstand. This is where the semantic layer stops being a BI convenience and becomes access infrastructure; the Open Semantic Interchange (OSI) spec, published in early 2026, exists precisely so those definitions can travel between tools and agent platforms. An agent that reads `monthly_recurring_revenue` from the semantic layer inherits the definition the business signed off on. An agent that computes it from raw tables invents its own.

**Data products as tools.** The narrowest safe interface is a read-only, contract-backed data product exposed as a named tool: `get_customer_profile`, `lookup_claim_status`. The agent gets a typed, documented, rate-limited capability instead of open SQL. The data contract already specifies schema, freshness, and ownership; exposing the product as a tool extends the same contract to agent consumers.

**Text-to-SQL only inside guardrails.** Free-form SQL generation against the warehouse is the most powerful pattern and the least controllable. Where it is genuinely needed, fence it: scope the agent's schema to curated views, cap rows and bytes scanned per query, set cost budgets per agent identity, and log every generated statement with its execution plan. Treat generated SQL as untrusted input, because it is.

**Scoped identity per agent.** Each agent gets its own service identity with least-privilege grants, separate from every other agent and from the application hosting it. This is what makes the audit trail meaningful: "which agent read this PII, under whose delegation, for which task" must be answerable per agent, not per shared account.

## Identity, Authority, and Audit

The open gap in 2026 is not connectivity; it is authority. When an agent acts on behalf of a user, who authorized the action, and can you prove it later? Three approaches are emerging, and they are not mutually exclusive:

- **Gateway enforcement.** An MCP gateway or proxy in front of data tools applies policy, rate limits, and logging at the choke point, the same pattern API gateways established for service traffic.
- **Vendor-native agent governance.** The managed MCP servers from warehouse vendors enforce catalog policies on agent queries and tie agent identities into platform-native access control and audit.
- **Open identity specifications.** Specs such as the [Agent Identity Protocol](https://sunilprakash.com/aip/) define portable agent identities and delegation chains, so authority can be verified across platform boundaries rather than inside one vendor's walls.

Whichever combination you choose, hold it to the standard the rest of this guide applies to human access: identity per actor, authority traceable to a person or a policy, and an audit trail that survives the vendor relationship.

## Where Agent Workloads Run

Agent demand does not move the platform boundary. Route agent workloads through the same [decision tree](../decisions/decision-tree.md) as everything else. An agent answering analytical questions over governed data products is an analytical consumer, and the EDP serves it well. An agent that acts (processing claims, executing trades, messaging customers) is an operational workload: it belongs on an operational platform, reading governed products through a [serving layer or API](coexistence-patterns.md), with the EDP ingesting its traces for analysis after the fact.

The pressure to make the EDP an agent runtime will arrive the same way every other scope-creep did: the data is there, so the workload wants to be there. The answer is also the same. The platform supplies governed data to agents; it does not run them.
