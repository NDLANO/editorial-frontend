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
import handleError from "../../util/handleError";
import { usePaginatedQuery } from "../../util/usePaginatedQuery";

const StyledList = styled("ul", {
  base: { listStyle: "none" },
});

export const convertGrepCodesToObject = async (grepCodes: string[]): Promise<Record<string, string>> => {
  const grepCodesData = await searchGrepCodes({ codes: grepCodes, pageSize: grepCodes.length });
  const grepCodesWithTitle = grepCodesData.results.map((c) => {
    const laereplan = "laereplan" in c ? ` (${c.laereplan.code})` : "";
    return {
      [c.code]: `${c.code}${laereplan} - ${c.title.title}`,
    };
  });
  return Object.assign({}, ...grepCodesWithTitle);
};

interface GrepCodeSuccess {
  code: string;
  title: string;
  status: "success";
}
interface GrepCodeError {
  code: string;
  status: "error";
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

  const fetchGrepCodeTitles = async (
    newGrepCodes: string[],
  ): Promise<{ success: GrepCodeSuccess[]; failed: GrepCodeError[] }> => {
    try {
      const withoutSavedAndInvalid = newGrepCodes.filter(
        (code) => !grepCodes[code] && isGrepCodeValid(code, prefixFilter),
      );
      if (!withoutSavedAndInvalid.length) return { success: [], failed: [] };
      const grepCodesData = await searchGrepCodes({ codes: withoutSavedAndInvalid });

      const codes = grepCodesData.results.map((grepCode) => {
        const laereplan = "laereplan" in grepCode ? ` (${grepCode.laereplan.code})` : "";
        return {
          code: grepCode.code,
          title: `${grepCode.code}${laereplan} - ${grepCode.title.title}`,
          status: "success",
        } as const;
      });

      const failedCodes = newGrepCodes
        .filter((code) => !codes.some((c) => c?.code === code))
        .map((code) => ({ code: code, status: "error" }) as const);

      return { success: codes, failed: failedCodes };
    } catch (e) {
      handleError(e);
      helpers.setError(t("errorMessage.genericError"));
      return { success: [], failed: [] };
    }
  };

  const updateGrepCodes = async (newValue: string) => {
    const delimitedValues = newValue.split(",");
    helpers.setError(undefined);

    const addedGrepCodes = delimitedValues.reduce<string[]>((acc, v) => {
      const trimmedValue = v.toUpperCase().trim();
      // Delete grep code
      if (field.value.includes(trimmedValue)) {
        const { [trimmedValue]: _, ...remaining } = grepCodes;
        setGrepCodes(remaining);
        helpers.setValue(field.value.filter((v) => v !== trimmedValue));
        return acc;
      }
      //Add grep code
      acc.push(trimmedValue);
      return acc;
    }, []);
    if (!addedGrepCodes.length) return;

    const grepCodesWithName = await fetchGrepCodeTitles(addedGrepCodes);

    const updatedGrepCodes = grepCodesWithName.success.reduce<Record<string, string>>((acc, v) => {
      helpers.setValue([...field.value, v.code]);
      acc[v.code] = v.title;
      return acc;
    }, grepCodes);
    setGrepCodes(updatedGrepCodes);

    if (grepCodesWithName.failed.length) {
      setTimeout(() => {
        helpers.setError(`${t("errorMessage.grepCodes")}${grepCodesWithName.failed.map((e) => e.code).join(", ")}`);
      }, 0);
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
            renderItem={(item) => {
              const laereplan = "laereplan" in item ? ` (${item.laereplan.code})` : "";
              return <GenericComboboxItemContent title={`${item.code}${laereplan} - ${item.title.title}`} />;
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
