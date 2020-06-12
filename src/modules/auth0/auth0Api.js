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

// import { auth0Manage } from '../../util/authHelpers';

export const fetchAuth0Users = uniqueUserIds =>
  fetchAuthorized(`/get_note_users?userIds=${uniqueUserIds}`).then(
    resolveJsonOrRejectWithError,
  );

export const fetchAuth0Editors = role =>
  fetchAuthorized(`/get_editors?role=${role}`).then(
    resolveJsonOrRejectWithError,
  );

// TODO: patch/ update user_metadata
// Only properties at the root level are merged into the object.
// All lower-level properties will be replaced.
// patching the metadata itself with an empty object removes the metadata completely
export const patchAuth0UserMetadata = (uniqueUserId, userMetadata) => {};
