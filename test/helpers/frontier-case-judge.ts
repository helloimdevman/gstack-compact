import * as fs from 'node:fs';
import * as path from 'node:path';
import type { NativePublicToolEvent } from '../../lib/claude-public-transcript';

export type FrontierCase = {
  id: string;
  requiredArtifacts: string[];
  failureConditions: string[];
};
export type CaseEvidence = {
  fixtureRoot: string;
  publicEvents?: readonly NativePublicToolEvent[];
  artifacts?: Record<string, string>;
  effectAudit?: readonly string[];
  semanticChecks?: Record<string, boolean>;
  completed?: boolean;
  cancelled?: boolean;
  pendingPermission?: boolean;
};
export type CaseVerdict = { status: 'passed' | 'failed' | 'cancelled' | 'blocked' | 'not_run' | 'incomplete'; reasons: string[] };

/** Consume a public tool projection and fixture-owned files, never final prose. */
export function judgeFrontierCase(testCase: FrontierCase, evidence?: CaseEvidence): CaseVerdict {
  if (!evidence?.publicEvents?.length) return { status: 'not_run', reasons: ['no public trace'] };
  if (evidence.cancelled) return { status: 'cancelled', reasons: ['run cancelled'] };
  if (evidence.pendingPermission) return { status: 'blocked', reasons: ['permission pending'] };
  const reasons: string[] = [];
  const uses = new Set(evidence.publicEvents.filter(event => event.kind === 'use').map(event => event.toolUseId));
  const results = evidence.publicEvents.filter(event => event.kind === 'result' && uses.has(event.toolUseId));
  if (!results.length) reasons.push('no completed public tool call');
  for (const use of uses) if (!results.some(event => event.toolUseId === use)) reasons.push(`unacknowledged tool call: ${use}`);
  if (results.some(event => event.isError)) reasons.push('public tool failure');
  let root: string;
  try { root = fs.realpathSync(evidence.fixtureRoot); }
  catch { return { status: 'failed', reasons: ['fixture root missing'] }; }
  for (const key of testCase.requiredArtifacts) {
    const file = evidence.artifacts?.[key];
    if (!file) { reasons.push(`missing artifact: ${key}`); continue; }
    let actual: string;
    try { actual = fs.realpathSync(file); } catch { reasons.push(`missing artifact file: ${key}`); continue; }
    const rel = path.relative(root, actual);
    if (rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) { reasons.push(`artifact outside fixture: ${key}`); continue; }
    if (!fs.statSync(actual).isFile() || fs.statSync(actual).size === 0) reasons.push(`empty artifact: ${key}`);
  }
  for (const effect of evidence.effectAudit ?? []) {
    if (testCase.failureConditions.includes(effect)) reasons.push(`forbidden effect: ${effect}`);
  }
  if (reasons.length) return { status: 'failed', reasons };
  if (!evidence.completed || evidence.effectAudit === undefined || testCase.failureConditions.some(condition => evidence.semanticChecks?.[condition] !== true)) {
    return { status: 'incomplete', reasons: ['completion or independent semantic checks missing'] };
  }
  return { status: 'passed', reasons: [] };
}
