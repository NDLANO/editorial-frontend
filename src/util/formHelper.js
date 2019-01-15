/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { isEditorValueDirty } from './articleContentConverter';

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

export const isFormDirty = ({ fields, model, showSaved }) => {
  // Checking specific slate object fields if they really have changed
  const slateFields = ['introduction', 'metaDescription', 'content'];
  const dirtyFields = [];
  Object.keys(fields)
    .filter(field => fields[field].dirty)
    .forEach(dirtyField => {
      if (slateFields.includes(dirtyField)) {
        if (isEditorValueDirty(model[dirtyField])) {
          dirtyFields.push(dirtyField);
        }
      } else {
        dirtyFields.push(dirtyField);
      }
    });
  return dirtyFields.length > 0 && !showSaved;
};
