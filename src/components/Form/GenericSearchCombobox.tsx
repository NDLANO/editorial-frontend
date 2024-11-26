/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CollectionItem, createListCollection } from "@ark-ui/react";
import { CollectionOptions } from "@zag-js/collection";
import {
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxRoot,
  ComboboxRootProps,
  PaginationRootProps,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useComboboxTranslations } from "@ndla/ui";
import { scrollToIndexFn } from "./utils";
import Pagination from "../abstractions/Pagination";

interface PaginationData {
  totalCount: number;
  pageSize: number;
  page?: number;
}

const StyledComboboxContent = styled(ComboboxContent, {
  base: {
    maxHeight: "unset",
    overflowY: "unset",
  },
});

const StyledComboboxList = styled(ComboboxList, {
  base: {
    maxHeight: "surface.xsmall",
    overflowY: "auto",
  },
});

interface Props<T extends CollectionItem>
  extends Omit<ComboboxRootProps<T>, "translations" | "collection">,
    CollectionOptions<T> {
  children: ReactNode;
  renderItem: (item: T) => ReactNode;
  isSuccess: boolean;
  paginationData: PaginationData | undefined;
  onPageChange?: PaginationRootProps["onPageChange"];
}

export const GenericSearchCombobox = <T extends CollectionItem>({
  items,
  itemToString,
  itemToValue,
  isItemDisabled,
  positioning = { strategy: "fixed" },
  selectionBehavior = "clear",
  variant = "complex",
  context = "standalone",
  children,
  isSuccess,
  renderItem,
  paginationData,
  onPageChange,
  ...props
}: Props<T>) => {
  const translations = useComboboxTranslations();
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);

  const collection = useMemo(() => {
    return createListCollection({
      items: items,
      itemToString: itemToString,
      itemToValue: itemToValue,
      isItemDisabled: isItemDisabled,
    });
  }, [isItemDisabled, itemToString, itemToValue, items]);

  return (
    <ComboboxRoot
      collection={collection}
      translations={translations}
      positioning={positioning}
      selectionBehavior={selectionBehavior}
      variant={variant}
      context={context}
      scrollToIndexFn={(details) => {
        scrollToIndexFn(contentRef, details.index);
      }}
      {...props}
    >
      {children}
      <StyledComboboxContent ref={contentRef}>
        <StyledComboboxList>
          {collection.items.map((item) => (
            <ComboboxItem key={collection.getItemValue(item)} item={item} asChild>
              {renderItem(item)}
            </ComboboxItem>
          ))}
        </StyledComboboxList>
        {isSuccess && <Text>{t("dropdown.numberHits", { hits: paginationData?.totalCount ?? 0 })}</Text>}
        {!!paginationData && paginationData.totalCount > paginationData.pageSize && (
          <Pagination
            count={paginationData.totalCount}
            pageSize={paginationData.pageSize}
            page={paginationData.page ?? 1}
            onPageChange={onPageChange}
            buttonSize="small"
          />
        )}
      </StyledComboboxContent>
    </ComboboxRoot>
  );
};
