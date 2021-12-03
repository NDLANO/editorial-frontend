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
  ConceptPostType,
  ConceptPatchType,
} from '../../modules/concept/conceptApiInterfaces';
import * as conceptApi from '../../modules/concept/conceptApi';
import * as taxonomyApi from '../../modules/taxonomy';
import { fetchSearchTags } from '../../modules/concept/conceptApi';
import { fetchDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { DraftApiType } from '../../modules/draft/draftApiInterfaces';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from '../../constants';

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
      const fetchedSubjects = await taxonomyApi.fetchSubjects(locale, {
        key: TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
        value: 'true',
      });
      setSubjects(fetchedSubjects);
    };
    fetchSubjects();
  }, [locale]);

  const fetchElementList = async (articleIds?: number[]): Promise<DraftApiType[]> => {
    const promises = articleIds?.map(id => fetchDraft(id)) ?? [];
    return await Promise.all(promises);
  };

  const updateConcept = async (updatedConcept: ConceptPatchType): Promise<ConceptApiType> => {
    const savedConcept = await conceptApi.updateConcept(updatedConcept);
    const convertedArticles = await fetchElementList(savedConcept.articleIds);
    setConcept(savedConcept);
    setConceptArticles(convertedArticles);
    setConceptChanged(false);
    return savedConcept;
  };

  const createConcept = async (createdConcept: ConceptPostType) => {
    const savedConcept = await conceptApi.addConcept(createdConcept);
    const convertedArticles = await fetchElementList(savedConcept.articleIds);
    setConcept(savedConcept);
    setConceptArticles(convertedArticles);
    setConceptChanged(false);
    return savedConcept;
  };

  const updateConceptAndStatus = async (
    updatedConcept: ConceptPatchType,
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
