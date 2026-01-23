/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, useFormikContext } from "formik";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseQueryResult } from "@tanstack/react-query";
import { Button } from "@ndla/primitives";
import { ArticleDTO, UpdatedArticleDTO, ArticleRevisionHistoryDTO } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import LearningResourcePanels from "./LearningResourcePanels";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import { Form, FormActionsContainer } from "../../../../components/FormikForm";
import validateFormik, { getWarnings } from "../../../../components/formikValidationSchema";
import HeaderWithLanguage from "../../../../components/HeaderWithLanguage";
import EditorFooter from "../../../../components/SlateEditor/EditorFooter";
import { ARCHIVED, UNPUBLISHED } from "../../../../constants";
import { useDraftStatusStateMachine } from "../../../../modules/draft/draftQueries";
import { isFormikFormDirty, learningResourceRules } from "../../../../util/formHelper";
import { AlertDialogWrapper } from "../../../FormikForm";
import { HandleSubmitFunc, LearningResourceFormType, useArticleFormHooks } from "../../../FormikForm/articleFormHooks";
import usePreventWindowUnload from "../../../FormikForm/preventWindowUnloadHook";
import { TaxonomyVersionProvider } from "../../../StructureVersion/TaxonomyVersionProvider";
import {
  draftApiTypeToLearningResourceFormType,
  learningResourceFormTypeToDraftApiType,
} from "../../articleTransformers";

interface Props {
  article?: ArticleDTO;
  articleRevisionHistory?: UseQueryResult<ArticleRevisionHistoryDTO>;
  articleTaxonomy?: Node[];
  articleChanged: boolean;
  updateArticle: (updatedArticle: UpdatedArticleDTO) => Promise<ArticleDTO>;
  articleLanguage: string;
  translatedFieldsToNN: string[];
}

const LearningResourceForm = ({
  article,
  articleTaxonomy,
  updateArticle,
  articleChanged,
  articleLanguage,
  articleRevisionHistory,
  translatedFieldsToNN,
}: Props) => {
  const [showTaxWarning, setShowTaxWarning] = useState(false);
  const { t } = useTranslation();

  const validate = useCallback(
    (values: LearningResourceFormType) => {
      const val = validateFormik(values, learningResourceRules, t);
      return val;
    },
    [t],
  );

  const {
    savedToServer,
    formikRef,
    initialValues,
    handleSubmit: _handleSubmit,
  } = useArticleFormHooks<LearningResourceFormType>({
    getInitialValues: draftApiTypeToLearningResourceFormType,
    article,
    articleRevisionHistory,
    updateArticle,
    getArticleFromSlate: learningResourceFormTypeToDraftApiType,
    articleLanguage,
    rules: learningResourceRules,
    node: articleTaxonomy?.[0],
  });
  const contexts = useMemo(() => articleTaxonomy?.flatMap((node) => node.contexts), [articleTaxonomy]);

  const handleSubmit: HandleSubmitFunc<LearningResourceFormType> = useCallback(
    async (values, helpers) => {
      if (!contexts?.length && values.status?.current !== ARCHIVED && values.status?.current !== UNPUBLISHED) {
        setShowTaxWarning(true);
        return;
      }
      return await _handleSubmit(values, helpers);
    },
    [_handleSubmit, contexts?.length],
  );

  const initialWarnings = useMemo(() => {
    return {
      warnings: getWarnings(initialValues, learningResourceRules, t, translatedFieldsToNN, article),
    };
  }, [article, initialValues, translatedFieldsToNN, t]);

  const initialErrors = useMemo(() => validateFormik(initialValues, learningResourceRules, t), [initialValues, t]);

  const onCancel = useCallback(() => {
    setShowTaxWarning(false);
  }, []);

  return (
    <Formik
      key={articleLanguage}
      initialValues={initialValues}
      initialErrors={initialErrors}
      innerRef={formikRef}
      validateOnBlur={false}
      validateOnMount
      onSubmit={handleSubmit}
      validate={validate}
      initialStatus={initialWarnings}
    >
      {({ isSubmitting }) => (
        <Form>
          <HeaderWithLanguage
            language={articleLanguage}
            article={article}
            nodes={articleTaxonomy}
            articleRevisionHistory={articleRevisionHistory?.data}
            type="standard"
          />
          <TaxonomyVersionProvider>
            <LearningResourcePanels
              // Formik does not allow for invalid form submissions through their handleSubmit function, so we have to bypass formik
              handleSubmit={handleSubmit}
              articleLanguage={articleLanguage}
              article={article}
              articleRevisionHistory={articleRevisionHistory?.data}
              taxonomy={articleTaxonomy}
              updateNotes={updateArticle}
              contexts={contexts}
              submitted={isSubmitting}
              articleChanged={articleChanged}
            />
          </TaxonomyVersionProvider>
          <FormFooter
            articleChanged={articleChanged}
            savedToServer={savedToServer}
            handleSubmit={handleSubmit}
            article={article}
          />
          <AlertDialog
            text={t("errorMessage.missingTax")}
            title={t("errorMessage.missingTaxTitle")}
            label={t("errorMessage.missingTaxTitle")}
            show={showTaxWarning}
            onCancel={onCancel}
            severity={"danger"}
          >
            <FormActionsContainer>
              <Button variant="secondary" onClick={onCancel}>
                {t("alertDialog.continue")}
              </Button>
            </FormActionsContainer>
          </AlertDialog>
        </Form>
      )}
    </Formik>
  );
};

interface FormFooterProps {
  articleChanged: boolean;
  article?: ArticleDTO;
  savedToServer: boolean;
  handleSubmit: HandleSubmitFunc<LearningResourceFormType>;
}

const InternalFormFooter = ({ articleChanged, article, savedToServer, handleSubmit }: FormFooterProps) => {
  const { t } = useTranslation();
  const statusStateMachine = useDraftStatusStateMachine({
    articleId: article?.id,
  });
  const formik = useFormikContext<LearningResourceFormType>();
  const { values, dirty, isSubmitting, initialValues } = formik;

  const formIsDirty = useMemo(
    () =>
      isFormikFormDirty({
        values,
        initialValues,
        dirty,
        changed: articleChanged,
      }),
    [articleChanged, dirty, initialValues, values],
  );

  const onSave = useCallback(() => {
    return handleSubmit(values, formik);
  }, [handleSubmit, values, formik]);

  usePreventWindowUnload(formIsDirty);

  return (
    <>
      <EditorFooter
        type="article"
        formIsDirty={formIsDirty}
        savedToServer={savedToServer}
        onSaveClick={onSave}
        statusStateMachine={statusStateMachine.data}
        hideSecondaryButton={false}
      />
      <AlertDialogWrapper
        isSubmitting={isSubmitting}
        formIsDirty={formIsDirty}
        severity="danger"
        text={t("alertDialog.notSaved")}
      />
    </>
  );
};

const FormFooter = memo(InternalFormFooter);

export default LearningResourceForm;
