/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { IConcept, INewConcept, IUpdatedConcept } from '@ndla/types-concept-api';
import { IArticle } from '@ndla/types-draft-api';
import * as conceptApi from '../../modules/concept/conceptApi';
import * as taxonomyApi from '../../modules/taxonomy';
import { fetchSearchTags } from '../../modules/concept/conceptApi';
import { fetchDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from '../../constants';
import { ConceptStatusType } from '../../interfaces';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

export function useFetchConceptData(conceptId: number | undefined, locale: string) {
  const [concept, setConcept] = useState<IConcept>();
  const [conceptArticles, setConceptArticles] = useState<IArticle[]>([]);
  const [conceptChanged, setConceptChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const { taxonomyVersion } = useTaxonomyVersion();

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
      const fetchedSubjects = await taxonomyApi.fetchSubjects({
        language: locale,
        metadataFilter: {
          key: TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
          value: 'true',
        },
        taxonomyVersion,
      });
      setSubjects(fetchedSubjects);
    };
    fetchSubjects();
  }, [locale, taxonomyVersion]);

  const fetchElementList = async (articleIds?: number[]): Promise<IArticle[]> => {
    const promises = articleIds?.map(id => fetchDraft(id)) ?? [];
    return await Promise.all(promises);
  };

  const updateConcept = async (id: number, updatedConcept: IUpdatedConcept): Promise<IConcept> => {
    const savedConcept = await conceptApi.updateConcept(id, updatedConcept);
    const convertedArticles = await fetchElementList(savedConcept.articleIds);
    setConcept(savedConcept);
    setConceptArticles(convertedArticles);
    setConceptChanged(false);
    return savedConcept;
  };

  const createConcept = async (createdConcept: INewConcept) => {
    const savedConcept = await conceptApi.addConcept(createdConcept);
    const convertedArticles = await fetchElementList(savedConcept.articleIds);
    setConcept(savedConcept);
    setConceptArticles(convertedArticles);
    setConceptChanged(false);
    return savedConcept;
  };

  const updateConceptAndStatus = async (
    id: number,
    conceptPatch: IUpdatedConcept,
    newStatus: ConceptStatusType,
    dirty: boolean,
  ): Promise<IConcept> => {
    const newConcept = dirty
      ? await conceptApi.updateConcept(id, conceptPatch)
      : await conceptApi.fetchConcept(id, conceptPatch.language);
    const convertedArticles = await fetchElementList(newConcept.articleIds);
    const conceptChangedStatus = await conceptApi.updateConceptStatus(id, newStatus);
    const updatedConcept = {
      ...newConcept,
      status: conceptChangedStatus.status,
    };
    setConcept(updatedConcept);
    setConceptArticles(convertedArticles);
    setConceptChanged(false);
    return updatedConcept;
  };

  return {
    concept,
    createConcept,
    fetchSearchTags,
    loading,
    setConcept: (concept: IConcept) => {
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
