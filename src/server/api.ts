/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import express from "express";
import { GetVerificationKey, expressjwt as jwt, Request } from "express-jwt";
import jwksRsa from "jwks-rsa";
import prettier from "prettier";
import {
  getToken,
  getBrightcoveToken,
  fetchAuth0UsersById,
  getEditors,
  getZendeskToken,
  getResponsibles,
} from "./auth";
import { OK, INTERNAL_SERVER_ERROR, NOT_ACCEPTABLE, FORBIDDEN } from "./httpCodes";
import errorLogger from "./logger";
import { translateDocument } from "./translate";
import config from "../config";
import { DRAFT_PUBLISH_SCOPE, DRAFT_WRITE_SCOPE } from "../constants";
import { NdlaError } from "../interfaces";

const router = express.Router();

type NdlaUser = {
  "https://ndla.no/user_email"?: string;
  "https://ndla.no/user_name"?: string;
  permissions?: string[];
};

// Temporal hack to send users to prod
router.get("*", (req, res, next) => {
  if (!req.hostname.includes("ed.ff")) {
    next();
  } else {
    res.set("location", `https://ed.ndla.no${req.originalUrl}`);
    res.status(302).send();
  }
});

router.get("/robots.txt", (_, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /");
});

router.get("/health", (_, res) => {
  res.status(OK).json({ status: OK, text: "Health check ok" });
});

router.post("/format-html", async (req, res) => {
  const html = await prettier.format(req.body.html, {
    parser: "html",
    printWidth: 1000000, // Avoid inserting linebreaks for long inline texts i.e. <p>Lorem ......... ipsum</p>
  });
  res.status(OK).json({ html });
});

router.get("/get_brightcove_token", (_, res) => {
  getBrightcoveToken()
    .then((token) => {
      res.send(token);
    })
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send(err.message));
});

router.get(
  "/get_zendesk_token",
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      jwksUri: `https://${config.auth0Domain}/.well-known/jwks.json`,
    }) as GetVerificationKey,
    audience: "ndla_system",
    issuer: `https://${config.auth0Domain}/`,
    algorithms: ["RS256"],
  }),
  async (req: Request, res) => {
    const user = req.auth as NdlaUser;
    const name = user["https://ndla.no/user_name"] || "";
    const email = user["https://ndla.no/user_email"] || "";
    const token = getZendeskToken(name, email);
    res.send({ token });
  },
);

router.get(
  "/get_note_users",
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      jwksUri: `https://${config.auth0Domain}/.well-known/jwks.json`,
    }) as GetVerificationKey,
    audience: "ndla_system",
    issuer: `https://${config.auth0Domain}/`,
    algorithms: ["RS256"],
  }),
  async (req: Request, res) => {
    const {
      auth: untypedUser,
      query: { userIds },
    } = req;

    const user = untypedUser as NdlaUser;

    const hasWriteAccess =
      user &&
      user.permissions &&
      (user.permissions.includes(DRAFT_WRITE_SCOPE) || user.permissions.includes(DRAFT_PUBLISH_SCOPE));

    if (!hasWriteAccess) {
      res.status(FORBIDDEN).json({ status: FORBIDDEN, text: "No access allowed" });
    } else {
      try {
        const managementToken = await getToken(`https://${config.auth0Domain}/api/v2/`);
        const users = await fetchAuth0UsersById(managementToken, userIds as string);
        res.status(OK).json(users);
      } catch (err) {
        res.status(INTERNAL_SERVER_ERROR).send((err as NdlaError).message);
      }
    }
  },
);

router.get(
  "/get_editors",
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      jwksUri: `https://${config.auth0Domain}/.well-known/jwks.json`,
    }) as GetVerificationKey,
    audience: "ndla_system",
    issuer: `https://${config.auth0Domain}/`,
    algorithms: ["RS256"],
  }),
  async (_, res) => {
    try {
      const managementToken = await getToken(`https://${config.auth0Domain}/api/v2/`);
      const editors = await getEditors(managementToken);
      res.status(OK).json(editors);
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).send((err as NdlaError).message);
    }
  },
);

router.get(
  "/get_responsibles",
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      jwksUri: `https://${config.auth0Domain}/.well-known/jwks.json`,
    }) as GetVerificationKey,
    audience: "ndla_system",
    issuer: `https://${config.auth0Domain}/`,
    algorithms: ["RS256"],
  }),
  async (req, res) => {
    const {
      query: { permission },
    } = req;

    try {
      const managementToken = await getToken(`https://${config.auth0Domain}/api/v2/`);
      const editors = await getResponsibles(managementToken, permission as string);
      res.status(OK).json(editors);
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).send((err as NdlaError).message);
    }
  },
);

router.post("/csp-report", (req, res) => {
  const { body } = req;
  if (body && body["csp-report"]) {
    const cspReport = body["csp-report"];
    const errorMessage = `Refused to load the resource because it violates the following Content Security Policy directive: ${cspReport["violated-directive"]}`;
    errorLogger.error(errorMessage, cspReport);
    res.status(OK).json({ status: OK, text: "CSP Error recieved" });
  } else {
    res.status(NOT_ACCEPTABLE).json({ status: NOT_ACCEPTABLE, text: "CSP Error not recieved" });
  }
});

router.post("/translate", async (req, res) => {
  const { body } = req;
  if (body && body["document"]) {
    const translated = await translateDocument(body["document"]);
    res.status(OK).json(translated);
  } else {
    res.status(OK).json({ status: OK, text: "No body" });
  }
});

export default router;
