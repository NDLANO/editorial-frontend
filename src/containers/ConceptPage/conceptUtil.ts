/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEmpty from 'lodash/fp/isEmpty';
import { plainTextToEditorValue, editorValueToPlainText } from '../../util/articleContentConverter';
import { createEmbedTag } from '../../util/embedTagHelpers';
import { ConceptSubmitType } from '../../modules/concept/conceptApiInterfaces';
import { SubjectType, License } from '../../interfaces';
import { ConceptFormValues, ConceptFormType } from './conceptInterfaces';

export const transformApiConceptToFormValues = (
  concept: ConceptFormType,
  subjects: SubjectType[],
): ConceptFormValues => {
  return {
    id: concept.id,
    title: concept.title || '',
    language: concept.language,
    updated: concept.updated,
    updateCreated: false,
    subjects: subjects.filter(subject => concept.subjectIds.find(id => id === subject.id)),
    created: concept.created,
    conceptContent: plainTextToEditorValue(concept.content || '', true),
    supportedLanguages: concept.supportedLanguages || [],
    creators: concept.copyright?.creators || [],
    rightsholders: concept.copyright?.rightsholders || [],
    processors: concept.copyright?.processors || [],
    source: concept && concept.source ? concept.source : '',
    license: concept.copyright?.license?.license || '',
    metaImageId: concept.metaImageId,
    metaImageAlt: concept.metaImage?.alt || '',
    tags: concept.tags || [],
    articles: concept.articles || [],
    status: concept.status || {},
    visualElementObject: concept.parsedVisualElement || {},
  };
};

export const getCreatedDate = (values: ConceptFormValues, initialValues: ConceptFormValues) => {
  if (isEmpty(values.created)) {
    return undefined;
  }

  const hasCreatedDateChanged = initialValues.created !== values.created;
  if (hasCreatedDateChanged) {
    return values.created;
  }
  return undefined;
};

export const getApiConcept = (
  values: ConceptFormValues,
  initialValues: ConceptFormValues,
  licenses: License[],
): ConceptSubmitType => {
  return {
    id: values.id,
    title: values.title,
    content: editorValueToPlainText(values.conceptContent),
    language: values.language,
    supportedLanguages: values.supportedLanguages,
    copyright: {
      license: licenses.find(license => license.license === values.license),
      creators: values.creators,
      processors: values.processors,
      rightsholders: values.rightsholders,
    },
    agreementId: values.agreementId,
    metaImageId: values.metaImageId,
    metaImage: values.metaImageId
      ? {
          id: values.metaImageId,
          alt: values.metaImageAlt,
        }
      : undefined,
    source: values.source,
    subjectIds: values.subjects.map(subject => subject.id),
    tags: values.tags,
    created: getCreatedDate(values, initialValues),
    articleIds: values.articles.map(a => a.id),
    articles: values.articles,
    parsedVisualElement: values.visualElementObject,
    visualElement: createEmbedTag(values.visualElementObject),
  };
};

export const conceptFormRules = {
  title: {
    required: true,
  },
  conceptContent: {
    required: true,
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: (values: ConceptFormValues) => !!values.metaImageId,
  },
  subjects: {
    minItems: 1,
  },
};
