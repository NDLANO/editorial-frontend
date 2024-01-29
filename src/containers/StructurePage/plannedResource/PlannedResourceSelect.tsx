/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps } from "formik";
import { useTranslation } from "react-i18next";
import { Select, SingleValue, Option } from "@ndla/select";
import { StyledFormikField, StyledLabel } from "./PlannedResourceForm";

interface Props {
  label: string;
  fieldName: string;
  id: string;
  placeholder: string;
  options: Option[];
  defaultValue?: Option;
}

const PlannedResourceSelect = ({ label, fieldName, id, placeholder, options = [], defaultValue }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledFormikField name={fieldName}>
      {({ field }: FieldProps) => (
        <>
          <StyledLabel htmlFor={id}>{t(label)}</StyledLabel>
          <Select<false>
            id={id}
            options={options}
            placeholder={t(placeholder)}
            required
            inModal
            isSearchable
            matchFrom="any"
            defaultValue={defaultValue}
            noOptionsMessage={() => t("form.responsible.noResults")}
            onChange={(value: SingleValue) =>
              field.onChange({
                target: { name: field.name, value: value?.value },
              })
            }
          />
        </>
      )}
    </StyledFormikField>
  );
};

export default PlannedResourceSelect;
