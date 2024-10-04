/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChevronLeft, ChevronRight } from "@ndla/icons/common";
import {
  Button,
  PaginationContext,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { usePaginationTranslations } from "@ndla/ui";

const StyledPaginationRoot = styled(PaginationRoot, {
  base: {
    flexWrap: "wrap",
  },
});

interface Props {
  page: number | undefined;
  onPageChange: (details: { page: number; pageSize: number }) => void;
  count: number | undefined;
  pageSize: number | undefined;
}

const Pagination = ({ page = 1, onPageChange, count = 0, pageSize }: Props) => {
  const translations = usePaginationTranslations();
  return (
    <StyledPaginationRoot
      page={page}
      onPageChange={onPageChange}
      count={count}
      pageSize={pageSize}
      translations={translations}
    >
      <PaginationPrevTrigger asChild>
        <Button
          size="small"
          variant="tertiary"
          aria-label={translations?.prevTriggerLabel}
          title={translations?.prevTriggerLabel}
        >
          <ChevronLeft />
        </Button>
      </PaginationPrevTrigger>
      <PaginationContext>
        {(pagination) =>
          pagination.pages.map((page, index) =>
            page.type === "page" ? (
              <PaginationItem key={index} {...page} asChild>
                <Button size="small" variant={page.value === pagination.page ? "primary" : "tertiary"}>
                  {page.value}
                </Button>
              </PaginationItem>
            ) : (
              <PaginationEllipsis key={index} index={index} asChild>
                <Text asChild consumeCss>
                  <div>&#8230;</div>
                </Text>
              </PaginationEllipsis>
            ),
          )
        }
      </PaginationContext>
      <PaginationNextTrigger asChild>
        <Button
          size="small"
          variant="tertiary"
          aria-label={translations?.nextTriggerLabel}
          title={translations?.nextTriggerLabel}
        >
          <ChevronRight />
        </Button>
      </PaginationNextTrigger>
    </StyledPaginationRoot>
  );
};

export default Pagination;
