/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField, useFormikContext } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DragVertical } from "@ndla/icons/editor";
import { ComboboxLabel } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticle } from "@ndla/types-backend/draft-api";
import { ILearningPathV2 } from "@ndla/types-backend/learningpath-api";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import ListResource from "../../../components/Form/ListResource";
import { FormContent } from "../../../components/FormikForm";
import { fetchDraft } from "../../../modules/draft/draftApi";
import { useMoviesQuerySearch } from "../../../modules/frontpage/filmQueries";
import { fetchLearningpath } from "../../../modules/learningpath/learningpathApi";
import handleError from "../../../util/handleError";
import { routes, toLearningpathFull } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
  },
});

interface Props {
  editorsChoices: (IArticle | ILearningPathV2)[];
  elementId: string;
  fieldName: string;
}

const getSubject = (elementId: string) => {
  if (elementId.includes("subject")) {
    return elementId;
  }
  return undefined;
};

const SubjectpageArticles = ({ editorsChoices, elementId, fieldName }: Props) => {
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();
  const { i18n, t } = useTranslation();
  const [resources, setResources] = useState<(IArticle | ILearningPathV2)[]>(editorsChoices);
  const { setFieldTouched } = useFormikContext();
  const [fieldInputProps] = useField<(IArticle | ILearningPathV2)[]>(fieldName);
  const subjectId = getSubject(elementId);

  const searchQuery = useMoviesQuerySearch(
    {
      page,
      subjects: subjectId,
      sort: "-relevance",
      "page-size": 10,
      query: delayedQuery,
    },
    { placeholderData: (prev) => prev },
  );

  const onAddResultToList = async (result: IMultiSearchSummary) => {
    try {
      if (resources.some((r) => r.id === result.id)) {
        const newResources = resources.filter((r) => r.id !== result.id);
        setResources(newResources);
        updateFormik(newResources);
      } else {
        const f = result.learningResourceType === "learningpath" ? fetchLearningpath : fetchDraft;
        const newResource = await f(result.id);
        const newResources = resources.concat({ ...newResource, metaImage: result.metaImage });
        setResources(newResources);
        updateFormik(newResources);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (articleList: (IArticle | ILearningPathV2)[]) => {
    setResources(articleList);
    updateFormik(articleList);
  };

  const onDeleteElement = (elements: (IArticle | ILearningPathV2)[], deleteIndex: number) => {
    const newElements = elements.filter((_, i) => i !== deleteIndex);
    onUpdateElements(newElements);
  };

  const updateFormik = (newData: (IArticle | ILearningPathV2)[]) => {
    setFieldTouched(fieldName, true, false);
    fieldInputProps.onChange({
      target: {
        name: fieldName,
        value: newData || null,
      },
    });
  };

  return (
    <FormContent>
      <GenericSearchCombobox
        value={resources.map((r) => r.id.toString())}
        closeOnSelect={false}
        selectionBehavior="preserve"
        onValueChange={(details) => onAddResultToList(details.items[0])}
        items={searchQuery.data?.results ?? []}
        itemToString={(item) => item.title.title}
        itemToValue={(item) => item.id.toString()}
        inputValue={query}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        isSuccess={searchQuery.isSuccess}
        paginationData={searchQuery.data}
        onPageChange={(details) => setPage(details.page)}
        renderItem={(item) => (
          <GenericComboboxItemContent
            title={item.title.title}
            description={item.metaDescription.metaDescription}
            image={item.metaImage}
            useFallbackImage
          />
        )}
      >
        <ComboboxLabel>{t("subjectpageForm.editorsChoices")}</ComboboxLabel>
        <GenericComboboxInput placeholder={t("subjectpageForm.addArticle")} isFetching={searchQuery.isFetching} />
      </GenericSearchCombobox>
      <StyledList>
        <DndList
          data-testid="editors-choices-article-list"
          items={resources}
          dragHandle={
            <DragHandle aria-label={t("form.file.changeOrder")}>
              <DragVertical />
            </DragHandle>
          }
          renderItem={(item, index) => (
            <ListResource
              key={item.id}
              title={item.title?.title}
              metaImage={"metaImage" in item ? item.metaImage : undefined}
              url={
                "articleType" in item
                  ? routes.editArticle(item.id, item.articleType ?? "standard", i18n.language)
                  : toLearningpathFull(item.id, i18n.language)
              }
              isExternal={!("articleType" in item)}
              onDelete={() => onDeleteElement(resources, index)}
              removeElementTranslation={t("subjectpageForm.removeArticle")}
            />
          )}
          onDragEnd={(_, newArray) => onUpdateElements(newArray)}
        />
      </StyledList>
    </FormContent>
  );
};

export default SubjectpageArticles;
