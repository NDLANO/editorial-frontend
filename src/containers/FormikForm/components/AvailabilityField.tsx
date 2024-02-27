/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps } from "formik";
import { useTranslation } from "react-i18next";
import { Label, RadioButtonGroup, RadioButtonItem } from "@ndla/forms";
import { FieldsetRow, RadioButtonWrapper, LeftLegend, StyledFormControl } from "../../../components/Form/styles";

interface Props {
  field: FieldInputProps<string>;
}

const AvailabilityField = ({ field }: Props) => {
  const { t } = useTranslation();
  const availabilityValues: string[] = ["everyone", "teacher"];

  return (
    <StyledFormControl>
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
        <FieldsetRow>
          <LeftLegend margin="none" textStyle="label-small">
            {t("form.availability.description")}
          </LeftLegend>
          {availabilityValues.map((value) => (
            <RadioButtonWrapper key={value}>
              <RadioButtonItem id={`availability-${value}`} value={value} />
              <Label htmlFor={`availability-${value}`} margin="none" textStyle="label-small">
                {t(`form.availability.${value}`)}
              </Label>
            </RadioButtonWrapper>
          ))}
        </FieldsetRow>
      </RadioButtonGroup>
    </StyledFormControl>
  );
};

export default AvailabilityField;
