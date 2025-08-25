/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface SelectItem {
  label: string;
  value: string;
}

export type SortOptionWorkList =
  | "title"
  | "responsibleLastUpdated"
  | "status"
  | "resourceType"
  | "parentTopicName"
  | "primaryRoot";

export type SortOptionConceptList = "title" | "responsibleLastUpdated" | "status" | "subject" | "conceptType";

export type SortOptionLastUsed = "title" | "status" | "lastUpdated";
