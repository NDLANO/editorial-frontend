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
import { DeleteBinLine } from "@ndla/icons";
import {
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
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
import { searchGrepCodes } from "../../modules/search/searchApi";
import { useSearchGrepCodes } from "../../modules/search/searchQueries";
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
const StyledComboboxContent = styled(ComboboxContent, {
  base: { zIndex: "popover" },
});

export const convertGrepCodesToObject = async (grepCodes: string[]): Promise<Record<string, string>> => {
  const grepCodesData = await searchGrepCodes({ codes: grepCodes });
  const grepCodesWithTitle = grepCodesData.results.map((c) => ({
    [c.code]: c.title.title ? `${c.code} - ${c.title.title}` : c,
  }));
  return Object.assign({}, ...grepCodesWithTitle);
};

interface GrepCode {
  code: string;
  title: string;
}

interface Props {
  prefixFilter: string[];
}

const GrepCodesField = ({ prefixFilter }: Props) => {
  const { t } = useTranslation();
  const translations = useComboboxTranslations();
  const [field, , helpers] = useField<string[]>("grepCodes");
  const [grepCodes, setGrepCodes] = useState<Record<string, string>>({});

  const { query, setQuery } = usePaginatedQuery();
  const grepCodesQuery = useSearchGrepCodes({ prefixFilter: prefixFilter, query: query });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (!field.value.length) return;
      const grepCodesObject = await convertGrepCodesToObject(field.value);
      setGrepCodes(grepCodesObject);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGrepCodeTitles = async (grepCode: string): Promise<GrepCode | undefined> => {
    const grepCodeTitle = await searchGrepCodes({ codes: [grepCode] });
    const isGrepCodeSaved = grepCodes[grepCode];
    if (grepCodeTitle.results.length && !isGrepCodeSaved && isGrepCodeValid(grepCode, prefixFilter)) {
      return {
        code: grepCode,
        title: `${grepCode} - ${grepCodeTitle.results[0].title.title}`,
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
      items: grepCodesQuery.data?.results ?? [],
      itemToString: (item) => item.title.title,
      itemToValue: (item) => item.code,
    });
  }, [grepCodesQuery.data?.results]);

  return (
    <FormField name="grepCodes">
      {({ field, meta }) => (
        <FieldRoot>
          <FieldLabel>{t("form.grepCodes.label")}</FieldLabel>
          <FieldHelper>{t("form.grepCodes.description", { codes: prefixFilter.join(", ") })}</FieldHelper>
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
              isFetching={grepCodesQuery.isFetching}
              onKeyUp={(event) => {
                if (event.key === "Enter" && !!query.trim()) {
                  updateGrepCodes(query);
                }
              }}
              triggerable
            />
            <StyledComboboxContent ref={contentRef}>
              <StyledComboboxList>
                {collection.items.map((item) => (
                  <ComboboxItem key={item.code} item={item} asChild>
                    <GenericComboboxItemContent title={`${item.code} - ${item.title.title}`} />
                  </ComboboxItem>
                ))}
              </StyledComboboxList>
              {!!grepCodesQuery.isSuccess && (
                <Text>
                  {`${t("dropdown.numberHits", { hits: grepCodesQuery.data?.totalCount ?? 0 })}. ${!grepCodesQuery.data?.totalCount ? t("form.grepCodes.noHits") : ""}`}
                </Text>
              )}
            </StyledComboboxContent>
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
