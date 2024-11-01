/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikHelpers, useFormikContext } from "formik";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseQueryResult } from "@tanstack/react-query";
import { IUpdatedArticle, IArticle, IStatus, ILicense } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import TopicArticleAccordionPanels from "./TopicArticleAccordionPanels";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import validateFormik, { getWarnings } from "../../../../components/formikValidationSchema";
import HeaderWithLanguage from "../../../../components/HeaderWithLanguage";
import EditorFooter from "../../../../components/SlateEditor/EditorFooter";
import StyledForm from "../../../../components/StyledFormComponents";
import { ARCHIVED, UNPUBLISHED } from "../../../../constants";
import { validateDraft } from "../../../../modules/draft/draftApi";
import { useLicenses, useDraftStatusStateMachine } from "../../../../modules/draft/draftQueries";
import { isFormikFormDirty, topicArticleRules } from "../../../../util/formHelper";
import { AlertDialogWrapper } from "../../../FormikForm";
import { HandleSubmitFunc, TopicArticleFormType, useArticleFormHooks } from "../../../FormikForm/articleFormHooks";
import usePreventWindowUnload from "../../../FormikForm/preventWindowUnloadHook";
import { useSession } from "../../../Session/SessionProvider";
import { TaxonomyVersionProvider } from "../../../StructureVersion/TaxonomyVersionProvider";
import {
  draftApiTypeToTopicArticleFormType,
  getExpirationDate,
  topicArticleFormTypeToDraftApiType,
} from "../../articleTransformers";

interface Props {
  article?: IArticle;
  articleHistory?: UseQueryResult<IArticle[]>;
  articleTaxonomy?: Node[];
  revision?: number;
  updateArticle: (art: IUpdatedArticle) => Promise<IArticle>;
  articleStatus?: IStatus;
  articleChanged: boolean;
  isNewlyCreated: boolean;
  supportedLanguages: string[];
  articleLanguage: string;
}

const TopicArticleForm = ({
  article,
  articleHistory,
  articleTaxonomy,
  updateArticle,
  articleChanged,
  isNewlyCreated,
  supportedLanguages,
  articleLanguage,
  articleStatus,
}: Props) => {
  const [showTaxWarning, setShowTaxWarning] = useState(false);
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { t } = useTranslation();
  const { ndlaId } = useSession();

  const validate = useCallback((values: TopicArticleFormType) => validateFormik(values, topicArticleRules, t), [t]);

  const {
    savedToServer,
    formikRef,
    initialValues,
    handleSubmit: _handleSubmit,
  } = useArticleFormHooks<TopicArticleFormType>({
    getInitialValues: draftApiTypeToTopicArticleFormType,
    article,
    t,
    articleStatus,
    updateArticle,
    licenses,
    getArticleFromSlate: topicArticleFormTypeToDraftApiType,
    articleLanguage,
    rules: topicArticleRules,
    ndlaId,
    articleHistory,
  });

  const initialWarnings = useMemo(
    () => getWarnings(initialValues, topicArticleRules, t, article),
    [article, initialValues, t],
  );

  const initialErrors = useMemo(() => validateFormik(initialValues, topicArticleRules, t), [initialValues, t]);

  const handleSubmit: HandleSubmitFunc<TopicArticleFormType> = useCallback(
    async (values, helpers, saveAsNew) => {
      if (!articleTaxonomy?.length && values.status?.current !== ARCHIVED && values.status?.current !== UNPUBLISHED) {
        setShowTaxWarning(true);
        return;
      }
      return await _handleSubmit(values, helpers, saveAsNew);
    },
    [_handleSubmit, articleTaxonomy?.length],
  );

  const contexts = articleTaxonomy
    ?.flatMap((node) => node.contexts)
    .filter((context) => !context.rootId.includes("programme"));

  return (
    <Formik
      validateOnMount
      initialValues={initialValues}
      initialErrors={initialErrors}
      validateOnBlur={false}
      innerRef={formikRef}
      onSubmit={handleSubmit}
      validate={validate}
      initialStatus={initialWarnings}
    >
      <StyledForm>
        <HeaderWithLanguage
          id={article?.id}
          language={articleLanguage}
          taxonomy={contexts}
          article={article}
          articleHistory={articleHistory?.data}
          status={article?.status}
          supportedLanguages={supportedLanguages}
          title={article?.title?.title}
          type="topic-article"
          expirationDate={getExpirationDate(article)}
        />
        <TaxonomyVersionProvider>
          <TopicArticleAccordionPanels
            articleLanguage={articleLanguage}
            articleHistory={articleHistory?.data}
            updateNotes={updateArticle}
            article={article}
            hasTaxonomyEntries={!!articleTaxonomy?.length}
          />
        </TaxonomyVersionProvider>
        <FormFooter
          licenses={licenses ?? []}
          articleChanged={!!articleChanged}
          isNewlyCreated={isNewlyCreated}
          savedToServer={savedToServer}
          handleSubmit={handleSubmit}
          article={article}
        />
        <AlertDialog
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
  licenses: ILicense[];
  handleSubmit: (
    values: TopicArticleFormType,
    formikHelpers: FormikHelpers<TopicArticleFormType>,
    saveAsNew?: boolean,
  ) => Promise<void>;
}

const _FormFooter = ({
  articleChanged,
  article,
  isNewlyCreated,
  savedToServer,
  licenses,
  handleSubmit,
}: FormFooterProps) => {
  const { t } = useTranslation();
  const statusStateMachine = useDraftStatusStateMachine({
    articleId: article?.id,
  });
  const formik = useFormikContext<TopicArticleFormType>();
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
    const article = topicArticleFormTypeToDraftApiType(values, initialValues, licenses!, false);
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
      <AlertDialogWrapper
        isSubmitting={isSubmitting}
        formIsDirty={formIsDirty}
        severity="danger"
        text={t("alertModal.notSaved")}
      />
    </>
  );
};

const FormFooter = memo(_FormFooter);

export default TopicArticleForm;
