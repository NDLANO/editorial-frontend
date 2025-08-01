/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement } from "react";
import { useMessages } from "../containers/Messages/MessagesProvider";
import { scheduleRenewal } from "../util/authHelpers";

export const AuthInitializer = ({ children }: { children: ReactElement }) => {
  const { createMessage } = useMessages();
  scheduleRenewal(createMessage, true);
  return children;
};
