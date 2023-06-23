/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { IConcept, INewConcept, IUpdatedConcept } from '@ndla/types-backend/concept-api';
import { IArticle, IUserData } from '@ndla/types-backend/draft-api';
import uniq from 'lodash/uniq';
import * as conceptApi from '../../modules/concept/conceptApi';
import * as taxonomyApi from '../../modules/taxonomy';
import { fetchSearchTags } from '../../modules/concept/conceptApi';
import { fetchDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from '../../constants';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';
import { useUpdateUserDataMutation, useUserData } from '../../modules/draft/draftQueries';

export function useFetchConceptData(conceptId: number | undefined, locale: string) {
  const [concept, setConcept] = useState<IConcept>();
  const [conceptArticles, setConceptArticles] = useState<IArticle[]>([]);
  const [conceptChanged, setConceptChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync } = useUpdateUserDataMutation();
  const { data } = useUserData();

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
    const promises = articleIds?.map((id) => fetchDraft(id)) ?? [];
    return await Promise.all(promises);
  };

  const updateUserData = async (userData?: IUserData) => {
    if (!userData || !conceptId) return;
    const latestEdited = uniq([conceptId?.toString()].concat(userData?.latestEditedConcepts ?? []));
    const latestEditedConcepts = latestEdited.slice(0, 10);
    mutateAsync({ latestEditedConcepts });
  };

  const updateConcept = async (id: number, updatedConcept: IUpdatedConcept): Promise<IConcept> => {
    const savedConcept = await conceptApi.updateConcept(id, updatedConcept);
    const convertedArticles = await fetchElementList(savedConcept.articleIds);
    setConcept(savedConcept);
    setConceptArticles(convertedArticles);
    setConceptChanged(false);
    updateUserData(data);
    return savedConcept;
  };

  const createConcept = async (createdConcept: INewConcept) => {
    const savedConcept = await conceptApi.addConcept(createdConcept);
    const convertedArticles = await fetchElementList(savedConcept.articleIds);
    setConcept(savedConcept);
    setConceptArticles(convertedArticles);
    setConceptChanged(false);
    updateUserData(data);

    return savedConcept;
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
  };
}
