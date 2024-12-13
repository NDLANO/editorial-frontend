/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Buffer } from "buffer";

export const claudeHaikuDefaults = { top_p: 0.7, top_k: 100, temperature: 0.9 };

interface modelProps {
  prompt: string;
  image?: {
    base64: string;
    fileType: string;
  };
  max_tokens?: number;
}

export const invokeModel = async ({ prompt, image, max_tokens = 2000, ...rest }: modelProps) => {
  if (!prompt) {
    console.error("No prompt provided to invokeModel");
    return null;
  }

  const payload: any = { prompt, max_tokens, ...rest };
  if (image) {
    payload.image = image;
  }

  const response = await fetch("/invoke-model", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("Failed to get a response from the model");
    return null;
  }

  const responseBody = await response.json();
  return parseResponse(responseBody.content[0].text);
};

export const getTextFromHTML = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const parseResponse = (response: string) => {
  return response.split("<answer>")[1].split("</answer>")[0].trim();
};

export const convertBufferToBase64 = (buffer: ArrayBuffer) => {
  return Buffer.from(buffer).toString("base64");
};
