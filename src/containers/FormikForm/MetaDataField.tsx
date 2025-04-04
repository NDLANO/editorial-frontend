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
  Text,
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
import { useGenerateSummaryMutation, useGenerateMetaDescriptionMutation } from "../../modules/llm/llmMutations";
import { inlineContentToEditorValue } from "../../util/articleContentConverter";
import { NdlaErrorPayload } from "../../util/resolveJsonOrRejectWithError";
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
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3DTO) => void;
}

const availabilityValues: string[] = ["everyone", "teacher"];
const SUMMARY_EDITOR = "editor-summary";
const METADATA_EDITOR = "editor-metadata";

const MetaDataField = ({ articleLanguage, showCheckbox, checkboxAction }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { createMessage } = useMessages();
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
  const generateSummaryMutation = useGenerateSummaryMutation();
  const generateMetaDescriptionMutation = useGenerateMetaDescriptionMutation();

  const collection = useMemo(() => {
    return createListCollection({
      items: searchTagsQuery.data?.results ?? [],
      itemToValue: (item) => item,
      itemToString: (item) => item,
    });
  }, [searchTagsQuery.data?.results]);

  const onClickMetaDescription = async (helpers: FieldHelperProps<Descendant[]>) => {
    const articleTitle = values.title.map((val) => Node.string(val)).join(" ");
    const articleContent = values.content.map((val) => Node.string(val)).join(" ");

    await generateMetaDescriptionMutation
      .mutateAsync({
        type: "metaDescription",
        text: articleContent,
        title: articleTitle,
        language: t(`languages.${articleLanguage}`),
      })
      .then(async (res) => {
        await helpers.setValue(inlineContentToEditorValue(res, true), true);
        setStatus({ status: METADATA_EDITOR });
      })
      .catch((e: NdlaErrorPayload) =>
        createMessage({
          message: t("textGeneration.failed.metaDescription", { error: e.messages }),
          severity: "danger",
          timeToLive: 10000,
        }),
      );
  };

  const onClickGenerateSummary = async () => {
    const articleTitle = values.title.map((val) => Node.string(val)).join(" ");
    const articleContent = values.content.map((val) => Node.string(val)).join(" ");

    await generateSummaryMutation
      .mutateAsync({
        type: "summary",
        text: articleContent,
        title: articleTitle,
        language: t(`languages.${articleLanguage}`),
      })
      .then(async (res) => {
        setSummary(inlineContentToEditorValue(res, true));
        setStatus({ status: SUMMARY_EDITOR });
      })
      .catch((e: NdlaErrorPayload) =>
        createMessage({
          message: t("textGeneration.failed.summary", { error: e.messages }),
          severity: "danger",
          timeToLive: 10000,
        }),
      );
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
              {userPermissions?.includes(AI_ACCESS_SCOPE) ? (
                <Button
                  size="small"
                  onClick={() => onClickMetaDescription(helpers)}
                  loading={generateMetaDescriptionMutation.isPending}
                >
                  {t("textGeneration.generate.metaDescription")}
                </Button>
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
            <Button size="small" onClick={() => onClickGenerateSummary()} loading={generateSummaryMutation.isPending}>
              {t("textGeneration.generate.summary")}
            </Button>
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
