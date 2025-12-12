/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { CheckLine } from "@ndla/icons";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  FieldErrorMessage,
  FieldHelper,
  FieldRoot,
  Input,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { TagSelectorLabel, TagSelectorRoot, useTagSelectorTranslations } from "@ndla/ui";
import { SearchTagsContent } from "../../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import { useImageSearchTags } from "../../../modules/image/imageQueries";
import useDebounce from "../../../util/useDebounce";

interface Props {
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

const ImageMetaData = ({ imageLanguage }: Props) => {
  const { t } = useTranslation();
  const tagSelectorTranslations = useTagSelectorTranslations();
  const [inputQuery, setInputQuery] = useState<string>("");
  const debouncedQuery = useDebounce(inputQuery, 300);

  const searchTagsQuery = useImageSearchTags(
    {
      input: debouncedQuery,
      language: imageLanguage || "all",
    },
    {
      enabled: !!debouncedQuery.length,
      placeholderData: (prev) => prev,
    },
  );

  const collection = useMemo(() => {
    return createListCollection({
      items: searchTagsQuery.data?.results ?? [],
      itemToValue: (item) => item,
      itemToString: (item) => item,
    });
  }, [searchTagsQuery.data?.results]);

  return (
    <FormContent>
      <FormField name="tags">
        {({ field, meta, helpers }) => (
          <FieldRoot invalid={!!meta.error}>
            <TagSelectorRoot
              collection={collection}
              value={field.value}
              onValueChange={(details) => helpers.setValue(details.value)}
              translations={tagSelectorTranslations}
              inputValue={inputQuery}
              onInputValueChange={(details) => setInputQuery(details.inputValue)}
            >
              <TagSelectorLabel>{t("form.tags.label")}</TagSelectorLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldHelper>{t("form.tags.description")}</FieldHelper>
              <SearchTagsTagSelectorInput asChild>
                <Input placeholder={t("form.tags.searchPlaceholder")} />
              </SearchTagsTagSelectorInput>
              <SearchTagsContent isFetching={searchTagsQuery.isFetching} hits={collection.items.length}>
                {collection.items.map((item) => (
                  <ComboboxItem key={item} item={item}>
                    <ComboboxItemText>{item}</ComboboxItemText>
                    <ComboboxItemIndicator asChild>
                      <CheckLine />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                ))}
              </SearchTagsContent>
            </TagSelectorRoot>
          </FieldRoot>
        )}
      </FormField>
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
      <FormField name="inactive">
        {({ field, helpers }) => (
          <FieldRoot>
            <CheckboxRoot
              checked={field.value ?? false}
              onCheckedChange={(details) => helpers.setValue(details.checked)}
            >
              <CheckboxControl>
                <CheckboxIndicator asChild>
                  <CheckLine />
                </CheckboxIndicator>
              </CheckboxControl>
              <CheckboxLabel>{t("imageForm.fields.inactive.label")}</CheckboxLabel>
              <CheckboxHiddenInput />
            </CheckboxRoot>
          </FieldRoot>
        )}
      </FormField>
    </FormContent>
  );
};

export default ImageMetaData;
