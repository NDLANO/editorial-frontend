/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import {
  GetTranscriptionJobCommand,
  LanguageCode,
  MediaFormat,
  StartTranscriptionJobCommand,
  TranscribeClient,
} from "@aws-sdk/client-transcribe";
import { getEnvironmentVariabel } from "../config";
import { PromptType, DefaultPrompts, PromptPayload, PromptVariables, LlmResponse } from "../interfaces";
import { PROMPTS } from "./llmPrompts";
import { llmQueryText } from "./llmQueries";
import { LlmLanguageCode } from "./llmTypes";

const aiModelId = getEnvironmentVariabel("NDLA_AI_MODEL_ID", "test");
const aiRegion = getEnvironmentVariabel("NDLA_AI_MODEL_REGION", "eu-west-1");

const LLM_ANSWER_REGEX = /(?<=<answer>\s*).*?(?=\s*<\/answer>)/gs;
const LLM_ERROR_REGEX = /(?<=<ERROR>\s*).*?(?=\s*<\/ERROR>)/gs;
const ANTHROPIC_VERSION = "bedrock-2023-05-31";
const TRANSCRIBE_REGION = "eu-west-1";

const bedRockClient = new BedrockRuntimeClient({
  region: aiRegion, //As of now this is the closest aws-region, with the service
});
const textDecoder = new TextDecoder();

export const getDefaultPrompts = (type: PromptType, language: LlmLanguageCode): DefaultPrompts => {
  const { role, generalInstructions: instructions } = PROMPTS[language][type];
  return { role, instructions };
};

export const generateAnswer = async (
  request: PromptPayload<PromptVariables>,
  language: string,
  max_tokens: number | undefined,
): Promise<LlmResponse> => {
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

  const responseText = responseBody.content?.[0]?.text;
  if (typeof responseText !== "string") throw new Error("Invalid response from Bedrock");

  const containsError = responseText.includes("<ERROR>");
  if (containsError) {
    const errorMsg = responseText.match(LLM_ERROR_REGEX)?.[0].trim();
    throw new Error(errorMsg);
  }

  const answer = responseText.match(LLM_ANSWER_REGEX)?.[0].trim();
  if (!answer) throw new Error("LLM response did not include an answer tag");

  return {
    fullResponse: responseText,
    answer,
  };
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
