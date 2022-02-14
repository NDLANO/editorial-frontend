/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import isEqual from 'lodash/fp/isEqual';
import { Descendant } from 'slate';
import { isUserProvidedEmbedDataValid } from './embedTagHelpers';
import { findNodesByType } from './slateHelpers';
import {
  learningResourceContentToHTML,
  topicArticleContentToHTML,
} from './articleContentConverter';
import { diffHTML } from './diffHTML';
import { isGrepCodeValid } from './articleUtil';
import { License, MetaImage } from '../interfaces';
import { RulesType } from '../components/formikValidationSchema';
import {
  ArticleFormType,
  LearningResourceFormType,
  TopicArticleFormType,
} from '../containers/FormikForm/articleFormHooks';
import { isEmbed } from '../components/SlateEditor/plugins/embed/utils';
import { EmbedElement } from '../components/SlateEditor/plugins/embed';

export const DEFAULT_LICENSE: License = {
  description: 'Creative Commons Attribution-ShareAlike 4.0 International',
  license: 'CC-BY-SA-4.0',
  url: 'https://creativecommons.org/licenses/by-sa/4.0/',
};

const checkIfContentHasChanged = (
  currentValue: Descendant[],
  initialContent: Descendant[],
  type: string,
  initialHTML?: string,
) => {
  if (currentValue.length !== initialContent.length) return true;
  const toHTMLFunction =
    type === 'standard' ? learningResourceContentToHTML : topicArticleContentToHTML;
  const newHTML = toHTMLFunction(currentValue);

  const diff = diffHTML(newHTML, initialHTML || toHTMLFunction(initialContent));

  if (diff.warn) {
    return true;
  }
  return false;
};

interface FormikFields {
  description?: Descendant[];
  introduction?: Descendant[];
  title?: Descendant[];
  metaDescription?: Descendant[];
  content?: Descendant[];
  conceptContent?: Descendant[];
  manuscript?: Descendant[];
  articleType?: string;
  [x: string]: any;
}

interface FormikFormDirtyParams<T extends FormikFields> {
  values: T;
  initialValues: T;
  dirty?: boolean;
  changed?: boolean;
  initialHTML?: string;
}

export const isFormikFormDirty = <T extends FormikFields>({
  values,
  initialValues,
  dirty = false,
  changed = false,
  initialHTML,
}: FormikFormDirtyParams<T>) => {
  if (!dirty) {
    return changed;
  }
  // Checking specific slate object fields if they really have changed
  const slateFields = [
    'description',
    'introduction',
    'title',
    'metaDescription',
    'content',
    'conceptContent',
    'manuscript',
  ];
  // and skipping fields that only changes on the server
  const skipFields = ['revision', 'updated', 'updatePublished', 'id', 'status'];
  const dirtyFields = [];
  Object.entries(values)
    .filter(([key]) => !skipFields.includes(key))
    .forEach(([key, value]) => {
      if (slateFields.includes(key)) {
        if (key === 'content') {
          if (
            checkIfContentHasChanged(
              values[key]!,
              initialValues[key]!,
              initialValues.articleType!,
              initialHTML,
            )
          ) {
            dirtyFields.push(value);
          }
        } else if (typeof value === 'object' && !isEqual(value, initialValues[key])) {
          dirtyFields.push(value);
        }
      } else if (!isEqual(value, initialValues[key as keyof T])) {
        dirtyFields.push(value);
      }
    });

  return dirtyFields.length > 0 || changed;
};

export const formikCommonArticleRules: RulesType<ArticleFormType> = {
  title: {
    required: true,
    maxLength: 256,
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
    test: values => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (values.license === 'N/A' || authors.length > 0) return undefined;
      return { translationKey: 'validation.noLicenseWithoutCopyrightHolder' };
    },
  },
  notes: {
    required: false,
    test: values => {
      const emptyNote = values.notes?.find(note => note.length === 0);
      if (emptyNote !== undefined) {
        return { translationKey: 'validation.noEmptyNote' };
      }
      return undefined;
    },
  },
  grepCodes: {
    required: false,
    test: values => {
      const wrongFormat = !!values?.grepCodes?.find(value => !isGrepCodeValid(value));
      return wrongFormat ? { translationKey: 'validation.grepCodes' } : undefined;
    },
  },
};

export const learningResourceRules: RulesType<LearningResourceFormType> = {
  ...formikCommonArticleRules,
  metaImageAlt: {
    required: true,
    onlyValidateIf: values => !!values.metaImageId,
  },
  content: {
    required: true,
    test: values => {
      const embeds = findNodesByType(values.content ?? [], 'embed').map(
        node => (node as EmbedElement).data,
      );
      const notValidEmbeds = embeds.filter(embed => !isUserProvidedEmbedDataValid(embed));
      const embedsHasErrors = notValidEmbeds.length > 0;

      return embedsHasErrors
        ? { translationKey: 'learningResourceForm.validation.missingEmbedData' }
        : undefined;
    },
  },
};

export const topicArticleRules: RulesType<TopicArticleFormType> = {
  ...formikCommonArticleRules,
  visualElementAlt: {
    required: false,
    onlyValidateIf: values =>
      isEmbed(values.visualElement[0]) && values.visualElement[0].data.resource === 'image',
  },
  visualElementCaption: {
    required: false,
    onlyValidateIf: values =>
      isEmbed(values.visualElement[0]) &&
      (values.visualElement[0].data.resource === 'image' ||
        values.visualElement[0].data.resource === 'brightcove'),
  },
};

export const parseImageUrl = (metaImage?: MetaImage) => {
  if (!metaImage || !metaImage.url || metaImage.url.length === 0) {
    return '';
  }

  const splittedUrl = metaImage.url.split('/');
  return splittedUrl[splittedUrl.length - 1];
};

export const getTagName = (id: string | undefined, data: { id: string; name: string }[] = []) => {
  return id ? data.find(entry => entry.id === id)?.name : undefined;
};
