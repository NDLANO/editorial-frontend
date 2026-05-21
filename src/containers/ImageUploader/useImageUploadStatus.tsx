/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BulkUploadStateDTO } from "@ndla/types-backend/image-api";
import { useEffect, useState } from "react";
import { getBulkUploadStatus } from "../../modules/image/imageApi";

const initiateBulkUploadStatus = async (
  bulkUploadId: string,
  signal: AbortSignal,
  onEvent: (event: BulkUploadStateDTO) => void,
) => {
  const res = await getBulkUploadStatus(bulkUploadId, signal);
  if (!res.body) {
    throw new Error("Missing response body");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        onEvent(JSON.parse(line.replace("data: ", "")));
      }
    }
  }
};

export const useImageUploadStatus = (bulkUploadId: string | undefined) => {
  const [event, setEvent] = useState<BulkUploadStateDTO | undefined>(undefined);

  useEffect(() => {
    if (!bulkUploadId) return;
    const controller = new AbortController();
    initiateBulkUploadStatus(bulkUploadId, controller.signal, setEvent);

    return () => controller.abort();
  }, [bulkUploadId]);

  return event;
};
