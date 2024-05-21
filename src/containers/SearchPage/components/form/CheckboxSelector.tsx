/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, fonts } from "@ndla/core";
import { CheckboxItem, Label } from "@ndla/forms";
import { CheckboxWrapper } from "../../../../components/Form/styles";

interface Props {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  name: string;
}

const StyledLabel = styled(Label)`
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.normal};
`;

const CheckboxSelector = ({ name, checked, onCheckedChange }: Props) => {
  const { t } = useTranslation();

  return (
    <CheckboxWrapper>
      <CheckboxItem id={`checkbox-${name}`} checked={checked} onCheckedChange={onCheckedChange} />
      <StyledLabel margin="none" textStyle="label-small" htmlFor={`checkbox-${name}`}>
        {t(`searchForm.types.${name}`)}
      </StyledLabel>
    </CheckboxWrapper>
  );
};

export default CheckboxSelector;
