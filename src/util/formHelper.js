/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

export const DEFAULT_LICENSE = {
  description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
  license: 'by-sa',
  url: 'https://creativecommons.org/licenses/by-sa/2.0/',
};

export const parseCopyrightContributors = (obj, contributorType) => {
  if (!obj.copyright) {
    return [];
  }
  return obj.copyright[contributorType] || [];
};

export const articleStatuses = [
  { key: 'CREATED' },
  { key: 'DRAFT' },
  { key: 'USER_TEST' },
  { key: 'AWAITING_QUALITY_ASSURANCE' },
  {key: 'QUALITY_ASSURED'},
  {
    key: 'QUEUED_FOR_PUBLISHING',
    columnSize: 2,
  },
  { key: 'PUBLISHED' },
  { key: 'AWAITING_UNPUBLISHING' },
  { key: 'UNPUBLISHED' },
  { key: 'IMPORTED' },
  {key: 'ARCHIEVED'},
];
