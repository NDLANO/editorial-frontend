/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik, FormikValues } from "formik";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { ButtonV2, IconButtonV2 } from "@ndla/button";
import { colors, fonts, misc, spacing } from "@ndla/core";
import { Label, FieldErrorMessage } from "@ndla/forms";
import { DeleteForever } from "@ndla/icons/editor";
import { ModalBody } from "@ndla/modal";
import { SafeLink } from "@ndla/safelink";
import { IArticleSummaryV2, IArticleV2 } from "@ndla/types-backend/article-api";
import { UuDisclaimerEmbedData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import { getArticle, searchArticles } from "../../../../modules/article/articleApi";
import { plainTextToEditorValue, editorValueToPlainText } from "../../../../util/articleContentConverter";
import { toEditFrontPageArticle, toEditLearningResource, toEditTopicArticle } from "../../../../util/routeHelpers";
import AsyncDropdown from "../../../Dropdown/asyncDropdown/AsyncDropdown";
import { FormControl, FormField } from "../../../FormField";
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

const StyledFormField = styled(FormField)`
  margin: 0;
`;

const StyledPlainTextEditor = styled(PlainTextEditor)`
  border: 1px solid ${colors.brand.grey};
  border-radius: ${misc.borderRadius};
  min-height: ${spacing.xxlarge};
  outline: none;
  padding: ${spacing.small};
  transition-duration: outline-color 100ms ease;
  outline: 2px solid transparent;

  &:focus {
    outline-color: ${colors.brand.primary};
  }
`;

const StyledModalBody = styled(ModalBody)`
  padding: ${spacing.normal};
`;

const DisclaimerActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${spacing.xsmall};
  padding: ${spacing.normal} 0 0;
`;

const StyledText = styled(Text)`
  ${fonts.size.text.label.small}
`;

const SelectedArticle = styled.div`
  align-items: center;
  display: flex;
  gap: ${spacing.xsmall};
  margin-top: ${spacing.small};
`;

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

const DisclaimerForm = ({ initialData, onOpenChange, onSave }: DisclaimerFormProps) => {
  const { t, i18n } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [selectedArticle, setSelectedArticle] = useState<undefined | IArticleV2 | IArticleSummaryV2>(undefined);

  useEffect(() => {
    const initSelectedArticle = async () => {
      let response: IArticleV2 | undefined = undefined;
      initialValues.articleId && (response = await getArticle(Number(initialValues.articleId)));
      setSelectedArticle(response ?? undefined);
    };
    initSelectedArticle();
  }, [initialValues.articleId]);

  const searchForArticles = async (query: string, page: number | undefined) => {
    return searchArticles({
      query,
      page,
    });
  };

  const pathingFunction =
    selectedArticle?.articleType === "frontpage-article"
      ? toEditFrontPageArticle
      : selectedArticle?.articleType === "topic-article"
        ? toEditTopicArticle
        : toEditLearningResource;

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
        <Form>
          <StyledModalBody>
            <StyledText element="p" textStyle="label-small" margin="small">
              {t("form.disclaimer.exampleHeader")}
            </StyledText>
            <StyledText element="p" textStyle="meta-text-small" margin="none">
              {t("form.disclaimer.exampleText")}
            </StyledText>
            <StyledText element="p" textStyle="meta-text-small">
              <SafeLink to={DISCLAIMER_EXAMPLES_LINK}>{t("form.disclaimer.exampleLinkText")}</SafeLink>
            </StyledText>
            <StyledFormField name="disclaimer">
              {({ field, meta }) => (
                <FormControl>
                  <Label textStyle="label-small">{t("form.disclaimer.editorHeader")}</Label>
                  <StyledPlainTextEditor
                    data-testid="disclaimer-editor"
                    id={field.name}
                    {...field}
                    value={initialValues.disclaimer}
                  />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FormControl>
              )}
            </StyledFormField>
            <StyledFormField name="articleId">
              {({ field }) => {
                const handleChange = (selected: IArticleSummaryV2 | undefined) => {
                  field.onChange({ target: { value: selected?.id.toString() ?? "", name: field.name } });
                  setSelectedArticle(selected);
                };

                return (
                  <FormControl>
                    <Label textStyle="label-small">{t("form.disclaimer.articleId")}</Label>
                    <AsyncDropdown
                      clearInputField
                      idField="id"
                      labelField="title"
                      placeholder={t("form.content.relatedArticle.placeholder")}
                      apiAction={searchForArticles}
                      onClick={(e) => e.stopPropagation()}
                      onChange={handleChange}
                      showPagination
                      menuHeight={windowHeight * 0.3}
                    />
                    {selectedArticle && (
                      <SelectedArticle>
                        <SafeLink to={pathingFunction(selectedArticle.id, i18n.language)} target="_blank">
                          {selectedArticle.title.title}
                        </SafeLink>
                        <IconButtonV2
                          aria-label={t("form.disclaimer.removeArticle")}
                          variant="ghost"
                          title={t("form.disclaimer.removeArticle")}
                          colorTheme="danger"
                          data-testid="disclaimerArticleDeleteButton"
                          onClick={() => handleChange(undefined)}
                        >
                          <DeleteForever />
                        </IconButtonV2>
                      </SelectedArticle>
                    )}
                  </FormControl>
                );
              }}
            </StyledFormField>
            <DisclaimerActions>
              <ButtonV2 onClick={() => onOpenChange(false)} variant="outline">
                {t("form.abort")}
              </ButtonV2>
              <ButtonV2 type="submit" variant="solid" data-testid="disclaimer-save">
                {t("form.save")}
              </ButtonV2>
            </DisclaimerActions>
          </StyledModalBody>
        </Form>
      )}
    </Formik>
  );
};

export default DisclaimerForm;
