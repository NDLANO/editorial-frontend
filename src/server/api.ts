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
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
  MediaFormat,
  LanguageCode,
} from "@aws-sdk/client-transcribe";
import { getToken, getBrightcoveToken, fetchAuth0UsersById, getEditors, getResponsibles } from "./auth";
import { OK, INTERNAL_SERVER_ERROR, NOT_ACCEPTABLE, FORBIDDEN, BAD_REQUEST } from "./httpCodes";
import errorLogger from "./logger";
import { translateDocument } from "./translate";
import config, { getEnvironmentVariabel } from "../config";
import { DRAFT_PUBLISH_SCOPE, DRAFT_WRITE_SCOPE } from "../constants";
import { NdlaError } from "../interfaces";
import { fetchMatomoStats } from "./matomo";
import { getPromptQuery, PromptVariables } from "./llmUtils";

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

const jwtMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  await jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      jwksUri: `https://${config.auth0Domain}/.well-known/jwks.json`,
    }) as GetVerificationKey,
    audience: "ndla_system",
    issuer: `https://${config.auth0Domain}/`,
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
  if (body?.contextIds?.length) {
    try {
      const matomoStats = await fetchMatomoStats(body.contextIds);
      res.status(OK).json(matomoStats);
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).send((err as NdlaError).message);
    }
  } else {
    res
      .status(BAD_REQUEST)
      .json({ status: BAD_REQUEST, text: "The 'contextIds' field is required in the request body." });
  }
});

const aiModelId = getEnvironmentVariabel("NDLA_AI_MODEL_ID");
const aiRegion = getEnvironmentVariabel("NDLA_AI_MODEL_REGION");
const aiSecretKey = getEnvironmentVariabel("NDLA_AI_SECRET_KEY");
const aiSecretID = getEnvironmentVariabel("NDLA_AI_SECRET_ID");
const transcriptionBucketName = getEnvironmentVariabel("TRANSCRIBE_FILE_S3_BUCKET");

const LLM_ANSWER_REGEX = /(?<=<answer>\s*).*?(?=\s*<\/answer>)/gs;
const ANTHROPIC_VERSION = "bedrock-2023-05-31";

type GenerateAnswerBody = {
  language: string;
  max_tokens: number;
} & PromptVariables;

router.post<{}, {}, GenerateAnswerBody>("/generate-ai", async (req, res) => {
  if (!aiRegion || !aiSecretID || !aiSecretKey || !aiModelId) {
    res.status(INTERNAL_SERVER_ERROR).send("Missing required environment variables");
    return;
  }

  const client = new BedrockRuntimeClient({
    region: aiRegion, //As of now this is the closest aws-region, with the service
    credentials: { accessKeyId: aiSecretID, secretAccessKey: aiSecretKey },
  });

  const promptQuery = getPromptQuery(req.body, req.body.language);

  const prompt = {
    type: "text",
    text: promptQuery,
  };

  const content =
    req.body.type === "alttext"
      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: req.body.image.fileType,
              data: req.body.image.base64,
            },
          },
          prompt,
        ]
      : [prompt];

  const payload = {
    anthropic_version: ANTHROPIC_VERSION,
    max_tokens: req.body.max_tokens || 500,
    messages: [
      {
        content: content,
        role: "user",
      },
    ],
  };

  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId: aiModelId,
  });

  try {
    const response = await client.send(command);
    const decodedResponseBody = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decodedResponseBody);

    const responseText = responseBody.content[0].text.match(LLM_ANSWER_REGEX)[0].trim();

    res.status(OK).send(responseText);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send((err as NdlaError).message);
  }
});

const TRANSCRIBE_REGION = "eu-west-1";

interface StartTranscriptBody {
  languageCode?: LanguageCode;
  mediaFormat?: MediaFormat;
  mediaFileUri?: string;
  outputFileName?: string;
  maxSpeakers?: number;
}

router.post<{}, {}, StartTranscriptBody>("/transcribe", async (req, res) => {
  if (!transcriptionBucketName) {
    res.status(INTERNAL_SERVER_ERROR).send("Missing required environment variables");
    return;
  }

  if (!req.body.languageCode || !req.body.mediaFormat || !req.body.mediaFileUri || !req.body.outputFileName) {
    res.status(400).send("Missing required parameters");
  }

  const client = new TranscribeClient({
    region: TRANSCRIBE_REGION,
  });

  const jobName = `transcribe-${Date.now()}`;
  const command = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    LanguageCode: req.body.languageCode,
    MediaFormat: req.body.mediaFormat,
    Media: {
      MediaFileUri: req.body.mediaFileUri,
    },
    OutputBucketName: transcriptionBucketName,
    OutputKey: req.body.outputFileName,
    Settings: {
      ShowSpeakerLabels: true, // Enable speaker identification
      MaxSpeakerLabels: req.body.maxSpeakers || 2,
    },
  });

  try {
    const response = await client.send(command);
    res.status(OK).json(response);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send((err as NdlaError).message);
  }
});

interface TranscribeJobParams {
  jobName: string;
}
router.get<TranscribeJobParams, {}, {}>("/transcribe/:jobName", async (req, res) => {
  if (!transcriptionBucketName) {
    res.status(INTERNAL_SERVER_ERROR).send("Missing required environment variables");
    return;
  }

  const client = new TranscribeClient({
    region: TRANSCRIBE_REGION,
  });

  try {
    const command = new GetTranscriptionJobCommand({ TranscriptionJobName: req.params.jobName });
    const response = await client.send(command);

    if (!response || !response.TranscriptionJob) {
      res.status(404).send({ error: "Job not found or an error occurred" });
      return;
    }
    const jobStatus = response.TranscriptionJob.TranscriptionJobStatus;
    if (jobStatus === "COMPLETED") {
      const transcriptUri = response.TranscriptionJob.Transcript?.TranscriptFileUri || "";
      res.json({ jobName: req.params.jobName, status: "COMPLETED", transcriptUrl: transcriptUri });
    } else if (jobStatus === "FAILED") {
      res
        .status(500)
        .send({ jobName: req.params.jobName, status: "FAILED", reason: response.TranscriptionJob.FailureReason });
    } else {
      res.json({ jobName: req.params.jobName, status: jobStatus });
    }
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).send((error as NdlaError).message);
  }
});

export default router;
