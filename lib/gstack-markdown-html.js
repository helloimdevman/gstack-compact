#!/usr/bin/env node

// make-pdf/src/html.ts
import { readFileSync, writeFileSync } from "node:fs";

// node_modules/marked/lib/marked.esm.js
function A() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var R = A();
function j(l) {
  R = l;
}
var z = { exec: () => null };
function I(l) {
  let e = [];
  return (t) => {
    let n = Math.max(0, Math.min(3, t - 1)), s = e[n];
    return s || (s = l(n), e[n] = s), s;
  };
}
function k(l, e = "") {
  let t = typeof l == "string" ? l : l.source, n = { replace: (s, r) => {
    let i = typeof r == "string" ? r : r.source;
    return i = i.replace(m.caret, "$1"), t = t.replace(s, i), n;
  }, getRegex: () => new RegExp(t, e) };
  return n;
}
var Oe = ((l = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + l);
  } catch {
    return false;
  }
})();
var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (l) => new RegExp(`^( {0,3}${l})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: I((l) => new RegExp(`^ {0,${l}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: I((l) => new RegExp(`^ {0,${l}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)), fencesBeginRegex: I((l) => new RegExp(`^ {0,${l}}(?:\`\`\`|~~~)`)), headingBeginRegex: I((l) => new RegExp(`^ {0,${l}}#`)), htmlBeginRegex: I((l) => new RegExp(`^ {0,${l}}<(?:[a-z].*>|!--)`, "i")), blockquoteBeginRegex: I((l) => new RegExp(`^ {0,${l}}>`)) };
var Te = /^(?:[ \t]*(?:\n|$))+/;
var we = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var ye = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var q = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var Pe = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var U = / {0,3}(?:[*+-]|\d{1,9}[.)])/;
var oe = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var ae = k(oe).replace(/bull/g, U).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var Se = k(oe).replace(/bull/g, U).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var K = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/;
var _e = /^[^\n]+/;
var W = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
var $e = k(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", W).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var Le = k(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, U).getRegex();
var Q = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var X = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var Ee = k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))", "i").replace("comment", X).replace("tag", Q).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var le = (l) => k(K).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", l).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex();
var ze = le(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/);
var Me = le(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/);
var Ae = k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Me).getRegex();
var J = { blockquote: Ae, code: we, def: $e, fences: ye, heading: Pe, hr: q, html: Ee, lheading: ae, list: Le, newline: Te, paragraph: ze, table: z, text: _e };
var se = k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}\t)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex();
var Ie = { ...J, lheading: Se, table: se, paragraph: k(K).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", se).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex() };
var Ce = { ...J, html: k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", X).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: z, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: k(K).replace("hr", q).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ae).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
var Be = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var De = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var ue = /^( {2,}|\\)\n(?!\s*$)/;
var qe = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var _ = /[\p{P}\p{S}]/u;
var C = /[\s\p{P}\p{S}]/u;
var v = /[^\s\p{P}\p{S}]/u;
var ve = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, C).getRegex();
var He = /[\p{Pi}\p{Ps}"']/u;
var pe = /(?!~)[\p{P}\p{S}]/u;
var Ze = /(?!~)[\s\p{P}\p{S}]/u;
var Ge = /(?:[^\s\p{P}\p{S}]|~)/u;
var Qe = k(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Oe ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
var ce = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/;
var Ne = k(ce, "u").replace(/punct/g, _).getRegex();
var je = k(ce, "u").replace(/punct/g, pe).getRegex();
var Fe = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/;
var Ue = k(Fe, "u").replace(/openQuote/g, He).replace(/punct/g, _).getRegex();
var he = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var Ke = k(he, "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
var We = k(he, "gu").replace(/notPunctSpace/g, Ge).replace(/punctSpace/g, Ze).replace(/punct/g, pe).getRegex();
var Xe = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)";
var Je = k(Xe, "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
var Ve = k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
var Ye = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)";
var et = k(Ye, "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
var tt = k(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, _).getRegex();
var nt = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)";
var rt = k(nt, "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
var st = k(/\\(punct)/, "gu").replace(/punct/g, _).getRegex();
var it = k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var ot = k(X).replace("(?:-->|$)", "-->").getRegex();
var at = k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ot).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var G = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/;
var lt = k(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", G).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var ke = k(/^!?\[(label)\]\[(ref)\]/).replace("label", G).replace("ref", W).getRegex();
var de = k(/^!?\[(ref)\](?:\[\])?/).replace("ref", W).getRegex();
var ut = k("reflink|nolink(?!\\()", "g").replace("reflink", ke).replace("nolink", de).getRegex();
var ie = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
var V = { _backpedal: z, anyPunctuation: st, autolink: it, blockSkip: Qe, br: ue, code: De, del: z, delLDelim: z, delRDelim: z, emStrongLDelim: Ne, emStrongRDelimAst: Ke, emStrongRDelimUnd: Ve, escape: Be, link: lt, nolink: de, punctuation: ve, reflink: ke, reflinkSearch: ut, tag: at, text: qe, url: z };
var pt = { ...V, emStrongLDelim: Ue, emStrongRDelimAst: Je, emStrongRDelimUnd: et, link: k(/^!?\[(label)\]\((.*?)\)/).replace("label", G).getRegex(), reflink: k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", G).getRegex() };
var F = { ...V, emStrongRDelimAst: We, emStrongLDelim: je, delLDelim: tt, delRDelim: rt, url: k(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ie).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: k(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ie).getRegex() };
var ct = { ...F, br: k(ue).replace("{2,}", "*").getRegex(), text: k(F.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
var H = { normal: J, gfm: Ie, pedantic: Ce };
var B = { normal: V, gfm: F, breaks: ct, pedantic: pt };
var ht = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var ge = (l) => ht[l];
function T(l, e) {
  if (e) {
    if (m.escapeTest.test(l))
      return l.replace(m.escapeReplace, ge);
  } else if (m.escapeTestNoEncode.test(l))
    return l.replace(m.escapeReplaceNoEncode, ge);
  return l;
}
function Y(l) {
  try {
    l = encodeURI(l).replace(m.percentDecode, "%");
  } catch {
    return null;
  }
  return l;
}
function ee(l, e) {
  let t = l.replace(m.findPipe, (r, i, o) => {
    let u = false, a = i;
    for (;--a >= 0 && o[a] === "\\"; )
      u = !u;
    return u ? "|" : " |";
  }), n = t.split(m.splitPipe), s = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e)
    if (n.length > e)
      n.splice(e);
    else
      for (;n.length < e; )
        n.push("");
  for (;s < n.length; s++)
    n[s] = n[s].trim().replace(m.slashPipe, "|");
  return n;
}
function $(l, e, t) {
  let n = l.length;
  if (n === 0)
    return "";
  let s = 0;
  for (;s < n; ) {
    let r = l.charAt(n - s - 1);
    if (r === e && !t)
      s++;
    else if (r !== e && t)
      s++;
    else
      break;
  }
  return l.slice(0, n - s);
}
function te(l) {
  let e = l.split(`
`), t = e.length - 1;
  for (;t >= 0 && m.blankLine.test(e[t]); )
    t--;
  return e.length - t <= 2 ? l : e.slice(0, t + 1).join(`
`);
}
function fe(l, e) {
  if (l.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let n = 0;n < l.length; n++)
    if (l[n] === "\\")
      n++;
    else if (l[n] === e[0])
      t++;
    else if (l[n] === e[1] && (t--, t < 0))
      return n;
  return t > 0 ? -2 : -1;
}
function me(l, e = 0) {
  let t = e, n = "";
  for (let s of l)
    if (s === "\t") {
      let r = 4 - t % 4;
      n += " ".repeat(r), t += r;
    } else
      n += s, t++;
  return n;
}
function xe(l, e, t, n, s) {
  let r = e.href, i = e.title || null, o = l[1].replace(s.other.outputLinkReplace, "$1"), u = l[0].charAt(0) === "!";
  n.state.inLink = true;
  let a = n.state.linkEmitted, p = n.state.inRawBlock;
  n.state.linkEmitted = false;
  let c = n.inlineTokens(o), h = n.state.linkEmitted;
  if (n.state.linkEmitted = a, n.state.inLink = false, !u) {
    if (h) {
      n.state.inRawBlock = p;
      return;
    }
    n.state.linkEmitted = true;
  }
  return { type: u ? "image" : "link", raw: t, href: r, title: i, text: o, tokens: c };
}
function kt(l, e, t) {
  let n = l.match(t.other.indentCodeCompensation);
  if (n === null)
    return e;
  let s = n[1];
  return e.split(`
`).map((r) => {
    let i = r.match(t.other.beginningSpace);
    if (i === null)
      return r;
    let [o] = i;
    return o.length >= s.length ? r.slice(s.length) : r;
  }).join(`
`);
}
var y = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || R;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0)
      return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = this.options.pedantic ? t[0] : te(t[0]), s = n.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: n, codeBlockStyle: "indented", text: s };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], s = kt(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: s };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let s = $(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return { type: "heading", raw: $(t[0], `
`), depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t)
      return { type: "hr", raw: $(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = $(t[0], `
`).split(`
`), s = "", r = "", i = [];
      for (;n.length > 0; ) {
        let o = false, u = [], a;
        for (a = 0;a < n.length; a++)
          if (this.rules.other.blockquoteStart.test(n[a]))
            u.push(n[a]), o = true;
          else if (!o)
            u.push(n[a]);
          else
            break;
        n = n.slice(a);
        let p = u.join(`
`), c = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${p}` : p, r = r ? `${r}
${c}` : c;
        let h = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(c, i, true), this.lexer.state.top = h, n.length === 0)
          break;
        let d = i.at(-1);
        if (d?.type === "code")
          break;
        if (d?.type === "blockquote") {
          let O = d, g = n.join(`
`), w = O.raw + `
` + g.replace(this.rules.other.blockquoteSetextReplace2, ""), E = this.blockquote(w);
          i[i.length - 1] = E, s = `${s}
${g}`, r = r.substring(0, r.length - O.text.length) + E.text;
          break;
        } else if (d?.type === "list") {
          let O = d, g = O.raw + `
` + n.join(`
`), w = this.list(g);
          i[i.length - 1] = w, s = s.substring(0, s.length - d.raw.length) + w.raw, r = r.substring(0, r.length - O.raw.length) + w.raw, n = g.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: i, text: r };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim(), s = n.length > 1, r = { type: "list", raw: "", ordered: s, start: s ? +n.slice(0, -1) : "", loose: false, items: [] };
      n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
      let i = this.rules.other.listItemRegex(n), o = false;
      for (;e; ) {
        let a = false, p = "", c = "";
        if (!(t = i.exec(e)) || this.rules.block.hr.test(e))
          break;
        p = t[0], e = e.substring(p.length);
        let h = me(t[2].split(`
`, 1)[0], t[1].length), d = e.split(`
`, 1)[0], O = !h.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, c = h.trimStart()) : O ? g = t[1].length + 1 : (g = h.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, c = h.slice(g), g += t[1].length), O && this.rules.other.blankLine.test(d) && (p += d + `
`, e = e.substring(d.length + 1), a = true), !a) {
          let w = this.rules.other.nextBulletRegex(g), E = this.rules.other.hrRegex(g), ne = this.rules.other.fencesBeginRegex(g), re = this.rules.other.headingBeginRegex(g), be = this.rules.other.htmlBeginRegex(g), Re = this.rules.other.blockquoteBeginRegex(g);
          for (;e; ) {
            let N = e.split(`
`, 1)[0], D;
            if (d = N, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), D = d) : D = d.replace(this.rules.other.tabCharGlobal, "    "), ne.test(d) || re.test(d) || be.test(d) || Re.test(d) || w.test(d) || E.test(d))
              break;
            if (D.search(this.rules.other.nonSpaceChar) >= g || !d.trim())
              c += `
` + D.slice(g);
            else {
              if (O || h.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ne.test(h) || re.test(h) || E.test(h))
                break;
              c += `
` + d;
            }
            O = !d.trim(), p += N + `
`, e = e.substring(N.length + 1), h = D.slice(g);
          }
        }
        r.loose || (o ? r.loose = true : this.rules.other.doubleBlankLine.test(p) && (o = true)), r.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: false, text: c, tokens: [] }), r.raw += p;
      }
      let u = r.items.at(-1);
      if (u)
        u.raw = u.raw.trimEnd(), u.text = u.text.trimEnd();
      else
        return;
      r.raw = r.raw.trimEnd();
      for (let a of r.items)
        if (this.lexer.state.top = false, a.tokens = this.lexer.blockTokens(a.text, []), !r.loose) {
          let p = a.tokens.filter((h) => h.type === "space"), c = p.length > 0 && p.some((h) => this.rules.other.anyLine.test(h.raw));
          r.loose = c;
        }
      for (let a of r.items) {
        let p = a.tokens[0];
        if (a.task && (p?.type === "text" || p?.type === "paragraph")) {
          a.text = a.text.replace(this.rules.other.listReplaceTask, ""), p.raw = p.raw.replace(this.rules.other.listReplaceTask, ""), p.text = p.text.replace(this.rules.other.listReplaceTask, "");
          for (let h = this.lexer.inlineQueue.length - 1;h >= 0; h--)
            if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)) {
              this.lexer.inlineQueue[h].src = this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          let c = this.rules.other.listTaskCheckbox.exec(a.raw);
          if (c) {
            let h = { type: "checkbox", raw: c[0] + " ", checked: c[0] !== "[ ]" };
            a.checked = h.checked, r.loose ? a.tokens[0] && ["paragraph", "text"].includes(a.tokens[0].type) && "tokens" in a.tokens[0] && a.tokens[0].tokens ? (a.tokens[0].raw = h.raw + a.tokens[0].raw, a.tokens[0].text = h.raw + a.tokens[0].text, a.tokens[0].tokens.unshift(h)) : a.tokens.unshift({ type: "paragraph", raw: h.raw, text: h.raw, tokens: [h] }) : a.tokens.unshift(h);
          }
        } else
          a.task && (a.task = false);
      }
      if (r.loose)
        for (let a of r.items) {
          a.loose = true;
          for (let p of a.tokens)
            p.type === "text" && (p.type = "paragraph");
        }
      return r;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) {
      let n = te(t[0]);
      return { type: "html", block: true, raw: n, pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: n };
    }
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: n, raw: $(t[0], `
`), href: s, title: r };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2]))
      return;
    let n = ee(t[1]), s = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: $(t[0], `
`), header: [], align: [], rows: [] };
    if (n.length === s.length) {
      for (let o of s)
        this.rules.other.tableAlignRight.test(o) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? i.align.push("left") : i.align.push(null);
      for (let o = 0;o < n.length; o++)
        i.header.push({ text: n[o], tokens: this.lexer.inline(n[o]), header: true, align: i.align[o] });
      for (let o of r)
        i.rows.push(ee(o, i.header.length).map((u, a) => ({ text: u, tokens: this.lexer.inline(u), header: false, align: i.align[a] })));
      return i;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) {
      let n = t[1].trim();
      return { type: "heading", raw: $(t[0], `
`), depth: t[2].charAt(0) === "=" ? 1 : 2, text: n, tokens: this.lexer.inline(n) };
    }
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t)
      return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t)
      return { type: "escape", raw: t[0], text: t[1] };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
  }
  link(e) {
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n))
          return;
        let i = $(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0)
          return;
      } else {
        let i = fe(t[2], "()");
        if (i === -2)
          return;
        if (i > -1) {
          let u = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + i;
          t[2] = t[2].substring(0, i), t[0] = t[0].substring(0, u).trim(), t[3] = "";
        }
      }
      let s = t[2], r = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(s);
        i && (s = i[1], r = i[3]);
      } else
        r = t[3] ? t[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), xe(t, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let s = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = t[s.toLowerCase()];
      if (!r) {
        let i = n[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return xe(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(e);
    if (!s || !s[1] && !s[2] && !s[3] && !s[4] || s[4] && n.match(this.rules.other.unicodeAlphaNumeric))
      return;
    if (!(s[1] || s[3] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let i = [...s[0]].length - 1, o, u, a = i, p = 0, c = s[0][0], h = n === c, d = c === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (d.lastIndex = 0, t = t.slice(-1 * e.length + i);(s = d.exec(t)) !== null; ) {
        if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o)
          continue;
        if (u = [...o].length, s[3] || s[4]) {
          a += u;
          continue;
        } else if (s[5] || s[6]) {
          if (i % 3 && !((i + u) % 3)) {
            p += u;
            continue;
          }
          if (h)
            break;
        }
        if (a -= u, a > 0)
          continue;
        u = Math.min(u, u + a + p);
        let O = [...s[0]][0].length, g = e.slice(0, i + s.index + O + u);
        if (Math.min(i, u) % 2) {
          let E = g.slice(1, -1);
          return { type: "em", raw: g, text: E, tokens: this.lexer.inlineTokens(E) };
        }
        let w = g.slice(2, -2);
        return { type: "strong", raw: g, text: w, tokens: this.lexer.inlineTokens(w) };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return s && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t)
      return { type: "br", raw: t[0] };
  }
  del(e, t, n = "") {
    let s = this.rules.inline.delLDelim.exec(e);
    if (!s)
      return;
    if (!(s[1] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let i = [...s[0]].length - 1, o, u, a = i, p = this.rules.inline.delRDelim;
      for (p.lastIndex = 0, t = t.slice(-1 * e.length + i);(s = p.exec(t)) !== null; ) {
        if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o || (u = [...o].length, u !== i))
          continue;
        if (s[3] || s[4]) {
          a += u;
          continue;
        }
        if (a -= u, a > 0)
          continue;
        u = Math.min(u, u + a);
        let c = [...s[0]][0].length, h = e.slice(0, i + s.index + c + u), d = h.slice(i, -i);
        return { type: "del", raw: h, text: d, tokens: this.lexer.inlineTokens(d) };
      }
    }
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, s;
      return t[2] === "@" ? (n = t[1], s = "mailto:" + n) : (n = t[1], s = n), { type: "link", raw: t[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(e) {
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let n, s;
      if (t[2] === "@")
        n = t[0], s = "mailto:" + n;
      else {
        let r;
        do
          r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
        while (r !== t[0]);
        n = t[0], t[1] === "www." ? s = "http://" + t[0] : s = t[0];
      }
      return { type: "link", raw: t[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: t[0], text: t[0], escaped: n };
    }
  }
};
var x = class l {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = Object.create(null), this.options = e || R, this.options.tokenizer = this.options.tokenizer || new y, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, linkEmitted: false, top: true };
    let t = { other: m, block: H.normal, inline: B.normal };
    this.options.pedantic ? (t.block = H.pedantic, t.inline = B.pedantic) : this.options.gfm && (t.block = H.gfm, this.options.breaks ? t.inline = B.breaks : t.inline = B.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: H, inline: B };
  }
  static lex(e, t) {
    return new l(t).lex(e);
  }
  static lexInline(e, t) {
    return new l(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0;t < this.inlineQueue.length; t++) {
      let n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = false) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, ""));
    let s = 1 / 0;
    for (;e; ) {
      if (e.length < s)
        s = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      let r;
      if (this.options.extensions?.block?.some((o) => (r = o.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false))
        continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        r.raw.length === 1 && o !== undefined ? o.raw += `
` : t.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.at(-1).src = o.text) : t.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.list(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.html(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
        continue;
      }
      if (r = this.tokenizer.table(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let o = 1 / 0, u = e.slice(1), a;
        this.options.extensions.startBlock.forEach((p) => {
          a = p.call({ lexer: this }, u), typeof a == "number" && a >= 0 && (o = Math.min(o, a));
        }), o < 1 / 0 && o >= 0 && (i = e.substring(0, o + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(i))) {
        let o = t.at(-1);
        n && o?.type === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(r);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return this.state.top = true, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  linkInText(e) {
    if (!e.includes("["))
      return false;
    let t = this.tokenizer.rules.inline.link;
    for (let n of e.matchAll(this.tokenizer.rules.inline.blockSkip))
      if (t.test(n[0]) && e.charAt(n.index - 1) !== "!")
        return true;
    for (let n of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
      let s = n[0], r = s.lastIndexOf("[");
      if (!(s.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, s.slice(r + 1, -1))) && !(r > 1 && this.linkInText(s.slice(1, r - 1))))
        return true;
    }
    return false;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let n = e;
    if (this.tokens.links && e.includes("[")) {
      let o = this.tokenizer.rules.inline.reflinkSearch, u = (a) => {
        let p = a.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, a.slice(p + 1, -1)))
          return a;
        if (p > 1 && a.charAt(0) !== "!") {
          let c = a.slice(1, p - 1);
          if (this.linkInText(c))
            return "[" + c.replace(o, u) + "][" + "a".repeat(a.length - p - 2) + "]";
        }
        return "[" + "a".repeat(a.length - 2) + "]";
      };
      n = n.replace(o, u);
    }
    n = n.replace(this.tokenizer.rules.inline.anyPunctuation, (o) => "+".repeat(o.length)), n = n.replace(this.tokenizer.rules.inline.blockSkip, (o, u, a) => {
      let p = a ? a.length : 0;
      return o.slice(0, p) + "[" + "a".repeat(o.length - p - 2) + "]";
    }), n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let s = false, r = "", i = 1 / 0;
    for (;e; ) {
      if (e.length < i)
        i = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      s || (r = ""), s = false;
      let o;
      if (this.options.extensions?.inline?.some((a) => (o = a.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), true) : false))
        continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let a = t.at(-1);
        o.type === "text" && a?.type === "text" ? (a.raw += o.raw, a.text += o.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, n, r)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e, n, r)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      let u = e;
      if (this.options.extensions?.startInline) {
        let a = 1 / 0, p = e.slice(1), c;
        this.options.extensions.startInline.forEach((h) => {
          c = h.call({ lexer: this }, p), typeof c == "number" && c >= 0 && (a = Math.min(a, c));
        }), a < 1 / 0 && a >= 0 && (u = e.substring(0, a + 1));
      }
      if (o = this.tokenizer.inlineText(u)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (r = o.raw.slice(-1)), s = true;
        let a = t.at(-1);
        a?.type === "text" ? (a.raw += o.raw, a.text += o.text) : t.push(o);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return t;
  }
  infiniteLoopError(e) {
    let t = "Infinite loop on byte: " + e;
    if (this.options.silent)
      console.error(t);
    else
      throw new Error(t);
  }
};
var P = class {
  options;
  parser;
  constructor(e) {
    this.options = e || R;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let s = (t || "").match(m.notSpaceStart)?.[0], r = e.replace(m.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + T(s) + '">' + (n ? r : T(r, true)) + `</code></pre>
` : "<pre><code>" + (n ? r : T(r, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  def(e) {
    return "";
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    let { ordered: t, start: n } = e, s = "";
    for (let o = 0;o < e.items.length; o++) {
      let u = e.items[o];
      s += this.listitem(u);
    }
    let r = t ? "ol" : "ul", i = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + i + `>
` + s + "</" + r + `>
`;
  }
  listitem(e) {
    return `<li>${this.parser.parse(e.tokens)}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let r = 0;r < e.header.length; r++)
      n += this.tablecell(e.header[r]);
    t += this.tablerow({ text: n });
    let s = "";
    for (let r = 0;r < e.rows.length; r++) {
      let i = e.rows[r];
      n = "";
      for (let o = 0;o < i.length; o++)
        n += this.tablecell(i[o]);
      s += this.tablerow({ text: n });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${T(e, true)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let s = this.parser.parseInline(n), r = Y(e);
    if (r === null)
      return s;
    e = r;
    let i = '<a href="' + e + '"';
    return t && (i += ' title="' + T(t) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: e, title: t, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    let r = Y(e);
    if (r === null)
      return T(n);
    e = r;
    let i = `<img src="${e}" alt="${T(n)}"`;
    return t && (i += ` title="${T(t)}"`), i += ">", i;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : ("escaped" in e) && e.escaped ? e.text : T(e.text);
  }
};
var L = class {
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
  checkbox({ raw: e }) {
    return e;
  }
};
var b = class l2 {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || R, this.options.renderer = this.options.renderer || new P, this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new L;
  }
  static parse(e, t) {
    return new l2(t).parse(e);
  }
  static parseInline(e, t) {
    return new l2(t).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let t = "";
    for (let n = 0;n < e.length; n++) {
      let s = e[n];
      if (this.options.extensions?.renderers?.[s.type]) {
        let i = s, o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "checkbox", "html", "def", "paragraph", "text"].includes(i.type)) {
          t += o || "";
          continue;
        }
      }
      let r = s;
      switch (r.type) {
        case "space": {
          t += this.renderer.space(r);
          break;
        }
        case "hr": {
          t += this.renderer.hr(r);
          break;
        }
        case "heading": {
          t += this.renderer.heading(r);
          break;
        }
        case "code": {
          t += this.renderer.code(r);
          break;
        }
        case "table": {
          t += this.renderer.table(r);
          break;
        }
        case "blockquote": {
          t += this.renderer.blockquote(r);
          break;
        }
        case "list": {
          t += this.renderer.list(r);
          break;
        }
        case "checkbox": {
          t += this.renderer.checkbox(r);
          break;
        }
        case "html": {
          t += this.renderer.html(r);
          break;
        }
        case "def": {
          t += this.renderer.def(r);
          break;
        }
        case "paragraph": {
          t += this.renderer.paragraph(r);
          break;
        }
        case "text": {
          t += this.renderer.text(r);
          break;
        }
        default: {
          let i = 'Token with "' + r.type + '" type was not found.';
          if (this.options.silent)
            return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return t;
  }
  parseInline(e, t = this.renderer) {
    this.renderer.parser = this;
    let n = "";
    for (let s = 0;s < e.length; s++) {
      let r = e[s];
      if (this.options.extensions?.renderers?.[r.type]) {
        let o = this.options.extensions.renderers[r.type].call({ parser: this }, r);
        if (o !== false || !["escape", "html", "link", "image", "checkbox", "strong", "em", "codespan", "br", "del", "text"].includes(r.type)) {
          n += o || "";
          continue;
        }
      }
      let i = r;
      switch (i.type) {
        case "escape": {
          n += t.text(i);
          break;
        }
        case "html": {
          n += t.html(i);
          break;
        }
        case "link": {
          n += t.link(i);
          break;
        }
        case "image": {
          n += t.image(i);
          break;
        }
        case "checkbox": {
          n += t.checkbox(i);
          break;
        }
        case "strong": {
          n += t.strong(i);
          break;
        }
        case "em": {
          n += t.em(i);
          break;
        }
        case "codespan": {
          n += t.codespan(i);
          break;
        }
        case "br": {
          n += t.br(i);
          break;
        }
        case "del": {
          n += t.del(i);
          break;
        }
        case "text": {
          n += t.text(i);
          break;
        }
        default: {
          let o = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent)
            return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
};
var S = class {
  options;
  block;
  constructor(e) {
    this.options = e || R;
  }
  static passThroughHooks = new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(e) {
    return e;
  }
  postprocess(e) {
    return e;
  }
  processAllTokens(e) {
    return e;
  }
  emStrongMask(e) {
    return e;
  }
  provideLexer(e = this.block) {
    return e ? x.lex : x.lexInline;
  }
  provideParser(e = this.block) {
    return e ? b.parse : b.parseInline;
  }
};
var Z = class {
  defaults = A();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = b;
  Renderer = P;
  TextRenderer = L;
  Lexer = x;
  Tokenizer = y;
  Hooks = S;
  constructor(...e) {
    this.use(...e);
  }
  walkTokens(e, t) {
    let n = [];
    for (let s of e)
      switch (n = n.concat(t.call(this, s)), s.type) {
        case "table": {
          let r = s;
          for (let i of r.header)
            n = n.concat(this.walkTokens(i.tokens, t));
          for (let i of r.rows)
            for (let o of i)
              n = n.concat(this.walkTokens(o.tokens, t));
          break;
        }
        case "list": {
          let r = s;
          n = n.concat(this.walkTokens(r.items, t));
          break;
        }
        default: {
          let r = s;
          this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((i) => {
            let o = r[i].flat(1 / 0);
            n = n.concat(this.walkTokens(o, t));
          }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, t)));
        }
      }
    return n;
  }
  use(...e) {
    let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      let s = { ...n };
      if (s.async = this.defaults.async || s.async || false, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name)
          throw new Error("extension name required");
        if ("renderer" in r) {
          let i = t.renderers[r.name];
          i ? t.renderers[r.name] = function(...o) {
            let u = r.renderer.apply(this, o);
            return u === false && (u = i.apply(this, o)), u;
          } : t.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          let i = t[r.level];
          i ? i.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
      }), s.extensions = t), n.renderer) {
        let r = this.defaults.renderer || new P(this.defaults);
        for (let i in n.renderer) {
          if (!(i in r))
            throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i))
            continue;
          let o = i, u = n.renderer[o], a = r[o];
          r[o] = (...p) => {
            let c = u.apply(r, p);
            return c === false && (c = a.apply(r, p)), c || "";
          };
        }
        s.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new y(this.defaults);
        for (let i in n.tokenizer) {
          if (!(i in r))
            throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i))
            continue;
          let o = i, u = n.tokenizer[o], a = r[o];
          r[o] = (...p) => {
            let c = u.apply(r, p);
            return c === false && (c = a.apply(r, p)), c;
          };
        }
        s.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new S;
        for (let i in n.hooks) {
          if (!(i in r))
            throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i))
            continue;
          let o = i, u = n.hooks[o], a = r[o];
          S.passThroughHooks.has(i) ? r[o] = (p) => {
            if (this.defaults.async && S.passThroughHooksRespectAsync.has(i))
              return (async () => {
                let h = await u.call(r, p);
                return a.call(r, h);
              })();
            let c = u.call(r, p);
            return a.call(r, c);
          } : r[o] = (...p) => {
            if (this.defaults.async)
              return (async () => {
                let h = await u.apply(r, p);
                return h === false && (h = await a.apply(r, p)), h;
              })();
            let c = u.apply(r, p);
            return c === false && (c = a.apply(r, p)), c;
          };
        }
        s.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, i = n.walkTokens;
        s.walkTokens = function(o) {
          let u = [];
          return u.push(i.call(this, o)), r && (u = u.concat(r.call(this, o))), u;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return x.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return b.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (n, s) => {
      let r = { ...s }, i = { ...this.defaults, ...r }, o = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === true && r.async === false)
        return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null)
        return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string")
        return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async)
        return (async () => {
          let u = i.hooks ? await i.hooks.preprocess(n) : n, p = await (i.hooks ? await i.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(u, i), c = i.hooks ? await i.hooks.processAllTokens(p) : p;
          i.walkTokens && await Promise.all(this.walkTokens(c, i.walkTokens));
          let d = await (i.hooks ? await i.hooks.provideParser(e) : e ? b.parse : b.parseInline)(c, i);
          return i.hooks ? await i.hooks.postprocess(d) : d;
        })().catch(o);
      try {
        i.hooks && (n = i.hooks.preprocess(n));
        let a = (i.hooks ? i.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(n, i);
        i.hooks && (a = i.hooks.processAllTokens(a)), i.walkTokens && this.walkTokens(a, i.walkTokens);
        let c = (i.hooks ? i.hooks.provideParser(e) : e ? b.parse : b.parseInline)(a, i);
        return i.hooks && (c = i.hooks.postprocess(c)), c;
      } catch (u) {
        return o(u);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let s = "<p>An error occurred:</p><pre>" + T(n.message + "", true) + "</pre>";
        return t ? Promise.resolve(s) : s;
      }
      if (t)
        return Promise.reject(n);
      throw n;
    };
  }
};
var M = new Z;
function f(l3, e) {
  return M.parse(l3, e);
}
f.options = f.setOptions = function(l3) {
  return M.setOptions(l3), f.defaults = M.defaults, j(f.defaults), f;
};
f.getDefaults = A;
f.defaults = R;
function dt(...l3) {
  return M.use(...l3), f.defaults = M.defaults, j(f.defaults), f;
}
f.use = dt;
f.walkTokens = function(l3, e) {
  return M.walkTokens(l3, e);
};
f.parseInline = M.parseInline;
f.Parser = b;
f.parser = b.parse;
f.Renderer = P;
f.TextRenderer = L;
f.Lexer = x;
f.lexer = x.lex;
f.Tokenizer = y;
f.Hooks = S;
f.parse = f;
var nn = f.options;
var rn = f.setOptions;
var sn = f.walkTokens;
var on = f.parseInline;
var ln = b.parse;
var un = x.lex;

// make-pdf/src/smartypants.ts
var CODE_ZONE_RE = /<(pre|code|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
var TAG_RE = /<[^>]+>/g;
var URL_RE = /\bhttps?:\/\/[^\s\u0000]+/g;
function smartypants(html) {
  const preserved = [];
  const PLACEHOLDER = (i) => `\x00SMARTPANTS_PRESERVED_${i}\x00`;
  const carve = (source, pattern) => {
    return source.replace(pattern, (match) => {
      const idx = preserved.length;
      preserved.push(match);
      return PLACEHOLDER(idx);
    });
  };
  let s = html.replace(/\u0000/g, "");
  s = carve(s, CODE_ZONE_RE);
  s = carve(s, TAG_RE);
  s = carve(s, URL_RE);
  s = transformText(s);
  s = s.replace(/\u0000SMARTPANTS_PRESERVED_(\d+)\u0000/g, (_2, idx) => {
    return preserved[parseInt(idx, 10)] ?? "";
  });
  return s;
}
function transformText(text) {
  let s = text;
  s = s.replace(/\.\s?\.\s?\./g, "…");
  s = s.replace(/(\w|\s)--(\w|\s)/g, "$1—$2");
  s = s.replace(/^--\s/gm, "— ");
  s = s.replace(/\s--$/gm, " —");
  s = s.replace(/(\w)'(\w)/g, "$1’$2");
  s = s.replace(/(^|[\s\(\[\{\-\uff1a\uff08\u3010\u300c\u300e\u3008\u300a])"/g, "$1“");
  s = s.replace(/"/g, "”");
  s = s.replace(/(^|[\s\(\[\{\-\uff1a\uff08\u3010\u300c\u300e\u3008\u300a])'/g, "$1‘");
  s = s.replace(/'/g, "’");
  return s;
}

// make-pdf/src/print-css.ts
var SANS_STACK = `Helvetica, "Liberation Sans", Arial`;
var CJK_STACK = `"PingFang SC", "Heiti SC", "Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP"`;
var EMOJI_FAMILIES = `"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"`;
function printCss(opts = {}) {
  const size = opts.pageSize ?? "letter";
  const margin = opts.margins ?? "1in";
  const hasWatermark = typeof opts.watermark === "string" && opts.watermark.length > 0;
  return [
    pageRules(size, margin, opts),
    rootTypography(),
    coverRules(opts.cover === true),
    tocRules(opts.toc === true),
    chapterRules(opts.noChapterBreaks === true),
    blockRules(),
    inlineRules(),
    codeRules(),
    quoteRules(),
    figureRules(),
    tableRules(),
    listRules(),
    footnoteRules(),
    hasWatermark ? watermarkRules() : "",
    breakAvoidRules()
  ].filter(Boolean).join(`

`);
}
function pageRules(size, margin, opts) {
  const runningHeader = escapeCssString(opts.runningHeader ?? "");
  const showConfidential = opts.confidential !== false;
  const showPageNumbers = opts.pageNumbers !== false;
  return [
    `@page {`,
    `  size: ${size};`,
    `  margin: ${margin};`,
    runningHeader ? `  @top-center { content: "${runningHeader}"; font-family: ${SANS_STACK}, ${EMOJI_FAMILIES}, sans-serif; font-size: 9pt; color: #666; }` : ``,
    showPageNumbers ? `  @bottom-center { content: counter(page) " of " counter(pages); font-family: ${SANS_STACK}, sans-serif; font-size: 9pt; color: #666; }` : ``,
    showConfidential ? `  @bottom-right { content: "CONFIDENTIAL"; font-family: ${SANS_STACK}, sans-serif; font-size: 8pt; color: #aaa; letter-spacing: 0.05em; }` : ``,
    `}`,
    ``,
    `@page :first {`,
    `  @top-center { content: none; }`,
    `  @bottom-center { content: none; }`,
    `  @bottom-right { content: none; }`,
    `}`,
    ``,
    `@page wide {`,
    `  size: ${size} landscape;`,
    `  margin: ${margin};`,
    `}`,
    `.page-wide {`,
    `  page: wide;`,
    `  text-align: center;`,
    `}`,
    `.page-wide img, .page-wide svg { width: 100%; height: auto; max-width: none; }`,
    `.page-wide figure.diagram > svg { max-width: none; }`
  ].filter((line) => line !== "").join(`
`);
}
function rootTypography() {
  return [
    `html { lang: en; }`,
    `img { max-width: 100%; height: auto; }`,
    `body {`,
    `  font-family: ${SANS_STACK}, ${CJK_STACK}, ${EMOJI_FAMILIES}, sans-serif;`,
    `  font-size: 12pt;`,
    `  line-height: 1.5;`,
    `  color: #111;`,
    `  background: white;`,
    `  hyphens: manual;`,
    `  font-variant-ligatures: common-ligatures;`,
    `  font-kerning: normal;`,
    `  text-rendering: geometricPrecision;`,
    `  margin: 0;`,
    `  padding: 0;`,
    `}`
  ].join(`
`);
}
function coverRules(enabled) {
  if (!enabled)
    return "";
  return [
    `.cover {`,
    `  page: first;`,
    `  page-break-after: always;`,
    `  break-after: page;`,
    `  text-align: left;`,
    `  padding-top: 1.4in;`,
    `}`,
    `.cover .eyebrow {`,
    `  font-size: 11pt;`,
    `  letter-spacing: 0.2em;`,
    `  text-transform: uppercase;`,
    `  color: #666;`,
    `  margin: 0 0 36pt;`,
    `}`,
    `.cover h1.cover-title {`,
    `  font-size: 56pt;`,
    `  line-height: 1.08;`,
    `  font-weight: 700;`,
    `  letter-spacing: -0.02em;`,
    `  margin: 0 0 24pt;`,
    `  max-width: 6in;`,
    `  text-align: left;`,
    `}`,
    `.cover .cover-subtitle {`,
    `  font-size: 18pt;`,
    `  line-height: 1.35;`,
    `  font-weight: 400;`,
    `  color: #333;`,
    `  margin: 0 0 36pt;`,
    `  max-width: 5.5in;`,
    `  text-align: left;`,
    `}`,
    `.cover hr.rule {`,
    `  width: 2.5in;`,
    `  height: 0;`,
    `  border: 0;`,
    `  border-top: 1.5px solid #111;`,
    `  margin: 0 0 24pt 0;`,
    `}`,
    `.cover .cover-meta { font-size: 13pt; line-height: 1.6; color: #333; text-align: left; }`,
    `.cover .cover-meta strong { font-weight: 700; }`
  ].join(`
`);
}
function tocRules(enabled) {
  if (!enabled)
    return "";
  return [
    `.toc { page-break-after: always; break-after: page; }`,
    `.toc h2 {`,
    `  font-size: 16pt;`,
    `  text-transform: uppercase;`,
    `  letter-spacing: 0.15em;`,
    `  color: #444;`,
    `  font-weight: 700;`,
    `  margin: 0 0 0.4in;`,
    `}`,
    `.toc ol {`,
    `  list-style: none;`,
    `  padding: 0;`,
    `  margin: 0;`,
    `}`,
    `.toc li {`,
    `  display: flex;`,
    `  align-items: baseline;`,
    `  gap: 0.25in;`,
    `  font-size: 12pt;`,
    `  line-height: 1.7;`,
    `  padding: 3pt 0;`,
    `}`,
    `.toc li .toc-title { flex: 0 0 auto; }`,
    `.toc li .toc-dots { flex: 1 1 auto; border-bottom: 1px dotted #aaa; margin: 0 6pt; transform: translateY(-4pt); }`,
    `.toc li .toc-page { flex: 0 0 auto; color: #666; font-variant-numeric: tabular-nums; }`,
    `.toc li.level-2 { padding-left: 0.35in; font-size: 11pt; }`,
    `.toc li a { color: inherit; text-decoration: none; }`
  ].join(`
`);
}
function chapterRules(noChapterBreaks) {
  const breakRule = noChapterBreaks ? `/* chapter breaks disabled */` : [
    `.chapter { break-before: page; page-break-before: always; }`,
    `.chapter:first-of-type { break-before: auto; page-break-before: auto; }`
  ].join(`
`);
  return [
    breakRule,
    `h1 {`,
    `  font-size: 26pt;`,
    `  line-height: 1.2;`,
    `  font-weight: 700;`,
    `  letter-spacing: -0.01em;`,
    `  margin: 0 0 0.25in;`,
    `  break-after: avoid;`,
    `  page-break-after: avoid;`,
    `}`,
    `h2 { font-size: 18pt; line-height: 1.3; font-weight: 700; margin: 26pt 0 8pt; break-after: avoid; page-break-after: avoid; }`,
    `h3 { font-size: 13.5pt; line-height: 1.4; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #333; margin: 20pt 0 5pt; break-after: avoid; page-break-after: avoid; }`,
    `h4 { font-size: 12pt; font-weight: 700; margin: 14pt 0 5pt; break-after: avoid; page-break-after: avoid; }`
  ].join(`
`);
}
function blockRules() {
  return [
    `p {`,
    `  margin: 0 0 12pt;`,
    `  text-align: left;`,
    `  widows: 3;`,
    `  orphans: 3;`,
    `}`,
    `p:first-child { margin-top: 0; }`,
    `p.lead { font-size: 14pt; line-height: 1.45; color: #222; margin: 0 0 18pt; }`
  ].join(`
`);
}
function inlineRules() {
  return [
    `a {`,
    `  color: #0055cc;`,
    `  text-decoration: underline;`,
    `  text-decoration-thickness: 0.5pt;`,
    `  text-underline-offset: 1.5pt;`,
    `}`,
    `strong { font-weight: 700; }`,
    `em { font-style: italic; }`
  ].join(`
`);
}
function codeRules() {
  return [
    `code {`,
    `  font-family: "SF Mono", Menlo, Consolas, monospace;`,
    `  font-size: 10.5pt;`,
    `  background: #f4f4f4;`,
    `  padding: 1pt 3pt;`,
    `  border-radius: 2pt;`,
    `  border: 0.5pt solid #e4e4e4;`,
    `}`,
    `pre {`,
    `  font-family: "SF Mono", Menlo, Consolas, monospace;`,
    `  font-size: 10pt;`,
    `  line-height: 1.4;`,
    `  background: #f7f7f5;`,
    `  padding: 10pt 12pt;`,
    `  border: 0.5pt solid #e0e0e0;`,
    `  border-radius: 3pt;`,
    `  margin: 12pt 0;`,
    `  overflow: hidden;`,
    `  white-space: pre-wrap;`,
    `}`,
    `pre code { background: none; border: 0; padding: 0; font-size: inherit; }`,
    `.hljs-keyword { color: #8b0000; font-weight: 500; }`,
    `.hljs-string { color: #0d6608; }`,
    `.hljs-comment { color: #888; font-style: italic; }`,
    `.hljs-function, .hljs-title { color: #0044aa; }`,
    `.hljs-number { color: #a64d00; }`
  ].join(`
`);
}
function quoteRules() {
  return [
    `blockquote {`,
    `  margin: 12pt 0;`,
    `  padding: 0 0 0 18pt;`,
    `  border-left: 2pt solid #111;`,
    `  color: #333;`,
    `  font-size: 12pt;`,
    `  line-height: 1.5;`,
    `}`,
    `blockquote p { margin-bottom: 6pt; text-align: left; }`,
    `blockquote cite { display: block; margin-top: 6pt; font-style: normal; font-size: 10pt; color: #666; letter-spacing: 0.02em; }`,
    `blockquote cite::before { content: "— "; }`
  ].join(`
`);
}
function figureRules() {
  return [
    `figure { margin: 12pt 0; }`,
    `figure img { display: block; max-width: 100%; height: auto; }`,
    `figcaption { font-size: 10pt; color: #666; margin-top: 6pt; font-style: italic; }`,
    `figure.diagram { break-inside: avoid; text-align: center; }`,
    `figure.diagram > svg { max-width: 100%; height: auto; }`,
    `figure.diagram .diagram-caption { text-align: center; }`,
    `figure.diagram-error { border: 1.5pt solid #b00020; padding: 8pt 10pt; text-align: left; }`,
    `figure.diagram-error .diagram-error-title { font-weight: 700; color: #b00020; font-style: normal; margin: 0 0 6pt; }`,
    `figure.diagram-error .diagram-error-detail { font-size: 8.5pt; white-space: pre-wrap; margin: 0; }`,
    `.image-missing { display: inline-block; border: 1pt dashed #b00020; color: #b00020; padding: 4pt 8pt; font-size: 9pt; }`
  ].join(`
`);
}
function tableRules() {
  return [
    `table { width: 100%; border-collapse: collapse; margin: 12pt 0; font-size: 11pt; }`,
    `th, td { border-bottom: 0.5pt solid #ccc; padding: 5pt 8pt; text-align: left; vertical-align: top; }`,
    `th { font-weight: 700; border-bottom: 1pt solid #111; background: transparent; }`
  ].join(`
`);
}
function listRules() {
  return [
    `ul, ol { margin: 0 0 12pt 0; padding-left: 20pt; }`,
    `li { margin-bottom: 3pt; line-height: 1.45; }`,
    `li > ul, li > ol { margin-top: 3pt; margin-bottom: 0; }`
  ].join(`
`);
}
function footnoteRules() {
  return [
    `.footnote-ref { font-size: 0.75em; vertical-align: super; line-height: 0; text-decoration: none; color: #0055cc; }`,
    `.footnotes { margin-top: 24pt; padding-top: 12pt; border-top: 0.5pt solid #ccc; font-size: 10pt; line-height: 1.4; }`,
    `.footnotes ol { padding-left: 18pt; }`
  ].join(`
`);
}
function watermarkRules() {
  return [
    `.watermark {`,
    `  position: fixed;`,
    `  top: 50%;`,
    `  left: 50%;`,
    `  transform: translate(-50%, -50%) rotate(-30deg);`,
    `  font-size: 140pt;`,
    `  font-weight: 700;`,
    `  color: rgba(200, 0, 0, 0.06);`,
    `  letter-spacing: 0.08em;`,
    `  pointer-events: none;`,
    `  z-index: 9999;`,
    `  user-select: none;`,
    `  white-space: nowrap;`,
    `}`
  ].join(`
`);
}
function breakAvoidRules() {
  return `blockquote, pre, code, table, figure, li, .keep-together { break-inside: avoid; page-break-inside: avoid; }`;
}
function escapeCssString(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}

// make-pdf/src/image-policy.ts
var IMG_WITH_SUFFIX_RE = /(<img\b[^>]*>)\s*\{([^{}<>\n]{1,120})\}/gi;
function applyImageDirectives(html) {
  return html.replace(IMG_WITH_SUFFIX_RE, (full, imgTag, body) => {
    const parsed = parseDirectives(body);
    if (!parsed)
      return full;
    let tag = imgTag;
    if (parsed.width)
      tag = addAttr(tag, "data-gstack-width", parsed.width);
    if (parsed.page)
      tag = addAttr(tag, "data-gstack-page", parsed.page);
    return tag;
  });
}
function parseDirectives(body) {
  let width;
  let page;
  let recognized = false;
  for (const part of body.trim().split(/\s+/)) {
    const m2 = part.match(/^(width|page)=(.+)$/i);
    if (!m2)
      return null;
    const key = m2[1].toLowerCase();
    const value = m2[2].toLowerCase();
    if (key === "width" && /^(full|\d{1,3}%|[0-9.]+(in|cm|mm|pt|px))$/.test(value)) {
      width = value;
      recognized = true;
    } else if (key === "page" && /^(landscape|portrait)$/.test(value)) {
      page = value;
      recognized = true;
    } else {
      return null;
    }
  }
  return recognized ? { width, page } : null;
}
function addAttr(imgTag, name, value) {
  return imgTag.replace(/^<img\b/i, `<img ${name}="${value}"`);
}

// make-pdf/src/render.ts
function render(opts) {
  const rawHtml = f.parse(stripFrontmatter(opts.markdown), { async: false });
  const directedHtml = applyImageDirectives(rawHtml);
  const cleanHtml = sanitizeUntrustedHtml(directedHtml);
  const decoded = decodeTypographicEntities(cleanHtml);
  const typographicHtml = smartypants(decoded);
  const derivedTitle = opts.title ?? extractFirstHeading(typographicHtml) ?? "Document";
  const derivedAuthor = opts.author ?? "";
  const derivedDate = opts.date ?? formatToday();
  const showPageNumbers = opts.pageNumbers !== false && !opts.footerTemplate;
  const cssOptions = {
    cover: opts.cover,
    toc: opts.toc,
    noChapterBreaks: opts.noChapterBreaks,
    watermark: opts.watermark,
    confidential: opts.confidential !== false,
    runningHeader: derivedTitle,
    pageSize: opts.pageSize,
    margins: composeMargins(opts),
    pageNumbers: showPageNumbers
  };
  const css = printCss(cssOptions);
  const coverBlock = opts.cover ? buildCoverBlock({
    title: derivedTitle,
    subtitle: opts.subtitle,
    author: derivedAuthor,
    date: derivedDate
  }) : "";
  const anchored = opts.toc ? addHeadingIds(typographicHtml) : { html: typographicHtml, ids: [] };
  const anchoredHtml = anchored.html;
  const tocBlock = opts.toc ? buildTocBlock(anchoredHtml, anchored.ids) : "";
  const chapterHtml = opts.noChapterBreaks ? `<section class="chapter">${anchoredHtml}</section>` : wrapChaptersByH1(anchoredHtml);
  const watermarkBlock = opts.watermark ? `<div class="watermark">${escapeHtml(opts.watermark)}</div>` : "";
  const fullHtml = [
    `<!doctype html>`,
    `<html lang="en">`,
    `<head>`,
    `<meta charset="utf-8">`,
    `<title>${escapeHtml(derivedTitle)}</title>`,
    derivedAuthor ? `<meta name="author" content="${escapeHtml(derivedAuthor)}">` : ``,
    `<style>`,
    css,
    `</style>`,
    `</head>`,
    `<body>`,
    watermarkBlock,
    coverBlock,
    tocBlock,
    chapterHtml,
    `</body>`,
    `</html>`
  ].filter(Boolean).join(`
`);
  return {
    html: fullHtml,
    printCss: css,
    bodyHtml: typographicHtml,
    meta: {
      title: derivedTitle,
      author: derivedAuthor,
      date: derivedDate,
      wordCount: countWords(stripTags(typographicHtml))
    }
  };
}
function decodeTypographicEntities(html) {
  return html.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&#x27;/g, "'");
}
function sanitizeUntrustedHtml(html) {
  let s = html;
  const DANGER_TAGS = [
    "script",
    "iframe",
    "object",
    "embed",
    "link",
    "meta",
    "base",
    "form",
    "applet",
    "frame",
    "frameset"
  ];
  for (const tag of DANGER_TAGS) {
    const re = new RegExp(`<${tag}\\b[\\s\\S]*?</${tag}>`, "gi");
    s = s.replace(re, "");
    const selfRe = new RegExp(`<${tag}\\b[^>]*/?>`, "gi");
    s = s.replace(selfRe, "");
  }
  s = s.replace(/<svg([^>]*)>([\s\S]*?)<\/svg>/gi, (_2, attrs, body) => {
    return `<svg${attrs}>${body.replace(/<script\b[\s\S]*?<\/script>/gi, "")}</svg>`;
  });
  s = s.replace(/\s+on[a-zA-Z]+\s*=\s*"[^"]*"/gi, "");
  s = s.replace(/\s+on[a-zA-Z]+\s*=\s*'[^']*'/gi, "");
  s = s.replace(/\s+on[a-zA-Z]+\s*=\s*[^\s>]+/gi, "");
  s = s.replace(/(\s(?:href|src|action|formaction|xlink:href)\s*=\s*)(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi, '$1"#"');
  s = s.replace(/\s+srcdoc\s*=\s*"[^"]*"/gi, "");
  s = s.replace(/\s+srcdoc\s*=\s*'[^']*'/gi, "");
  s = s.replace(/url\(\s*javascript:[^)]*\)/gi, "url(#)");
  const CSS_ESCAPE_MARKER = /\\|&#0*92(?![0-9])|&#x0*5c(?![0-9a-f])|&bsol;/i;
  const neutralizeUntrustedCss = (css) => {
    let out = css.replace(/@[-\w\\&#;]*?(?:\\|&#0*92(?![0-9]);?|&#x0*5c(?![0-9a-f]);?|&bsol;)[-\w\\&#;]*[^;{}]*(?:;|\{|$)/gi, "");
    out = out.replace(/@import\b[^;]*(;|$)/gi, "");
    out = out.replace(/[-\w\\&#;][-\w \t\\&#;]*\(\s*[^)]*(?:\)|$)/g, (m2) => CSS_ESCAPE_MARKER.test(m2) ? "url(#)" : m2);
    out = out.replace(/url\(\s*(?:&quot;|&#0?39;|&#x27;|["'])?\s*(?:https?:)?\/\/[^)]*(?:\)|$)/gi, "url(#)");
    out = out.replace(/(?:-webkit-)?image-set\(\s*[^)]*(?:\)|$)/gi, (m2) => /(?:&quot;|&#0?39;|&#x27;|["'])\s*(?:https?:)?\/\//i.test(m2) ? "url(#)" : m2);
    return out;
  };
  s = s.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (_m, open, css, close) => open + neutralizeUntrustedCss(css) + close);
  const NAMED_REFS = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    sol: "/",
    bsol: "\\",
    colon: ":",
    semi: ";",
    num: "#",
    lpar: "(",
    rpar: ")",
    commat: "@",
    grave: "`",
    Tab: "\t",
    NewLine: `
`
  };
  const refCodePoint = (n) => !Number.isFinite(n) || n <= 0 || n > 1114111 || n >= 55296 && n <= 57343 ? "�" : String.fromCodePoint(n);
  const decodeStyleAttrEntities = (v2) => v2.replace(/&(?:#[xX]([0-9a-fA-F]+);?|#(\d+);?|([a-zA-Z]+);|(amp|lt|gt|quot)(?![a-zA-Z0-9=;]))/g, (m2, hex, dec, named, legacy) => {
    if (hex !== undefined)
      return refCodePoint(parseInt(hex, 16));
    if (dec !== undefined)
      return refCodePoint(parseInt(dec, 10));
    if (named !== undefined)
      return NAMED_REFS[named] ?? m2;
    return NAMED_REFS[legacy];
  });
  s = s.replace(/(\s+style\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s"'>][^\s>]*))/gi, (_m, pre, dq, sq, uq) => {
    const raw = dq ?? sq ?? uq;
    const cleaned = neutralizeUntrustedCss(decodeStyleAttrEntities(raw));
    return `${pre}"${escapeHtml(cleaned)}"`;
  });
  const neutralizeRemoteSvgHref = (fragment) => fragment.replace(/(\s(?:xlink:)?href\s*=\s*)("([^"]*)"|'([^']*)'|[^\s>]+)/gi, (m2, pre, val, dq, sq) => {
    const raw = dq ?? sq ?? String(val);
    const decoded = decodeStyleAttrEntities(raw).replace(/[\t\n\r]/g, "");
    return /^\s*(?:https?:)?\/\//i.test(decoded) ? `${pre}"#"` : m2;
  });
  s = s.replace(/<svg\b[\s\S]*?<\/svg>/gi, neutralizeRemoteSvgHref);
  s = s.replace(/<(?:image|use|feimage)\b[^>]*>/gi, neutralizeRemoteSvgHref);
  const remoteSrcsetCandidate = /(?:^|[,\s])\s*(?:https?:)?\/\//i;
  s = s.replace(/\s+srcset\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (m2, val) => remoteSrcsetCandidate.test(String(val).replace(/^["']|["']$/g, "")) ? "" : m2);
  s = s.replace(/<(?:video|audio|source|track)\b[^>]*>/gi, (tag) => tag.replace(/(\s(?:src|poster)\s*=\s*)(?:"(?:https?:)?\/\/[^"]*"|'(?:https?:)?\/\/[^']*'|(?:https?:)?\/\/[^\s>]+)/gi, '$1"#"'));
  return s;
}
function buildCoverBlock(opts) {
  const title = escapeHtml(opts.title);
  const subtitle = opts.subtitle ? escapeHtml(opts.subtitle) : "";
  const author = opts.author ? escapeHtml(opts.author) : "";
  const date = escapeHtml(opts.date);
  return [
    `<section class="cover">`,
    `  <h1 class="cover-title">${title}</h1>`,
    subtitle ? `  <p class="cover-subtitle">${subtitle}</p>` : ``,
    `  <hr class="rule">`,
    `  <div class="cover-meta">`,
    author ? `    <div><strong>${author}</strong></div>` : ``,
    `    <div>${date}</div>`,
    `  </div>`,
    `</section>`
  ].filter(Boolean).join(`
`);
}
function buildTocBlock(html, ids = []) {
  const headings = extractHeadings(html);
  if (headings.length === 0)
    return "";
  const items = headings.map((h, i) => {
    const level = h.level >= 2 ? "level-2" : "level-1";
    const id = ids[i] ?? `toc-${i}`;
    return [
      `  <li class="${level}">`,
      `    <span class="toc-title"><a href="#${id}">${escapeHtml(h.text)}</a></span>`,
      `    <span class="toc-dots"></span>`,
      `    <span class="toc-page" data-toc-target="${id}"></span>`,
      `  </li>`
    ].join(`
`);
  }).join(`
`);
  return [
    `<section class="toc">`,
    `  <h2>Contents</h2>`,
    `  <ol>`,
    items,
    `  </ol>`,
    `</section>`
  ].join(`
`);
}
function addHeadingIds(html) {
  const ids = [];
  const out = html.replace(/<(h[1-3])([^>]*)>/gi, (full, tag, attrs) => {
    const existing = attrs.match(/\bid\s*=\s*["']([^"']*)["']/i)?.[1];
    if (existing) {
      ids.push(existing);
      return full;
    }
    const id = `toc-${ids.length}`;
    ids.push(id);
    return `<${tag}${attrs} id="${id}">`;
  });
  return { html: out, ids };
}
function extractHeadings(html) {
  const re = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;
  const headings = [];
  let match;
  while ((match = re.exec(html)) !== null) {
    const level = parseInt(match[1].slice(1), 10);
    const text = decodeTextEntities(stripTags(match[2]).trim());
    if (text)
      headings.push({ level, text });
  }
  return headings;
}
function wrapChaptersByH1(html) {
  const h1Re = /<h1\b[^>]*>/gi;
  const matches = [];
  let m2;
  while ((m2 = h1Re.exec(html)) !== null) {
    matches.push(m2.index);
  }
  if (matches.length === 0) {
    return `<section class="chapter">${html}</section>`;
  }
  const chunks = [];
  const preamble = html.slice(0, matches[0]);
  let carriedPreamble = "";
  if (preamble.trim().length > 0) {
    if (stripNonRendering(preamble).trim().length > 0) {
      chunks.push(`<section class="chapter">${preamble}</section>`);
    } else {
      carriedPreamble = preamble;
    }
  }
  for (let i = 0;i < matches.length; i++) {
    const start = matches[i];
    const end = i + 1 < matches.length ? matches[i + 1] : html.length;
    const body = i === 0 ? carriedPreamble + html.slice(start, end) : html.slice(start, end);
    chunks.push(`<section class="chapter">${body}</section>`);
  }
  return chunks.join(`
`);
}
function stripFrontmatter(md) {
  return md.replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, "");
}
function stripNonRendering(html) {
  return html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
}
function extractFirstHeading(html) {
  const m2 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return m2 ? decodeTextEntities(stripTags(m2[1]).trim()) : null;
}
function decodeTextEntities(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&#x27;/g, "'").replace(/&#(\d+);/g, (_2, n) => String.fromCodePoint(parseInt(n, 10))).replace(/&#x([0-9a-fA-F]+);/g, (_2, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, "&");
}
function composeMargins(opts) {
  const base = opts.margins ?? "1in";
  if (!opts.marginTop && !opts.marginRight && !opts.marginBottom && !opts.marginLeft) {
    return opts.margins;
  }
  return [
    opts.marginTop ?? base,
    opts.marginRight ?? base,
    opts.marginBottom ?? base,
    opts.marginLeft ?? base
  ].join(" ");
}
function stripTags(html) {
  return html.replace(/<[^>]+>/g, "");
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function countWords(text) {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}
function formatToday() {
  const now = new Date;
  return now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// make-pdf/src/html.ts
var [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("usage: bin/gstack-markdown-html <input.md> <output.html>");
  process.exit(1);
}
var html = render({ markdown: readFileSync(input, "utf8"), cover: true, toc: true }).html;
var csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: file:; style-src 'unsafe-inline'">`;
writeFileSync(output, html.replace("<head>", `<head>${csp}`), { flag: "wx" });
console.log(output);
