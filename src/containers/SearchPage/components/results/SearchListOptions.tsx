/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { SelectContent, SelectLabel, SelectRoot, SelectValueText, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GenericSelectItem, GenericSelectTrigger } from "../../../../components/abstractions/Select";
import { useStableSearchPageParams } from "../../useStableSearchPageParams";

const pageSizeOptions = ["5", "10", "20", "50", "100"];

interface Props {
  totalCount?: number;
  defaultValue: number;
}

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    maxWidth: "surface.xxsmall",
  },
});

const SearchListOptionsWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const SearchListOptions = ({ totalCount, defaultValue }: Props) => {
  const { t } = useTranslation();
  const [params, setParams] = useStableSearchPageParams();

  const handlePageSizeChange = (value: string) => {
    setParams({ "page-size": value === defaultValue.toString() ? null : value });
  };

  const collection = useMemo(() => {
    return createListCollection({
      items: pageSizeOptions,
      itemToString: (item) => t("searchPage.pageSize", { pageSize: item }),
    });
  }, [t]);

  return (
    <SearchListOptionsWrapper>
      <Text data-testid="totalCount">
        {t("searchPage.totalCount")}: <b data-testid="searchTotalCount">{totalCount}</b>
      </Text>
      <SelectRoot
        collection={collection}
        value={[params.get("page-size")?.toString() ?? defaultValue.toString()]}
        onValueChange={(details) => handlePageSizeChange(details.value[0])}
        positioning={{ sameWidth: true }}
      >
        <SelectLabel srOnly>{t("searchPage.hitsSelectLabel")}</SelectLabel>
        <StyledGenericSelectTrigger>
          <SelectValueText />
        </StyledGenericSelectTrigger>
        <SelectContent>
          {collection.items.map((option) => (
            <GenericSelectItem item={option} key={`pageSize_${option}`}>
              {t("searchPage.pageSize", { pageSize: option })}
            </GenericSelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </SearchListOptionsWrapper>
  );
};

export default SearchListOptions;
