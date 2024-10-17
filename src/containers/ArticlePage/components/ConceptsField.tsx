/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DragVertical } from "@ndla/icons/editor";
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
import useDebounce from "../../../util/useDebounce";
import { ArticleFormType } from "../../FormikForm/articleFormHooks";

const StyledList = styled("ul", {
  base: { listStyle: "none" },
});

interface Props {
  field: FieldInputProps<ArticleFormType["conceptIds"]>;
  form: FormikHelpers<ArticleFormType>;
}

const ConceptsField = ({ field, form }: Props) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const delayedQuery = useDebounce(query, 300);
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
    form.setFieldTouched("conceptIds", true, false);
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
        multiple
        onValueChange={(details) => {
          field.onChange({ target: { name: field.name, value: details.items.map((c) => c.id) } });
          setConcepts(details.items);
        }}
        items={searchQuery.data?.results ?? []}
        itemToString={(item) => item.title.title}
        itemToValue={(item) => item.id.toString()}
        inputValue={query}
        isSuccess={searchQuery.isSuccess}
        paginationData={searchQuery.data}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        onPageChange={(details) => setPage(details.page)}
        renderItem={(item) => <GenericComboboxItemContent title={item.title.title} image={item.metaImage} />}
      >
        <ComboboxLabel>{t("form.relatedConcepts.articlesTitle")}</ComboboxLabel>
        <GenericComboboxInput placeholder={t("form.relatedConcepts.placeholder")} isFetching={searchQuery.isFetching} />
      </GenericSearchCombobox>
      <StyledList>
        <DndList
          items={concepts}
          dragHandle={
            <DragHandle aria-label={t("form.relatedConcepts.changeOrder")}>
              <DragVertical />
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
