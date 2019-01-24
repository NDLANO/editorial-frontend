/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  fetchAuthorized,
} from '../../util/apiHelpers';

export const fetchAuth0Users = uniqueUserIds =>
  fetchAuthorized(`/get_note_users?userIds=${uniqueUserIds}`).then(
    resolveJsonOrRejectWithError,
  );
