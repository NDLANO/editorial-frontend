/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps } from "formik";
import { useTranslation } from "react-i18next";
import { RadioButtonItem } from "@ndla/forms";
import {
  StyledFieldset,
  StyledFormControl,
  StyledRadioButtonGroup,
  StyledText,
  StyledLabel,
} from "../../../components/Form/styles";

interface Props {
  field: FieldInputProps<string>;
}

const AvailabilityField = ({ field }: Props) => {
  const { t } = useTranslation();
  const availabilityValues: string[] = ["everyone", "teacher"];

  return (
    <StyledFieldset>
      <StyledText margin="none" textStyle="label-small" element="legend">
        {t("form.availability.description")}
      </StyledText>
      <StyledRadioButtonGroup
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
      >
        {availabilityValues.map((value) => (
          <StyledFormControl id={value} key={value}>
            <RadioButtonItem value={value} />
            <StyledLabel margin="none" textStyle="label-small" data-label="">
              {t(`form.availability.${value}`)}
            </StyledLabel>
          </StyledFormControl>
        ))}
      </StyledRadioButtonGroup>
    </StyledFieldset>
  );
};

export default AvailabilityField;
