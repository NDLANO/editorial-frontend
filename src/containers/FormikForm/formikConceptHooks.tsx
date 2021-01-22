/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import * as conceptApi from '../../modules/concept/conceptApi';
import * as taxonomyApi from '../../modules/taxonomy';
import {
  fetchSearchTags,
  fetchStatusStateMachine,
} from '../../modules/concept/conceptApi';
import { fetchDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import {
  ArticleType,
  ConceptFormType,
  ConceptStatusType,
} from '../../interfaces';

export function useFetchConceptData(conceptId: number, locale: string) {
  const [concept, setConcept] = useState<ConceptFormType>();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchConcept();
  }, [conceptId, locale]);

  useEffect(() => {
    fetchSubjects();
  }, [locale]);

  const fetchConcept = async (): Promise<void> => {
    try {
      if (conceptId) {
        setLoading(true);
        const concept = await conceptApi.fetchConcept(conceptId, locale);

        const convertedArticles = await fetchElementList(concept.articleIds);
        setConcept({
          ...concept,
          articles: convertedArticles,
        });
        setLoading(false);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const fetchSubjects = async () => {
    const fetchedSubjects = await taxonomyApi.fetchSubjects(locale);
    setSubjects(fetchedSubjects);
  };

  const fetchElementList = async (
    articleIds: number[],
  ): Promise<ArticleType[]> => {
    return Promise.all(
      articleIds.map(async elementId => {
        return fetchDraft(elementId);
      }),
    );
  };

  const updateConcept = async (
    updatedConcept: ConceptFormType,
  ): Promise<ConceptFormType> => {
    const savedConcept = await conceptApi.updateConcept(updatedConcept);
    const formConcept = { ...savedConcept, articles: [] };
    setConcept(formConcept);
    return formConcept;
  };

  const createConcept = async (createdConcept: ConceptFormType) => {
    const savedConcept = await conceptApi.addConcept(createdConcept);
    const formConcept = { ...savedConcept, articles: [] };
    setConcept(formConcept);
    return formConcept;
  };

  const updateConceptAndStatus = async (
    updatedConcept: ConceptFormType,
    newStatus: ConceptStatusType,
    dirty: boolean,
  ) => {
    const newConcept = dirty
      ? await conceptApi.updateConcept(updatedConcept)
      : updatedConcept;
    const conceptChangedStatus = await conceptApi.updateConceptStatus(
      updatedConcept.id,
      newStatus,
    );
    setConcept({
      ...newConcept,
      status: conceptChangedStatus.status,
      articles: [],
    });
  };

  return {
    concept,
    createConcept,
    fetchSearchTags,
    fetchStatusStateMachine,
    loading,
    setConcept,
    subjects,
    updateConcept,
    updateConceptAndStatus,
  };
}
