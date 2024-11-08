/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { memo, useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { DeleteBinLine } from "@ndla/icons/action";
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
import { scrollToIndexFn } from "../../components/Form/utils";
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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const grepCodesObject = await convertGrepCodesToObject(field.value);
      setGrepCodes(grepCodesObject);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGrepCodeTitles = async (grepCode: string): Promise<GrepCode | undefined> => {
    const grepCodeTitle = await fetchGrepCodeTitle(grepCode);
    const isGrepCodeSaved = grepCodes[grepCode];

    if (grepCodeTitle && !isGrepCodeSaved && isGrepCodeValid(grepCode)) {
      return {
        code: grepCode,
        title: `${grepCode} - ${grepCodeTitle}`,
      };
    } else if (!isGrepCodeSaved) {
      setTimeout(() => {
        helpers.setError(`${t("errorMessage.grepCodes")}${grepCode}`);
      }, 0);
    }
  };

  const updateGrepCodes = async (newValue: string) => {
    helpers.setError(undefined);
    const trimmedValue = newValue.toUpperCase().trim();
    if (field.value.includes(trimmedValue)) {
      const { [trimmedValue]: _, ...remaining } = grepCodes;
      setGrepCodes(remaining);
      helpers.setValue(field.value.filter((v) => v !== trimmedValue));
    } else {
      const grepCodeWithName = await fetchGrepCodeTitles(trimmedValue);
      if (!grepCodeWithName) return;
      setGrepCodes({ ...grepCodes, [grepCodeWithName.code]: grepCodeWithName.title });
      helpers.setValue([...field.value, grepCodeWithName.code]);
    }
  };

  const collection = useMemo(() => {
    return createListCollection({
      items: searchQuery.data?.results ?? [],
      itemToString: (item) => item.title,
      itemToValue: (item) => item.code,
    });
  }, [searchQuery.data?.results]);

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
            onValueChange={(details) => {
              const newValue = details.value[0];
              if (!newValue) return;
              setQuery("");
              updateGrepCodes(newValue);
            }}
            value={field.value}
            positioning={{ strategy: "fixed" }}
            variant="complex"
            context="standalone"
            scrollToIndexFn={(details) => {
              scrollToIndexFn(contentRef, details.index);
            }}
            closeOnSelect={false}
            selectionBehavior="preserve"
          >
            <GenericComboboxInput
              placeholder={t("form.grepCodes.placeholder")}
              isFetching={searchQuery.isFetching}
              onKeyUp={(event) => {
                if (event.key === "Enter" && !!query.trim()) {
                  updateGrepCodes(query);
                }
              }}
              triggerable
            />
            <ComboboxPositioner>
              <ComboboxContent ref={contentRef}>
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
              <ListItemRoot key={code} context="list" variant="subtle" asChild consumeCss id="list-item">
                <li>
                  <ListItemContent>{title}</ListItemContent>
                  <IconButton
                    variant="danger"
                    size="small"
                    aria-label={t("delete")}
                    title={t("delete")}
                    onClick={() => {
                      updateGrepCodes(code);
                    }}
                  >
                    <DeleteBinLine />
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
