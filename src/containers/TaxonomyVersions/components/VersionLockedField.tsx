/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Label, RadioButtonGroup, RadioButtonItem } from "@ndla/forms";
import { RadioButtonWrapper, FieldsetRow, LeftLegend, StyledFormControl } from "../../../components/Form/styles";
import { FormField } from "../../../components/FormField";

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
    <FormField name="locked">
      {({ field }) => (
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
            defaultValue={field.value.toString()}
            asChild
          >
            <FieldsetRow>
              <LeftLegend margin="none" textStyle="label-small">
                {t("taxonomyVersions.form.locked.subTitle")}
              </LeftLegend>
              {options.map((option) => (
                <RadioButtonWrapper key={option.value}>
                  <RadioButtonItem id={`locked-${option.value}`} value={option.value} />
                  <Label htmlFor={`locked-${option.value}`} margin="none" textStyle="label-small">
                    {option.title}
                  </Label>
                </RadioButtonWrapper>
              ))}
            </FieldsetRow>
          </RadioButtonGroup>
        </StyledFormControl>
      )}
    </FormField>
  );
};
export default VersionLockedField;
