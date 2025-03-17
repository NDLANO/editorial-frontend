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
import { Descendant } from "slate";
import { createListCollection } from "@ark-ui/react";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import {
  Button,
  ComboboxItem,
  ComboboxItemText,
  FieldErrorMessage,
  FieldHelper,
  FieldLabel,
  FieldRoot,
  Input,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
  Spinner,
} from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { TagSelectorLabel, TagSelectorRoot, useTagSelectorTranslations } from "@ndla/ui";
import { MetaImageSearch } from ".";
import { ArticleFormType } from "./articleFormHooks";
import { GenericComboboxItemIndicator } from "../../components/abstractions/Combobox";
import { FieldWarning } from "../../components/Form/FieldWarning";
import { FormRemainingCharacters } from "../../components/Form/FormRemainingCharacters";
import { SearchTagsContent } from "../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../components/FormField";
import { FormContent } from "../../components/FormikForm";
import PlainTextEditor from "../../components/SlateEditor/PlainTextEditor";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { AI_ACCESS_SCOPE, DRAFT_ADMIN_SCOPE } from "../../constants";
import { useDraftSearchTags } from "../../modules/draft/draftQueries";
import {
  blockContentToHTML,
  inlineContentToEditorValue,
  inlineContentToHTML,
} from "../../util/articleContentConverter";
import { getTextFromHTML, Payload, useAiGeneratedAnswer } from "../../util/llmUtils";
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

const availabilityValues: string[] = ["everyone", "teacher"];

const MetaDataField = ({ articleLanguage, showCheckbox, checkboxAction }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const tagSelectorTranslations = useTagSelectorTranslations();
  const plugins = [textTransformPlugin];
  const [inputQuery, setInputQuery] = useState<string>("");
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

  const articleTitle = useMemo(() => getTextFromHTML(inlineContentToHTML(values.title)), [values.title]);
  const articleContent = useMemo(() => getTextFromHTML(blockContentToHTML(values.content)), [values.content]);

  // TODO: Handle loading, the fetching can take a long time
  const generateMetaDescription = async (
    helpers: FieldHelperProps<Descendant[]>,
    mutateAsync: UseMutateAsyncFunction<string, any, Payload>,
  ) => {
    const generatedText = await mutateAsync({
      prompt: t("textGeneration.metaDescription.prompt", {
        article: articleContent,
        title: articleTitle,
        language: t(`languages.${articleLanguage}`),
      }),
    });

    if (generatedText) {
      await helpers.setValue(inlineContentToEditorValue(generatedText, true), true);
    }
    setStatus({ status: "acceptGenerated" });
  };

  // TODO: Handle loading, the fetching can take a long time
  const generateSummary = async (
    helpers: FieldHelperProps<Descendant[]>,
    mutateAsync: UseMutateAsyncFunction<string, any, Payload>,
  ) => {
    const generatedText = await mutateAsync({
      prompt: t("textGeneration.articleSummary.prompt", {
        article: articleContent,
        title: articleTitle,
        language: t(`languages.${articleLanguage}`),
      }),
    });

    if (generatedText) {
      await helpers.setValue(inlineContentToEditorValue(generatedText, true), true);
    }
    setStatus({ status: "acceptGenerated" });
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
      {!!userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
        <FormField name="availability">
          {({ field, helpers }) => (
            <FieldRoot>
              <RadioGroupRoot
                orientation="horizontal"
                value={field.value}
                onValueChange={(details) => helpers.setValue(details.value)}
              >
                <RadioGroupLabel>{t("form.availability.description")}</RadioGroupLabel>
                {availabilityValues.map((value) => (
                  <RadioGroupItem key={value} value={value}>
                    <RadioGroupItemControl />
                    <RadioGroupItemText>{t(`form.availability.${value}`)}</RadioGroupItemText>
                    <RadioGroupItemHiddenInput />
                  </RadioGroupItem>
                ))}
              </RadioGroupRoot>
            </FieldRoot>
          )}
        </FormField>
      )}
      <FormField name="metaDescription">
        {({ field, meta, helpers }) => (
          <FieldRoot invalid={!!meta.error}>
            <HStack justify="space-between">
              <FieldLabel>{t("form.metaDescription.label")}</FieldLabel>
              <GenerateAnswerButton
                title={t("textGeneration.metaDescription.button")}
                onClick={generateMetaDescription}
                helpers={helpers}
              />
            </HStack>
            <FieldHelper>{t("form.metaDescription.description")}</FieldHelper>

            <PlainTextEditor
              id={field.name}
              placeholder={t("form.metaDescription.label")}
              {...field}
              plugins={plugins}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <StyledFormRemainingCharacters maxLength={155} value={field.value} />
            <FieldWarning name={field.name} />
          </FieldRoot>
        )}
      </FormField>
      {!!userPermissions?.includes(AI_ACCESS_SCOPE) && (
        <FormField name="summary">
          {({ field, meta, helpers }) => (
            <FieldRoot invalid={!!meta.error}>
              <HStack justify="space-between">
                <FieldLabel>{t("form.articleSummary.label")}</FieldLabel>
                <GenerateAnswerButton
                  title={t("textGeneration.articleSummary.button")}
                  helpers={helpers}
                  onClick={generateSummary}
                />
              </HStack>
              <FieldHelper>{t("form.articleSummary.description")}</FieldHelper>
              <PlainTextEditor
                id={field.name}
                placeholder={t("form.articleSummary.label")}
                {...field}
                plugins={plugins}
              />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldWarning name={field.name} />
            </FieldRoot>
          )}
        </FormField>
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

interface GenerateAnswerButtonProps {
  onClick: (helpers: FieldHelperProps<Descendant[]>, mutation: UseMutateAsyncFunction<string, any, Payload>) => void;
  helpers: FieldHelperProps<Descendant[]>;
  title: string;
}
export const GenerateAnswerButton = ({ onClick, helpers, title }: GenerateAnswerButtonProps) => {
  const { userPermissions } = useSession();
  const { mutateAsync, isPending } = useAiGeneratedAnswer();

  return userPermissions?.includes(AI_ACCESS_SCOPE) ? (
    <Button size="small" onClick={() => onClick(helpers, mutateAsync)}>
      {title}
      {isPending ? <Spinner size="small" /> : null}
    </Button>
  ) : null;
};
