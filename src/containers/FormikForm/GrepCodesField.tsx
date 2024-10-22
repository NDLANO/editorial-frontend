/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import difference from "lodash/difference";
import { memo, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { CheckLine } from "@ndla/icons/editor";
import {
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  FieldHelper,
  FieldLabel,
  FieldRoot,
  Input,
  Text,
} from "@ndla/primitives";
import { TagSelectorLabel, TagSelectorRoot, useTagSelectorTranslations } from "@ndla/ui";
import { SearchTagsContent } from "../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../components/FormField";
import { useGrepCodesSearch } from "../../modules/draft/draftQueries";
import { fetchGrepCodeTitle } from "../../modules/grep/grepApi";
import { isGrepCodeValid } from "../../util/articleUtil";
import { usePaginatedQuery } from "../../util/usePaginatedQuery";

interface GrepCode {
  code: string;
  title?: string;
}

export const convertGrepCodesToObject = async (grepCodes: string[]) => {
  return Promise.all(
    grepCodes.map(async (c) => {
      const grepCodeTitle = await fetchGrepCodeTitle(c);
      return {
        code: c,
        title: grepCodeTitle ? `${c} - ${grepCodeTitle}` : c,
      };
    }),
  );
};

const GrepCodesField = () => {
  const { t } = useTranslation();
  const [field, _, helpers] = useField<string[]>("grepCodes");

  const [grepCodes, setGrepCodes] = useState<GrepCode[]>([]);

  const tagSelectorTranslations = useTagSelectorTranslations();
  const { query, setQuery } = usePaginatedQuery();

  const searchQuery = useGrepCodesSearch({ input: query });

  useEffect(() => {
    (async () => {
      const comp = await convertGrepCodesToObject(field.value);
      setGrepCodes(comp);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGrepCodeTitles = async (
    newGrepCodes: string[],
  ): Promise<{ newGrepCodes: GrepCode[]; failedGrepCodes: string[] }> => {
    const newGrepCodeNames: GrepCode[] = [];
    const failed: string[] = [];
    for (const grepCode of newGrepCodes) {
      const grepCodeTitle = await fetchGrepCodeTitle(grepCode);
      const savedGrepCode = grepCodes.filter((c) => c.code === grepCode).length;
      if (grepCodeTitle && !savedGrepCode && isGrepCodeValid(grepCode)) {
        newGrepCodeNames.push({
          code: grepCode,
          title: `${grepCode} - ${grepCodeTitle}`,
        });
      } else if (!savedGrepCode) {
        failed.push(grepCode);
        setTimeout(() => {
          helpers.setError(`${t("errorMessage.grepCodes")}${grepCode}`);
        }, 0);
      }
    }
    return { newGrepCodes: newGrepCodeNames, failedGrepCodes: failed };
  };

  const updateGrepCodes = async (values: string[]) => {
    helpers.setError(undefined);
    const trimmedValues = values.map((v) => v.toUpperCase().trim());
    // Grep code is added
    if (trimmedValues.length > field.value.length) {
      const addedGrepCodes = difference(trimmedValues, field.value);
      const grepCodesWithNames = await fetchGrepCodeTitles(addedGrepCodes);
      setGrepCodes([...grepCodes, ...grepCodesWithNames.newGrepCodes]);
      const valuesRemoveFailed = trimmedValues.filter((v) => !grepCodesWithNames.failedGrepCodes.includes(v));
      helpers.setValue(valuesRemoveFailed);
    }
    // Grep code is removed
    if (trimmedValues.length < field.value.length) {
      const fileredGrepCodes = grepCodes.filter((c) => trimmedValues.includes(c.code));
      setGrepCodes(fileredGrepCodes);
      helpers.setValue(values);
    }
  };

  const collection = useMemo(() => {
    return createListCollection({
      items: searchQuery.data?.results ?? [],
      itemToValue: (item) => item.code,
      itemToString: (item) => item.title,
    });
  }, [searchQuery.data?.results]);

  return (
    <FormField name="grepCodes">
      {({ field, meta }) => (
        <FieldRoot>
          <FieldLabel>{t("form.grepCodes.label")}</FieldLabel>
          <FieldHelper>{t("form.grepCodes.description")}</FieldHelper>
          <TagSelectorRoot
            collection={collection}
            value={field.value}
            onValueChange={(details) => updateGrepCodes(details.value)}
            translations={tagSelectorTranslations}
            inputValue={query}
            onInputValueChange={(details) => setQuery(details.inputValue)}
          >
            <TagSelectorLabel>{t("form.grepCodes.comboboxLabel")}</TagSelectorLabel>
            <Text color="text.error" aria-live="polite">
              {meta.error}
            </Text>
            <SearchTagsTagSelectorInput asChild>
              <Input placeholder={t("form.grepCodes.placeholder")} />
            </SearchTagsTagSelectorInput>
            <SearchTagsContent isFetching={searchQuery.isFetching} hits={collection.items.length}>
              {collection.items.map((item) => (
                <ComboboxItem key={item.code} item={item}>
                  <ComboboxItemText>{item.title}</ComboboxItemText>
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

export default memo(GrepCodesField);
