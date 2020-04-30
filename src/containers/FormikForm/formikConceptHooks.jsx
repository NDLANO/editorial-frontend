import { useState, useEffect } from 'react';
import * as conceptApi from '../../modules/concept/conceptApi';
import * as taxonomyApi from '../../modules/taxonomy';
import { transformConceptFromApiVersion } from '../../util/conceptUtil';
import handleError from '../../util/handleError';

export function useFetchConceptData(conceptId, locale) {
  const [concept, setConcept] = useState(undefined);
  const [subjects, setSubjects] = useState([]);
  const fetchConcept = async () => {
    try {
      if (conceptId) {
        const concept = await conceptApi.fetchConcept(conceptId, locale);
        setConcept(transformConceptFromApiVersion(concept, locale));
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

  const fetchStateStatuses = async () => {
    return await conceptApi.fetchStatusStateMachine();
  };

  const fetchConceptTags = async (input, language) => {
    return await conceptApi.fetchSearchTags(input, language);
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
    updateConcept,
    subjects,
    updateConceptAndStatus,
    fetchStateStatuses,
    fetchConceptTags,
  };
}
