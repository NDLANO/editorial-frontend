/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { Draggable } from "@ndla/icons";
import { ComboboxLabel } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticle, IArticleSummary } from "@ndla/types-backend/draft-api";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import ListResource from "../../../components/Form/ListResource";
import { FormContent } from "../../../components/FormikForm";
import { fetchDraft } from "../../../modules/draft/draftApi";
import { useSearchDrafts } from "../../../modules/draft/draftQueries";
import handleError from "../../../util/handleError";
import { routes } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";
import { ConceptFormValues } from "../conceptInterfaces";

const StyledList = styled("ul", {
  base: { listStyle: "none" },
});

const ConceptArticles = () => {
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();
  const { i18n, t } = useTranslation();
  const {
    values: { articles, language },
    setFieldValue,
  } = useFormikContext<ConceptFormValues>();

  const searchQuery = useSearchDrafts({ query: delayedQuery, language, page }, { placeholderData: (prev) => prev });

  const onAddArticleToList = async (article: IArticleSummary) => {
    try {
      if (articles.some((a) => a.id === article.id)) {
        setFieldValue(
          "articles",
          articles.filter((a) => a.id !== article.id),
        );
      } else {
        const newArticle = await fetchDraft(article.id);
        if (newArticle !== undefined) {
          setFieldValue("articles", articles.concat(newArticle));
        }
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (articleList: IArticle[]) => {
    setFieldValue("articles", articleList);
  };

  const onDeleteElement = (elements: IArticle[], deleteIndex: number) => {
    const newElements = elements.filter((_, i) => i !== deleteIndex);
    onUpdateElements(newElements);
  };

  return (
    <FormContent>
      <GenericSearchCombobox
        value={articles.map((article) => article.id.toString())}
        closeOnSelect={false}
        selectionBehavior="preserve"
        onValueChange={(details) => onAddArticleToList(details.items[0])}
        items={searchQuery.data?.results ?? []}
        itemToString={(item) => item.title.title}
        itemToValue={(item) => item.id.toString()}
        inputValue={query}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        isSuccess={searchQuery.isSuccess}
        paginationData={searchQuery.data}
        onPageChange={(details) => setPage(details.page)}
        renderItem={(item) => <GenericComboboxItemContent title={item.title.title} />}
      >
        <ComboboxLabel>{t("form.related.title")}</ComboboxLabel>
        <GenericComboboxInput
          placeholder={t("form.content.relatedArticle.placeholder")}
          isFetching={searchQuery.isFetching}
        />
      </GenericSearchCombobox>
      <StyledList>
        <DndList
          items={articles}
          dragHandle={
            <DragHandle aria-label={t("conceptpageForm.changeOrder")}>
              <Draggable />
            </DragHandle>
          }
          renderItem={(item, index) => (
            <ListResource
              key={item.id}
              title={item.title?.title}
              metaImage={item.metaImage}
              url={routes.editArticle(item.id, item.articleType ?? "standard", i18n.language)}
              onDelete={() => onDeleteElement(articles, index)}
              removeElementTranslation={t("conceptpageForm.removeArticle")}
            />
          )}
          onDragEnd={(_, newArray) => onUpdateElements(newArray)}
        />
      </StyledList>
    </FormContent>
  );
};

export default ConceptArticles;
