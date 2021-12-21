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
import { AlertModalWrapper, formClasses } from '../../../FormikForm';
import { toEditArticle } from '../../../../util/routeHelpers';
import validateFormik from '../../../../components/formikValidationSchema';
import TopicArticleAccordionPanels from './TopicArticleAccordionPanels';
import HeaderWithLanguage from '../../../../components/HeaderWithLanguage';
import EditorFooter from '../../../../components/SlateEditor/EditorFooter';
import { TopicArticleFormType, useArticleFormHooks } from '../../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../../FormikForm/preventWindowUnloadHook';
import Spinner from '../../../../components/Spinner';
import {
  DraftApiType,
  DraftStatus,
  DraftStatusTypes,
  UpdatedDraftApiType,
} from '../../../../modules/draft/draftApiInterfaces';
import { useLicenses } from '../../../../modules/draft/draftQueries';
import {
  draftApiTypeToTopicArticleFormType,
  topicArticleFormTypeToDraftApiType,
} from '../topicHelpers';
import { fetchStatusStateMachine, validateDraft } from '../../../../modules/draft/draftApi';
import { formikCommonArticleRules, isFormikFormDirty } from '../../../../util/formHelper';

interface Props {
  article?: DraftApiType;
  revision?: number;
  updateArticle: (art: UpdatedDraftApiType) => Promise<DraftApiType>;
  articleStatus?: DraftStatus;
  articleChanged: boolean;
  updateArticleAndStatus?: (input: {
    updatedArticle: UpdatedDraftApiType;
    newStatus: DraftStatusTypes;
    dirty: boolean;
  }) => Promise<DraftApiType>;
  translating: boolean;
  translateToNN?: () => void;
  isNewlyCreated: boolean;
  articleLanguage: string;
}

const TopicArticleForm = ({
  article,
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

  const { t } = useTranslation();

  const {
    savedToServer,
    formikRef,
    initialValues,
    setSaveAsNewVersion,
    handleSubmit,
  } = useArticleFormHooks({
    getInitialValues: draftApiTypeToTopicArticleFormType,
    article,
    t,
    articleStatus,
    updateArticle,
    updateArticleAndStatus,
    licenses,
    getArticleFromSlate: topicArticleFormTypeToDraftApiType,
    isNewlyCreated,
    articleLanguage,
  });

  const [translateOnContinue, setTranslateOnContinue] = useState(false);

  const FormikChild = (formik: FormikProps<TopicArticleFormType>) => {
    // eslint doesn't allow this to be inlined when using hooks (in usePreventWindowUnload)
    const { values, dirty, isSubmitting } = formik;
    const formIsDirty = isFormikFormDirty({
      values,
      initialValues,
      dirty,
      changed: articleChanged,
    });
    usePreventWindowUnload(formIsDirty);
    const getArticle = () => topicArticleFormTypeToDraftApiType(values, initialValues, licenses!);
    const editUrl = values.id
      ? (lang: string) => toEditArticle(values.id!, values.articleType, lang)
      : undefined;

    return (
      <Form {...formClasses()}>
        <HeaderWithLanguage
          values={values}
          content={{ ...article, title: article?.title?.title, language: articleLanguage }}
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
            setSaveAsNewVersion(saveAsNewVersion ?? false);
            handleSubmit(values, formik);
          }}
          entityStatus={article?.status}
          fetchStatusStateMachine={fetchStatusStateMachine}
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

  const initialErrors = useMemo(() => validateFormik(initialValues, formikCommonArticleRules, t), [
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
      validate={values => validateFormik(values, formikCommonArticleRules, t)}>
      {FormikChild}
    </Formik>
  );
};

export default TopicArticleForm;
