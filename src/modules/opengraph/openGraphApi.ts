/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { httpFunctions } from "../../util/apiHelpers";
import { OpenGraphData } from "./opengraphTypes";

const { fetchAndResolve } = httpFunctions;

export const fetchOpenGraphData = async (url: string): Promise<OpenGraphData> => {
  return await fetchAndResolve<OpenGraphData>({
    url: "/opengraph",
    queryParams: { url },
  });
};
