/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { getEnvironmentVariabel } from "../config";
import {
  GetTranscriptionJobCommand,
  LanguageCode,
  MediaFormat,
  StartTranscriptionJobCommand,
  TranscribeClient,
} from "@aws-sdk/client-transcribe";
import { llmQueryText } from "./llmQueries";
import { PROMPTS } from "./llmPrompts";
import { PromptType, DefaultPrompts, isLanguageCode, Payload, PromptVariables } from "./llmApiTypes";

const aiModelId = getEnvironmentVariabel("NDLA_AI_MODEL_ID", "test");
const aiRegion = getEnvironmentVariabel("NDLA_AI_MODEL_REGION", "eu-west-1");
const aiSecretKey = getEnvironmentVariabel("NDLA_AI_SECRET_KEY", "test");
const aiSecretID = getEnvironmentVariabel("NDLA_AI_SECRET_ID", "test");

const LLM_ANSWER_REGEX = /(?<=<answer>\s*).*?(?=\s*<\/answer>)/gs;
const LLM_ERROR_REGEX = /(?<=<ERROR>\s*).*?(?=\s*<\/ERROR>)/gs;
const ANTHROPIC_VERSION = "bedrock-2023-05-31";
const TRANSCRIBE_REGION = "eu-west-1";

const bedRockClient = new BedrockRuntimeClient({
  region: aiRegion, //As of now this is the closest aws-region, with the service
  credentials: { accessKeyId: aiSecretID, secretAccessKey: aiSecretKey },
});
const textDecoder = new TextDecoder();

export const getDefaultPrompts = (type: PromptType, language: string): DefaultPrompts => {
  const lang = isLanguageCode(language) ? language : "nb";
  const { role, generalInstructions: instructions } = PROMPTS[lang][type];
  return { role, instructions };
};

export const generateAnswer = async (request: Payload<PromptVariables>, language: string, max_tokens: number) => {
  const { role, message } = llmQueryText(request, language);

  const prompt = {
    type: "text",
    text: message,
  };

  const content =
    request.type === "altText"
      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: request.image.fileType,
              data: request.image.base64,
            },
          },
          prompt,
        ]
      : [prompt];

  const payload = {
    anthropic_version: ANTHROPIC_VERSION,
    max_tokens: max_tokens || 2000,
    messages: [
      {
        content: content,
        role: "user",
      },
    ],
    system: role,
  };

  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId: aiModelId,
  });
  const response = await bedRockClient.send(command);
  const decodedResponseBody = textDecoder.decode(response.body);
  const responseBody = JSON.parse(decodedResponseBody);

  const containsError = responseBody.content[0].text.includes("<ERROR>");

  if (containsError) {
    const errorMsg = responseBody.content[0].text.match(LLM_ERROR_REGEX)[0].trim();
    throw new Error(errorMsg);
  }

  const responseText = responseBody.content[0].text.match(LLM_ANSWER_REGEX)[0].trim();
  return responseText;
};

interface StartTranscriptionJob {
  languageCode: LanguageCode;
  mediaFormat: MediaFormat;
  mediaFileUri: string;
  outputFileName: string;
  maxSpeakers: number;
}

const transcribeClient = new TranscribeClient({
  region: TRANSCRIBE_REGION,
});

export const initializeTranscription = async (params: StartTranscriptionJob, bucketName: string) => {
  const jobName = `transcribe-${Date.now()}`;
  const command = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    LanguageCode: params.languageCode,
    MediaFormat: params.mediaFormat,
    Media: {
      MediaFileUri: params.mediaFileUri,
    },
    OutputBucketName: bucketName,
    OutputKey: params.outputFileName,
    Settings: {
      ShowSpeakerLabels: true, // Enable speaker identification
      MaxSpeakerLabels: params.maxSpeakers || 2,
    },
  });
  return await transcribeClient.send(command);
};

export const getTranscription = async (jobName: string) => {
  const command = new GetTranscriptionJobCommand({ TranscriptionJobName: jobName });
  return await transcribeClient.send(command);
};
