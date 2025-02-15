/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import uniq from "lodash/uniq";
import { useState, useEffect } from "react";
import { IConceptDTO, INewConceptDTO, IUpdatedConceptDTO } from "@ndla/types-backend/concept-api";
import { IUserDataDTO } from "@ndla/types-backend/draft-api";
import { LAST_UPDATED_SIZE } from "../../constants";
import * as conceptApi from "../../modules/concept/conceptApi";
import { useUpdateUserDataMutation, useUserData } from "../../modules/draft/draftQueries";
import handleError from "../../util/handleError";

export function useFetchConceptData(conceptId: number | undefined, locale: string) {
  const [concept, setConcept] = useState<IConceptDTO>();
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

  const updateUserData = async (userData?: IUserDataDTO) => {
    if (!userData || !conceptId) return;
    const latestEdited = uniq([conceptId?.toString()].concat(userData?.latestEditedConcepts ?? []));
    const latestEditedConcepts = latestEdited.slice(0, LAST_UPDATED_SIZE);
    mutateAsync({ latestEditedConcepts });
  };

  const updateConcept = async (id: number, updatedConcept: IUpdatedConceptDTO): Promise<IConceptDTO> => {
    const savedConcept = await conceptApi.updateConcept(id, updatedConcept);
    setConcept(savedConcept);
    setConceptChanged(false);
    updateUserData(data);
    return savedConcept;
  };

  const updateConceptStatus = async (id: number, status: string): Promise<IConceptDTO> => {
    const savedConcept = await conceptApi.updateConceptStatus(id, status);
    setConcept(savedConcept);
    setConceptChanged(false);
    updateUserData(data);
    return savedConcept;
  };

  const createConcept = async (createdConcept: INewConceptDTO) => {
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
    setConcept: (concept: IConceptDTO) => {
      setConcept(concept);
      setConceptChanged(true);
    },
    conceptChanged,
    updateConcept,
    updateConceptStatus,
  };
}
