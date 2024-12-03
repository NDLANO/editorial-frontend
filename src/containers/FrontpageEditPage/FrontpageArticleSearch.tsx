/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import {
  ComboboxContent,
  ComboboxItem,
  ComboboxLabel,
  ComboboxRoot,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
  Text,
  ComboboxList,
} from "@ndla/primitives";
import { IArticleSummaryV2 } from "@ndla/types-backend/article-api";
import { useComboboxTranslations } from "@ndla/ui";
import { extractArticleIds } from "./frontpageHelpers";
import { MenuWithArticle } from "./types";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../components/abstractions/Combobox";
import Pagination from "../../components/abstractions/Pagination";
import { useArticleSearch } from "../../modules/article/articleQueries";
import { usePaginatedQuery } from "../../util/usePaginatedQuery";

interface Props {
  articleId?: number;
  children?: ReactNode;
  onChange: (article: IArticleSummaryV2) => void;
}

const FrontpageArticleSearch = ({ articleId, children, onChange }: Props) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<MenuWithArticle>();
  const [open, setOpen] = useState(false);
  const { query, setQuery, page, setPage, delayedQuery } = usePaginatedQuery();
  const comboboxTranslations = useComboboxTranslations();

  const articleQuery = useArticleSearch(
    { articleTypes: ["frontpage-article"], page, query: delayedQuery },
    { placeholderData: (prev) => prev },
  );

  const selectedValues = useMemo(() => {
    const articleIds = extractArticleIds(values);
    return articleIds.map((id) => id.toString());
  }, [values]);

  const articleCollection = useMemo(
    () =>
      createListCollection({
        items: articleQuery.data?.results ?? [],
        itemToValue: (item) => item.id.toString(),
        isItemDisabled: (item) => selectedValues.includes(item.id.toString()),
      }),
    [articleQuery.data?.results, selectedValues],
  );

  return (
    <PopoverRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <PopoverTrigger asChild consumeCss>
        {children}
      </PopoverTrigger>
      <PopoverContent>
        <ComboboxRoot
          collection={articleCollection}
          inputValue={query}
          value={selectedValues}
          onValueChange={(details) => !!details.items[0] && onChange(details.items[0])}
          onInputValueChange={(details) => setQuery(details.inputValue)}
          onFocusOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onOpenChange={(details) => !details.open && setOpen(false)}
          translations={comboboxTranslations}
          selectionBehavior="clear"
          defaultOpen
          closeOnSelect
          context="composite"
          variant="complex"
          css={{ width: "surface.small" }}
        >
          <ComboboxLabel>{articleId ? t("frontpageForm.changeArticle") : t("frontpageForm.addArticle")}</ComboboxLabel>
          <GenericComboboxInput isFetching={articleQuery.isFetching} />
          <ComboboxContent>
            {!!articleQuery.data?.results.length && (
              <ComboboxList>
                {articleQuery.data.results.map((article) => (
                  <ComboboxItem key={article.id} item={article} asChild>
                    <GenericComboboxItemContent
                      title={article.title.title}
                      image={article.metaImage}
                      description={article.metaDescription?.metaDescription}
                      useFallbackImage
                      nonInteractive={selectedValues.includes(article.id.toString())}
                    />
                  </ComboboxItem>
                ))}
              </ComboboxList>
            )}
            {!!articleQuery.isSuccess && (
              <Text>{t("dropdown.numberHits", { hits: articleQuery.data.totalCount })}</Text>
            )}
            {!!articleQuery.data && articleQuery.data.totalCount > articleQuery.data.pageSize && (
              <Pagination
                count={articleQuery.data.totalCount}
                pageSize={articleQuery.data.pageSize}
                page={page}
                onPageChange={(details) => setPage(details.page)}
                buttonSize="small"
              />
            )}
          </ComboboxContent>
        </ComboboxRoot>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default FrontpageArticleSearch;
