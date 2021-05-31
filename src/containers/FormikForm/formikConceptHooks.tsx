/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { NewConceptType, PatchConceptType } from '../../modules/concept/conceptApiInterfaces';
import * as conceptApi from '../../modules/concept/conceptApi';
import * as taxonomyApi from '../../modules/taxonomy';
import { fetchSearchTags, fetchStatusStateMachine } from '../../modules/concept/conceptApi';
import { fetchDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import { ArticleType, ConceptStatusType } from '../../interfaces';
import { ConceptFormType } from '../ConceptPage/conceptInterfaces';

export function useFetchConceptData(conceptId: number, locale: string) {
  const [concept, setConcept] = useState<ConceptFormType>();
  const [conceptChanged, setConceptChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
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
          setConceptChanged(false);
          setLoading(false);
        }
      } catch (e) {
        handleError(e);
      }
    };
    fetchConcept();
  }, [conceptId, locale]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const fetchedSubjects = await taxonomyApi.fetchSubjects(locale);
      setSubjects(fetchedSubjects);
    };
    fetchSubjects();
  }, [locale]);

  const fetchElementList = async (articleIds?: number[]): Promise<ArticleType[]> => {
    if (!articleIds) {
      return [];
    }
    return Promise.all(
      articleIds
        .filter(a => !!a)
        .map(async elementId => {
          // @ts-ignore TODO Temporary ugly hack for mismatching Article types, should be fixed when ConceptForm.jsx -> tsx
          return (await fetchDraft(elementId)) as ArticleType;
        }),
    );
  };

  const updateConcept = async (updatedConcept: PatchConceptType): Promise<ConceptFormType> => {
    const savedConcept = await conceptApi.updateConcept(updatedConcept);
    const convertedArticles = await fetchElementList(savedConcept.articleIds);
    const formConcept = { ...savedConcept, articles: convertedArticles };
    setConcept(formConcept);
    setConceptChanged(false);
    return formConcept;
  };

  const createConcept = async (createdConcept: NewConceptType) => {
    const savedConcept = await conceptApi.addConcept(createdConcept);
    const convertedArticles = await fetchElementList(savedConcept.articleIds);
    const formConcept = { ...savedConcept, articles: convertedArticles };
    setConcept(formConcept);
    setConceptChanged(false);
    return formConcept;
  };

  const updateConceptAndStatus = async (
    updatedConcept: PatchConceptType,
    newStatus: ConceptStatusType,
    dirty: boolean,
  ) => {
    const newConcept = dirty
      ? await conceptApi.updateConcept(updatedConcept)
      : await conceptApi.fetchConcept(updatedConcept.id, updatedConcept.language);
    const convertedArticles = await fetchElementList(newConcept.articleIds);
    const conceptChangedStatus = await conceptApi.updateConceptStatus(updatedConcept.id, newStatus);
    setConcept({
      ...newConcept,
      status: conceptChangedStatus.status,
      articles: convertedArticles,
    });
    setConceptChanged(false);
  };

  return {
    concept,
    createConcept,
    fetchSearchTags,
    fetchStatusStateMachine,
    loading,
    setConcept: (concept: ConceptFormType) => {
      setConcept(concept);
      setConceptChanged(true);
    },
    conceptChanged,
    subjects,
    updateConcept,
    updateConceptAndStatus,
  };
}
