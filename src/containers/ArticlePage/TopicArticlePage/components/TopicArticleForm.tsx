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
import { Button } from "@ndla/primitives";
import { IUpdatedArticleDTO, IArticleDTO, IStatusDTO, ArticleRevisionHistoryDTO } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import TopicArticleAccordionPanels from "./TopicArticleAccordionPanels";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import { Form, FormActionsContainer } from "../../../../components/FormikForm";
import validateFormik, { getWarnings } from "../../../../components/formikValidationSchema";
import HeaderWithLanguage from "../../../../components/HeaderWithLanguage";
import EditorFooter from "../../../../components/SlateEditor/EditorFooter";
import { ARCHIVED, UNPUBLISHED } from "../../../../constants";
import { useLicenses, useDraftStatusStateMachine } from "../../../../modules/draft/draftQueries";
import { isFormikFormDirty, topicArticleRules } from "../../../../util/formHelper";
import { getExpirationDate } from "../../../../util/revisionHelpers";
import { AlertDialogWrapper } from "../../../FormikForm";
import { HandleSubmitFunc, TopicArticleFormType, useArticleFormHooks } from "../../../FormikForm/articleFormHooks";
import usePreventWindowUnload from "../../../FormikForm/preventWindowUnloadHook";
import { useSession } from "../../../Session/SessionProvider";
import { TaxonomyVersionProvider } from "../../../StructureVersion/TaxonomyVersionProvider";
import { draftApiTypeToTopicArticleFormType, topicArticleFormTypeToDraftApiType } from "../../articleTransformers";

interface Props {
  article?: IArticleDTO;
  articleRevisionHistory?: UseQueryResult<ArticleRevisionHistoryDTO>;
  articleTaxonomy?: Node[];
  revision?: number;
  updateArticle: (art: IUpdatedArticleDTO) => Promise<IArticleDTO>;
  articleStatus?: IStatusDTO;
  articleChanged: boolean;
  supportedLanguages: string[];
  articleLanguage: string;
  translatedFieldsToNN: string[];
}

const TopicArticleForm = ({
  article,
  articleRevisionHistory,
  articleTaxonomy,
  updateArticle,
  articleChanged,
  supportedLanguages,
  articleLanguage,
  articleStatus,
  translatedFieldsToNN,
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
    articleRevisionHistory: articleRevisionHistory,
  });

  const initialWarnings = useMemo(
    () => getWarnings(initialValues, topicArticleRules, t, translatedFieldsToNN, article),
    [article, initialValues, t, translatedFieldsToNN],
  );

  const initialErrors = useMemo(() => validateFormik(initialValues, topicArticleRules, t), [initialValues, t]);

  const handleSubmit: HandleSubmitFunc<TopicArticleFormType> = useCallback(
    async (values, helpers) => {
      if (!articleTaxonomy?.length && values.status?.current !== ARCHIVED && values.status?.current !== UNPUBLISHED) {
        setShowTaxWarning(true);
        return;
      }
      return await _handleSubmit(values, helpers);
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
      <Form>
        <HeaderWithLanguage
          id={article?.id}
          language={articleLanguage}
          taxonomy={contexts}
          article={article}
          articleRevisionHistory={articleRevisionHistory?.data}
          status={article?.status}
          supportedLanguages={supportedLanguages}
          title={article?.title?.title}
          type="topic-article"
          expirationDate={getExpirationDate(article?.revisions)}
        />
        <TaxonomyVersionProvider>
          <TopicArticleAccordionPanels
            articleLanguage={articleLanguage}
            articleRevisionHistory={articleRevisionHistory?.data}
            article={article}
            hasTaxonomyEntries={!!articleTaxonomy?.length}
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
          title={t("errorMessage.missingTaxTitle")}
          label={t("errorMessage.missingTaxTitle")}
          show={showTaxWarning}
          onCancel={() => setShowTaxWarning(false)}
          severity={"danger"}
          text={t("errorMessage.missingTax")}
        >
          <FormActionsContainer>
            <Button onClick={() => setShowTaxWarning(false)} variant="secondary">
              {t("alertDialog.continue")}
            </Button>
          </FormActionsContainer>
        </AlertDialog>
      </Form>
    </Formik>
  );
};

interface FormFooterProps {
  articleChanged: boolean;
  article?: IArticleDTO;
  savedToServer: boolean;
  handleSubmit: (values: TopicArticleFormType, formikHelpers: FormikHelpers<TopicArticleFormType>) => Promise<void>;
}

const InternalFormFooter = ({ articleChanged, article, savedToServer, handleSubmit }: FormFooterProps) => {
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

  const onSave = useCallback(() => handleSubmit(values, formik), [handleSubmit, values, formik]);

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
        isArticle
        isConcept={false}
        hideSecondaryButton={false}
        article={article}
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

export default TopicArticleForm;
