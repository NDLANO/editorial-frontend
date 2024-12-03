/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { SearchParams } from "./SearchForm";
import { OnFieldChangeFunction } from "./types";
import ObjectSelector, { SelectOption } from "../../../../components/ObjectSelector";

export type SelectElement = {
  name: keyof SearchParams;
  options: SelectOption[];
};

interface Props {
  selectElements: SelectElement[];
  searchObject: SearchParams;
  onFieldChange: OnFieldChangeFunction;
}

export const SelectRenderer = ({ selectElements, searchObject, onFieldChange }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      {selectElements.map((selectElement) => (
        <ObjectSelector
          key={selectElement.name}
          name={selectElement.name}
          placeholder={t(`searchForm.types.${selectElement.name}`)}
          value={(searchObject[selectElement.name] as string) ?? ""}
          options={selectElement.options}
          onChange={(value) => onFieldChange(selectElement.name, value)}
        />
      ))}
    </>
  );
};
