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
import { IArticle, IUpdatedArticle, IStatus } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import LearningResourcePanels from "./LearningResourcePanels";
import AlertModal from "../../../../components/AlertModal";
import validateFormik, { getWarnings } from "../../../../components/formikValidationSchema";
import HeaderWithLanguage from "../../../../components/HeaderWithLanguage";
import EditorFooter from "../../../../components/SlateEditor/EditorFooter";
import StyledForm from "../../../../components/StyledFormComponents";
import { ARCHIVED, UNPUBLISHED } from "../../../../constants";
import { validateDraft } from "../../../../modules/draft/draftApi";
import { useLicenses, useDraftStatusStateMachine } from "../../../../modules/draft/draftQueries";
import { isFormikFormDirty, learningResourceRules } from "../../../../util/formHelper";
import { AlertModalWrapper } from "../../../FormikForm";
import { HandleSubmitFunc, LearningResourceFormType, useArticleFormHooks } from "../../../FormikForm/articleFormHooks";
import usePreventWindowUnload from "../../../FormikForm/preventWindowUnloadHook";
import { useSession } from "../../../Session/SessionProvider";
import { TaxonomyVersionProvider } from "../../../StructureVersion/TaxonomyVersionProvider";
import {
  draftApiTypeToLearningResourceFormType,
  getExpirationDate,
  learningResourceFormTypeToDraftApiType,
} from "../../articleTransformers";
import CommentSection from "../../components/CommentSection";
import { FlexWrapper, MainContent } from "../../styles";

interface Props {
  article?: IArticle;
  articleHistory?: UseQueryResult<IArticle[]>;
  articleTaxonomy?: Node[];
  articleStatus?: IStatus;
  supportedLanguages: string[];
  isNewlyCreated: boolean;
  articleChanged: boolean;
  updateArticle: (updatedArticle: IUpdatedArticle) => Promise<IArticle>;
  articleLanguage: string;
}

const LearningResourceForm = ({
  article,
  articleTaxonomy,
  articleStatus,
  isNewlyCreated = false,
  updateArticle,
  supportedLanguages,
  articleChanged,
  articleLanguage,
  articleHistory,
}: Props) => {
  const [showTaxWarning, setShowTaxWarning] = useState(false);
  const { t } = useTranslation();
  const { ndlaId } = useSession();

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
    t,
    articleStatus,
    articleHistory,
    updateArticle,
    getArticleFromSlate: learningResourceFormTypeToDraftApiType,
    articleLanguage,
    rules: learningResourceRules,
    ndlaId,
  });
  const contexts = useMemo(
    () => articleTaxonomy?.flatMap((node) => node.contexts).filter((context) => !context.rootId.includes("programme")),
    [articleTaxonomy],
  );

  const handleSubmit: HandleSubmitFunc<LearningResourceFormType> = useCallback(
    async (values, helpers, saveAsNew) => {
      if (!contexts?.length && values.status?.current !== ARCHIVED && values.status?.current !== UNPUBLISHED) {
        setShowTaxWarning(true);
        return;
      }
      return await _handleSubmit(values, helpers, saveAsNew);
    },
    [_handleSubmit, contexts?.length],
  );

  const initialWarnings = useMemo(() => {
    return {
      warnings: getWarnings(initialValues, learningResourceRules, t, article),
    };
  }, [article, initialValues, t]);

  const initialErrors = useMemo(() => validateFormik(initialValues, learningResourceRules, t), [initialValues, t]);

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
      <StyledForm>
        <HeaderWithLanguage
          id={article?.id}
          language={articleLanguage}
          article={article}
          status={article?.status}
          articleHistory={articleHistory?.data}
          supportedLanguages={supportedLanguages}
          taxonomy={contexts}
          title={article?.title?.title}
          type="standard"
          expirationDate={getExpirationDate(article)}
        />
        <FlexWrapper>
          <MainContent>
            <TaxonomyVersionProvider>
              <LearningResourcePanels
                // Formik does not allow for invalid form submissions through their handleSubmit function, so we have to bypass formik
                handleSubmit={handleSubmit}
                articleLanguage={articleLanguage}
                article={article}
                articleHistory={articleHistory?.data}
                taxonomy={articleTaxonomy}
                updateNotes={updateArticle}
                contexts={contexts}
              />
            </TaxonomyVersionProvider>
          </MainContent>
          <CommentSection savedStatus={article?.status} articleType="standard" />
        </FlexWrapper>
        <FormFooter
          articleChanged={!!articleChanged}
          isNewlyCreated={isNewlyCreated}
          savedToServer={savedToServer}
          handleSubmit={handleSubmit}
          article={article}
        />
        <AlertModal
          title={t("errorMessage.missingTaxTitle")}
          label={t("errorMessage.missingTaxTitle")}
          show={showTaxWarning}
          text={t("errorMessage.missingTax")}
          onCancel={() => setShowTaxWarning(false)}
          severity={"danger"}
        />
      </StyledForm>
    </Formik>
  );
};

interface FormFooterProps {
  articleChanged: boolean;
  article?: IArticle;
  isNewlyCreated: boolean;
  savedToServer: boolean;
  handleSubmit: HandleSubmitFunc<LearningResourceFormType>;
}

const _FormFooter = ({ articleChanged, article, isNewlyCreated, savedToServer, handleSubmit }: FormFooterProps) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
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

  const onSave = useCallback(
    (saveAsNew?: boolean) => handleSubmit(values, formik, saveAsNew),
    [handleSubmit, values, formik],
  );

  const validateOnServer = useCallback(async () => {
    if (!values.id) return;
    const article = learningResourceFormTypeToDraftApiType(values, initialValues, licenses!, false);
    const data = await validateDraft(values.id, article);
    return data;
  }, [initialValues, licenses, values]);

  usePreventWindowUnload(formIsDirty);

  return (
    <>
      <EditorFooter
        showSimpleFooter={!article?.id}
        formIsDirty={formIsDirty}
        savedToServer={savedToServer}
        onSaveClick={onSave}
        entityStatus={article?.status}
        statusStateMachine={statusStateMachine.data}
        validateEntity={validateOnServer}
        isArticle
        isNewlyCreated={isNewlyCreated}
        isConcept={false}
        hideSecondaryButton={false}
        responsibleId={article?.responsible?.responsibleId}
        articleId={article?.id}
        articleType={article?.articleType}
        selectedLanguage={article?.content?.language}
        supportedLanguages={article?.supportedLanguages}
      />
      <AlertModalWrapper
        isSubmitting={isSubmitting}
        formIsDirty={formIsDirty}
        severity="danger"
        text={t("alertModal.notSaved")}
      />
    </>
  );
};

const FormFooter = memo(_FormFooter);

export default LearningResourceForm;
