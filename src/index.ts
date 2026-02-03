/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// This is the entry point of the application.

import { getCookie } from "@ndla/util";
import compression from "compression";
import express from "express";
import fs from "fs/promises";
import helmet from "helmet";
import { join } from "path";
import serialize from "serialize-javascript";
import { ViteDevServer } from "vite";
import config from "./config";
import { ACCESS_TOKEN_COOKIE, HAS_REFRESH_TOKEN_COOKIE } from "./constants";
import api from "./server/api";
import authEndpoints, { refreshAccessToken } from "./server/authEndpoints";
import contentSecurityPolicy from "./server/contentSecurityPolicy";
import log from "./server/logger";

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
app.use(authEndpoints);

app.get("*splat", async (req, res) => {
  try {
    // We automatically refresh access tokens on ssr requests, so we need to ensure that the initial response is not cached.
    res.setHeader("Cache-Control", "no-store");
    const url = req.originalUrl.replace(base, "");

    let template: string;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite!.transformIndexHtml(url, template);
    } else {
      template = templateHtml;
    }

    const token = getCookie(ACCESS_TOKEN_COOKIE, req.headers.cookie ?? "");

    if (!token && getCookie(HAS_REFRESH_TOKEN_COOKIE, req.headers.cookie ?? "") === "true") {
      try {
        await refreshAccessToken(req, res);
      } catch (e) {
        log.error("Failed to refresh token on SSR request");
      }
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
    const error = e as Error;
    vite?.ssrFixStacktrace(error);
    // eslint-disable-next-line no-console
    console.log(error.stack);
    res.status(500).end(error.stack);
  }
});

if (!config.isVercel) {
  // Start http server
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started at http://localhost:${config.port}`);
  });
}

export default app;
