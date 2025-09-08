/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { CheckLine } from "@ndla/icons";
import {
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  FieldTextArea,
  Input,
} from "@ndla/primitives";
import { TagSelectorLabel, TagSelectorRoot, useTagSelectorTranslations } from "@ndla/ui";
import { LearningpathMetaImageField } from "./LearningpathMetaImageField";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import { ContentEditableFieldLabel } from "../../../components/Form/ContentEditableFieldLabel";
import { FieldWarning } from "../../../components/Form/FieldWarning";
import { SearchTagsContent } from "../../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import { useLearningpathTags } from "../../../modules/learningpath/learningpathQueries";
import useDebounce from "../../../util/useDebounce";
import { LearningpathTextEditor } from "../components/LearningpathTextEditor";
import { LearningpathFormValues } from "../learningpathFormUtils";

interface Props {
  language: string;
}
export const LearningpathMetaFormPart = ({ language }: Props) => {
  const { t } = useTranslation();
  const [inputQuery, setInputQuery] = useState<string>("");
  const debouncedQuery = useDebounce(inputQuery, 200);
  const tagSelectorTranslations = useTagSelectorTranslations();
  const { errors } = useFormikContext<LearningpathFormValues>();

  const tagsQuery = useLearningpathTags();

  const collection = useMemo(() => {
    return createListCollection({
      items: tagsQuery.data?.tags.filter((item) => item.includes(debouncedQuery)).slice(0, 50) ?? [],
      itemToValue: (item) => item,
      itemToString: (item) => item,
    });
  }, [debouncedQuery, tagsQuery.data?.tags]);
  return (
    <FormAccordion
      id="learningpath-meta"
      title={t("learningpathForm.metadata.title")}
      hasError={!!(errors.title || errors.description || errors.tags || errors.coverPhotoMetaUrl)}
    >
      <FormContent>
        <FormField name="title">
          {({ field, meta }) => (
            <FieldRoot required invalid={!!meta.error}>
              <FieldLabel>{t("learningpathForm.metadata.titleLabel")}</FieldLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldWarning name={field.name} />
              <FieldInput {...field} />
            </FieldRoot>
          )}
        </FormField>
        <FormField name="description">
          {({ field, meta }) => (
            <FieldRoot required invalid={!!meta.error}>
              <FieldLabel>{t("learningpathForm.metadata.descriptionLabel")}</FieldLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldWarning name={field.name} />
              <FieldTextArea {...field} />
            </FieldRoot>
          )}
        </FormField>
        <FormField name="introduction">
          {({ field, meta, helpers }) => (
            <FieldRoot required invalid={!!meta.error}>
              <ContentEditableFieldLabel>{t("learningpathForm.metadata.introductionLabel")}</ContentEditableFieldLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldWarning name={field.name} />
              <LearningpathTextEditor value={field.value} onChange={helpers.setValue} language={language} />
            </FieldRoot>
          )}
        </FormField>
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
                <FieldWarning name={field.name} />
                <SearchTagsTagSelectorInput asChild>
                  <Input placeholder={t("form.tags.searchPlaceholder")} />
                </SearchTagsTagSelectorInput>
                <SearchTagsContent isFetching={tagsQuery.isFetching} hits={collection.items.length}>
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
        <LearningpathMetaImageField language={language} />
      </FormContent>
    </FormAccordion>
  );
};
