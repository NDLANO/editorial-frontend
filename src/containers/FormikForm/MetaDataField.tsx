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
import { FileListLine } from "@ndla/icons";
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
import { styled } from "@ndla/styled-system/jsx";
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
import { inlineContentToEditorValue } from "../../util/articleContentConverter";
import { fetchAIGeneratedAnswer } from "../../util/llmUtils";
import useDebounce from "../../util/useDebounce";
import { useMessages } from "../Messages/MessagesProvider";
import { useSession } from "../Session/SessionProvider";

const StyledFormRemainingCharacters = styled(FormRemainingCharacters, {
  base: {
    marginInlineStart: "auto",
  },
});

interface Props {
  articleLanguage: string;
  articleContent?: string;
  articleTitle?: string;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3DTO) => void;
}

const availabilityValues: string[] = ["everyone", "teacher"];

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-start",
  },
});

const MetaDataField = ({ articleLanguage, articleContent, articleTitle, showCheckbox, checkboxAction }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { createMessage } = useMessages();
  const tagSelectorTranslations = useTagSelectorTranslations();
  const plugins = [textTransformPlugin];
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const debouncedQuery = useDebounce(inputQuery, 300);
  const { setStatus } = useFormikContext<ArticleFormType>();
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

  const generateMetaDescription = async (helpers: FieldHelperProps<Descendant[]>) => {
    if (!articleContent) {
      // console.error("No article content provided to generate meta description");
      return;
    }
    setIsLoadingMeta(true);
    try {
      const generatedText = await fetchAIGeneratedAnswer({
        prompt: t("textGeneration.metaDescription.prompt", {
          article: articleContent,
          title: articleTitle,
          language: t(`languages.${articleLanguage}`),
        }),
      });
      if (generatedText) {
        await helpers.setValue(inlineContentToEditorValue(generatedText, true), true);
      }
      // We have to invalidate slate children. We do this with status.
      setStatus({ status: "acceptGenerated" });
    } catch (error: any) {
      createMessage({
        message: t("textGeneration.error", { message: error.message }),
        timeToLive: 0,
        severity: "warning",
      });
    } finally {
      setIsLoadingMeta(false);
    }
  };

  const generateSummary = async (helpers: FieldHelperProps<Descendant[]>) => {
    if (!articleContent) {
      // console.error("No article content provided to generate meta description");
      return;
    }
    setIsLoadingSummary(true);
    try {
      const generatedText = await fetchAIGeneratedAnswer({
        prompt: t("textGeneration.articleSummary.prompt", {
          article: articleContent,
          title: articleTitle,
          language: t(`languages.${articleLanguage}`),
        }),
      });
      if (generatedText) {
        await helpers.setValue(inlineContentToEditorValue(generatedText, true), true);
      }
      // We have to invalidate slate children. We do this with status.
      setStatus({ status: "acceptGenerated" });
    } catch (error) {
      // console.error("Error generating meta description", error);
    } finally {
      setIsLoadingSummary(false);
    }
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
            <FieldLabel>{t("form.metaDescription.label")}</FieldLabel>
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
            {!!userPermissions?.includes(AI_ACCESS_SCOPE) && (
              <StyledButton size="small" onClick={() => generateMetaDescription(helpers)}>
                {t("textGeneration.metaDescription.button")}{" "}
                {isLoadingMeta ? <Spinner size="small" /> : <FileListLine />}
              </StyledButton>
            )}
          </FieldRoot>
        )}
      </FormField>
      {!!userPermissions?.includes(AI_ACCESS_SCOPE) && (
        <FormField name="summary">
          {({ field, meta, helpers }) => (
            <FieldRoot invalid={!!meta.error}>
              <FieldLabel>{t("form.articleSummary.label")}</FieldLabel>
              <FieldHelper>{t("form.articleSummary.description")}</FieldHelper>
              <PlainTextEditor
                id={field.name}
                placeholder={t("form.articleSummary.label")}
                {...field}
                plugins={plugins}
              />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldWarning name={field.name} />
              <StyledButton size="small" onClick={() => generateSummary(helpers)}>
                {t("textGeneration.articleSummary.button")}{" "}
                {isLoadingSummary ? <Spinner size="small" /> : <FileListLine />}
              </StyledButton>
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
