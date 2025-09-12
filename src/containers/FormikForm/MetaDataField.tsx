/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, useFormikContext } from "formik";
import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant, Node } from "slate";
import { createListCollection } from "@ark-ui/react";
import {
  Button,
  ComboboxItem,
  ComboboxItemText,
  DialogTrigger,
  FieldErrorMessage,
  FieldHelper,
  FieldLabel,
  FieldRoot,
  Input,
  Text,
} from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { TagSelectorLabel, TagSelectorRoot, useTagSelectorTranslations } from "@ndla/ui";
import { ArticleFormType } from "./articleFormHooks";
import MetaImageSearch from "./MetaImageSearch";
import { GenericComboboxItemIndicator } from "../../components/abstractions/Combobox";
import { AiPromptDialog } from "../../components/AiPromptDialog";
import { FieldWarning } from "../../components/Form/FieldWarning";
import { FormRemainingCharacters } from "../../components/Form/FormRemainingCharacters";
import { SearchTagsContent } from "../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../components/FormField";
import { FormContent } from "../../components/FormikForm";
import PlainTextEditor from "../../components/SlateEditor/PlainTextEditor";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { AI_ACCESS_SCOPE } from "../../constants";
import { MetaDescriptionVariables, SummaryVariables } from "../../interfaces";
import { useDraftSearchTags } from "../../modules/draft/draftQueries";
import { inlineContentToEditorValue } from "../../util/articleContentConverter";
import useDebounce from "../../util/useDebounce";
import { useSession } from "../Session/SessionProvider";

const StyledFormRemainingCharacters = styled(FormRemainingCharacters, {
  base: {
    marginInlineStart: "auto",
  },
});

interface Props {
  articleLanguage: string;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3DTO) => void;
}

const SUMMARY_EDITOR = "editor-summary";
const METADATA_EDITOR = "editor-metadata";

const MetaDataField = ({ articleLanguage, showCheckbox, checkboxAction }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const tagSelectorTranslations = useTagSelectorTranslations();
  const plugins = [textTransformPlugin];
  const [inputQuery, setInputQuery] = useState<string>("");
  const [summary, setSummary] = useState<Descendant[]>([]);
  const debouncedQuery = useDebounce(inputQuery, 300);
  const { setStatus, values } = useFormikContext<ArticleFormType>();
  const searchTagsQuery = useDraftSearchTags(
    {
      input: debouncedQuery,
      language: articleLanguage,
    },
    {
      enabled: !!debouncedQuery.length,
      placeholderData: (prev) => prev,
    },
  );

  const collection = useMemo(() => {
    return createListCollection({
      items: searchTagsQuery.data?.results ?? [],
      itemToValue: (item) => item,
      itemToString: (item) => item,
    });
  }, [searchTagsQuery.data?.results]);

  const getMetaDescriptionPromptVariables = (): MetaDescriptionVariables => {
    const articleTitle = values.title.map((val) => Node.string(val)).join(" ");
    const articleContent = values.content.map((val) => Node.string(val)).join(" ");
    return {
      type: "metaDescription",
      text: articleContent,
      title: articleTitle,
    };
  };

  const getSummaryPromptVariables = (): SummaryVariables => {
    const articleTitle = values.title.map((val) => Node.string(val)).join(" ");
    const articleContent = values.content.map((val) => Node.string(val)).join(" ");
    return {
      type: "summary",
      text: articleContent,
      title: articleTitle,
    };
  };

  const onInsertMetaDescription = (generatedText: string, helpers: FieldHelperProps<Descendant[]>) => {
    helpers.setValue(inlineContentToEditorValue(generatedText, true), true);
    setStatus({ status: METADATA_EDITOR });
  };

  const onInsertSummary = (generatedText: string) => {
    setSummary(inlineContentToEditorValue(generatedText, true));
    setStatus({ status: SUMMARY_EDITOR });
  };

  return (
    <FormContent>
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
      <FormField name="metaDescription">
        {({ field, meta, helpers }) => (
          <FieldRoot invalid={!!meta.error}>
            <HStack justify="space-between">
              <FieldLabel>{t("form.metaDescription.label")}</FieldLabel>
              {userPermissions?.includes(AI_ACCESS_SCOPE) ? (
                <AiPromptDialog
                  promptVariables={getMetaDescriptionPromptVariables}
                  language={articleLanguage}
                  onInsert={(text) => onInsertMetaDescription(text, helpers)}
                >
                  <DialogTrigger asChild>
                    <Button size="small">{t("textGeneration.generateButton", { type: "metaDescription" })}</Button>
                  </DialogTrigger>
                </AiPromptDialog>
              ) : null}
            </HStack>
            <FieldHelper>{t("form.metaDescription.description")}</FieldHelper>
            <PlainTextEditor
              id={field.name}
              placeholder={t("form.metaDescription.label")}
              {...field}
              plugins={plugins}
              editorId={METADATA_EDITOR}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <StyledFormRemainingCharacters maxLength={155} value={field.value} />
            <FieldWarning name={field.name} />
          </FieldRoot>
        )}
      </FormField>
      {!!userPermissions?.includes(AI_ACCESS_SCOPE) && (
        <div>
          <HStack justify="space-between">
            <Text textStyle="label.medium">{t("form.articleSummary.label")}</Text>
            <AiPromptDialog
              promptVariables={getSummaryPromptVariables}
              language={articleLanguage}
              onInsert={onInsertSummary}
            >
              <DialogTrigger asChild>
                <Button size="small">{t("textGeneration.generateButton", { type: "summary" })}</Button>
              </DialogTrigger>
            </AiPromptDialog>
          </HStack>
          <Text textStyle="label.small">{t("form.articleSummary.description")}</Text>
          <PlainTextEditor
            id="summary"
            placeholder={t("form.articleSummary.label")}
            plugins={plugins}
            onChange={(val: {
              target: {
                name: number;
                value: Descendant[];
                type: "SlateEditorValue";
              };
            }) => setSummary(val.target.value)}
            value={summary}
            editorId={SUMMARY_EDITOR}
          />
        </div>
      )}
      <FormField name="metaImageId">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <MetaImageSearch
              metaImageId={field.value}
              showRemoveButton={false}
              showCheckbox={!!showCheckbox}
              checkboxAction={checkboxAction}
              language={articleLanguage}
              {...field}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
    </FormContent>
  );
};

export default memo(MetaDataField);
