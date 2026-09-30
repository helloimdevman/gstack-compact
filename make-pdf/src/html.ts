#!/usr/bin/env node
/** Prepare print HTML; the agent host's user browser handles PDF export. */
import { readFileSync, writeFileSync } from 'node:fs';
import { render } from './render';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: bin/gstack-markdown-html <input.md> <output.html>');
  process.exit(1);
}

const html = render({ markdown: readFileSync(input, 'utf8'), cover: true, toc: true }).html;
const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: file:; style-src 'unsafe-inline'">`;
writeFileSync(output, html.replace('<head>', `<head>${csp}`), { flag: 'wx' });
console.log(output);
