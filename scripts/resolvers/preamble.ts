/** Installed bootstrap and shared contract; optional model guidance follows it. */
import type { TemplateContext } from './types';
import { getHostConfig } from '../../hosts/index';
import { generateModelOverlay } from './model-overlay';

export { generateTestFailureTriage } from './preamble/generate-test-failure-triage';

export const SHARED_CONTRACT_POINTER = [
  '## Shared contract',
  '',
  'Read the printed `GSTACK_CONTRACT` file before acting. It owns common permissions and safety.',
].join('\n');

export function generateInstalledPreamble(ctx: TemplateContext): string {
  const tier = ctx.preambleTier;
  if (tier === undefined) {
    throw new Error(
      `Missing preamble-tier frontmatter in ${ctx.tmplPath}: every template that ` +
      `resolves {{PREAMBLE}} must declare 'preamble-tier: N' (1-4).`
    );
  }
  if (tier < 1 || tier > 4) {
    throw new Error(`Invalid preamble-tier: ${tier} in ${ctx.tmplPath}. Must be 1-4.`);
  }
  if (SHARED_CONTRACT_POINTER.length >= 500) {
    throw new Error('SHARED_CONTRACT_POINTER must stay under 500 characters');
  }
  const host = getHostConfig(ctx.host);
  const globalRoot = ctx.host === 'codex'
    ? '${CODEX_HOME:-$HOME/.codex}/skills/gstack'
    : `$HOME/${host.globalRoot}`;
  const overlay = generateModelOverlay(ctx);
  return `## Start /${ctx.skillName}

\`\`\`bash
_G="${globalRoot}"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/${ctx.paths.localSkillRoot}/bin/gstack-skill-start" ] && _G="$_R/${ctx.paths.localSkillRoot}"
"$_G/bin/gstack-skill-start" --skill "${ctx.skillName}" --model "${ctx.model ?? 'none'}" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
\`\`\`

Reuse printed \`GSTACK_BIN\`; shell variables reset. Missing \`GSTACK_CONTRACT\` or \`SKILL_START_PROTO: 1\` blocks protected /${ctx.skillName} steps. If \`SESSION_KIND\` is absent, treat \`SESSION_KIND\` as \`interactive\`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep \`SESSION_ID\` and \`TEL_START\`.

${SHARED_CONTRACT_POINTER}${overlay ? `\n\n${overlay}` : ''}`;
}
