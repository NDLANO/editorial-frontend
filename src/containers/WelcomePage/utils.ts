/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Node } from "@ndla/types-taxonomy";
import {
  TAXONOMY_CUSTOM_FIELD_SUBJECT_DESK_RESPONSIBLE,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LANGUAGE_RESPONSIBLE,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
} from "../../constants";

export type SubjectIdObject = {
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA]: string[];
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_DESK_RESPONSIBLE]: string[];
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_LANGUAGE_RESPONSIBLE]: string[];
};

export const defaultSubjectIdObject: SubjectIdObject = {
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA]: [],
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_DESK_RESPONSIBLE]: [],
  [TAXONOMY_CUSTOM_FIELD_SUBJECT_LANGUAGE_RESPONSIBLE]: [],
};

export const getResultSubjectIdObject = (ndlaId: string | undefined, nodes: Node[] | undefined): SubjectIdObject => {
  if (!nodes) return defaultSubjectIdObject;
  return nodes.reduce((acc, res) => {
    if (res.metadata && res.metadata.customFields) {
      const customFields = res.metadata.customFields;

      if (customFields.subjectLMA === ndlaId) {
        acc.subjectLMA.push(res.id);
      }

      if (customFields.subjectDeskResponsible === ndlaId) {
        acc.subjectDeskResponsible.push(res.id);
      }

      if (customFields.subjectLanguageResponsible === ndlaId) {
        acc.subjectLanguageResponsible.push(res.id);
      }
    }

    return acc;
  }, defaultSubjectIdObject);
};

export const customFieldsBody = (ndlaId: string) => ({
  pageSize: 300,
  customFields: {
    [TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA]: ndlaId,
    [TAXONOMY_CUSTOM_FIELD_SUBJECT_LANGUAGE_RESPONSIBLE]: ndlaId,
    [TAXONOMY_CUSTOM_FIELD_SUBJECT_DESK_RESPONSIBLE]: ndlaId,
  },
});
