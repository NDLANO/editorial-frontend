import { useState, useEffect } from 'react';
import * as conceptApi from '../../modules/concept/conceptApi';
import { transformConceptFromApiVersion } from '../../util/conceptUtil';

export function useFetchConceptData(conceptId, locale) {
  let [concept, setConcept] = useState(undefined);

  const fetchConcept = async () => {
    if (conceptId) {
      const concept = await conceptApi.fetchConcept(conceptId, locale);
      setConcept(transformConceptFromApiVersion(concept, locale));
    }
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

  useEffect(() => {
    fetchConcept();
  }, [conceptId, locale]);

  return { concept, createConcept, updateConcept };
}
