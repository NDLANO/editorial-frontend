/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing, stackOrder } from "@ndla/core";
import { CheckboxItem, Label, StyledButtonWrapper, TextArea } from "@ndla/forms";
import { CheckboxWrapper } from "../../../Form/styles";
import { FormControl } from "../../../FormField";
import { isEmpty } from "../../../validators";
import { useSlateContext } from "../../SlateContext";
import { useInGrid } from "../grid/GridContext";

export const StyledInputWrapper = styled.div`
  background: ${colors.brand.greyLightest};
  padding: ${spacing.normal};
  position: relative;
  z-index: ${stackOrder.offsetSingle};
`;

interface Props {
  caption?: string;
  alt: string;
  madeChanges: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onAbort: MouseEventHandler<HTMLButtonElement>;
  onSave: MouseEventHandler<HTMLButtonElement>;
  isDecorative?: boolean;
  border?: boolean;
  onBorderChecked: () => void;
  handleCheck: (isDecorative: boolean) => void;
  allowDecorative?: boolean;
}

const FigureInput = ({
  caption,
  alt,
  madeChanges,
  onChange,
  onAbort,
  onSave,
  isDecorative,
  handleCheck,
  allowDecorative,
  border,
  onBorderChecked,
}: Props) => {
  const inGrid = useInGrid();
  const { t } = useTranslation();
  const { submitted } = useSlateContext();

  return (
    <StyledInputWrapper>
      {caption !== undefined && (
        <TextArea
          name="caption"
          label={t("form.image.caption.label")}
          value={caption}
          onChange={onChange}
          type="text"
          placeholder={t("form.image.caption.placeholder")}
          white
        />
      )}
      {!isDecorative && (
        <TextArea
          name="alt"
          label={t("form.image.alt.label")}
          value={alt}
          onChange={onChange}
          type="text"
          placeholder={t("form.image.alt.placeholder")}
          white
          warningText={!submitted && isEmpty(alt) ? t("form.image.alt.noText") : ""}
        />
      )}
      {allowDecorative && (
        <FormControl>
          <CheckboxWrapper>
            <CheckboxItem checked={isDecorative} onCheckedChange={() => handleCheck(!isDecorative)} />
            <Label margin="none" textStyle="label-small">
              {t("form.image.isDecorative")}
            </Label>
          </CheckboxWrapper>
        </FormControl>
      )}
      {inGrid && (
        <FormControl>
          <CheckboxWrapper>
            <CheckboxItem checked={border} onCheckedChange={onBorderChecked} />
            <Label margin="none" textStyle="label-small">
              {t("form.image.showBorder")}
            </Label>
          </CheckboxWrapper>
        </FormControl>
      )}
      <StyledButtonWrapper paddingLeft>
        <ButtonV2 onClick={onAbort} variant="outline">
          {t("form.abort")}
        </ButtonV2>
        <ButtonV2 disabled={!madeChanges || (isEmpty(alt) && !isDecorative)} onClick={onSave}>
          {t("form.image.save")}
        </ButtonV2>
      </StyledButtonWrapper>
    </StyledInputWrapper>
  );
};

export default FigureInput;
