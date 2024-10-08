/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps } from "formik";
import { useTranslation } from "react-i18next";
import {
  FieldRoot,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import AsyncSearchTags from "../../../components/Dropdown/asyncDropdown/AsyncSearchTags";
import { FormField } from "../../../components/FormField";
import FormikField from "../../../components/FormikField";
import { FormContent } from "../../../components/FormikForm";
import { fetchSearchTags } from "../../../modules/image/imageApi";

interface Props {
  imageTags: string[];
  imageLanguage?: string;
}

const RadioGroupItemWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    flexWrap: "wrap",
  },
});

const options = ["yes", "not-applicable", "no", "not-set"];
const defaultValue = "not-set";

const ImageMetaData = ({ imageTags, imageLanguage }: Props) => {
  const { t } = useTranslation();
  return (
    <FormContent>
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
        {({ field, helpers }) => {
          return (
            <FieldRoot>
              <RadioGroupRoot
                value={field.value ?? defaultValue}
                onValueChange={(details) => helpers.setValue(details.value)}
              >
                <RadioGroupLabel>{t("form.modelReleased.description")}</RadioGroupLabel>
                <RadioGroupItemWrapper>
                  {options.map((option) => (
                    <RadioGroupItem key={option} value={option}>
                      <RadioGroupItemControl />
                      <RadioGroupItemText>{t(`form.modelReleased.${option}`)}</RadioGroupItemText>
                      <RadioGroupItemHiddenInput />
                    </RadioGroupItem>
                  ))}
                </RadioGroupItemWrapper>
              </RadioGroupRoot>
            </FieldRoot>
          );
        }}
      </FormField>
    </FormContent>
  );
};

export default ImageMetaData;
