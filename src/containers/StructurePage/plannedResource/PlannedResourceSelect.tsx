/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { FieldErrorMessage, Label } from "@ndla/forms";
import { Select, SingleValue, Option } from "@ndla/select";
import { FormControl, FormField } from "../../../components/FormField";

interface Props {
  label: string;
  fieldName: string;
  id: string;
  isRequired?: boolean;
  placeholder: string;
  options: Option[];
  defaultValue?: Option;
}

const SelectWrapper = styled.div`
  position: relative;
`;

const PlannedResourceSelect = ({ label, fieldName, id, placeholder, options = [], defaultValue }: Props) => {
  const { t } = useTranslation();
  return (
    <FormField name={fieldName}>
      {({ meta, helpers }) => (
        <SelectWrapper>
          <FormControl isInvalid={!!meta.error}>
            <Label textStyle="label-small" margin="none">
              {t(label)}
            </Label>
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
              onChange={(value: SingleValue) => helpers.setValue(value?.value)}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FormControl>
        </SelectWrapper>
      )}
    </FormField>
  );
};

export default PlannedResourceSelect;
