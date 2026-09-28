# diagram-render

`dist/diagram-render.html` is a committed, self-contained page with Mermaid
and Excalidraw conversion code. `/diagram` opens it only through the browser
capability supplied by the agent host for the user's browser. If that host
cannot open and evaluate the page, the skill returns Mermaid source and
reports SVG, PNG, and Excalidraw export unavailable. `./setup` does not build
or install a browser.

The page exposes `window.__renderMermaid(id, text)`,
`window.__mermaidToExcalidraw(text)`, `window.__excalidrawToSvg(sceneJson)`,
and `window.__rasterize(svg, targetWidthPx)`. Wait until `#status` reads
`ready` before calling them. The functions return SVG text, Excalidraw JSON,
or a PNG data URL respectively.

To update the bundle, edit an exact dependency pin in `package.json`, run
`bun install` and `bun run build` in this directory, then commit the lockfile,
`dist/diagram-render.html`, and `dist/BUILD_INFO.json` together. The drift
test checks that the committed bundle matches the source.
