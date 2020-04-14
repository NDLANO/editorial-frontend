/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import isEqual from 'lodash/fp/isEqual';
import { isUserProvidedEmbedDataValid } from './embedTagHelpers';
import { findNodesByType } from './slateHelpers';
import {
  learningResourceContentToHTML,
  topicArticleContentToHTML,
} from './articleContentConverter';
import { diffHTML } from './diffHTML';
import { isGrepCodeValid } from './articleUtil';

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

const checkIfContentHasChanged = ({ currentValue, type, initialContent }) => {
  if (currentValue.length !== initialContent.length) return true;
  const toHTMLFunction =
    type === 'standard'
      ? learningResourceContentToHTML
      : topicArticleContentToHTML;
  const newHTML = toHTMLFunction(currentValue);
  const oldHTML = toHTMLFunction(initialContent);
  const diff = diffHTML(newHTML, oldHTML);
  if (diff.warn) {
    return true;
  }
  return false;
};

export const isFormikFormDirty = ({ values, initialValues, dirty = false }) => {
  if (!dirty) {
    return false;
  }
  // Checking specific slate object fields if they really have changed
  const slateFields = [
    'introduction',
    'metaDescription',
    'content',
    'conceptContent',
  ];
  // and skipping fields that only changes on the server
  const skipFields = ['revision', 'updated', 'updatePublished', 'id', 'status'];
  const dirtyFields = [];
  Object.keys(values)
    .filter(field => !skipFields.includes(field))
    .forEach(value => {
      const currentValue = values[value];
      if (slateFields.includes(value)) {
        if (value === 'content') {
          if (
            checkIfContentHasChanged({
              currentValue,
              initialContent: initialValues.content,
              type: initialValues.articleType,
            })
          ) {
            dirtyFields.push(value);
          }
        } else if (
          !isEqual(currentValue.toJSON(), initialValues[value].toJSON())
        ) {
          dirtyFields.push(value);
        }
      } else if (!isEqual(currentValue, initialValues[value])) {
        dirtyFields.push(value);
      }
    });
  return dirtyFields.length > 0;
};

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
    required: true,
    minItems: 3,
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
        return { translationKey: 'validation.noEmptyNote' };
      }
      return undefined;
    },
  },
  grepCodes: {
    required: false,
    test: values => {
      const wrongFormat = !!values.find(value => !isGrepCodeValid(value));
      return wrongFormat
        ? { translationKey: 'validation.grepCodes' }
        : undefined;
    },
  },
};

export const learningResourceRules = {
  ...formikCommonArticleRules,
  metaImageAlt: {
    required: true,
    onlyValidateIf: values => !!values.metaImageId,
  },
  content: {
    required: true,
    test: value => {
      const embedsHasErrors = value.find(sectionValue => {
        const embeds = findNodesByType(
          sectionValue.document,
          'embed',
        ).map(node => node.get('data').toJS());
        const notValidEmbeds = embeds.filter(
          embed => !isUserProvidedEmbedDataValid(embed),
        );
        return notValidEmbeds.length > 0;
      });

      return embedsHasErrors
        ? { translationKey: 'learningResourceForm.validation.missingEmbedData' }
        : undefined;
    },
  },
};

export const topicArticleRules = {
  ...formikCommonArticleRules,
  visualElementAlt: {
    required: false,
    onlyValidateIf: values =>
      values.visualElement && values.visualElement.resource === 'image',
  },
  visualElementCaption: {
    required: false,
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
