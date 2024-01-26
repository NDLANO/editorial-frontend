/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getNdlaApiUrl } from '../../config';
import { fetchReAuthorized } from '../../util/apiHelpers';

export const fetchDisclaimerLink = (
  locale: string = '',
  canReturnResources: boolean = false,
): Promise<{ text: string; href: string }> => {
  return fetchReAuthorized(
    `${getNdlaApiUrl}/select?locale=${getH5pLocale(
      locale,
    )}&canReturnResources=${canReturnResources}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer JWT-token` },
    },
  ).then((r) => resolveJsonOrRejectWithError(r));
};
