/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import difference from "lodash/difference";
import uniq from "lodash/uniq";
import { memo, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection, useTagsInputContext } from "@ark-ui/react";
import { CloseLine } from "@ndla/icons/action";
import { ArrowDownShortLine } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
import {
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  FieldHelper,
  FieldLabel,
  FieldRoot,
  IconButton,
  Input,
  TagsInputItem,
  TagsInputItemDeleteTrigger,
  TagsInputItemInput,
  TagsInputItemPreview,
  TagsInputItemText,
  Text,
} from "@ndla/primitives";
import { Flex, HStack, Wrap } from "@ndla/styled-system/jsx";
import {
  TagSelectorControl,
  TagSelectorInputBase,
  TagSelectorLabel,
  TagSelectorRoot,
  TagSelectorTrigger,
  useTagSelectorTranslations,
} from "@ndla/ui";
import { SearchTagsContent } from "../../components/Form/SearchTagsContent";
import { FormField } from "../../components/FormField";
import { useGrepCodesSearch } from "../../modules/draft/draftQueries";
import { fetchGrepCodeTitle } from "../../modules/grep/grepApi";
import { GrepCode } from "../../modules/grep/grepApiInterfaces";
import { isGrepCodeValid } from "../../util/articleUtil";
import { usePaginatedQuery } from "../../util/usePaginatedQuery";

export const convertGrepCodesToObject = async (grepCodes: string[]): Promise<Record<string, string>> => {
  const grepCodesWithTitle = await Promise.all(
    grepCodes.map(async (c) => {
      const grepCodeTitle = await fetchGrepCodeTitle(c);
      return {
        [c]: grepCodeTitle ? `${c} - ${grepCodeTitle}` : c,
      };
    }),
  );
  return Object.assign({}, ...grepCodesWithTitle);
};

interface GrepCodeTagItemsProps {
  grepCodes: Record<string, string>;
}
const GrepCodeTagItems = ({ grepCodes }: GrepCodeTagItemsProps) => {
  const tagsApi = useTagsInputContext();
  return (
    <Wrap gap="3xsmall">
      {tagsApi.value.map((value, index) => (
        <TagsInputItem index={index} value={value} key={value}>
          <TagsInputItemPreview>
            <TagsInputItemText>{grepCodes[value] ?? value}</TagsInputItemText>
            <TagsInputItemDeleteTrigger>
              <CloseLine />
            </TagsInputItemDeleteTrigger>
          </TagsInputItemPreview>
          <TagsInputItemInput />
        </TagsInputItem>
      ))}
    </Wrap>
  );
};

const GrepCodesField = () => {
  const { t } = useTranslation();
  const [field, _, helpers] = useField<string[]>("grepCodes");
  const [grepCodes, setGrepCodes] = useState<Record<string, string>>({});

  const tagSelectorTranslations = useTagSelectorTranslations();
  const { query, setQuery } = usePaginatedQuery();
  const searchQuery = useGrepCodesSearch({ input: query });

  useEffect(() => {
    (async () => {
      const grepCodesObject = await convertGrepCodesToObject(field.value);
      setGrepCodes(grepCodesObject);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGrepCodeTitles = async (newGrepCodes: string[]): Promise<GrepCode[]> => {
    const newGrepCodeNames: GrepCode[] = [];
    for (const grepCode of newGrepCodes) {
      const grepCodeTitle = await fetchGrepCodeTitle(grepCode);
      const isGrepCodeSaved = grepCodes[grepCode];

      if (grepCodeTitle && !isGrepCodeSaved && isGrepCodeValid(grepCode)) {
        newGrepCodeNames.push({
          code: grepCode,
          title: `${grepCode} - ${grepCodeTitle}`,
        });
      } else if (!isGrepCodeSaved) {
        setTimeout(() => {
          helpers.setError(`${t("errorMessage.grepCodes")}${grepCode}`);
        }, 0);
      }
    }
    return newGrepCodeNames;
  };

  const updateGrepCodes = async (values: string[]) => {
    helpers.setError(undefined);
    const trimmedValues = uniq(values.map((v) => v.toUpperCase().trim()));
    // Grep code is added
    if (trimmedValues.length > field.value.length) {
      const addedGrepCodes = difference(trimmedValues, field.value);
      const grepCodesWithNames = await fetchGrepCodeTitles(addedGrepCodes);
      const grepCodesObject = grepCodesWithNames.reduce((acc, c) => ({ ...acc, [c.code]: c.title }), grepCodes);
      setGrepCodes(grepCodesObject);
      helpers.setValue(Object.keys(grepCodesObject));
      return;
    }
    // Grep code is removed
    if (trimmedValues.length < field.value.length) {
      const filteredGrepCodes = trimmedValues.reduce(
        (acc, c) => (values.includes(c) ? { ...acc, [c]: grepCodes[c] } : acc),
        {},
      );
      setGrepCodes(filteredGrepCodes);
      helpers.setValue(values);
      return;
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
            positioning={{ strategy: "fixed" }}
            editable={false}
          >
            <TagSelectorLabel>{t("form.grepCodes.comboboxLabel")}</TagSelectorLabel>
            <Text color="text.error" aria-live="polite">
              {meta.error}
            </Text>
            <Flex direction="column">
              <HStack gap="3xsmall">
                <TagSelectorControl asChild>
                  <TagSelectorInputBase asChild>
                    <Input placeholder={t("form.grepCodes.placeholder")} />
                  </TagSelectorInputBase>
                </TagSelectorControl>
                <TagSelectorTrigger asChild>
                  <IconButton variant="secondary">
                    <ArrowDownShortLine />
                  </IconButton>
                </TagSelectorTrigger>
              </HStack>
              <GrepCodeTagItems grepCodes={grepCodes} />
            </Flex>
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
