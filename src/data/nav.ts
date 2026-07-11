// Site navigation — single source of truth for sections, ordering,
// sidebar, prev/next, and home-page cards. Mirrors the retired mkdocs nav.

export interface NavPage {
  title: string;
  slug: string;
}

export interface NavSection {
  label: string;
  description: string;
  pages: NavPage[];
}

export const SECTIONS: NavSection[] = [
  {
    label: 'Position',
    description: 'What the enterprise data platform is, what it is not, and why the boundary matters.',
    pages: [
      { title: 'What EDP Is', slug: 'position/what-edp-is' },
      { title: 'EDP vs Operational', slug: 'position/edp-vs-operational' },
      { title: 'Anti-Patterns', slug: 'position/anti-patterns' },
      { title: 'EDP Is Not an ODS', slug: 'position/edp-is-not-an-ods' },
      { title: 'The New Data Architecture', slug: 'position/new-data-architecture' },
      { title: 'Convergence and Exceptions', slug: 'position/convergence-and-exceptions' },
    ],
  },
  {
    label: 'Blueprints',
    description: 'Reference architectures: seven layers, capabilities, control plane, AI supply chains, agent access.',
    pages: [
      { title: 'Target State Architecture', slug: 'blueprints/target-state' },
      { title: 'Capability Architecture', slug: 'blueprints/capability-architecture' },
      { title: 'Control Plane', slug: 'blueprints/control-plane' },
      { title: 'AI/ML Platform Relationship', slug: 'blueprints/ai-ml-platform' },
      { title: 'Agents as Consumers', slug: 'blueprints/agent-access' },
      { title: 'Coexistence Patterns', slug: 'blueprints/coexistence-patterns' },
      { title: 'The Serving Layer', slug: 'blueprints/serving-layer' },
    ],
  },
  {
    label: 'Decisions',
    description: 'Workload routing, capability maps, data mesh, maturity, and vendor evaluation frameworks.',
    pages: [
      { title: 'Decision Tree', slug: 'decisions/decision-tree' },
      { title: 'Business Capability Map', slug: 'decisions/capability-map' },
      { title: 'Data Mesh', slug: 'decisions/data-mesh' },
      { title: 'Maturity Model', slug: 'decisions/maturity-model' },
      { title: 'Vendor Evaluation', slug: 'decisions/vendor-framework' },
      { title: 'Capability Assessment', slug: 'decisions/capability-maturity' },
    ],
  },
  {
    label: 'Patterns',
    description: 'Data contracts, cost architecture, open table formats, and the catalog layer.',
    pages: [
      { title: 'Data Contracts', slug: 'patterns/data-contracts' },
      { title: 'Cost Architecture', slug: 'patterns/cost-architecture' },
      { title: 'Open Formats and Catalogs', slug: 'patterns/open-formats' },
    ],
  },
  {
    label: 'Compliance',
    description: 'BCBS 239, DORA, HIPAA, Solvency II, IFRS 17, and the EU AI Act mapped to platform design.',
    pages: [
      { title: 'Overview', slug: 'compliance/overview' },
      { title: 'Banking', slug: 'compliance/banking' },
      { title: 'Healthcare', slug: 'compliance/healthcare' },
      { title: 'Insurance', slug: 'compliance/insurance' },
      { title: 'EU AI Act', slug: 'compliance/eu-ai-act' },
    ],
  },
  {
    label: 'Operations',
    description: 'Roles, processes, KPIs, support tiers, SLOs, and incident discipline for running the platform.',
    pages: [
      { title: 'Operating Model', slug: 'operations/operating-model' },
      { title: 'Reliability Model', slug: 'operations/reliability' },
    ],
  },
  {
    label: 'Transformation',
    description: 'A four-stage roadmap from current-state confusion to governed coexistence.',
    pages: [{ title: 'Roadmap', slug: 'transformation/roadmap' }],
  },
  {
    label: 'Evidence',
    description: 'Worked examples, evidence tables, target metrics, and review checklists, each labeled by provenance.',
    pages: [
      { title: 'Case Studies', slug: 'proof/case-studies' },
      { title: 'Evidence Tables', slug: 'proof/evidence' },
      { title: 'Decision Records', slug: 'proof/decision-records' },
      { title: 'Metrics and Outcomes', slug: 'proof/metrics' },
      { title: 'Review Checklists', slug: 'proof/checklists' },
    ],
  },
  {
    label: 'Glossary',
    description: '20 commonly confused terms, each mapped to the target-state architecture.',
    pages: [{ title: 'Glossary', slug: 'glossary' }],
  },
];

export function flatPages(): NavPage[] {
  return SECTIONS.flatMap((s) => s.pages);
}

export function findPage(slug: string): NavPage | undefined {
  return flatPages().find((p) => p.slug === slug);
}

export function sectionFor(slug: string): NavSection | undefined {
  return SECTIONS.find((s) => s.pages.some((p) => p.slug === slug));
}
