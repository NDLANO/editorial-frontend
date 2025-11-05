/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { uniq } from "lodash-es";
import { useState, useEffect } from "react";
import { ConceptDTO, NewConceptDTO, UpdatedConceptDTO } from "@ndla/types-backend/concept-api";
import { UserDataDTO } from "@ndla/types-backend/draft-api";
import { LAST_UPDATED_SIZE } from "../../constants";
import * as conceptApi from "../../modules/concept/conceptApi";
import { useUpdateUserDataMutation, useUserData } from "../../modules/draft/draftQueries";
import handleError from "../../util/handleError";

export function useFetchConceptData(conceptId: number | undefined, locale: string) {
  const [concept, setConcept] = useState<ConceptDTO>();
  const [conceptChanged, setConceptChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const { mutateAsync } = useUpdateUserDataMutation();
  const { data } = useUserData();

  useEffect(() => {
    const fetchConcept = async (): Promise<void> => {
      try {
        if (conceptId) {
          setLoading(true);
          const concept = await conceptApi.fetchConcept(conceptId, locale);
          setConcept(concept);
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

  const updateUserData = async (userData?: UserDataDTO) => {
    if (!userData || !conceptId) return;
    const latestEdited = uniq([conceptId?.toString()].concat(userData?.latestEditedConcepts ?? []));
    const latestEditedConcepts = latestEdited.slice(0, LAST_UPDATED_SIZE);
    mutateAsync({ latestEditedConcepts });
  };

  const updateConcept = async (id: number, updatedConcept: UpdatedConceptDTO): Promise<ConceptDTO> => {
    const savedConcept = await conceptApi.updateConcept(id, updatedConcept);
    setConcept(savedConcept);
    setConceptChanged(false);
    updateUserData(data);
    return savedConcept;
  };

  const updateConceptStatus = async (id: number, status: string): Promise<ConceptDTO> => {
    const savedConcept = await conceptApi.updateConceptStatus(id, status);
    setConcept(savedConcept);
    setConceptChanged(false);
    updateUserData(data);
    return savedConcept;
  };

  const createConcept = async (createdConcept: NewConceptDTO) => {
    const savedConcept = await conceptApi.addConcept(createdConcept);
    setConcept(savedConcept);
    setConceptChanged(false);
    updateUserData(data);

    return savedConcept;
  };

  return {
    concept,
    createConcept,
    loading,
    setConcept: (concept: ConceptDTO) => {
      setConcept(concept);
      setConceptChanged(true);
    },
    conceptChanged,
    updateConcept,
    updateConceptStatus,
  };
}
