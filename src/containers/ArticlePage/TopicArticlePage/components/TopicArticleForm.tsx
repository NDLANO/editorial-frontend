/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, FormikProps } from 'formik';
import { IUpdatedArticle, IArticle, IStatus } from '@ndla/types-draft-api';
import { AlertModalWrapper, formClasses } from '../../../FormikForm';
import { toEditArticle } from '../../../../util/routeHelpers';
import validateFormik, { getWarnings } from '../../../../components/formikValidationSchema';
import TopicArticleAccordionPanels from './TopicArticleAccordionPanels';
import HeaderWithLanguage from '../../../../components/HeaderWithLanguage';
import EditorFooter from '../../../../components/SlateEditor/EditorFooter';
import { TopicArticleFormType, useArticleFormHooks } from '../../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../../FormikForm/preventWindowUnloadHook';
import Spinner from '../../../../components/Spinner';
import { useLicenses, useDraftStatusStateMachine } from '../../../../modules/draft/draftQueries';
import {
  draftApiTypeToTopicArticleFormType,
  topicArticleFormTypeToDraftApiType,
} from '../../articleTransformers';
import { validateDraft } from '../../../../modules/draft/draftApi';
import { isFormikFormDirty, topicArticleRules } from '../../../../util/formHelper';
import { ArticleTaxonomy } from '../../../FormikForm/formikDraftHooks';
import { learningResourceContentToHTML } from '../../../../util/articleContentConverter';
import { DraftStatusType } from '../../../../interfaces';

interface Props {
  article?: IArticle;
  articleTaxonomy?: ArticleTaxonomy;
  revision?: number;
  updateArticle: (art: IUpdatedArticle) => Promise<IArticle>;
  articleStatus?: IStatus;
  articleChanged: boolean;
  updateArticleAndStatus?: (input: {
    updatedArticle: IUpdatedArticle;
    newStatus: DraftStatusType;
    dirty: boolean;
  }) => Promise<IArticle>;
  translating: boolean;
  translateToNN?: () => void;
  isNewlyCreated: boolean;
  articleLanguage: string;
}

const TopicArticleForm = ({
  article,
  articleTaxonomy,
  updateArticle,
  articleChanged,
  translating,
  translateToNN,
  isNewlyCreated,
  articleLanguage,
  articleStatus,
  updateArticleAndStatus,
}: Props) => {
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const statusStateMachine = useDraftStatusStateMachine({ articleId: article?.id });

  const { t } = useTranslation();

  const { savedToServer, formikRef, initialValues, handleSubmit } = useArticleFormHooks<
    TopicArticleFormType
  >({
    getInitialValues: draftApiTypeToTopicArticleFormType,
    article,
    t,
    articleStatus,
    updateArticle,
    updateArticleAndStatus,
    licenses,
    getArticleFromSlate: topicArticleFormTypeToDraftApiType,
    articleLanguage,
  });

  const initialHTML = useMemo(() => learningResourceContentToHTML(initialValues.content), [
    initialValues,
  ]);

  const [translateOnContinue, setTranslateOnContinue] = useState(false);

  const FormikChild = (formik: FormikProps<TopicArticleFormType>) => {
    // eslint doesn't allow this to be inlined when using hooks (in usePreventWindowUnload)
    const { values, dirty, isSubmitting } = formik;
    const formIsDirty = isFormikFormDirty({
      values,
      initialValues,
      dirty,
      changed: articleChanged,
      initialHTML,
    });
    usePreventWindowUnload(formIsDirty);
    const getArticle = () => topicArticleFormTypeToDraftApiType(values, initialValues, licenses!);
    const editUrl = values.id
      ? (lang: string) => toEditArticle(values.id!, values.articleType, lang)
      : undefined;

    return (
      <Form {...formClasses()}>
        <HeaderWithLanguage
          taxonomy={articleTaxonomy}
          values={values}
          content={{
            ...article,
            title: article?.title?.title,
            language: articleLanguage,
            supportedLanguages: values.supportedLanguages,
          }}
          getEntity={getArticle}
          editUrl={editUrl}
          formIsDirty={formIsDirty}
          isSubmitting={isSubmitting}
          translateToNN={translateToNN}
          setTranslateOnContinue={setTranslateOnContinue}
          type="topic-article"
        />
        {translating ? (
          <Spinner withWrapper />
        ) : (
          <TopicArticleAccordionPanels
            taxonomy={articleTaxonomy}
            articleLanguage={articleLanguage}
            updateNotes={updateArticle}
            article={article}
            getArticle={getArticle}
            handleSubmit={async () => handleSubmit(values, formik)}
          />
        )}
        <EditorFooter
          showSimpleFooter={!article?.id}
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getArticle}
          onSaveClick={saveAsNewVersion => {
            handleSubmit(values, formik, saveAsNewVersion ?? false);
          }}
          entityStatus={article?.status}
          statusStateMachine={statusStateMachine.data}
          validateEntity={validateDraft}
          isArticle
          isNewlyCreated={isNewlyCreated}
          isConcept={false}
          hideSecondaryButton={false}
        />
        <AlertModalWrapper
          isSubmitting={isSubmitting}
          formIsDirty={formIsDirty}
          onContinue={translateOnContinue ? translateToNN : () => {}}
          severity="danger"
          text={t('alertModal.notSaved')}
        />
      </Form>
    );
  };

  const initialWarnings = getWarnings(initialValues, topicArticleRules, t, article);
  const initialErrors = useMemo(() => validateFormik(initialValues, topicArticleRules, t), [
    initialValues,
    t,
  ]);

  return (
    <Formik
      enableReinitialize={translating}
      validateOnMount
      initialValues={initialValues}
      initialErrors={initialErrors}
      validateOnBlur={false}
      innerRef={formikRef}
      onSubmit={handleSubmit}
      validate={values => validateFormik(values, topicArticleRules, t)}
      initialStatus={{ warnings: initialWarnings }}>
      {FormikChild}
    </Formik>
  );
};

export default TopicArticleForm;
