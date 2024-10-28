/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fs from "fs/promises";
import { join } from "path";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import serialize from "serialize-javascript";
import { ViteDevServer } from "vite";
import api from "./api";
import contentSecurityPolicy from "./contentSecurityPolicy";
import config from "../config";

const isProduction = config.runtimeType === "production";
const base = "/";

const app = express();
// Cached production assets
// Vercel is particular about how it reads files. Changing this might break the build.
const templateHtml = isProduction
  ? await fs.readFile(join(process.cwd(), "build", "public", "index.html"), "utf-8")
  : "";

let vite: ViteDevServer | undefined;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const sirv = (await import("sirv")).default;
  app.use(base, sirv("./build/public", { extensions: [] }));
}

const allowedBodyContentTypes = ["application/csp-report", "application/json"];

// Temporal hack to send users to prod
app.get("*splat", (req, res, next) => {
  if (!req.hostname.includes("ed.ff")) {
    next();
  } else {
    res.set("location", `https://ed.ndla.no${req.originalUrl}`);
    res.status(302).send();
  }
});

if (!config.isVercel) {
  app.use(compression());
}

app.use(
  express.json({
    limit: "1mb",
    type: (req) => {
      for (const allowedType of allowedBodyContentTypes) {
        if ((req as express.Request).is(allowedType)) {
          return true;
        }
      }
      return false;
    },
  }),
);

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    contentSecurityPolicy: config.disableCSP === "true" ? null : contentSecurityPolicy,
    frameguard:
      config.runtimeType === "development"
        ? {
            action: "allow-from",
            domain: "*://localhost",
          }
        : undefined,
  }),
);

const serializedConfig = serialize(config);

app.use(api);

app.get("*splat", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    let template: string;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite!.transformIndexHtml(url, template);
    } else {
      template = templateHtml;
    }

    const html = template
      .replace(/"__CONFIG__"/, serializedConfig)
      .replaceAll("__ENVIRONMENT__", config.ndlaEnvironment);

    res
      .status(200)
      .set({
        "Content-Type": "text/html",
        "Reporting-Endpoints": `csp-endpoint="${config.editorialFrontendDomain}/csp-reporting"`,
      })
      .end(html);
  } catch (e) {
    //@ts-ignore
    vite?.ssrFixStacktrace(e);
    //@ts-ignore
    // eslint-disable-next-line no-console
    console.log(e.stack);
    //@ts-ignore
    res.status(500).end(e.stack);
  }
});

export default app;
