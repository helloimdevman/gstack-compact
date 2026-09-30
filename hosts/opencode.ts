import { defineHost } from './define-host';

const opencode = defineHost({
  name: 'opencode',
  displayName: 'OpenCode',

  globalRoot: '.config/opencode/skills/gstack',  // XDG config dir, not ~/.opencode

  // OpenCode links a wider runtime asset set than the shared default
  // (design binary, review specialists, qa templates/references, DX hall of fame).
  runtimeRoot: {
    globalSymlinks: ['bin', 'scripts', 'VERSION', 'gstack-upgrade', 'ETHOS.md', 'CONTRACT.md', 'review/specialists', 'qa/templates', 'qa/references', 'plan-devex-review/dx-hall-of-fame.md'],
    globalFiles: {
      'design': ['design', 'src'],
      'make-pdf': ['src'],
      'node_modules': ['marked', 'yaml', 'semver', 'smol-toml'],
      'review': ['checklist.md', 'design-checklist.md', 'greptile-triage.md', 'TODOS-format.md'],
    },
  },
});

export default opencode;
