/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { resolveJsonOrRejectWithError } from '../../util/apiHelpers';

export const resolveTaxonomyJsonOrRejectWithError = (res: Response) =>
  resolveJsonOrRejectWithError(res, { taxonomy: true });
