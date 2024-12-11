/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { memo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons";
import { FieldHelper, FieldLabel, FieldRoot, IconButton, ListItemContent, ListItemRoot, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../components/Form/GenericSearchCombobox";
import { FormField } from "../../components/FormField";
import { searchGrepCodes } from "../../modules/search/searchApi";
import { useSearchGrepCodes } from "../../modules/search/searchQueries";
import { isGrepCodeValid } from "../../util/articleUtil";
import { usePaginatedQuery } from "../../util/usePaginatedQuery";

const StyledList = styled("ul", {
  base: { listStyle: "none" },
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
  const [field, , helpers] = useField<string[]>("grepCodes");
  const [grepCodes, setGrepCodes] = useState<Record<string, string>>({});

  const { query, setQuery, page, setPage } = usePaginatedQuery();
  const grepCodesQuery = useSearchGrepCodes({ prefixFilter: prefixFilter, query: query, page: page });

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

  return (
    <FormField name="grepCodes">
      {({ field, meta }) => (
        <FieldRoot>
          <FieldLabel>{t("form.grepCodes.label")}</FieldLabel>
          <FieldHelper>{t("form.grepCodes.description", { codes: prefixFilter.join(", ") })}</FieldHelper>
          <Text color="text.error" aria-live="polite">
            {meta.error}
          </Text>
          <GenericSearchCombobox
            items={grepCodesQuery.data?.results ?? []}
            itemToString={(item) => item.title.title}
            itemToValue={(item) => item.code}
            paginationData={grepCodesQuery.data}
            isSuccess={grepCodesQuery.isSuccess}
            onPageChange={(details) => setPage(details.page)}
            inputValue={query}
            onInputValueChange={(details) => setQuery(details.inputValue)}
            onValueChange={(details) => {
              const newValue = details.value[0];
              if (!newValue) return;
              setQuery("");
              updateGrepCodes(newValue);
            }}
            value={field.value}
            renderItem={(item) => <GenericComboboxItemContent title={`${item.code} - ${item.title.title}`} />}
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
          </GenericSearchCombobox>
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
