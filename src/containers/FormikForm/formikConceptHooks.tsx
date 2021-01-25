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
import { fetchSearchTags, fetchStatusStateMachine } from '../../modules/concept/conceptApi';
import { fetchDraft } from '../../modules/draft/draftApi';
import {
  transformApiToFormikVersion,
  transformFormikToUpdatedApiVersion,
  transformFormikToNewApiVersion,
} from '../../util/conceptUtil';
import handleError from '../../util/handleError';
import {
  ConceptFormikType,
  ConceptStatusType,
  ConceptApiType,
} from '../../modules/concept/conceptApiInterfaces';
import { ArticleType } from '../../interfaces';

export function useFetchConceptData(conceptId: number, locale: string) {
  const [concept, setConcept] = useState<ConceptFormikType>();
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
        setConcept(transformApiToFormikVersion(concept, locale, convertedArticles));
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

  const fetchElementList = async (articleIds: number[]): Promise<ArticleType[]> => {
    return Promise.all(
      articleIds.map(async elementId => {
        return fetchDraft(elementId);
      }),
    );
  };

  const updateConcept = async (updatedConcept: ConceptFormikType): Promise<ConceptApiType> => {
    const savedConcept = await conceptApi.updateConcept(
      transformFormikToUpdatedApiVersion(updatedConcept, locale),
    );

    setConcept(transformApiToFormikVersion(savedConcept, locale, updatedConcept.articleIds));
    return savedConcept;
  };

  const createConcept = async (createdConcept: ConceptFormikType) => {
    const savedConcept = await conceptApi.addConcept(
      transformFormikToNewApiVersion(createdConcept, locale),
    );
    setConcept(transformApiToFormikVersion(savedConcept, locale, createdConcept.articleIds));
    return savedConcept;
  };

  const updateConceptAndStatus = async (
    updatedConcept: ConceptFormikType,
    newStatus: keyof typeof ConceptStatusType,
    dirty: boolean,
  ) => {
    let newConcept = updatedConcept;
    if (dirty) {
      const savedConcept = await conceptApi.updateConcept(
        transformFormikToUpdatedApiVersion(updatedConcept, locale),
      );
      newConcept = transformApiToFormikVersion(savedConcept, locale, updatedConcept.articleIds);
    }
    const conceptChangedStatus = await conceptApi.updateConceptStatus(updatedConcept.id, newStatus);
    setConcept({
      ...newConcept,
      status: conceptChangedStatus.status,
      revision: conceptChangedStatus.revision,
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
