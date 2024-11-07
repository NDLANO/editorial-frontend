/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { css, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors } from "@ndla/core";
import { CheckboxCircleFill } from "@ndla/icons/editor";

export const saveButtonAppearances: Record<string, SerializedStyles> = {
  saved: css`
    &,
    &:hover,
    &:disabled {
      color: white;
      transition: all 0.5s ease;
      background-color: ${colors.support.green};
      border-color: ${colors.support.green};
    }
  `,
  saving: css`
    &,
    &:hover,
    &:disabled {
      color: white;
      transition: all 0.5s ease;
      background-color: ${colors.support.greenLight};
      border-color: ${colors.support.greenLight};
    }
  `,
};

const StyledSpan = styled("span")`
  display: flex;
  justify-content: space-evenly;
`;

const StyledCheck = styled(CheckboxCircleFill)`
  width: 1.45rem;
  height: 1.45rem;
`;

const shouldForwardProp = (p: string) => p !== "color";

const StyledSaveButton = styled(ButtonV2, { shouldForwardProp })`
  &,
  &:hover,
  &:disabled {
    color: white;
    transition: all 0.5s ease;
    background-color: ${(p) => p.color};
    border-color: ${(p) => p.color};
  }
`;

interface Props extends ComponentProps<typeof ButtonV2> {
  isSaving?: boolean;
  showSaved?: boolean;
  defaultText?: string;
  formIsDirty?: boolean;
}

const SaveButton = ({ isSaving, showSaved, defaultText, formIsDirty = true, disabled, ...rest }: Props) => {
  const getModifier = () => {
    if (isSaving) return "saving";
    if (showSaved) return "saved";
    return defaultText || "save";
  };

  const color = isSaving ? colors.support.greenLight : showSaved ? colors.support.green : undefined;
  const { t } = useTranslation();
  const modifier = getModifier();
  const disabledButton = isSaving || !formIsDirty || disabled;

  return (
    <>
      <StyledSaveButton disabled={disabledButton} color={color} {...rest}>
        <StyledSpan>
          {t(`form.${modifier}`)}
          {showSaved && <StyledCheck />}
        </StyledSpan>
      </StyledSaveButton>
    </>
  );
};

export default SaveButton;
