/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent } from "react";
import { SearchParams } from "./SearchForm";
import { DateChangedEvent } from "../../../FormikForm/components/InlineDatePicker";

type FormEvents = FormEvent<HTMLInputElement> | FormEvent<HTMLSelectElement>;
type FieldChangedEvent = FormEvents | DateChangedEvent;

export type OnFieldChangeFunction = <T extends keyof SearchParams>(
  name: T,
  value: SearchParams[T],
  event?: FieldChangedEvent,
) => void;
