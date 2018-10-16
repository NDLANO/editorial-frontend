/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { isEqualEditorValue } from './articleContentConverter';

export const DEFAULT_LICENSE = {
  description: 'Creative Commons Attribution-ShareAlike 4.0 International',
  license: 'CC-BY-SA-4.0',
  url: 'https://creativecommons.org/licenses/by-sa/4.0/',
};

export const parseCopyrightContributors = (obj, contributorType) => {
  if (!obj.copyright) {
    return [];
  }
  return obj.copyright[contributorType] || [];
};

export const articleStatuses = [
  { key: 'CREATED' },
  { key: 'PROPOSAL' },
  { key: 'AWAITING_QUALITY_ASSURANCE', columnSize: 2 },
  { key: 'DRAFT' },
  { key: 'USER_TEST' },
  { key: 'IMPORTED', columnSize: 2 },
  { key: 'QUALITY_ASSURED' },
  { key: 'PUBLISHED' },
  { key: 'AWAITING_UNPUBLISHING', columnSize: 2 },
  { key: 'UNPUBLISHED' },
  { key: 'ARCHIEVED' },
  {
    key: 'QUEUED_FOR_PUBLISHING',
    columnSize: 2,
  },
];

export const isFormDirty = (
  formFields,
  initialModel,
  currentModel,
  slateFields = [],
  showSaved = false,
) => {
  // Checking specific slate object fields if they really have changed
  const dirtyFields = [];
  Object.keys(formFields)
    .filter(field => formFields[field].dirty)
    .forEach(dirtyField => {
      if (slateFields.includes(dirtyField)) {
        if (
          !isEqualEditorValue(
            initialModel[dirtyField],
            currentModel[dirtyField],
            currentModel.articleType,
          )
        ) {
          dirtyFields.push(dirtyField);
        }
      } else {
        dirtyFields.push(dirtyField);
      }
    });
  return dirtyFields.length > 0 && !showSaved;
};
