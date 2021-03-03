/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { plainTextToEditorValue } from '../../util/articleContentConverter';
import { SubjectType } from '../../interfaces';
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
