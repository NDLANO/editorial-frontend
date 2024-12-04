/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import { CheckLine } from "@ndla/icons";
import { CheckboxControl, CheckboxHiddenInput, CheckboxIndicator, CheckboxLabel, CheckboxRoot } from "@ndla/primitives";

interface Props {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  name: string;
}

const CheckboxSelector = ({ name, checked, onCheckedChange }: Props) => {
  const { t } = useTranslation();

  return (
    <CheckboxRoot checked={checked} onCheckedChange={(details) => onCheckedChange(details.checked as boolean)}>
      <CheckboxControl>
        <CheckboxIndicator asChild>
          <CheckLine />
        </CheckboxIndicator>
      </CheckboxControl>
      <CheckboxLabel>{t(`searchForm.types.${name}`)}</CheckboxLabel>
      <CheckboxHiddenInput />
    </CheckboxRoot>
  );
};

export default CheckboxSelector;
