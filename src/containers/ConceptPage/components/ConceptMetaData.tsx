/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createListCollection } from "@ark-ui/react";
import { ComboboxItem, ComboboxItemText, FieldErrorMessage, FieldRoot, Input } from "@ndla/primitives";
import { TagSelectorLabel, TagSelectorRoot, useTagSelectorTranslations } from "@ndla/ui";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GenericComboboxItemIndicator } from "../../../components/abstractions/Combobox";
import { FieldWarning } from "../../../components/Form/FieldWarning";
import { SearchTagsContent } from "../../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import { useConceptSearchTags } from "../../../modules/concept/conceptQueries";
import useDebounce from "../../../util/useDebounce";
import { ConceptFormValues } from "../conceptInterfaces";

const ConceptMetaData = () => {
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
              <SearchTagsTagSelectorInput asChild>
                <Input placeholder={t("form.tags.searchPlaceholder")} />
              </SearchTagsTagSelectorInput>
              <SearchTagsContent isFetching={searchTagsQuery.isFetching} hits={collection.items.length}>
                {collection.items.map((item) => (
                  <ComboboxItem key={item} item={item}>
                    <ComboboxItemText>{item}</ComboboxItemText>
                    <GenericComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </SearchTagsContent>
              <FieldWarning name={field.name} />
            </TagSelectorRoot>
          </FieldRoot>
        )}
      </FormField>
    </FormContent>
  );
};

export default ConceptMetaData;
