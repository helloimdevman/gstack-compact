import * as fs from 'fs';
import * as path from 'path';
import type { ResolverFn } from './types';
import type { SkillProfile } from '../host-config';

const MAP_PATH = path.resolve(import.meta.dirname, '../../gstack/router-map.json');
const ID = /^[a-z][a-z0-9-]*$/;
const COMMAND = /^\/[a-z][a-z0-9-]*$/;

export type Route = { skill: string; mode?: string };
export type RouterMap = {
  version: 2;
  core: string[];
  modes: Record<string, string[]>;
  jobs: Record<string, string>;
  commands: Record<string, Route>;
};

export function loadRouterMap(): RouterMap {
  return JSON.parse(fs.readFileSync(MAP_PATH, 'utf8')) as RouterMap;
}

export function validateRouterMap(raw: unknown, skillIds: ReadonlySet<string>): string[] {
  const errors: string[] = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return ['router map must be an object'];
  const map = raw as Partial<RouterMap>;
  if (map.version !== 2) errors.push('version must be 2');
  if (!Array.isArray(map.core) || !map.core.length) errors.push('core must be nonempty');
  const core = Array.isArray(map.core) ? map.core : [];
  if (new Set(core).size !== core.length) errors.push('duplicate core id');
  for (const id of core) {
    if (typeof id !== 'string' || !ID.test(id) || !skillIds.has(id)) errors.push(`invalid core skill: ${String(id)}`);
  }
  const modes = map.modes && typeof map.modes === 'object' && !Array.isArray(map.modes) ? map.modes : {};
  for (const [skill, values] of Object.entries(modes)) {
    if (!ID.test(skill) || !skillIds.has(skill)) errors.push(`invalid mode owner: ${skill}`);
    if (!Array.isArray(values) || values.some(value => typeof value !== 'string' || !ID.test(value))) errors.push(`invalid modes: ${skill}`);
    else if (new Set(values).size !== values.length) errors.push(`duplicate mode: ${skill}`);
  }
  const commands = map.commands && typeof map.commands === 'object' && !Array.isArray(map.commands) ? map.commands : {};
  for (const id of skillIds) if (!commands[`/${id}`]) errors.push(`missing command: /${id}`);
  for (const [command, route] of Object.entries(commands)) {
    if (!COMMAND.test(command)) errors.push(`invalid command: ${command}`);
    if (!route || typeof route !== 'object' || Array.isArray(route)) { errors.push(`invalid route: ${command}`); continue; }
    if (typeof route.skill !== 'string' || !ID.test(route.skill) || !skillIds.has(route.skill)) {
      errors.push(`invalid skill: ${String(route.skill)}`);
      continue;
    }
    const target = commands[`/${route.skill}`];
    if (target && target.skill !== route.skill) errors.push(`alias chain: ${command} -> ${route.skill}`);
    if (route.mode !== undefined && (!Array.isArray(modes[route.skill]) || !modes[route.skill].includes(route.mode))) {
      errors.push(`unknown mode: ${command} -> ${String(route.mode)}`);
    }
  }
  const jobs = map.jobs && typeof map.jobs === 'object' && !Array.isArray(map.jobs) ? map.jobs : {};
  for (const [job, command] of Object.entries(jobs)) {
    if (!ID.test(job) || typeof command !== 'string' || !COMMAND.test(command) || !commands[command]) {
      errors.push(`missing job destination: ${job} -> ${String(command)}`);
    }
  }
  return errors;
}

/** Embed only commands that are installed in the selected profile. */
export const generateRouterMap: ResolverFn = (ctx) => {
  const map = loadRouterMap();
  const profile: SkillProfile = ctx.skillProfile ?? 'compat';
  if (profile === 'compat') return '```json\n' + JSON.stringify(map, null, 2) + '\n```';
  const core = new Set(map.core);
  const commands = Object.fromEntries(Object.entries(map.commands).filter(([name, route]) => core.has(name.slice(1)) && core.has(route.skill)));
  const jobs = Object.fromEntries(Object.entries(map.jobs).filter(([, command]) => command in commands));
  const unavailableCommands = Object.keys(map.commands).filter(name => !(name in commands));
  const unavailableJobs = Object.fromEntries(Object.entries(map.jobs).filter(([, command]) => !(command in commands)));
  return '```json\n' + JSON.stringify({ ...map, jobs, commands, unavailableCommands, unavailableJobs }, null, 2) + '\n```';
};
