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
  ConceptApiType,
  NewConceptType,
  PatchConceptType,
} from '../../modules/concept/conceptApiInterfaces';
import { License } from '../../interfaces';
import { ConceptFormValues } from './conceptInterfaces';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { RulesType } from '../../components/formikValidationSchema';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { DraftApiType } from '../../modules/draft/draftApiInterfaces';
import { parseImageUrl } from '../../util/formHelper';
import { parseEmbedTag } from '../../util/embedTagHelpers';

const convertNestedConceptProps = (concept: ConceptApiType | undefined, language: string) => {
  if (concept) {
    const conceptLanguage = concept.supportedLanguages.includes(language) ? language : undefined;
    return {
      title: convertFieldWithFallback<'title'>(concept, 'title', '', conceptLanguage),
      content: convertFieldWithFallback<'content'>(concept, 'content', '', conceptLanguage),
      tags: convertFieldWithFallback<'tags', string[]>(concept, 'tags', [], conceptLanguage),
      visualElement: convertFieldWithFallback<'visualElement'>(concept, 'visualElement', ''),
    };
  }
  return { title: '', content: '', tags: [] as string[], visualElement: '' };
};

export const conceptApiTypeToFormType = (
  concept: ConceptApiType | undefined,
  language: string,
  subjects: SubjectType[],
  articles: DraftApiType[],
): ConceptFormValues => {
  const { title, content, tags, visualElement } = convertNestedConceptProps(concept, language);
  const conceptSubjects = subjects.filter(s => concept?.subjectIds.find(id => id === s.id)) ?? [];
  const spreadConcept: Partial<ConceptApiType> = concept ? { ...concept, content: undefined } : {};
  if (spreadConcept.hasOwnProperty('content')) {
    delete spreadConcept.content;
  }
  return {
    id: concept?.id,
    revision: concept?.revision,
    status: concept?.status,
    visualElement: concept?.visualElement?.visualElement,
    copyright: concept?.copyright,
    metaImage: concept?.metaImage,
    subjectIds: concept?.subjectIds,
    articleIds: concept?.articleIds,
    created: concept?.created,
    slatetitle: plainTextToEditorValue(title, true),
    language,
    subjects: conceptSubjects,
    conceptContent: plainTextToEditorValue(content, true),
    supportedLanguages: concept?.supportedLanguages ?? [language],
    creators: concept?.copyright?.creators ?? [],
    rightsholders: concept?.copyright?.rightsholders ?? [],
    processors: concept?.copyright?.processors ?? [],
    source: concept?.source ?? '',
    license: concept?.copyright?.license?.license ?? '',
    metaImageId: parseImageUrl(concept?.metaImage),
    metaImageAlt: concept?.metaImage?.alt ?? '',
    tags,
    articles,
    visualElementObject: parseEmbedTag(visualElement) || {},
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
  id: values.id!,
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

export const conceptFormTypeToApiType = (
  values: ConceptFormValues,
  licenses: License[],
  updatedBy?: string[],
): ConceptApiType => {
  return {
    ...values,
    id: values.id!,
    revision: values.revision!,
    title: editorValueToPlainText(values.slatetitle),
    content: editorValueToPlainText(values.conceptContent),
    metaImage: { url: '', alt: '', language: values.language },
    subjectIds: values.subjects.map(subject => subject.id),
    articleIds: values.articles?.map(a => a.id) ?? [],
    visualElement: createEmbedTag(values.visualElementObject),
    updatedBy,
    tags: {
      tags: values.tags,
      language: values.language,
    },
    created: values.created!,
    updated: values.updated!,
    status: values.status!,
    copyright: {
      license: licenses.find(license => license.license === values.license),
      creators: values.creators,
      processors: values.processors,
      rightsholders: values.rightsholders,
    },
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
