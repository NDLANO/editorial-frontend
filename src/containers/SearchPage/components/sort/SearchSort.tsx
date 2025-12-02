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
import { SelectContent, SelectLabel, SelectRoot, SelectValueText } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GenericSelectItem, GenericSelectTrigger } from "../../../../components/abstractions/Select";
import { useStableSearchPageParams } from "../../useStableSearchPageParams";

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
  const [params] = useStableSearchPageParams();
  const { t } = useTranslation();

  const [sort, order] = useMemo(() => {
    const sortOrder = params.get("sort");
    if (!sortOrder) return [sortProp, orderProp];
    const split = sortOrder.split("-");
    return split.length > 1 ? [split[1], "desc"] : [split[0], "asc"];
  }, [orderProp, params, sortProp]);

  const handleSortChange = (value: string) => {
    const _order = order === "desc" ? "-" : "";
    onSortOrderChange(`${_order + value}`);
  };

  const handleOrderChange = (value: string) => {
    const newOrder = value === "desc" ? "-" : "";
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
        <SelectContent>
          {sortCollection.items.map((option) => (
            <GenericSelectItem item={option} key={option}>
              {t(`searchForm.sort.${option}`)}
            </GenericSelectItem>
          ))}
        </SelectContent>
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
        <SelectContent>
          {orderCollection.items.map((option) => (
            <GenericSelectItem item={option} key={option}>
              {t(`searchForm.${option}`)}
            </GenericSelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </StyledSortContainer>
  );
};

export default SearchSort;
