/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { User, ZendeskToken } from '../../interfaces';
import { resolveJsonOrRejectWithError, fetchAuthorized } from '../../util/apiHelpers';

export const fetchAuth0Users = (uniqueUserIds: string): Promise<User[]> =>
  fetchAuthorized(`/get_note_users?userIds=${uniqueUserIds}`).then(r =>
    resolveJsonOrRejectWithError<User[]>(r),
  );

export const fetchAuth0Editors = (role: string): Promise<User[]> =>
  fetchAuthorized(`/get_editors?role=${role}`).then(r => resolveJsonOrRejectWithError<User[]>(r));

export const fetchZendeskToken = (): Promise<ZendeskToken> =>
  fetchAuthorized('/get_zendesk_token').then(r => resolveJsonOrRejectWithError<ZendeskToken>(r));
