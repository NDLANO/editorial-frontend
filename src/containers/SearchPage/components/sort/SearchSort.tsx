/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { createListCollection } from "@ark-ui/react";
import { SelectContent, SelectLabel, SelectPositioner, SelectRoot, SelectValueText } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GenericSelectItem, GenericSelectTrigger } from "../../../../components/abstractions/Select";

const customSortOptions: Record<string, string[]> = {
  content: ["revisionDate", "favorited", "published"],
};

const StyledSortContainer = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    paddingBlock: "small",
    flexWrap: "wrap",
  },
});

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    maxWidth: "surface.xsmall",
  },
});

interface Props {
  sort?: string;
  order?: string;
  onSortOrderChange: (sort: string) => void;
  type: string;
}

const SearchSort = ({ sort: sortProp = "relevance", order: orderProp = "desc", onSortOrderChange, type }: Props) => {
  const [sort, setSort] = useState(sortProp);
  const [order, setOrder] = useState(orderProp);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const { sort: sortOrder } = queryString.parse(location.search);
    const splitSortOrder = sortOrder ? sortOrder.split("-") : "-";
    const sort = splitSortOrder.length > 1 ? splitSortOrder[1] : splitSortOrder[0];
    const order = splitSortOrder.length > 1 ? "desc" : "asc";
    setSort(sort);
    setOrder(order);
  }, [location]);

  const handleSortChange = (value: string) => {
    const _order = order === "desc" ? "-" : "";
    setSort(value);
    onSortOrderChange(`${_order + value}`);
  };

  const handleOrderChange = (value: string) => {
    const newOrder = value === "desc" ? "-" : "";
    setOrder(value);
    onSortOrderChange(`${newOrder + sort}`);
  };

  const sortCollection = useMemo(() => {
    return createListCollection({
      items: ["id", "relevance", "title", "lastUpdated", ...(customSortOptions[type] ?? [])],
      itemToString: (item) => t(`searchForm.sort.${item}`),
    });
  }, [t, type]);

  const orderCollection = useMemo(() => {
    return createListCollection({
      items: ["desc", "asc"],
      itemToString: (item) => t(`searchForm.${item}`),
    });
  }, [t]);

  return (
    <StyledSortContainer>
      <SelectRoot
        collection={sortCollection}
        positioning={{ sameWidth: true }}
        value={[sort]}
        onValueChange={(details) => handleSortChange(details.value[0])}
      >
        <SelectLabel>{t("searchForm.sorting")}</SelectLabel>
        <StyledGenericSelectTrigger>
          <SelectValueText />
        </StyledGenericSelectTrigger>
        <SelectPositioner>
          <SelectContent>
            {sortCollection.items.map((option) => (
              <GenericSelectItem item={option} key={option}>
                {t(`searchForm.sort.${option}`)}
              </GenericSelectItem>
            ))}
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>
      <SelectRoot
        collection={orderCollection}
        positioning={{ sameWidth: true }}
        value={[order]}
        onValueChange={(details) => handleOrderChange(details.value[0])}
      >
        <SelectLabel>{t("searchForm.order")}</SelectLabel>
        <StyledGenericSelectTrigger>
          <SelectValueText />
        </StyledGenericSelectTrigger>
        <SelectPositioner>
          <SelectContent>
            {orderCollection.items.map((option) => (
              <GenericSelectItem item={option} key={option}>
                {t(`searchForm.${option}`)}
              </GenericSelectItem>
            ))}
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>
    </StyledSortContainer>
  );
};

export default SearchSort;
