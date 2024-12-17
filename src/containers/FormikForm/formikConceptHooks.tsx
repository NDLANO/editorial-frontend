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
import { IArticleDTO, IUserDataDTO } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import { LAST_UPDATED_SIZE, TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from "../../constants";
import * as conceptApi from "../../modules/concept/conceptApi";
import { fetchDraft } from "../../modules/draft/draftApi";
import { useUpdateUserDataMutation, useUserData } from "../../modules/draft/draftQueries";
import { fetchNodes } from "../../modules/nodes/nodeApi";
import handleError from "../../util/handleError";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

export function useFetchConceptData(conceptId: number | undefined, locale: string) {
  const [concept, setConcept] = useState<IConceptDTO>();
  const [conceptArticles, setConceptArticles] = useState<IArticleDTO[]>([]);
  const [conceptChanged, setConceptChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Node[]>([]);
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
      const fetchedSubjects = await fetchNodes({
        language: locale,
        nodeType: "SUBJECT",
        key: TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
        value: "true",
        taxonomyVersion,
      });
      setSubjects(fetchedSubjects);
    };
    fetchSubjects();
  }, [locale, taxonomyVersion]);

  const fetchElementList = async (articleIds?: number[]): Promise<IArticleDTO[]> => {
    const promises = articleIds?.map((id) => fetchDraft(id)) ?? [];
    return await Promise.all(promises);
  };

  const updateUserData = async (userData?: IUserDataDTO) => {
    if (!userData || !conceptId) return;
    const latestEdited = uniq([conceptId?.toString()].concat(userData?.latestEditedConcepts ?? []));
    const latestEditedConcepts = latestEdited.slice(0, LAST_UPDATED_SIZE);
    mutateAsync({ latestEditedConcepts });
  };

  const updateConcept = async (id: number, updatedConcept: IUpdatedConceptDTO): Promise<IConceptDTO> => {
    const savedConcept = await conceptApi.updateConcept(id, updatedConcept);
    const convertedArticles = await fetchElementList(savedConcept.articleIds);
    setConcept(savedConcept);
    setConceptArticles(convertedArticles);
    setConceptChanged(false);
    updateUserData(data);
    return savedConcept;
  };

  const createConcept = async (createdConcept: INewConceptDTO) => {
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
    loading,
    setConcept: (concept: IConceptDTO) => {
      setConcept(concept);
      setConceptChanged(true);
    },
    conceptChanged,
    subjects,
    conceptArticles,
    updateConcept,
  };
}
