/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent } from "react";
import { DateChangedEvent } from "../../../FormikForm/components/InlineDatePicker";

type FormEvents = FormEvent<HTMLInputElement> | FormEvent<HTMLSelectElement>;
type FieldChangedEvent = FormEvents | DateChangedEvent;

export type OnFieldChangeFunction = <T extends keyof SearchParams>(
  name: T,
  value: SearchParams[T],
  event?: FieldChangedEvent,
) => void;

export interface SearchParams {
  query?: string;
  "draft-status"?: string;
  "include-other-statuses"?: boolean;
  "resource-types"?: string;
  "article-types"?: string;
  "audio-type"?: string;
  fallback?: boolean;
  language?: string;
  page?: number;
  "page-size"?: number;
  status?: string;
  subjects?: string;
  users?: string;
  sort?: string;
  license?: string;
  "model-released"?: string;
  "revision-date-from"?: string;
  "revision-date-to"?: string;
  "exclude-revision-log"?: boolean | undefined;
  "responsible-ids"?: string;
  "concept-type"?: string;
  "filter-inactive"?: boolean;
}
