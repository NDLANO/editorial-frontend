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
import openGraph from "open-graph-scraper";
import { youtube } from "@googleapis/youtube";
import { getToken, getBrightcoveToken, fetchAuth0UsersById, getEditors, getResponsibles } from "./auth";
import { OK, INTERNAL_SERVER_ERROR, NOT_ACCEPTABLE, FORBIDDEN, BAD_REQUEST, NOT_FOUND, FOUND } from "./httpCodes";
import errorLogger from "./logger";
import { translateDocument } from "./translate";
import config, { getEnvironmentVariabel } from "../config";
import { AI_ACCESS_SCOPE, DRAFT_PUBLISH_SCOPE, DRAFT_WRITE_SCOPE } from "../constants";
import { isPromptType, NdlaError } from "../interfaces";
import { fetchMatomoStats } from "./matomo";
import { generateAnswer, getDefaultPrompts, getTranscription, initializeTranscription } from "./llm";
import { isValidRequestBody } from "./utils";
import { isLlmLanguageCode } from "./llmTypes";

const googleApiKey = getEnvironmentVariabel("NDLA_GOOGLE_API_KEY");

const router = express.Router();

type NdlaUser = {
  "https://ndla.no/user_email"?: string;
  "https://ndla.no/user_name"?: string;
  permissions?: string[];
};

// Temporal hack to send users to prod
router.get("*splat", (req, res, next) => {
  if (!req.hostname.includes("ed.ff")) {
    next();
  } else {
    res.set("location", `https://ed.ndla.no${req.originalUrl}`);
    res.status(FOUND).send();
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

const jwtMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  await jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      jwksUri: `https://${config.auth0Domain}/.well-known/jwks.json`,
    }) as GetVerificationKey,
    audience: "ndla_system",
    issuer: `https://${config.auth0BrowserDomain}/`,
    algorithms: ["RS256"],
  })(req, res, next);
};

router.get("/get_note_users", jwtMiddleware, async (req: Request, res) => {
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
});

router.get("/get_editors", jwtMiddleware, async (_, res) => {
  try {
    const managementToken = await getToken(`https://${config.auth0Domain}/api/v2/`);
    const editors = await getEditors(managementToken);
    res.status(OK).json(editors);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send((err as NdlaError).message);
  }
});

router.get("/get_responsibles", jwtMiddleware, async (req, res) => {
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
});

router.post("/csp-reporting", (req, res) => {
  const { body } = req;
  if (body && body["type"] === "csp-violation") {
    const cspReport = body["body"];
    const errorMessage = `Refused to load the resource because it violates the following Content Security Policy directive: ${cspReport["effectiveDirective"]}`;
    errorLogger.error(errorMessage, cspReport);
    res.status(OK).json({ status: OK, text: "CSP Error recieved" });
  } else {
    res.status(NOT_ACCEPTABLE).json({ status: NOT_ACCEPTABLE, text: "CSP Error not recieved" });
  }
});

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

router.post("/matomo-stats", jwtMiddleware, async (req, res) => {
  const { body } = req;
  if (body?.urls?.length) {
    try {
      const matomoStats = await fetchMatomoStats(body.urls);
      res.status(OK).json(matomoStats);
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).send((err as NdlaError).message);
    }
  } else {
    res.status(BAD_REQUEST).json({ status: BAD_REQUEST, text: "The 'urls' field is required in the request body." });
  }
});

const aiMiddleware = (req: Request, res: express.Response, next: express.NextFunction) => {
  const { auth } = req;
  const user = auth as NdlaUser;

  const hasAiAccess = user?.permissions?.includes(AI_ACCESS_SCOPE);

  if (!hasAiAccess) {
    res.status(FORBIDDEN).send({ error: "Access denied. Missing access" });
  } else {
    next();
  }
};

router.get("/default-ai-prompts", jwtMiddleware, aiMiddleware, async (req, res) => {
  const {
    query: { type, language },
  } = req;

  const promptType = type as string;
  const lang = language as string;
  if (!isPromptType(promptType) || !isLlmLanguageCode(lang)) {
    res.status(BAD_REQUEST).send({ error: "Invalid parameter types" });
    return;
  }

  const defaultPrompts = getDefaultPrompts(promptType, lang);
  res.status(OK).json(defaultPrompts);
});

router.post("/generate-ai", jwtMiddleware, aiMiddleware, async (req, res) => {
  if (!isValidRequestBody(req.body)) {
    res.status(BAD_REQUEST).send({ error: "Missing required parameters" });
    return;
  }
  try {
    const llmResponse = await generateAnswer(req.body, req.body.language, req.body.max_tokens);
    res.status(OK).send(llmResponse);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .send((err as NdlaError)?.message ?? "Answer generation failed to give a proper answer with the given input");
  }
});

const transcriptionBucketName = getEnvironmentVariabel("TRANSCRIBE_FILE_S3_BUCKET");

router.post("/transcribe", jwtMiddleware, aiMiddleware, async (req: Request, res) => {
  if (!transcriptionBucketName) {
    res.status(INTERNAL_SERVER_ERROR).send({ error: "Missing required environment variables" });
    return;
  }

  if (!req.body.languageCode || !req.body.mediaFormat || !req.body.mediaFileUri || !req.body.outputFileName) {
    res.status(BAD_REQUEST).send({ error: "Missing required parameters" });
    return;
  }

  try {
    const response = await initializeTranscription(req.body, transcriptionBucketName);
    res.status(OK).json(response);
  } catch (err) {
    errorLogger.error(err);
    res.status(INTERNAL_SERVER_ERROR).send({ error: "An error occured" });
  }
});

router.get("/transcribe/:jobName", jwtMiddleware, aiMiddleware, async (req, res) => {
  if (!transcriptionBucketName) {
    res.status(INTERNAL_SERVER_ERROR).send({ error: "Missing required environment variables" });
    return;
  }
  const { jobName } = req.params;
  try {
    const response = await getTranscription(jobName);

    if (!response.TranscriptionJob) {
      res.status(NOT_FOUND).send({ error: "Job not found or an error occurred" });
      return;
    }

    switch (response.TranscriptionJob.TranscriptionJobStatus) {
      case "COMPLETED": {
        const transcriptUri = response.TranscriptionJob.Transcript?.TranscriptFileUri || "";
        res.status(OK).json({ jobName: jobName, status: "COMPLETED", transcriptUrl: transcriptUri });
        break;
      }
      case "FAILED": {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ jobName: jobName, status: "FAILED", reason: response.TranscriptionJob.FailureReason });
        break;
      }
      default:
        res.status(OK).json({ jobName: jobName, status: response.TranscriptionJob.TranscriptionJobStatus });
    }
  } catch (error) {
    errorLogger.error(error);
    res.status(INTERNAL_SERVER_ERROR).send({ error: "An error occured" });
  }
});

const youtubeApi = youtube({ version: "v3", auth: googleApiKey });

router.get("/opengraph", jwtMiddleware, async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== "string") {
    res.status(BAD_REQUEST).send({ error: "Missing 'url' query parameter" });
    return;
  }
  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch (e) {
    res.status(BAD_REQUEST).send({ error: "Invalid 'url' query parameter" });
    return;
  }
  if (url.includes("youtu")) {
    const videoId = urlObj.pathname.startsWith("/watch")
      ? urlObj.searchParams.get("v")
      : urlObj.pathname.split("/")?.[1]?.split("?")[0];
    const yt_metadata = await youtubeApi.videos.list({ id: [videoId ?? ""], part: ["snippet"] });
    const data = yt_metadata.data.items?.[0]?.snippet;
    const json = {
      title: data?.title ?? undefined,
      description: data?.description ?? undefined,
      imageUrl: data?.thumbnails?.default?.url ?? undefined,
      imageAlt: data?.title ?? undefined,
      url,
    };
    res.status(OK).json(json);
    return;
  }
  const ogs = await openGraph({ url });
  if (ogs.error) {
    res.status(INTERNAL_SERVER_ERROR).send({ error: `Failed to fetch opengraph for url ${url}` });
    return;
  }
  const response = {
    title: ogs.result.ogTitle,
    description: ogs.result.ogDescription,
    imageUrl: ogs.result.ogImage?.[0]?.url,
    imageAlt: ogs.result.ogImage?.[0]?.alt,
    url: ogs.result.ogUrl,
  };

  res.status(OK).json(response);
});

export default router;
