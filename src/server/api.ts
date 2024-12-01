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
import { BedrockRuntimeClient, ConversationRole, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from "@aws-sdk/client-transcribe";
import { getToken, getBrightcoveToken, fetchAuth0UsersById, getEditors, getResponsibles } from "./auth";
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

router.post("/invoke-model", async (req, res) => {
  const modelId = config.aiModelID;
  const modelRegion = config.aiRegion;
  const secretKey = config.aiSecretKey;
  const secretId = config.aiSecretID;

  const client = new BedrockRuntimeClient({
    region: modelRegion, //As of now this is the closest aws-region, with the service
    credentials: { accessKeyId: secretId, secretAccessKey: secretKey },
  });

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: req.body.max_tokens || 500,
    messages: [
      {
        role: ConversationRole.USER,
        content: [{ type: "text", text: req.body.prompt }],
      },
    ],
  };
  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });
  try {
    const response = await client.send(command);
    const decodedResponseBody = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decodedResponseBody);
    res.status(OK).json(responseBody);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send((err as NdlaError).message);
  }
});

router.post("/transcribe", async (req, res) => {
  if (!req.body.languageCode || !req.body.mediaFormat || !req.body.mediaFileUri || !req.body.outputFileName) {
    res.status(400).send("Missing required parameters");
  }

  const client = new TranscribeClient({
    region: "eu-west-1",
  });

  const jobName = `transcribe-${Date.now()}`;
  const command = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    LanguageCode: req.body.languageCode,
    MediaFormat: req.body.mediaFormat,
    Media: {
      MediaFileUri: req.body.mediaFileUri,
    },
    OutputBucketName: config.transcriptionBucketName,
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

router.post("/get_transcription", async (req, res) => {
  const jobName = req.body.jobName;

  if (!jobName) {
    res.status(404).send("");
  }

  const client = new TranscribeClient({
    region: "eu-west-1",
  });

  try {
    const command = new GetTranscriptionJobCommand({ TranscriptionJobName: jobName });
    const response = await client.send(command);

    if (!response || !response.TranscriptionJob) {
      res.status(404).send({ error: "Job not found or an error occurred" });
      return;
    }
    const jobStatus = response.TranscriptionJob.TranscriptionJobStatus;

    if (jobStatus === "COMPLETED") {
      const transcriptUri = response.TranscriptionJob.Transcript?.TranscriptFileUri || "";
      res.json({ jobName, status: "COMPLETED", transcriptUrl: transcriptUri });
    } else if (jobStatus === "FAILED") {
      res.status(404).send({ jobName, status: "FAILED", reason: response.TranscriptionJob.FailureReason });
    } else {
      res.json({ jobName, status: jobStatus });
    }
  } catch (error) {
    console.error("Error fetching job status:", error);
    res.status(INTERNAL_SERVER_ERROR).send((error as NdlaError).message);
  }
});

export default router;
