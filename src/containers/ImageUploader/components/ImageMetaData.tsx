/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps, FieldProps } from "formik";
import { useTranslation } from "react-i18next";
import { RadioButtonItem } from "@ndla/forms";
import AsyncSearchTags from "../../../components/Dropdown/asyncDropdown/AsyncSearchTags";
import { StyledFormControl, StyledLabel, StyledRadioButtonGroup } from "../../../components/Form/styles";
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
      <FormikField
        name="modelReleased"
        label={t("form.modelReleased.label")}
        description={t("form.modelReleased.description")}
      >
        {({ field }: { field: FieldInputProps<string> }) => {
          const options = ["yes", "not-applicable", "no", "not-set"];
          const defaultValue = "not-set";
          return (
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
              defaultValue={field.value ?? defaultValue}
            >
              {options.map((option) => (
                <StyledFormControl id={option} key={option}>
                  <RadioButtonItem value={option} />
                  <StyledLabel margin="none" textStyle="label-small" data-label="">
                    {t(`form.modelReleased.${option}`)}
                  </StyledLabel>
                </StyledFormControl>
              ))}
            </StyledRadioButtonGroup>
          );
        }}
      </FormikField>
    </>
  );
};

export default ImageMetaData;
