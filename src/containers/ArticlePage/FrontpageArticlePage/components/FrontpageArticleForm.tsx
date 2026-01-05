/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, useFormikContext } from "formik";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { UseQueryResult } from "@tanstack/react-query";
import { ArticleDTO, UpdatedArticleDTO, ArticleRevisionHistoryDTO } from "@ndla/types-backend/draft-api";
import FrontpageArticlePanels from "./FrontpageArticlePanels";
import { Form } from "../../../../components/FormikForm";
import validateFormik, { getWarnings } from "../../../../components/formikValidationSchema";
import HeaderWithLanguage from "../../../../components/HeaderWithLanguage";
import EditorFooter from "../../../../components/SlateEditor/EditorFooter";
import { articleIsWide, useWideArticle } from "../../../../components/WideArticleEditorProvider";
import { useDraftStatusStateMachine } from "../../../../modules/draft/draftQueries";
import { frontPageArticleRules, isFormikFormDirty } from "../../../../util/formHelper";
import { getExpirationDate } from "../../../../util/revisionHelpers";
import { AlertDialogWrapper } from "../../../FormikForm";
import { FrontpageArticleFormType, HandleSubmitFunc, useArticleFormHooks } from "../../../FormikForm/articleFormHooks";
import usePreventWindowUnload from "../../../FormikForm/preventWindowUnloadHook";
import {
  draftApiTypeToFrontpageArticleFormType,
  frontpageArticleFormTypeToDraftApiType,
} from "../../articleTransformers";

interface Props {
  article?: ArticleDTO;
  articleRevisionHistory?: UseQueryResult<ArticleRevisionHistoryDTO>;
  articleChanged: boolean;
  supportedLanguages: string[];
  updateArticle: (updatedArticle: UpdatedArticleDTO) => Promise<ArticleDTO>;
  articleLanguage: string;
  translatedFieldsToNN: string[];
}

const FrontpageArticleForm = ({
  article,
  articleRevisionHistory,
  updateArticle,
  articleChanged,
  articleLanguage,
  supportedLanguages,
  translatedFieldsToNN,
}: Props) => {
  const { t } = useTranslation();
  const { savedToServer, formikRef, initialValues, handleSubmit } = useArticleFormHooks<FrontpageArticleFormType>({
    getInitialValues: draftApiTypeToFrontpageArticleFormType,
    article,
    articleRevisionHistory,
    updateArticle,
    getArticleFromSlate: frontpageArticleFormTypeToDraftApiType,
    articleLanguage,
    rules: frontPageArticleRules,
  });

  const { setWideArticle } = useWideArticle();

  useEffect(() => {
    if (article && articleIsWide(article.id)) {
      setWideArticle(true);
    }
  }, [article, setWideArticle]);

  const initialWarnings = getWarnings(initialValues, frontPageArticleRules, t, translatedFieldsToNN, article);
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
          articleRevisionHistory={articleRevisionHistory?.data}
          language={articleLanguage}
          supportedLanguages={supportedLanguages}
          nodes={undefined}
          status={article?.status}
          type="frontpage-article"
          expirationDate={getExpirationDate(article?.revisions)}
        />
        <FrontpageArticlePanels
          articleLanguage={articleLanguage}
          article={article}
          articleRevisionHistory={articleRevisionHistory?.data}
          articleChanged={articleChanged}
        />
        <FormFooter
          articleChanged={articleChanged}
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
  article?: ArticleDTO;
  savedToServer: boolean;
  handleSubmit: HandleSubmitFunc<FrontpageArticleFormType>;
}

const InternalFormFooter = ({ articleChanged, article, savedToServer, handleSubmit }: FormFooterProps) => {
  const { t } = useTranslation();
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

  const onSave = useCallback(() => handleSubmit(values, formik), [handleSubmit, values, formik]);

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

export default FrontpageArticleForm;
