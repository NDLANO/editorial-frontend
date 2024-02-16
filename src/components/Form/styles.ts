/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { colors, fonts, spacing } from "@ndla/core";
import { FormControl, Label, RadioButtonGroup } from "@ndla/forms";
import { Text } from "@ndla/typography";

export const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.xsmall};
`;

// Radio button styles
export const StyledFieldset = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  gap: ${spacing.medium};
  margin: ${spacing.small} 0;
`;

export const StyledFormControl = styled(FormControl)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.small};
  color: ${colors.brand.primary};
`;

export const StyledRadioButtonGroup = styled(RadioButtonGroup)`
  display: flex;
  flex-direction: row;
  gap: ${spacing.normal};
`;

export const StyledText = styled(Text)`
  float: left;
`;

export const StyledLabel = styled(Label)`
  // Custom styling needed when component is wrapped in FormikField component to override label styling coming from StyledField
  &[data-label] {
    font-size: ${fonts.size.text.label.small};
  }
`;
