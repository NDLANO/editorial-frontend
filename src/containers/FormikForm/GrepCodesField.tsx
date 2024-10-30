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
import { DeleteForever } from "@ndla/icons/editor";
import {
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxPositioner,
  ComboboxRoot,
  FieldHelper,
  FieldLabel,
  FieldRoot,
  IconButton,
  ListItemContent,
  ListItemRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useComboboxTranslations } from "@ndla/ui";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../components/abstractions/Combobox";
import { FormField } from "../../components/FormField";
import { useGrepCodesSearch } from "../../modules/draft/draftQueries";
import { fetchGrepCodeTitle } from "../../modules/grep/grepApi";
import { GrepCode } from "../../modules/grep/grepApiInterfaces";
import { isGrepCodeValid } from "../../util/articleUtil";
import { usePaginatedQuery } from "../../util/usePaginatedQuery";

const StyledList = styled("ul", {
  base: { listStyle: "none" },
});

const StyledComboboxList = styled(ComboboxList, {
  base: {
    overflowY: "auto",
  },
});

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

const GrepCodesField = () => {
  const { t } = useTranslation();
  const translations = useComboboxTranslations();
  const [field, _, helpers] = useField<string[]>("grepCodes");
  const [grepCodes, setGrepCodes] = useState<Record<string, string>>({});

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
    const trimmedValues = Array.from(new Set(values.map((v) => v.toUpperCase().trim())));
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
      itemToString: (item) => item.title,
      itemToValue: (item) => item.code,
      isItemDisabled: (item) => !!grepCodes[item.code],
    });
  }, [grepCodes, searchQuery.data?.results]);

  return (
    <FormField name="grepCodes">
      {({ field, meta }) => (
        <FieldRoot>
          <FieldLabel>{t("form.grepCodes.label")}</FieldLabel>
          <FieldHelper>{t("form.grepCodes.description")}</FieldHelper>
          <Text color="text.error" aria-live="polite">
            {meta.error}
          </Text>
          <ComboboxRoot
            collection={collection}
            translations={translations}
            onInputValueChange={(details) => setQuery(details.inputValue)}
            inputValue={query}
            onValueChange={(details) => updateGrepCodes(details.value)}
            value={field.value}
            multiple
            positioning={{ strategy: "fixed" }}
            variant="complex"
            context="standalone"
          >
            <GenericComboboxInput
              placeholder={t("form.grepCodes.placeholder")}
              isFetching={searchQuery.isFetching}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !!query.trim()) {
                  updateGrepCodes([...field.value, query]);
                }
              }}
              triggerable
            />
            <ComboboxPositioner>
              <ComboboxContent>
                <StyledComboboxList>
                  {collection.items.map((item) => (
                    <ComboboxItem key={item.code} item={item} asChild>
                      <GenericComboboxItemContent title={item.title} />
                    </ComboboxItem>
                  ))}
                </StyledComboboxList>
                {searchQuery.isSuccess && (
                  <Text>{t("dropdown.numberHits", { hits: searchQuery.data?.totalCount ?? 0 })}</Text>
                )}
              </ComboboxContent>
            </ComboboxPositioner>
          </ComboboxRoot>
          <StyledList>
            {Object.entries(grepCodes).map(([code, title]) => (
              <ListItemRoot key={code} context="list" variant="subtle" asChild consumeCss>
                <li>
                  <ListItemContent>{title}</ListItemContent>
                  <IconButton
                    variant="danger"
                    size="small"
                    aria-label={t("delete")}
                    title={t("delete")}
                    onClick={() => {
                      const filtered = field.value.filter((el: string) => el !== code);
                      updateGrepCodes(filtered);
                    }}
                  >
                    <DeleteForever />
                  </IconButton>
                </li>
              </ListItemRoot>
            ))}
          </StyledList>
        </FieldRoot>
      )}
    </FormField>
  );
};

export default memo(GrepCodesField);
