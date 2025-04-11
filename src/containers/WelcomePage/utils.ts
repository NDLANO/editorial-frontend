/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node } from "@ndla/types-taxonomy";
import {
  TAXONOMY_CUSTOM_FIELD_SUBJECT_DA,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_SA,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
  FAVOURITES_SUBJECT_ID,
  LMA_SUBJECT_ID,
  SA_SUBJECT_ID,
  DA_SUBJECT_ID,
} from "../../constants";
import { SearchParamsBody } from "../SearchPage/components/form/SearchForm";

export interface SubjectData {
  id: string;
  name: string;
}

export type SubjectIdObject = {
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA]: SubjectData[];
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_DA]: SubjectData[];
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_SA]: SubjectData[];
};

export const defaultSubjectIdObject: SubjectIdObject = {
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA]: [],
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_DA]: [],
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_SA]: [],
};

export const getResultSubjectIdObject = (ndlaId: string | undefined, nodes: Node[] | undefined): SubjectIdObject => {
  if (!nodes) return defaultSubjectIdObject;
  const result = nodes.reduce(
    (acc, res) => {
      if (res.metadata && res.metadata.customFields) {
        const customFields = res.metadata.customFields;

        if (customFields.subjectLMA === ndlaId) {
          acc.subjectLMA.push({ id: res.id, name: res.name });
        }

        if (customFields.subjectDA === ndlaId) {
          acc.subjectDA.push({ id: res.id, name: res.name });
        }

        if (customFields.subjectSA === ndlaId) {
          acc.subjectSA.push({ id: res.id, name: res.name });
        }
      }
      return acc;
    },
    {
      [TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA]: [],
      [TAXONOMY_CUSTOM_FIELD_SUBJECT_DA]: [],
      [TAXONOMY_CUSTOM_FIELD_SUBJECT_SA]: [],
    } as SubjectIdObject,
  );
  return result;
};

export const customFieldsBody = (ndlaId: string) => ({
  pageSize: 300,
  customFields: {
    [TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA]: ndlaId,
    [TAXONOMY_CUSTOM_FIELD_SUBJECT_DA]: ndlaId,
    [TAXONOMY_CUSTOM_FIELD_SUBJECT_SA]: ndlaId,
  },
});

// Translate filter to correct subject ids for search
export const getSubjectsIdsQuery = (
  query: SearchParamsBody,
  favoriteSubjects: string[] | undefined = [],
  subjectIdObject: SubjectIdObject,
): SearchParamsBody => {
  if (!query.subjects) return query;
  let subjects;

  if (query.subjects.join("") === FAVOURITES_SUBJECT_ID) {
    subjects = favoriteSubjects;
  } else if (query.subjects.join("") === LMA_SUBJECT_ID) {
    subjects = subjectIdObject[TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA].map((s) => s.id);
  } else if (query.subjects.join("") === SA_SUBJECT_ID) {
    subjects = subjectIdObject[TAXONOMY_CUSTOM_FIELD_SUBJECT_SA].map((s) => s.id);
  } else if (query.subjects.join("") === DA_SUBJECT_ID) {
    subjects = subjectIdObject[TAXONOMY_CUSTOM_FIELD_SUBJECT_DA].map((s) => s.id);
  } else {
    subjects = query.subjects;
  }
  return {
    ...query,
    subjects: subjects,
  };
};
