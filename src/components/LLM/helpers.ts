/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const invokeModel = async (prompt: string) => {
  const response = await fetch("/invoke-model", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate meta description");
  }

  const responseBody = await response.json();
  return responseBody.content[0].text;
};

export const getTextFromHTML = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
};
