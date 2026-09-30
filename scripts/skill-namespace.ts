/** Public gpact names; runtime helpers and stored protocol IDs stay stable. */
import { loadRouterMap } from './resolvers/router-map';

export function publicSkillName(id: string, prefix = true): string {
  if (id === 'gstack' || id === 'gpact') return 'gpact';
  const short = id.replace(/^(?:gstack|gpact)-/, '');
  return prefix ? `gpact-${short}` : short;
}

export function namespaceSkill(content: string, prefix = true): string {
  if (/^name: gstack$/m.test(content)) {
    content = content.replace(/^---\n[\s\S]*?\n---/, frontmatter => frontmatter.replace(/\bgstack\b/g, 'gpact'));
    content = content.replace('Open the installed skill entry for that ID and pass the mode and user constraints.',
      `For a logical skill ID, read its installed sibling \`../${prefix ? 'gpact-' : ''}<id>/SKILL.md\` and pass the mode and user constraints. The logical ID \`gstack\` refers to this router itself.`);
  }
  const commands = Object.keys(loadRouterMap().commands).map(name => name.slice(1));
  const names = [...new Set([...commands, 'test'])].sort((a, b) => b.length - a.length).join('|');
  return content
    .replace(/^name: (.+)$/m, (_, name) => `name: ${publicSkillName(name.trim(), prefix)}`)
    .replace(new RegExp('(^|[\\s`"\'(])/(?:gstack-|gpact-)?(' + names + ')(?=$|[\\s`"\'.,;!?:)])', 'gm'),
      (_, before, id) => `${before}/${publicSkillName(id, prefix)}`)
    .replace(/\$gstack-([a-z][a-z0-9-]*)\b/g, (_, id) => `$${publicSkillName(id, prefix)}`)
    .replace(/(^[ \t]+(?:display_name: "|default_prompt: "Use ))(gstack(?:-[a-z0-9-]+)?)(?="| for)/gm,
      (_, before, id) => before + publicSkillName(id, prefix))
    .replace(/\.\.\/(?:gstack-|gpact-)?([a-z][a-z0-9-]*)\/SKILL\.md/g,
      (_, id) => `../${publicSkillName(id, prefix)}/SKILL.md`);
}
