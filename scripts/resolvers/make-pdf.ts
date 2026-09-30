import { type TemplateContext, toShellPath } from './types';

export function generateMakePdfSetup(ctx: TemplateContext): string {
  return `## MAKE-PDF SETUP

The Markdown-to-print-HTML helper is included with gstack. It does not launch a browser. Resolve it before converting:

\`\`\`bash
_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
P=""
[ -n "$_ROOT" ] && [ -f "$_ROOT/${ctx.paths.localSkillRoot}/bin/gstack-markdown-html" ] && P="$_ROOT/${ctx.paths.localSkillRoot}/bin/gstack-markdown-html"
[ -z "$P" ] && P="${toShellPath(ctx.paths.skillRoot)}/bin/gstack-markdown-html"
[ -f "$P" ] && echo "PRINT_HTML_READY: $P" || echo "PRINT_HTML_UNAVAILABLE"
\`\`\`

The agent host's user-browser capability must export the final PDF. If it cannot, report that step unavailable. Never launch a separate browser.`;
}
