import { useState, useEffect } from 'react';
import * as conceptApi from '../../modules/concept/conceptApi';
import { transformConceptFromApiVersion } from '../../util/conceptUtil';

export function useFetchConceptData(conceptId, locale) {
  let [concept, setConcept] = useState(undefined);

  const fetchArticle = async () => {
    if (conceptId) {
      const article = await conceptApi.fetchConcept(conceptId, locale);
      setConcept(transformConceptFromApiVersion(article, locale));
    }
  };

  /*const updateConcept = async updatedConcept => {
    const savedConcept = await conceptApi.updateDraft(updatedConcept);
    setConcept(transformConceptFromApiVersion(savedConcept, locale));
    return savedConcept;
  };*/

  const createConcept = async createdConcept => {
    const savedConcept = await conceptApi.addConcept(createdConcept);
    setConcept(transformConceptFromApiVersion(savedConcept, locale));
    return savedConcept;
  };

  useEffect(() => {
    fetchArticle();
  }, [conceptId, locale]);

  return { concept, createConcept };
}
