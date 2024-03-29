/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { ITagsSearchResult } from "@ndla/types-backend/concept-api";
import { Node } from "@ndla/types-taxonomy";
import InlineImageSearch from "./InlineImageSearch";
import AsyncSearchTags from "../../../components/Dropdown/asyncDropdown/AsyncSearchTags";
import MultiSelectDropdown from "../../../components/Dropdown/MultiSelectDropdown";
import FormikField from "../../../components/FormikField";
import { MetaImageSearch } from "../../FormikForm";
import { onSaveAsVisualElement } from "../../FormikForm/utils";
import { ConceptFormValues } from "../conceptInterfaces";

interface Props {
  subjects: Node[];
  fetchTags: (input: string, language: string) => Promise<ITagsSearchResult>;
  inModal: boolean;
  language?: string;
}

const ConceptMetaData = ({ subjects, fetchTags, inModal, language }: Props) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ConceptFormValues>();
  const { values } = formikContext;

  return (
    <>
      {inModal ? (
        <InlineImageSearch name="metaImageId" />
      ) : (
        <FormikField name="metaImageId">
          {({ field, form }) => (
            <MetaImageSearch
              metaImageId={field.value}
              setFieldTouched={form.setFieldTouched}
              showRemoveButton
              showCheckbox={true}
              checkboxAction={(image) => onSaveAsVisualElement(image, formikContext)}
              language={language}
              {...field}
            />
          )}
        </FormikField>
      )}
      <FormikField name="subjects" label={t("form.subjects.label")} description={t("form.concept.subjects")}>
        {({ field }) => <MultiSelectDropdown labelField="name" minSearchLength={1} initialData={subjects} {...field} />}
      </FormikField>
      <FormikField name="tags" label={t("form.categories.label")} description={t("form.categories.description")}>
        {({ field, form }) => (
          <AsyncSearchTags
            multiSelect
            language={values.language}
            initialTags={values.tags}
            field={field}
            form={form}
            fetchTags={fetchTags}
          />
        )}
      </FormikField>
    </>
  );
};

export default ConceptMetaData;
