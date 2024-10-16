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
import { styled } from "@ndla/styled-system/jsx";
import { IConcept, IConceptSummary } from "@ndla/types-backend/concept-api";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import AsyncDropdown from "../../../components/Dropdown/asyncDropdown/AsyncDropdown";
import FieldHeader from "../../../components/Field/FieldHeader";
import ListResource from "../../../components/Form/ListResource";
import { fetchConcept, postSearchConcepts } from "../../../modules/concept/conceptApi";
import handleError from "../../../util/handleError";
import { routes } from "../../../util/routeHelpers";
import { ArticleFormType } from "../../FormikForm/articleFormHooks";

const StyledList = styled("ul", {
  base: { listStyle: "none" },
});

interface ConceptApiTypeWithArticleType extends IConcept {
  articleType?: string;
}
interface Props {
  field: FieldInputProps<ArticleFormType["conceptIds"]>;
  form: FormikHelpers<ArticleFormType>;
}

const ConceptsField = ({ field, form }: Props) => {
  const { t, i18n } = useTranslation();
  const [concepts, setConcepts] = useState<ConceptApiTypeWithArticleType[]>([]);

  useEffect(() => {
    (async () => {
      const conceptPromises = field.value.filter((a) => !!a).map((id) => fetchConcept(id, ""));
      const fetchedConcepts = await Promise.all(conceptPromises);
      setConcepts(
        fetchedConcepts.map((concept) => ({
          ...concept,
          articleType: "concept",
        })),
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddConceptToList = async (concept: IConceptSummary) => {
    try {
      const newConcept = await fetchConcept(concept.id, i18n.language);
      const temp = [...concepts, { ...newConcept, articleType: "concept" }];
      setConcepts(temp);
      updateFormik(field, temp);
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (conceptList: ConceptApiTypeWithArticleType[]) => {
    setConcepts(conceptList);
    updateFormik(field, conceptList);
  };

  const onDeleteElements = (elements: ConceptApiTypeWithArticleType[], deleteIndex: number) => {
    const newElements = elements.filter((_, i) => i !== deleteIndex);
    onUpdateElements(newElements);
  };

  const updateFormik = (formikField: Props["field"], newData: ConceptApiTypeWithArticleType[]) => {
    form.setFieldTouched("conceptIds", true, false);
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData.map((c) => c.id) || null,
      },
    });
  };

  const searchForConcepts = async (query: string, page?: number) => {
    return postSearchConcepts({
      query,
      page,
      language: i18n.language,
    });
  };

  return (
    <>
      <FieldHeader title={t("form.relatedConcepts.articlesTitle")} />
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
      <AsyncDropdown<IConceptSummary>
        selectedItems={concepts}
        idField="id"
        labelField="title"
        placeholder={t("form.relatedConcepts.placeholder")}
        apiAction={searchForConcepts}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={onAddConceptToList}
        multiSelect
        disableSelected
        clearInputField
        showPagination
      />
    </>
  );
};

export default ConceptsField;
