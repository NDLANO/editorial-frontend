/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { SelectContent, SelectLabel, SelectRoot, SelectValueText, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GenericSelectItem, GenericSelectTrigger } from "../../../../components/abstractions/Select";
import { SearchParams } from "../../../../interfaces";

const pageSizeOptions = ["5", "10", "20", "50", "100"];

interface Props {
  searchObject?: SearchParams;
  search: (params: SearchParams, type: string) => void;
  totalCount?: number;
  type: string;
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

const SearchListOptions = ({ searchObject = { "page-size": 10 }, search, type, totalCount }: Props) => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(searchObject["page-size"]?.toString() ?? "10");

  const handlePageSizeChange = (value: string) => {
    setPageSize(value);
    search({ "page-size": parseInt(value), page: 1 }, type);
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
        value={[pageSize.toString()]}
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
