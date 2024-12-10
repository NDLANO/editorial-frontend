/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Draggable } from "@ndla/icons";
import { ComboboxLabel } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IConceptSummary } from "@ndla/types-backend/concept-api";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import ListResource from "../../../components/Form/ListResource";
import { FormContent } from "../../../components/FormikForm";
import { postSearchConcepts } from "../../../modules/concept/conceptApi";
import { useSearchConcepts } from "../../../modules/concept/conceptQueries";
import { routes } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";
import { ArticleFormType } from "../../FormikForm/articleFormHooks";

const StyledList = styled("ul", {
  base: { listStyle: "none" },
});

interface Props {
  field: FieldInputProps<ArticleFormType["conceptIds"]>;
}

const ConceptsField = ({ field }: Props) => {
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();
  const { t, i18n } = useTranslation();
  const [concepts, setConcepts] = useState<IConceptSummary[]>([]);

  const searchQuery = useSearchConcepts(
    { query: delayedQuery, language: i18n.language, page },
    { placeholderData: (prev) => prev },
  );

  useEffect(() => {
    (async () => {
      if (!field.value.length) return;
      const concepts = await postSearchConcepts({ ids: field.value, language: i18n.language });
      setConcepts(concepts.results);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUpdateElements = (conceptList: IConceptSummary[]) => {
    setConcepts(conceptList);
    updateFormik(field, conceptList);
  };

  const onDeleteElements = (elements: IConceptSummary[], deleteIndex: number) => {
    const newElements = elements.filter((_, i) => i !== deleteIndex);
    onUpdateElements(newElements);
  };

  const updateFormik = (formikField: Props["field"], newData: IConceptSummary[]) => {
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData.map((c) => c.id) || null,
      },
    });
  };

  return (
    <FormContent>
      <GenericSearchCombobox
        value={field.value.map((c) => c.toString())}
        closeOnSelect={false}
        selectionBehavior="preserve"
        onValueChange={(details) => {
          const newValue = parseInt(details.value[0]);
          if (!newValue) return;
          if (field.value.includes(newValue)) {
            field.onChange({ target: { name: field.name, value: field.value.filter((val) => val !== newValue) } });
            setConcepts(concepts.filter((c) => c.id !== newValue));
          } else {
            field.onChange({ target: { name: field.name, value: field.value.concat(newValue) } });
            setConcepts((prev) => prev.concat(details.items[0]));
          }
        }}
        items={searchQuery.data?.results ?? []}
        itemToString={(item) => item.title.title}
        itemToValue={(item) => item.id.toString()}
        inputValue={query}
        isSuccess={searchQuery.isSuccess}
        paginationData={searchQuery.data}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        onPageChange={(details) => setPage(details.page)}
        renderItem={(item) => (
          <GenericComboboxItemContent title={item.title.title} image={item.metaImage} useFallbackImage />
        )}
      >
        <ComboboxLabel>{t("form.relatedConcepts.articlesTitle")}</ComboboxLabel>
        <GenericComboboxInput placeholder={t("form.relatedConcepts.placeholder")} isFetching={searchQuery.isFetching} />
      </GenericSearchCombobox>
      <StyledList>
        <DndList
          items={concepts}
          dragHandle={
            <DragHandle aria-label={t("form.relatedConcepts.changeOrder")}>
              <Draggable />
            </DragHandle>
          }
          renderItem={(item, index) => (
            <ListResource
              key={item.id}
              title={item.title.title}
              metaImage={item.metaImage}
              url={
                item.conceptType === "concept"
                  ? routes.concept.edit(item.id, i18n.language)
                  : routes.gloss.edit(item.id, i18n.language)
              }
              onDelete={() => onDeleteElements(concepts, index)}
              removeElementTranslation={t("form.relatedConcepts.removeArticle")}
            />
          )}
          onDragEnd={(_, newArray) => onUpdateElements(newArray)}
        />
      </StyledList>
    </FormContent>
  );
};

export default ConceptsField;
