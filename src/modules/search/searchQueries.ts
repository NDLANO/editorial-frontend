/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IMultiSearchResult } from "@ndla/types-backend/search-api";
import { search } from "./searchApi";
import { MultiSearchApiQuery } from "./searchApiInterfaces";
import {
  DA_SUBJECT_ID,
  FAVOURITES_SUBJECT_ID,
  SA_SUBJECT_ID,
  LMA_SUBJECT_ID,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_DA,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_SA,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
} from "../../constants";
import { useTaxonomyVersion } from "../../containers/StructureVersion/TaxonomyVersionProvider";
import {
  SubjectIdObject,
  customFieldsBody,
  defaultSubjectIdObject,
  getResultSubjectIdObject,
} from "../../containers/WelcomePage/utils";
import { SEARCH } from "../../queryKeys";
import { getAccessToken, getAccessTokenPersonal } from "../../util/authHelpers";
import { isValid } from "../../util/jwtHelper";
import { useUserData } from "../draft/draftQueries";
import { usePostSearchNodesMutation } from "../nodes/nodeMutations";

export const searchQueryKeys = {
  search: (params?: Partial<MultiSearchApiQuery>) => [SEARCH, params] as const,
};

const getActualQuery = (query: UseSearch, favoriteSubjects: string[] | undefined, subjectIdObject: SubjectIdObject) => {
  let subjects;

  if (query.subjects === FAVOURITES_SUBJECT_ID) {
    subjects = favoriteSubjects?.join(",");
  } else if (query.subjects === LMA_SUBJECT_ID) {
    subjects = subjectIdObject[TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA].join(",");
  } else if (query.subjects === SA_SUBJECT_ID) {
    subjects = subjectIdObject[TAXONOMY_CUSTOM_FIELD_SUBJECT_SA].join(",");
  } else if (query.subjects === DA_SUBJECT_ID) {
    subjects = subjectIdObject[TAXONOMY_CUSTOM_FIELD_SUBJECT_DA].join(",");
  } else {
    subjects = query.subjects;
  }

  return {
    ...query,
    subjects: subjects,
  };
};

export interface UseSearch extends MultiSearchApiQuery {
  favoriteSubjects?: string[];
}

export const useSearch = (query: UseSearch, options?: Partial<UseQueryOptions<IMultiSearchResult>>) => {
  const [subjectIdObject, setSubjectIdObject] = useState<SubjectIdObject>(defaultSubjectIdObject);

  const { taxonomyVersion } = useTaxonomyVersion();

  const isFavourite = query.subjects === FAVOURITES_SUBJECT_ID;

  const { data, isLoading } = useUserData({
    enabled: !!isFavourite && isValid(getAccessToken()) && getAccessTokenPersonal(),
  });

  const { mutateAsync: postSearchNodes, isPending } = usePostSearchNodesMutation();

  useEffect(() => {
    const isLMASubjects = query.subjects === LMA_SUBJECT_ID;
    const isDASubjects = query.subjects === DA_SUBJECT_ID;
    const isSASubjects = query.subjects === SA_SUBJECT_ID;

    const updateSubjectId = async () => {
      if (!data?.userId || (!isLMASubjects && !isDASubjects && !isSASubjects)) return [];
      const nodesSearchResult = await postSearchNodes({
        body: customFieldsBody(data.userId),
        taxonomyVersion,
      });
      const resultSubjectIdObject = getResultSubjectIdObject(data.userId, nodesSearchResult.results);
      setSubjectIdObject(resultSubjectIdObject);
    };
    updateSubjectId();
  }, [data?.userId, postSearchNodes, query.subjects, taxonomyVersion]);

  const actualQuery = getActualQuery(query, data?.favoriteSubjects, subjectIdObject);

  return useQuery<IMultiSearchResult>({
    queryKey: searchQueryKeys.search(actualQuery),
    queryFn: () => search(actualQuery),
    ...options,
    enabled: options?.enabled && !isLoading && !isPending,
  });
};
