/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import FormikFieldHelp from "./FormikFieldHelp";

interface Props {
  value: string;
  maxLength: number;
  getRemainingLabel: (maxLength: number, remaining: number) => ReactNode;
}

export const FormikRemainingCharacters = ({ value, maxLength, getRemainingLabel }: Props) => {
  const currentLength = value ? value.length : 0;
  return <FormikFieldHelp float="right">{getRemainingLabel(maxLength, maxLength - currentLength)}</FormikFieldHelp>;
};

export default FormikRemainingCharacters;
