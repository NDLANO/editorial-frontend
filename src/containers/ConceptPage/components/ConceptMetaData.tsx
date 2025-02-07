/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import keyBy from "lodash/keyBy";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ComboboxContext, TagsInputContext, createListCollection } from "@ark-ui/react";
import { CloseLine, ArrowDownShortLine } from "@ndla/icons";
import {
  ComboboxItem,
  ComboboxItemText,
  FieldErrorMessage,
  FieldHelper,
  FieldRoot,
  IconButton,
  Input,
  InputContainer,
  TagsInputItem,
  TagsInputItemDeleteTrigger,
  TagsInputItemInput,
  TagsInputItemPreview,
  TagsInputItemText,
} from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import {
  TagSelectorClearTrigger,
  TagSelectorControl,
  TagSelectorInputBase,
  TagSelectorLabel,
  TagSelectorRoot,
  TagSelectorTrigger,
  useTagSelectorTranslations,
} from "@ndla/ui";
import InlineImageSearch from "./InlineImageSearch";
import { GenericComboboxItemIndicator } from "../../../components/abstractions/Combobox";
import { SearchTagsContent } from "../../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import { useConceptSearchTags } from "../../../modules/concept/conceptQueries";
import useDebounce from "../../../util/useDebounce";
import { MetaImageSearch } from "../../FormikForm";
import { onSaveAsVisualElement } from "../../FormikForm/utils";
import { ConceptFormValues } from "../conceptInterfaces";

interface Props {
  subjects: Node[];
  inModal: boolean;
  language?: string;
}

const ConceptMetaData = ({ subjects, inModal, language }: Props) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ConceptFormValues>();
  const tagSelectorTranslations = useTagSelectorTranslations();
  const { values } = formikContext;
  const [inputQuery, setInputQuery] = useState<string>("");
  const [subjectsInputQuery, setSubjectsInputQuery] = useState<string>("");
  const debouncedQuery = useDebounce(inputQuery, 300);
  const searchTagsQuery = useConceptSearchTags(
    {
      input: debouncedQuery,
      language: values.language,
    },
    {
      enabled: !!debouncedQuery.length,
      placeholderData: (prev) => prev,
    },
  );

  const keyedSubjects = useMemo(() => keyBy(subjects, (subject) => subject.id), [subjects]);

  const filteredSubjects = useMemo(
    () => subjects.filter((subject) => subject.name.toLowerCase().includes(subjectsInputQuery)),
    [subjects, subjectsInputQuery],
  );

  const collection = useMemo(() => {
    return createListCollection({
      items: searchTagsQuery.data?.results ?? [],
      itemToValue: (item) => item,
      itemToString: (item) => item,
    });
  }, [searchTagsQuery.data?.results]);

  const subjectsCollection = useMemo(() => {
    return createListCollection({
      items: filteredSubjects,
      itemToString: (item) => item.name,
      itemToValue: (item) => item.id,
    });
  }, [filteredSubjects]);

  return (
    <FormContent>
      {inModal ? (
        <InlineImageSearch name="metaImageId" />
      ) : (
        <FormField name="metaImageId">
          {({ field, meta }) => (
            <FieldRoot invalid={!!meta.error}>
              <MetaImageSearch
                metaImageId={field.value}
                showRemoveButton
                showCheckbox={true}
                checkboxAction={(image) => onSaveAsVisualElement(image, formikContext)}
                language={language}
                {...field}
              />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FieldRoot>
          )}
        </FormField>
      )}
      <FormField<Node[]> name="subjects">
        {({ field, meta, helpers }) => (
          <FieldRoot invalid={!!meta.error}>
            <TagSelectorRoot
              collection={subjectsCollection}
              value={field.value.map((subject) => subject.id)}
              onValueChange={(details) => {
                // only add valid subjects. Triggering the delimiter can lead to an invalid subject being added.
                helpers.setValue(details.value.map((id) => keyedSubjects[id]).filter(Boolean));
              }}
              translations={tagSelectorTranslations}
              inputValue={subjectsInputQuery}
              onInputValueChange={(details) => setSubjectsInputQuery(details.inputValue)}
              // arbitrary delimiter that is hopefully never written
              delimiter={"^"}
              editable={false}
            >
              <TagSelectorLabel>{t("form.subjects.label")}</TagSelectorLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldHelper>{t("form.concept.subjects")}</FieldHelper>
              <HStack gap="3xsmall">
                <TagSelectorControl asChild>
                  <InputContainer>
                    {field.value.map((value, index) => (
                      <TagsInputItem index={index} value={value.id} key={value.id}>
                        <TagsInputItemPreview>
                          <TagsInputItemText>{value.name}</TagsInputItemText>
                          <TagsInputItemDeleteTrigger>
                            <CloseLine />
                          </TagsInputItemDeleteTrigger>
                        </TagsInputItemPreview>
                        <TagsInputItemInput />
                      </TagsInputItem>
                    ))}
                    <TagsInputContext>
                      {(tagsInputApi) => (
                        <ComboboxContext>
                          {(comboboxApi) => (
                            <TagSelectorInputBase
                              onKeyDown={(e) => {
                                // only add a new value if the combobox has a highlighted value. We're not allowing custom values.
                                if (e.key === "Enter" && comboboxApi.highlightedValue) {
                                  tagsInputApi.addValue(comboboxApi.highlightedValue);
                                }
                                return;
                              }}
                              asChild
                            >
                              <Input placeholder={t("form.tags.searchPlaceholder")} />
                            </TagSelectorInputBase>
                          )}
                        </ComboboxContext>
                      )}
                    </TagsInputContext>
                    <TagSelectorClearTrigger asChild>
                      <IconButton variant="clear">
                        <CloseLine />
                      </IconButton>
                    </TagSelectorClearTrigger>
                  </InputContainer>
                </TagSelectorControl>
                <TagSelectorTrigger asChild>
                  <IconButton variant="secondary">
                    <ArrowDownShortLine />
                  </IconButton>
                </TagSelectorTrigger>
              </HStack>
              <SearchTagsContent isFetching={false} hits={subjectsCollection.items.length}>
                {subjectsCollection.items.map((item) => (
                  <ComboboxItem key={item.id} item={item}>
                    <ComboboxItemText>{item.name}</ComboboxItemText>
                    <GenericComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </SearchTagsContent>
            </TagSelectorRoot>
          </FieldRoot>
        )}
      </FormField>
      <FormField name="tags">
        {({ field, meta, helpers }) => (
          <FieldRoot invalid={!!meta.error}>
            <TagSelectorRoot
              collection={collection}
              value={field.value}
              onValueChange={(details) => helpers.setValue(details.value)}
              translations={tagSelectorTranslations}
              inputValue={inputQuery}
              onInputValueChange={(details) => setInputQuery(details.inputValue)}
            >
              <TagSelectorLabel>{t("form.tags.label")}</TagSelectorLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldHelper>{t("form.tags.description")}</FieldHelper>
              <SearchTagsTagSelectorInput asChild>
                <Input placeholder={t("form.tags.searchPlaceholder")} />
              </SearchTagsTagSelectorInput>
              <SearchTagsContent isFetching={searchTagsQuery.isFetching} hits={collection.items.length}>
                {collection.items.map((item) => (
                  <ComboboxItem key={item} item={item}>
                    <ComboboxItemText>{item}</ComboboxItemText>
                    <GenericComboboxItemIndicator />
                  </ComboboxItem>
                ))}
              </SearchTagsContent>
            </TagSelectorRoot>
          </FieldRoot>
        )}
      </FormField>
    </FormContent>
  );
};

export default ConceptMetaData;
