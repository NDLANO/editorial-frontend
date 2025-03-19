/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArrowLeftShortLine, ArrowRightShortLine } from "@ndla/icons";
import {
  IconButton,
  PaginationContext,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  PaginationRootProps,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { usePaginationTranslations } from "@ndla/ui";

const StyledPaginationRoot = styled(PaginationRoot, {
  base: {
    flexWrap: "wrap",
  },
});

type Props = Omit<PaginationRootProps, "translations"> & { buttonSize?: "small" | "medium" };

const Pagination = ({ page = 1, onPageChange, count, pageSize, buttonSize = "medium", ...props }: Props) => {
  const translations = usePaginationTranslations();
  const countWithMaxValue = Math.min(count ?? 0, 1000);
  return (
    <StyledPaginationRoot
      page={page}
      onPageChange={onPageChange}
      count={countWithMaxValue}
      pageSize={pageSize}
      translations={translations}
      {...props}
    >
      <PaginationPrevTrigger asChild>
        <IconButton
          size={buttonSize}
          variant="tertiary"
          aria-label={translations?.prevTriggerLabel}
          title={translations?.prevTriggerLabel}
        >
          <ArrowLeftShortLine />
        </IconButton>
      </PaginationPrevTrigger>
      <PaginationContext>
        {(pagination) =>
          pagination.pages.map((page, index) =>
            page.type === "page" ? (
              <PaginationItem key={index} {...page} asChild>
                <IconButton size={buttonSize} variant={page.value === pagination.page ? "primary" : "tertiary"}>
                  {page.value}
                </IconButton>
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
        <IconButton
          size={buttonSize}
          variant="tertiary"
          aria-label={translations?.nextTriggerLabel}
          title={translations?.nextTriggerLabel}
        >
          <ArrowRightShortLine />
        </IconButton>
      </PaginationNextTrigger>
    </StyledPaginationRoot>
  );
};

export default Pagination;
