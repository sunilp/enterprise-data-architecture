// Rewrites MkDocs-style internal links and relative image paths for Astro.
//
// Content files under docs/ link to each other with relative .md paths
// (e.g. ../decisions/decision-tree.md#anchor) and reference images as
// ../images/foo.svg. MkDocs rewrote both at build time; this plugin does
// the same for the Astro pipeline, resolving against the source file path
// and emitting site-absolute URLs under the configured base path.
import { visit } from 'unist-util-visit';
import path from 'node:path';

const BASE = '/enterprise-data-architecture';

export function rehypeMkdocsLinks() {
  return (tree, file) => {
    const src = file.history?.[0] ?? file.path ?? '';
    if (!src.includes('/docs/')) return;
    const docsRoot = src.slice(0, src.indexOf('/docs/')) + '/docs';
    const fileDir = path.dirname(src);

    // Raw HTML blocks (hero figures) are not parsed into elements at this
    // stage; rewrite their relative image paths textually.
    visit(tree, 'raw', (node) => {
      node.value = node.value.replaceAll('src="../images/', `src="${BASE}/images/`);
    });

    visit(tree, 'element', (node) => {
      if (node.tagName === 'a' && typeof node.properties?.href === 'string') {
        const href = node.properties.href;
        if (/^(https?:|mailto:|#)/.test(href)) return;
        const m = href.match(/^([^#?]*\.md)(#.*)?$/);
        if (m) {
          const abs = path.resolve(fileDir, m[1]);
          const rel = path.relative(docsRoot, abs).replace(/\.md$/, '');
          const slug = rel === 'index' ? '' : rel + '/';
          node.properties.href = `${BASE}/${slug}${m[2] ?? ''}`;
        }
      }
      if (node.tagName === 'img' && typeof node.properties?.src === 'string') {
        const s = node.properties.src;
        if (/^(https?:|data:|\/)/.test(s)) return;
        const i = s.indexOf('images/');
        if (i >= 0) node.properties.src = `${BASE}/${s.slice(i)}`;
      }
    });
  };
}
