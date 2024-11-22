/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, useFormikContext } from "formik";
import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UseQueryResult } from "@tanstack/react-query";
import { IArticle, IUpdatedArticle, IStatus } from "@ndla/types-backend/draft-api";
import FrontpageArticlePanels from "./FrontpageArticlePanels";
import { Form } from "../../../../components/FormikForm";
import validateFormik, { getWarnings } from "../../../../components/formikValidationSchema";
import HeaderWithLanguage from "../../../../components/HeaderWithLanguage";
import EditorFooter from "../../../../components/SlateEditor/EditorFooter";
import { validateDraft } from "../../../../modules/draft/draftApi";
import { useLicenses, useDraftStatusStateMachine } from "../../../../modules/draft/draftQueries";
import { frontPageArticleRules, isFormikFormDirty } from "../../../../util/formHelper";
import { AlertDialogWrapper } from "../../../FormikForm";
import { FrontpageArticleFormType, HandleSubmitFunc, useArticleFormHooks } from "../../../FormikForm/articleFormHooks";
import usePreventWindowUnload from "../../../FormikForm/preventWindowUnloadHook";
import { useSession } from "../../../Session/SessionProvider";
import {
  draftApiTypeToFrontpageArticleFormType,
  frontpageArticleFormTypeToDraftApiType,
  getExpirationDate,
} from "../../articleTransformers";

interface Props {
  article?: IArticle;
  articleHistory?: UseQueryResult<IArticle[]>;
  articleStatus?: IStatus;
  isNewlyCreated: boolean;
  articleChanged: boolean;
  supportedLanguages: string[];
  updateArticle: (updatedArticle: IUpdatedArticle) => Promise<IArticle>;
  articleLanguage: string;
}

const FrontpageArticleForm = ({
  article,
  articleHistory,
  articleStatus,
  isNewlyCreated = false,
  updateArticle,
  articleChanged,
  articleLanguage,
  supportedLanguages,
}: Props) => {
  const { t } = useTranslation();
  const { ndlaId } = useSession();
  const { savedToServer, formikRef, initialValues, handleSubmit } = useArticleFormHooks<FrontpageArticleFormType>({
    getInitialValues: draftApiTypeToFrontpageArticleFormType,
    article,
    articleHistory,
    t,
    articleStatus,
    updateArticle,
    getArticleFromSlate: frontpageArticleFormTypeToDraftApiType,
    articleLanguage,
    rules: frontPageArticleRules,
    ndlaId,
  });

  const initialWarnings = getWarnings(initialValues, frontPageArticleRules, t, article);
  const initialErrors = useMemo(() => validateFormik(initialValues, frontPageArticleRules, t), [initialValues, t]);

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      innerRef={formikRef}
      validateOnBlur={false}
      validateOnMount
      onSubmit={handleSubmit}
      validate={(values) => validateFormik(values, frontPageArticleRules, t)}
      initialStatus={{ warnings: initialWarnings }}
    >
      <Form>
        <HeaderWithLanguage
          id={article?.id}
          title={article?.title?.title}
          article={article}
          articleHistory={articleHistory?.data}
          language={articleLanguage}
          supportedLanguages={supportedLanguages}
          status={article?.status}
          type="frontpage-article"
          expirationDate={getExpirationDate(article)}
        />
        <FrontpageArticlePanels
          articleLanguage={articleLanguage}
          article={article}
          articleHistory={articleHistory?.data}
        />
        <FormFooter
          articleChanged={!!articleChanged}
          isNewlyCreated={isNewlyCreated}
          savedToServer={savedToServer}
          handleSubmit={handleSubmit}
          article={article}
        />
      </Form>
    </Formik>
  );
};

interface FormFooterProps {
  articleChanged: boolean;
  article?: IArticle;
  isNewlyCreated: boolean;
  savedToServer: boolean;
  handleSubmit: HandleSubmitFunc<FrontpageArticleFormType>;
}

const InternalFormFooter = ({
  articleChanged,
  article,
  isNewlyCreated,
  savedToServer,
  handleSubmit,
}: FormFooterProps) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
  const statusStateMachine = useDraftStatusStateMachine({
    articleId: article?.id,
  });
  const formik = useFormikContext<FrontpageArticleFormType>();
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
    const article = frontpageArticleFormTypeToDraftApiType(values, initialValues, licenses!, false);
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

const FormFooter = memo(InternalFormFooter);

export default FrontpageArticleForm;
