/**
 * Copyright (c) 2016-present, NDLA.
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
import { TagSelectorLabel, TagSelectorRoot, useTagSelectorTranslations } from "@ndla/ui";
import { AudioFormikType } from "./AudioForm";
import { SearchTagsContent } from "../../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../../components/FormField";
import { useAudioSearchTags } from "../../../modules/audio/audioQueries";
import useDebounce from "../../../util/useDebounce";

const AudioMetaData = () => {
  const { values } = useFormikContext<AudioFormikType>();
  const { t } = useTranslation();
  const [inputQuery, setInputQuery] = useState<string>("");
  const debouncedQuery = useDebounce(inputQuery, 300);
  const tagSelectorTranslations = useTagSelectorTranslations();
  const searchTagsQuery = useAudioSearchTags(
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
  );
};

export default AudioMetaData;
