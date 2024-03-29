/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Fieldset, Legend } from "@ndla/forms";
import { FormControl } from "../FormField";

export const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.xsmall};
`;

// Radio button styles
export const StyledFormControl = styled(FormControl)`
  margin-top: ${spacing.small};
`;

export const RadioButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
  color: ${colors.brand.primary};
`;
export const FieldsetRow = styled(Fieldset)`
  display: flex;
  gap: ${spacing.small};
`;

export const LeftLegend = styled(Legend)`
  float: left;
`;
