/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { DragVertical } from "@ndla/icons/editor";
import { styled } from "@ndla/styled-system/jsx";
import { IArticle, IArticleSummary } from "@ndla/types-backend/draft-api";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import AsyncDropdown from "../../../components/Dropdown/asyncDropdown/AsyncDropdown";
import FieldHeader from "../../../components/Field/FieldHeader";
import ListResource from "../../../components/Form/ListResource";
import { fetchDraft, searchDrafts } from "../../../modules/draft/draftApi";
import handleError from "../../../util/handleError";
import { routes } from "../../../util/routeHelpers";
import { ConceptFormValues } from "../conceptInterfaces";

const StyledList = styled("ul", {
  base: { listStyle: "none" },
});

const ConceptArticles = () => {
  const { i18n, t } = useTranslation();
  const {
    values: { articles, language },
    setFieldValue,
  } = useFormikContext<ConceptFormValues>();

  const onAddArticleToList = async (article: IArticleSummary) => {
    try {
      const newArticle = await fetchDraft(article.id);
      const temp = [...articles, newArticle];
      if (newArticle !== undefined) {
        setFieldValue("articles", temp);
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

  const searchForArticles = async (input: string) => {
    return searchDrafts({
      query: input,
      language: language,
    });
  };

  return (
    <>
      <FieldHeader title={t("form.related.title")} subTitle={t("subjectpageForm.articles")} />
      <StyledList>
        <DndList
          items={articles}
          dragHandle={
            <DragHandle aria-label={t("conceptpageForm.changeOrder")}>
              <DragVertical />
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
      <AsyncDropdown
        selectedItems={articles}
        idField="id"
        labelField="title"
        placeholder={t("form.content.relatedArticle.placeholder")}
        apiAction={searchForArticles}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={onAddArticleToList}
        multiSelect
        disableSelected
        clearInputField
      />
    </>
  );
};

export default ConceptArticles;
