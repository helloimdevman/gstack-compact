import { expect, test } from 'bun:test';
import { generateBrowserSetup } from '../scripts/resolvers/browser';
import { HOST_PATHS } from '../scripts/resolvers/types';

test('browser contract uses the user browser supplied by the host', () => {
  const setup = generateBrowserSetup({ skillName: 'browse', tmplPath: 'browse/SKILL.md.tmpl', host: 'claude', paths: HOST_PATHS.claude });
  expect(setup).toContain('browser capability supplied by the current agent host');
  expect(setup).toContain('profile the user is using');
  expect(setup).toContain('report this step as `unavailable`');
  expect(setup).toContain('Never install, launch, or connect a separate browser');
  expect(setup).not.toContain('Aside');
  expect(setup).not.toContain('Chromium');
});
