import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

let vite;
let PublicRoutes;

before(async () => {
  vite = await createServer({
    server: { middlewareMode: true, ws: false },
    appType: "custom",
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  PublicRoutes = (await vite.ssrLoadModule("/src/routes/PublicRoutes.jsx")).default;
}, { timeout: 30000 });

after(async () => {
  await vite?.close();
});

for (const path of ["/", "/team", "/contact"]) {
  test(`${path} renders its public layout and team footer link without crashing`, () => {
    const html = renderToString(React.createElement(
      MemoryRouter,
      { initialEntries: [path] },
      React.createElement(PublicRoutes),
    ));
    assert.match(html, /<main class="public-site">/);
    assert.match(html, /<footer>/);
    assert.match(html, /href="\/team"[^>]*>Our Teams<\/a>/);
  });
}
