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
import {
  transformConceptFromApiVersion,
  transformConceptToApiVersion,
} from '../../util/conceptUtil';
import handleError from '../../util/handleError';

export function useFetchConceptData(conceptId, locale) {
  const [concept, setConcept] = useState(undefined);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConcept();
  }, [conceptId, locale]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchConcept = async () => {
    try {
      if (conceptId) {
        setLoading(true);
        const concept = await conceptApi.fetchConcept(conceptId, locale);
        const articleIds = await fetchElementList(concept.articleIds);
        setConcept(transformConceptFromApiVersion(concept, locale, articleIds));
        setLoading(false);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const fetchElementList = async articleIds => {
    return await Promise.all(
      articleIds.map(async elementId => {
        return fetchDraft(elementId);
      }),
    );
  };

  const fetchSubjects = async () => {
    const fetchedSubjects = await taxonomyApi.fetchSubjects();
    setSubjects(fetchedSubjects);
  };

  const updateConcept = async updatedConcept => {
    const articleIds = updatedConcept.articleIds.map(articleId => articleId.id);
    const savedConcept = await conceptApi.updateConcept(
      transformConceptToApiVersion(updatedConcept, articleIds),
    );
    setConcept(transformConceptFromApiVersion(savedConcept, locale));
    return savedConcept;
  };

  const createConcept = async createdConcept => {
    const articleIds = createdConcept.articleIds.map(articleId => articleId.id);
    const savedConcept = await conceptApi.addConcept(
      transformConceptToApiVersion(createdConcept, articleIds),
    );
    setConcept(transformConceptFromApiVersion(savedConcept, locale));
    return savedConcept;
  };

  const updateConceptAndStatus = async (updatedConcept, newStatus, dirty) => {
    const articleIds = updatedConcept.articleIds.map(articleId => articleId.id);
    let newConcept = updatedConcept;
    if (dirty) {
      const savedConcept = await conceptApi.updateConcept(
        transformConceptToApiVersion(updatedConcept, articleIds),
      );
      newConcept = transformConceptFromApiVersion(savedConcept, locale);
    }
    const conceptChangedStatus = await conceptApi.updateConceptStatus(
      updatedConcept.id,
      newStatus,
    );
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
