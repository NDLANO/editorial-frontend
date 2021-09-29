/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import {
  ConceptApiType,
  ConceptStatusType,
  NewConceptType,
  PatchConceptType,
} from '../../modules/concept/conceptApiInterfaces';
import * as conceptApi from '../../modules/concept/conceptApi';
import * as taxonomyApi from '../../modules/taxonomy';
import { fetchSearchTags, fetchStatusStateMachine } from '../../modules/concept/conceptApi';
import { fetchDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { DraftApiType } from '../../modules/draft/draftApiInterfaces';

export function useFetchConceptData(conceptId: number | undefined, locale: string) {
  const [concept, setConcept] = useState<ConceptApiType>();
  const [conceptArticles, setConceptArticles] = useState<DraftApiType[]>([]);
  const [conceptChanged, setConceptChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);

  useEffect(() => {
    const fetchConcept = async (): Promise<void> => {
      try {
        if (conceptId) {
          setLoading(true);
          const concept = await conceptApi.fetchConcept(conceptId, locale);
          const conceptArticles = await fetchElementList(concept.articleIds);
          setConcept(concept);
          setConceptArticles(conceptArticles);
          setConceptChanged(false);
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
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

  const fetchElementList = async (articleIds?: number[]): Promise<DraftApiType[]> => {
    const promises = articleIds?.map(id => fetchDraft(id)) ?? [];
    return await Promise.all(promises);
  };

  const updateConcept = async (updatedConcept: PatchConceptType): Promise<ConceptApiType> => {
    const savedConcept = await conceptApi.updateConcept(updatedConcept);
    const convertedArticles = await fetchElementList(savedConcept.articleIds);
    const formConcept = { ...savedConcept };
    setConcept(formConcept);
    setConceptArticles(convertedArticles);
    setConceptChanged(false);
    return formConcept;
  };

  const createConcept = async (createdConcept: NewConceptType) => {
    const savedConcept = await conceptApi.addConcept(createdConcept);
    const convertedArticles = await fetchElementList(savedConcept.articleIds);
    const formConcept = { ...savedConcept };
    setConcept(formConcept);
    setConceptArticles(convertedArticles);
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
    });
    setConceptArticles(convertedArticles);
    setConceptChanged(false);
  };

  return {
    concept,
    createConcept,
    fetchSearchTags,
    fetchStatusStateMachine,
    loading,
    setConcept: (concept: ConceptApiType) => {
      setConcept(concept);
      setConceptChanged(true);
    },
    conceptChanged,
    subjects,
    conceptArticles,
    updateConcept,
    updateConceptAndStatus,
  };
}
