/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps } from "formik";
import { useTranslation } from "react-i18next";
import { FormControl, Label, RadioButtonGroup, RadioButtonItem } from "@ndla/forms";
import { StyledFieldset, RadioButtonWrapper, StyledLegend } from "../../../components/Form/styles";

interface Props {
  field: FieldInputProps<string>;
}

const AvailabilityField = ({ field }: Props) => {
  const { t } = useTranslation();
  const availabilityValues: string[] = ["everyone", "teacher"];

  return (
    <FormControl id="availability">
      <RadioButtonGroup
        onValueChange={(value: string) =>
          field.onChange({
            target: {
              name: field.name,
              value: value,
            },
          })
        }
        orientation="horizontal"
        defaultValue={field.value}
        asChild
      >
        <StyledFieldset>
          <StyledLegend margin="none" textStyle="label-small">
            {t("form.availability.description")}
          </StyledLegend>
          {availabilityValues.map((value) => (
            <RadioButtonWrapper key={value}>
              <RadioButtonItem id={`availability-${value}`} value={value} />
              <Label htmlFor={`availability-${value}`} margin="none" textStyle="label-small">
                {t(`form.availability.${value}`)}
              </Label>
            </RadioButtonWrapper>
          ))}
        </StyledFieldset>
      </RadioButtonGroup>
    </FormControl>
  );
};

export default AvailabilityField;
