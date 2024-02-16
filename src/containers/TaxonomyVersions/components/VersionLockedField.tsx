/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps } from "formik";
import { useTranslation } from "react-i18next";
import { RadioButtonItem } from "@ndla/forms";
import {
  StyledFieldset,
  StyledFormControl,
  StyledLabel,
  StyledRadioButtonGroup,
  StyledText,
} from "../../../components/Form/styles";
import FormikField from "../../../components/FormikField";

const VersionLockedField = () => {
  const { t } = useTranslation();

  const options = [
    {
      title: t("taxonomyVersions.form.locked.locked"),
      value: "true",
    },
    {
      title: t("taxonomyVersions.form.locked.unlocked"),
      value: "false",
    },
  ];
  return (
    <FormikField name="locked" label={t("taxonomyVersions.form.locked.title")}>
      {({ field }: FieldProps) => (
        <StyledFieldset>
          <StyledText margin="none" textStyle="label-small" element="legend">
            {t("taxonomyVersions.form.locked.subTitle")}
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
            defaultValue={field.value.toString()}
          >
            {options.map((option) => (
              <StyledFormControl id={option.value} key={option.value}>
                <RadioButtonItem value={option.value} />
                <StyledLabel margin="none" textStyle="label-small" data-label="">
                  {option.title}
                </StyledLabel>
              </StyledFormControl>
            ))}
          </StyledRadioButtonGroup>
        </StyledFieldset>
      )}
    </FormikField>
  );
};
export default VersionLockedField;
