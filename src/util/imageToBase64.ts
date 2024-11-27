/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export const imageToBase64 = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const contentType = response.headers.get("Content-Type");
  const buffer = await response.arrayBuffer();

  if (!contentType) {
    throw new Error("Failed to determine file type");
  }

  // Convert buffer to Base64
  const base64 = Buffer.from(buffer).toString("base64");

  return {
    base64,
    filetype: contentType,
  };
};
