/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { claudeHaikuDefaults, invokeModel } from "../../../LLM/helpers";

export const getRephrasing = async (prompt: string) => {
  try {
    return await invokeModel({ prompt: prompt, ...claudeHaikuDefaults });
  } catch (error) {
    // console.error(error);
  }
};
