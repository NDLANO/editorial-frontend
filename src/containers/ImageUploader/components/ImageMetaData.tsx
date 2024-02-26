/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps, FieldProps } from "formik";
import { useTranslation } from "react-i18next";
import { FormControl, Label, Legend, RadioButtonGroup, RadioButtonItem } from "@ndla/forms";
import AsyncSearchTags from "../../../components/Dropdown/asyncDropdown/AsyncSearchTags";
import { RadioButtonWrapper, StyledFieldset, StyledLabel } from "../../../components/Form/styles";
import { FormField } from "../../../components/FormField";
import FormikField from "../../../components/FormikField";
import { fetchSearchTags } from "../../../modules/image/imageApi";

interface Props {
  imageTags: string[];
  imageLanguage?: string;
}

const ImageMetaData = ({ imageTags, imageLanguage }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <FormikField name="tags" label={t("form.tags.label")} obligatory description={t("form.tags.description")}>
        {({ field, form }: FieldProps<string[], string[]>) => (
          <AsyncSearchTags
            multiSelect
            language={imageLanguage || "all"}
            initialTags={imageTags}
            field={field}
            form={form}
            fetchTags={fetchSearchTags}
          />
        )}
      </FormikField>
      <FormField name="modelReleased">
        {({ field }: { field: FieldInputProps<string> }) => {
          const options = ["yes", "not-applicable", "no", "not-set"];
          const defaultValue = "not-set";
          return (
            <>
              <StyledLabel textStyle="ingress" margin="small">
                {t("form.modelReleased.label")}
              </StyledLabel>
              <FormControl id="model-released">
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
                  defaultValue={field.value ?? defaultValue}
                  asChild
                >
                  <StyledFieldset>
                    <Legend margin="none" textStyle="label-small">
                      {t("form.modelReleased.description")}
                    </Legend>
                    {options.map((option) => (
                      <RadioButtonWrapper key={option}>
                        <RadioButtonItem id={`model-released-${option}`} value={option} />
                        <Label htmlFor={`model-released-${option}`} margin="none" textStyle="label-small">
                          {t(`form.modelReleased.${option}`)}
                        </Label>
                      </RadioButtonWrapper>
                    ))}
                  </StyledFieldset>
                </RadioButtonGroup>
              </FormControl>
            </>
          );
        }}
      </FormField>
    </>
  );
};

export default ImageMetaData;
