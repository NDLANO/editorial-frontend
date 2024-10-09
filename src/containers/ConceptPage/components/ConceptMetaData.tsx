/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { CheckLine } from "@ndla/icons/editor";
import {
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  FieldErrorMessage,
  FieldHelper,
  FieldRoot,
  Input,
} from "@ndla/primitives";
import { Node } from "@ndla/types-taxonomy";
import { TagSelectorLabel, TagSelectorRoot, useTagSelectorTranslations } from "@ndla/ui";
import InlineImageSearch from "./InlineImageSearch";
import MultiSelectDropdown from "../../../components/Dropdown/MultiSelectDropdown";
import { SearchTagsContent } from "../../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../../components/FormField";
import FormikField from "../../../components/FormikField";
import { useConceptSearchTags } from "../../../modules/concept/conceptQueries";
import useDebounce from "../../../util/useDebounce";
import { MetaImageSearch } from "../../FormikForm";
import { onSaveAsVisualElement } from "../../FormikForm/utils";
import { ConceptFormValues } from "../conceptInterfaces";

interface Props {
  subjects: Node[];
  inModal: boolean;
  language?: string;
}

const ConceptMetaData = ({ subjects, inModal, language }: Props) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ConceptFormValues>();
  const tagSelectorTranslations = useTagSelectorTranslations();
  const { values } = formikContext;
  const [inputQuery, setInputQuery] = useState<string>("");
  const debouncedQuery = useDebounce(inputQuery, 300);
  const searchTagsQuery = useConceptSearchTags(
    {
      input: debouncedQuery,
      language: values.language,
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
    <>
      {inModal ? (
        <InlineImageSearch name="metaImageId" />
      ) : (
        <FormikField name="metaImageId">
          {({ field, form }) => (
            <MetaImageSearch
              metaImageId={field.value}
              setFieldTouched={form.setFieldTouched}
              showRemoveButton
              showCheckbox={true}
              checkboxAction={(image) => onSaveAsVisualElement(image, formikContext)}
              language={language}
              {...field}
            />
          )}
        </FormikField>
      )}
      <FormikField name="subjects" label={t("form.subjects.label")} description={t("form.concept.subjects")}>
        {({ field }) => <MultiSelectDropdown labelField="name" minSearchLength={1} initialData={subjects} {...field} />}
      </FormikField>
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
    </>
  );
};

export default ConceptMetaData;
