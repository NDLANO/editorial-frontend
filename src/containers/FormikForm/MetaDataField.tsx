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
import { BlogPost, CheckLine } from "@ndla/icons/editor";
import {
  Button,
  ComboboxItem,
  ComboboxItemIndicator,
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
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { TagSelectorLabel, TagSelectorRoot, useTagSelectorTranslations } from "@ndla/ui";
import { MetaImageSearch } from ".";
import { ArticleFormType } from "./articleFormHooks";
import { SearchTagsContent } from "../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../components/FormField";
import FormikField from "../../components/FormikField";
import { FormContent } from "../../components/FormikForm";
import { claudeHaikuDefaults, invokeModel } from "../../components/LLM/helpers";
import PlainTextEditor from "../../components/SlateEditor/PlainTextEditor";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { DRAFT_ADMIN_SCOPE } from "../../constants";
import { useDraftSearchTags } from "../../modules/draft/draftQueries";
import { inlineContentToEditorValue } from "../../util/articleContentConverter";
import useDebounce from "../../util/useDebounce";
import { useSession } from "../Session/SessionProvider";

interface Props {
  articleLanguage: string;
  articleContent?: string;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3) => void;
}

const availabilityValues: string[] = ["everyone", "teacher"];

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-start",
  },
});

const MetaDataField = ({ articleLanguage, articleContent, showCheckbox, checkboxAction }: Props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { userPermissions } = useSession();
  const tagSelectorTranslations = useTagSelectorTranslations();
  const plugins = [textTransformPlugin];
  const [inputQuery, setInputQuery] = useState<string>("");
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
      console.error("No article content provided to generate meta description");
      return;
    }
    setIsLoading(true);
    try {
      const generatedText = await invokeModel({
        prompt: t("textGeneration.metaDescription.prompt", {
          article: articleContent,
          language: t(`languages.${articleLanguage}`),
        }),
        ...claudeHaikuDefaults,
      });
      generatedText
        ? await helpers.setValue(inlineContentToEditorValue(generatedText, true), true)
        : console.error("No generated text");
      // We have to invalidate slate children. We do this with status.
      setStatus({ status: "acceptGenerated" });
    } catch (error) {
      console.error("Error generating meta description", error);
    } finally {
      setIsLoading(false);
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
                    <ComboboxItemIndicator asChild>
                      <CheckLine />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                ))}
              </SearchTagsContent>
            </TagSelectorRoot>
          </FieldRoot>
        )}
      </FormField>
      {userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
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
        {({ field, helpers, meta }) => {
          return (
            <FieldRoot required invalid={!!meta.error}>
              <FieldLabel>{t("form.metaDescription.label")}</FieldLabel>
              <FieldHelper>{t("form.metaDescription.description")}</FieldHelper>
              <PlainTextEditor
                key={field.value}
                id={field.name}
                placeholder={t("form.metaDescription.label")}
                {...field}
                plugins={plugins}
              />
              {/* <FormRemainingCharacters value={field.value[0].children[0].text.length} maxLength={155} /> */}
              <StyledButton size="small" onClick={() => generateMetaDescription(helpers)}>
                {t("textGeneration.metaDescription.button")} {isLoading ? <Spinner size="small" /> : <BlogPost />}
              </StyledButton>
            </FieldRoot>
          );
        }}
      </FormField>
      <FormikField name="metaImageId">
        {({ field, form }) => (
          <MetaImageSearch
            metaImageId={field.value}
            setFieldTouched={form.setFieldTouched}
            showRemoveButton={false}
            showCheckbox={showCheckbox}
            checkboxAction={checkboxAction}
            language={articleLanguage}
            {...field}
          />
        )}
      </FormikField>
    </FormContent>
  );
};

export default memo(MetaDataField);
