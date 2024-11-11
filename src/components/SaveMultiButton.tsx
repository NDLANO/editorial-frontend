/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { SerializedStyles, css } from "@emotion/react";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { CheckboxCircleFill } from "@ndla/icons/editor";
import MultiButton from "./MultiButton";

type SaveModifiers = "save" | "saving" | "saved";

const StyledSpan = styled("span")`
  display: flex;
  justify-content: space-evenly;
`;

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

const Wrapper = styled("div")`
  div > button:disabled {
    ${(props: { modifier: SaveModifiers }) => {
      return saveButtonAppearances[props.modifier];
    }}
  }
`;

const StyledCheck = styled(CheckboxCircleFill)`
  width: 1.45rem;
  height: 1.45rem;
`;

interface Props {
  isSaving: boolean;
  saveId?: string;
  showSaved: boolean;
  formIsDirty?: boolean;
  large?: boolean;
  disabled: boolean;
  onClick: (saveAsNew: boolean) => void;
  clippedButton?: boolean;
  hideSecondaryButton?: boolean;
}

const SaveMultiButton = ({
  isSaving,
  showSaved,
  formIsDirty = true,
  large,
  disabled,
  onClick,
  saveId,
  hideSecondaryButton,
  ...rest
}: Props) => {
  const getModifier = (): SaveModifiers => {
    if (isSaving) return "saving";
    if (showSaved) return "saved";
    return "save";
  };

  const { t } = useTranslation();
  const modifier = getModifier();
  const disabledButton = isSaving || !formIsDirty || disabled;

  return (
    <>
      <Wrapper modifier={modifier} data-testid="saveLearningResourceButtonWrapper">
        <MultiButton
          mainId={saveId}
          disabled={disabledButton}
          onClick={(value: string) => {
            const saveAsNewVersion = value === "saveAsNew";
            onClick(saveAsNewVersion);
          }}
          mainButton={{ value: "save", label: "" }}
          secondaryButtons={
            hideSecondaryButton
              ? []
              : [
                  {
                    label: t("form.saveAsNewVersion"),
                    value: "saveAsNew",
                    enable: !isSaving,
                  },
                  {
                    label: t("form.save"),
                    value: "save",
                    enable: !disabledButton,
                  },
                ]
          }
          large
          {...rest}
        >
          <StyledSpan>
            {t(`form.${modifier}`)}
            {showSaved && <StyledCheck />}
          </StyledSpan>
        </MultiButton>
      </Wrapper>
    </>
  );
};

export default SaveMultiButton;
