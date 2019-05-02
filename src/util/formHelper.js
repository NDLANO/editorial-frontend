/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import isEqual from 'lodash/fp/isEqual';
import { isEditorValueDirty } from './articleContentConverter';
import { getField } from '../components/Fields';

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

export const isFormDirty = ({
  fields,
  initialModel,
  model,
  showSaved = false,
}) => {
  // Checking specific slate object fields if they really have changed
  const slateFields = ['introduction', 'metaDescription', 'content'];
  const dirtyFields = [];
  Object.keys(fields)
    .filter(field => fields[field].dirty)
    .forEach(dirtyField => {
      if (slateFields.includes(dirtyField)) {
        if (isEditorValueDirty(model[dirtyField])) {
          dirtyFields.push(dirtyField);
        } else if (
          Array.isArray(model[dirtyField]) &&
          Array.isArray(initialModel[dirtyField]) &&
          model[dirtyField].length !== initialModel[dirtyField].length
        ) {
          dirtyFields.push(dirtyField);
        }
      } else {
        dirtyFields.push(dirtyField);
      }
    });
  return dirtyFields.length > 0 && !showSaved;
};

export const isFormikFormDirty = ({ values, initialValues, dirty = false }) => {
  if (!dirty) {
    return false;
  }
  // Checking specific slate object fields if they really have changed
  const slateFields = ['introduction', 'metaDescription', 'content'];
  const dirtyFields = [];
  Object.keys(values).forEach(dirtyValue => {
    if (slateFields.includes(dirtyValue)) {
      if (isEditorValueDirty(values[dirtyValue])) {
        dirtyFields.push(dirtyValue);
      }
    } else if (!isEqual(values[dirtyValue], initialValues[dirtyValue])) {
      dirtyFields.push(dirtyValue);
    }
  });
  return dirtyFields.length > 0;
};

export const getErrorMessages = (label, name, schema) =>
  getField(name, schema).errors.map(error => error(label));

const formikCommonArticleRules = {
  title: {
    required: true,
  },
  introduction: {
    maxLength: 300,
  },
  metaDescription: {
    maxLength: 155,
  },
  tags: {
    required: false,
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
  license: {
    required: false,
  },
  notes: {
    required: false,
    test: value => {
      const emptyNote = value.find(note => note.length === 0);
      if (emptyNote !== undefined) {
        return 'validation.noEmptyNote';
      }
      return undefined;
    },
  },
};

export const topicArticleRules = {
  ...formikCommonArticleRules,
  'visualElement.alt': {
    required: true,
    onlyValidateIf: values =>
      values.visualElement && values.visualElement.resource === 'image',
  },
  'visualElement.caption': {
    required: true,
    onlyValidateIf: values =>
      values.visualElement &&
      (values.visualElement.resource === 'image' ||
        values.visualElement.resource === 'brightcove'),
  },
};

export const parseImageUrl = metaImage => {
  if (!metaImage || !metaImage.url || metaImage.url.length === 0) {
    return '';
  }

  const splittedUrl = metaImage.url.split('/');
  return splittedUrl[splittedUrl.length - 1];
};
