/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikValues } from "formik";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { DeleteForever } from "@ndla/icons/editor";
import {
  Button,
  ComboboxLabel,
  DialogBody,
  FieldErrorMessage,
  FieldLabel,
  FieldRoot,
  IconButton,
  ListItemContent,
  ListItemHeading,
  ListItemRoot,
  Text,
  TextArea,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IArticleSummaryV2, IArticleV2 } from "@ndla/types-backend/article-api";
import { UuDisclaimerEmbedData } from "@ndla/types-embed";
import { getArticle } from "../../../../modules/article/articleApi";
import { useArticleSearch } from "../../../../modules/article/articleQueries";
import { plainTextToEditorValue, editorValueToPlainText } from "../../../../util/articleContentConverter";
import { routes } from "../../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../../util/usePaginatedQuery";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../abstractions/Combobox";
import { GenericSearchCombobox } from "../../../Form/GenericSearchCombobox";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import PlainTextEditor from "../../PlainTextEditor";

const DISCLAIMER_EXAMPLES_LINK =
  "https://docs.google.com/spreadsheets/d/1g8cCqgS4BvaChHX4R6VR5V5Q83fvYcMrgneBJMkLWYs/edit?usp=sharing";

interface DisclaimerFormProps {
  initialData?: UuDisclaimerEmbedData;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSave: (values: UuDisclaimerEmbedData) => void;
}

interface DisclaimerFormValues {
  resource: "uu-disclaimer";
  articleId?: string;
  disclaimer: Descendant[];
}

const rules: RulesType<DisclaimerFormValues> = {
  disclaimer: {
    required: true,
  },
};

const toInitialValues = (data?: UuDisclaimerEmbedData): DisclaimerFormValues => {
  return {
    resource: "uu-disclaimer",
    disclaimer: plainTextToEditorValue(data?.disclaimer ?? ""),
    articleId: data?.articleId,
  };
};

const StyledTextArea = styled(TextArea, {
  base: {
    minHeight: "unset",
    height: "unset",
  },
});

const DisclaimerForm = ({ initialData, onOpenChange, onSave }: DisclaimerFormProps) => {
  const { t, i18n } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);
  const [selectedArticle, setSelectedArticle] = useState<IArticleV2 | IArticleSummaryV2 | undefined>(undefined);
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();

  const searchQuery = useArticleSearch({ query: delayedQuery, page: page }, { placeholderData: (prev) => prev });

  useEffect(() => {
    const initSelectedArticle = async () => {
      let response: IArticleV2 | undefined = undefined;
      initialValues.articleId && (response = await getArticle(Number(initialValues.articleId)));
      setSelectedArticle(response ?? undefined);
    };
    initSelectedArticle();
  }, [initialValues.articleId]);

  const handleSubmit = useCallback(
    (values: FormikValues) => {
      onSave({
        resource: "uu-disclaimer",
        disclaimer: editorValueToPlainText(values.disclaimer),
        articleId: values.articleId,
      });
      onOpenChange(false);
    },
    [onOpenChange, onSave],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={handleSubmit}
      validateOnMount
      validate={(values) => validateFormik(values, rules, t)}
    >
      {() => (
        <DialogBody>
          <FormikForm>
            <Text>{t("form.disclaimer.exampleHeader")}</Text>
            <Text>{t("form.disclaimer.exampleText")}</Text>
            <SafeLink to={DISCLAIMER_EXAMPLES_LINK}>{t("form.disclaimer.exampleLinkText")}</SafeLink>
            <FormField name="disclaimer">
              {({ field, meta }) => (
                <FieldRoot>
                  <FieldLabel>{t("form.disclaimer.editorHeader")}</FieldLabel>
                  <StyledTextArea asChild>
                    <PlainTextEditor
                      data-testid="disclaimer-editor"
                      id={field.name}
                      {...field}
                      value={initialValues.disclaimer}
                    />
                  </StyledTextArea>
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FieldRoot>
              )}
            </FormField>
            <FormField name="articleId">
              {({ field, helpers }) => {
                const handleChange = (selected: IArticleSummaryV2 | undefined) => {
                  helpers.setValue(selected?.id.toString() ?? "");
                  setSelectedArticle(selected);
                };
                return (
                  <FieldRoot>
                    <GenericSearchCombobox
                      items={searchQuery.data?.results ?? []}
                      itemToString={(item) => item.title.title}
                      itemToValue={(item) => item.id.toString()}
                      inputValue={query}
                      isSuccess={searchQuery.isSuccess}
                      paginationData={searchQuery.data}
                      onInputValueChange={(details) => setQuery(details.inputValue)}
                      onPageChange={(details) => setPage(details.page)}
                      value={[field.value?.toString()]}
                      onValueChange={(details) => handleChange(details.items[0])}
                      renderItem={(item) => (
                        <GenericComboboxItemContent
                          title={item.title.title}
                          description={item.metaDescription?.metaDescription}
                          image={item.metaImage}
                          useFallbackImage
                        />
                      )}
                    >
                      <ComboboxLabel>{t("form.disclaimer.articleId")}</ComboboxLabel>
                      <GenericComboboxInput
                        placeholder={t("form.content.relatedArticle.placeholder")}
                        isFetching={searchQuery.isFetching}
                      />
                    </GenericSearchCombobox>
                    {!!selectedArticle && (
                      <ListItemRoot variant="subtle">
                        <ListItemContent>
                          <ListItemHeading asChild>
                            <SafeLink
                              to={routes.editArticle(selectedArticle.id, selectedArticle.articleType, i18n.language)}
                              unstyled
                            >
                              {selectedArticle.title.title}
                            </SafeLink>
                          </ListItemHeading>
                          <IconButton
                            aria-label={t("form.disclaimer.removeArticle")}
                            variant="danger"
                            title={t("form.disclaimer.removeArticle")}
                            data-testid="disclaimerArticleDeleteButton"
                            onClick={() => {
                              helpers.setValue("");
                              setSelectedArticle(undefined);
                            }}
                          >
                            <DeleteForever />
                          </IconButton>
                        </ListItemContent>
                      </ListItemRoot>
                    )}
                  </FieldRoot>
                );
              }}
            </FormField>
            <FormActionsContainer>
              <Button onClick={() => onOpenChange(false)} variant="secondary">
                {t("form.abort")}
              </Button>
              <Button type="submit" data-testid="disclaimer-save">
                {t("form.save")}
              </Button>
            </FormActionsContainer>
          </FormikForm>
        </DialogBody>
      )}
    </Formik>
  );
};

export default DisclaimerForm;
