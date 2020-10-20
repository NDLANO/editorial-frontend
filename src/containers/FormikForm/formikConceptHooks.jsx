import { useState, useEffect } from 'react';
import * as conceptApi from '../../modules/concept/conceptApi';
import * as taxonomyApi from '../../modules/taxonomy';
import {
  fetchSearchTags,
  fetchStatusStateMachine,
} from '../../modules/concept/conceptApi';
import { transformConceptFromApiVersion } from '../../util/conceptUtil';
import handleError from '../../util/handleError';

export function useFetchConceptData(conceptId, locale) {
  const [concept, setConcept] = useState(undefined);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchConcept = async () => {
    try {
      if (conceptId) {
        setLoading(true);
        const concept = await conceptApi.fetchConcept(conceptId, locale);
        setConcept(transformConceptFromApiVersion(concept, locale));
        setLoading(false);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const fetchSubjects = async () => {
    const fetchedSubjects = await taxonomyApi.fetchSubjects();
    setSubjects(fetchedSubjects);
  };

  const updateConcept = async updatedConcept => {
    const savedConcept = await conceptApi.updateConcept(updatedConcept);
    setConcept(transformConceptFromApiVersion(savedConcept, locale));
    return savedConcept;
  };

  const createConcept = async createdConcept => {
    const savedConcept = await conceptApi.addConcept(createdConcept);
    setConcept(transformConceptFromApiVersion(savedConcept, locale));
    return savedConcept;
  };

  const updateConceptAndStatus = async (updatedConcept, newStatus, dirty) => {
    let newConcept = updatedConcept;
    if (dirty) {
      const savedConcept = await conceptApi.updateConcept(updatedConcept);
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

  useEffect(() => {
    fetchConcept();
  }, [conceptId, locale]);

  useEffect(() => {
    fetchSubjects();
  }, []);

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
