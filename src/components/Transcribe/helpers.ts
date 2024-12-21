/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
interface props {
  fileUrl: string;
  languageCode: string;
  mediaFormat: string;
  maxSpeakers?: number;
  outputFileName: string;
}

export const transcribe = async ({ fileUrl, maxSpeakers, mediaFormat, languageCode, outputFileName }: props) => {
  const payload: any = {
    mediaFileUri: fileUrl,
    languageCode: languageCode,
    mediaFormat: mediaFormat,
    outputFileName: outputFileName,
  };

  if (maxSpeakers) {
    payload.maxSpeakers = maxSpeakers;
  }

  const response = await fetch("/transcribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};

export const getTranscription = async (jobName: string) => {
  const response = await fetch(`/transcribe/${jobName}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return result;
};
