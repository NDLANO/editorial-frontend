/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikContextType } from 'formik';
import isEmpty from 'lodash/fp/isEmpty';
import { plainTextToEditorValue, editorValueToPlainText } from '../../util/articleContentConverter';
import { createEmbedTag } from '../../util/embedTagHelpers';
import {
  ConceptType,
  NewConceptType,
  PatchConceptType,
} from '../../modules/concept/conceptApiInterfaces';
import { License } from '../../interfaces';
import { ConceptFormValues, ConceptFormType } from './conceptInterfaces';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { RulesType } from '../../components/formikValidationSchema';

export const transformApiConceptToFormValues = (
  concept: ConceptFormType,
  subjects: SubjectType[],
): ConceptFormValues => {
  return {
    id: concept.id,
    slatetitle: plainTextToEditorValue(concept.title || '', true),
    language: concept.language,
    updated: concept.updated,
    updateCreated: false,
    subjects: concept.subjectIds
      ? subjects.filter(subject => concept.subjectIds.find(id => id === subject.id))
      : [],
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

export const getNewApiConcept = (
  values: ConceptFormValues,
  licenses: License[],
): NewConceptType => ({
  title: editorValueToPlainText(values.slatetitle),
  content: editorValueToPlainText(values.conceptContent),
  language: values.language,
  copyright: {
    license: licenses.find(license => license.license === values.license),
    creators: values.creators,
    processors: values.processors,
    rightsholders: values.rightsholders,
  },
  metaImage: values.metaImageId
    ? {
        id: values.metaImageId,
        alt: values.metaImageAlt,
      }
    : undefined,
  source: values.source,
  subjectIds: values.subjects.map(subject => subject.id),
  tags: values.tags,
  articleIds: values.articles.map(a => a.id),
  visualElement: createEmbedTag(values.visualElementObject),
});
export const getPatchApiConcept = (
  values: ConceptFormValues,
  licenses: License[],
): PatchConceptType => ({
  id: values.id,
  title: editorValueToPlainText(values.slatetitle),
  content: editorValueToPlainText(values.conceptContent),
  language: values.language,
  copyright: {
    license: licenses.find(license => license.license === values.license),
    creators: values.creators,
    processors: values.processors,
    rightsholders: values.rightsholders,
  },
  metaImage: values.metaImageId
    ? {
        id: values.metaImageId,
        alt: values.metaImageAlt,
      }
    : null,
  source: values.source,
  subjectIds: values.subjects.map(subject => subject.id),
  tags: values.tags,
  articleIds: values.articles.map(a => a.id),
  visualElement: createEmbedTag(values.visualElementObject),
});

export const getConcept = (
  values: ConceptFormValues,
  licenses: License[],
  updatedBy: string[],
): ConceptType => {
  return {
    ...values,
    title: editorValueToPlainText(values.slatetitle),
    content: editorValueToPlainText(values.conceptContent),
    copyright: {
      license: licenses.find(license => license.license === values.license),
      creators: values.creators,
      processors: values.processors,
      rightsholders: values.rightsholders,
    },
    metaImage: values.metaImageId
      ? {
          id: values.metaImageId,
          alt: values.metaImageAlt,
        }
      : undefined,
    subjectIds: values.subjects.map(subject => subject.id),
    articleIds: values.articles.map(a => a.id),
    visualElement: createEmbedTag(values.visualElementObject),
    parsedVisualElement: values.visualElementObject,
    updatedBy,
  };
};

export const conceptFormRules: RulesType<ConceptFormValues> = {
  slatetitle: {
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

export function submitFormWithMessage<T>(
  formikContext: FormikContextType<T>,
  showMessage: () => void,
) {
  const { submitForm, isValid } = formikContext;
  if (isValid) {
    submitForm();
  } else {
    showMessage();
  }
}
