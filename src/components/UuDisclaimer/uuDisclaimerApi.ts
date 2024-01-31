/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../config";
import { fetchReAuthorized, resolveJsonOrRejectWithError } from "../../util/apiHelpers";

export const fetchDisclaimerLink = (
  locale: string = "",
  canReturnResources: boolean = false,
): Promise<{ text: string; href: string }> => {
  return fetchReAuthorized(
    `${config.ndlaApiUrl}/select?locale=${getH5pLocale(locale)}&canReturnResources=${canReturnResources}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer JWT-token` },
    },
  ).then((res) => resolveJsonOrRejectWithError(res));
};
