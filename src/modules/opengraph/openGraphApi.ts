/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getAccessToken } from "../../util/authHelpers";
import { OpenGraphData } from "./opengraphTypes";

export const fetchOpenGraphData = async (url: string): Promise<OpenGraphData> => {
  const response = await fetch(`/opengraph?${new URLSearchParams({ url }).toString()}`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.json();
};
