# Diagrams and print-ready documents

`/make-pdf` prepares print-ready HTML from Markdown. The helper does not open a
browser or export a PDF:

```bash
bun run make-pdf/src/html.ts document.md document.html
```

Open the HTML in the browser supplied by your agent host and use that host's
PDF export or print capability. The output HTML includes a cover, table of
contents, print CSS, and an offline Content Security Policy. Choose a new
output path for each run; the helper refuses to overwrite an existing file.
If the host cannot export PDF, `/make-pdf` reports that step unavailable and
keeps the HTML.

`/diagram` creates Mermaid source first. The offline page at
`lib/diagram-render/dist/diagram-render.html` exposes `__renderMermaid`,
`__mermaidToExcalidraw`, and `__rasterize` for SVG, editable Excalidraw, and
PNG exports. The skill uses those functions only when the host's user-browser
tool can open and evaluate that page and return the artifacts. If it cannot,
the Mermaid source remains usable and the missing formats are reported as
unavailable. gstack does not launch another browser for either skill.
