/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

type MessageSeverity = "danger" | "info" | "success" | "warning";

export interface MessageType {
  id: string;
  message?: string;
  translationKey?: string;
  translationObject?: {
    message?: string;
  };
  severity?: MessageSeverity;
  action?: string;
  timeToLive?: number;
  statusCode?: number;
  type?: string;
}
