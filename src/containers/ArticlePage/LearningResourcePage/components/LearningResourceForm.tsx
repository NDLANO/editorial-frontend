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
import validateFormik from '../../../../components/formikValidationSchema';
import LearningResourcePanels from './LearningResourcePanels';
import { isFormikFormDirty, learningResourceRules } from '../../../../util/formHelper';
import { toEditArticle } from '../../../../util/routeHelpers';
import HeaderWithLanguage from '../../../../components/HeaderWithLanguage';
import EditorFooter from '../../../../components/SlateEditor/EditorFooter';
import {
  LearningResourceFormType,
  useArticleFormHooks,
} from '../../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../../FormikForm/preventWindowUnloadHook';
import Spinner from '../../../../components/Spinner';
import {
  DraftApiType,
  DraftStatus,
  DraftStatusTypes,
  UpdatedDraftApiType,
} from '../../../../modules/draft/draftApiInterfaces';
import { useLicenses } from '../../../../modules/draft/draftQueries';
import { fetchStatusStateMachine, validateDraft } from '../../../../modules/draft/draftApi';
import {
  draftApiTypeToLearningResourceFormType,
  learningResourceFormTypeToDraftApiType,
} from '../../articleTransformers';

interface Props {
  article?: DraftApiType;
  translating: boolean;
  translateToNN?: () => void;
  articleStatus?: DraftStatus;
  isNewlyCreated: boolean;
  articleChanged: boolean;
  updateArticle: (updatedArticle: UpdatedDraftApiType) => Promise<DraftApiType>;
  updateArticleAndStatus: (input: {
    updatedArticle: UpdatedDraftApiType;
    newStatus: DraftStatusTypes;
    dirty: boolean;
  }) => Promise<DraftApiType>;
  articleLanguage: string;
}

const LearningResourceForm = ({
  article,
  articleStatus,
  isNewlyCreated = false,
  translateToNN,
  translating,
  updateArticle,
  updateArticleAndStatus,
  articleChanged,
  articleLanguage,
}: Props) => {
  const { t } = useTranslation();

  const { data: licenses } = useLicenses({ placeholderData: [] });

  const { savedToServer, formikRef, initialValues, handleSubmit } = useArticleFormHooks<
    LearningResourceFormType
  >({
    getInitialValues: draftApiTypeToLearningResourceFormType,
    article,
    t,
    articleStatus,
    updateArticle,
    updateArticleAndStatus,
    getArticleFromSlate: learningResourceFormTypeToDraftApiType,
    articleLanguage,
  });

  const [translateOnContinue, setTranslateOnContinue] = useState(false);

  const FormikChild = (formik: FormikProps<LearningResourceFormType>) => {
    // eslint doesn't allow this to be inlined when using hooks (in usePreventWindowUnload)
    const { values, dirty, isSubmitting } = formik;
    const formIsDirty = isFormikFormDirty({
      values,
      initialValues,
      dirty,
      changed: articleChanged,
    });
    usePreventWindowUnload(formIsDirty);
    const getArticle = () =>
      learningResourceFormTypeToDraftApiType(values, initialValues, licenses!, false);
    const editUrl = values.id
      ? (lang: string) => toEditArticle(values.id!, values.articleType, lang)
      : undefined;
    return (
      <Form {...formClasses()}>
        <HeaderWithLanguage
          values={values}
          content={{ ...article, title: article?.title?.title, language: articleLanguage }}
          editUrl={editUrl}
          getEntity={getArticle}
          formIsDirty={formIsDirty}
          isSubmitting={isSubmitting}
          translateToNN={translateToNN}
          setTranslateOnContinue={setTranslateOnContinue}
          type="standard"
        />
        {translating ? (
          <Spinner withWrapper />
        ) : (
          <LearningResourcePanels
            articleLanguage={articleLanguage}
            article={article}
            updateNotes={updateArticle}
            getArticle={getArticle}
            handleSubmit={handleSubmit}
          />
        )}
        <EditorFooter
          showSimpleFooter={!article}
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getArticle}
          onSaveClick={(saveAsNewVersion?: boolean) => {
            handleSubmit(values, formik, saveAsNewVersion || false);
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

  const initialErrors = useMemo(() => validateFormik(initialValues, learningResourceRules, t), [
    initialValues,
    t,
  ]);

  return (
    <Formik
      enableReinitialize={translating}
      initialValues={initialValues}
      initialErrors={initialErrors}
      innerRef={formikRef}
      validateOnBlur={false}
      validateOnMount
      onSubmit={handleSubmit}
      validate={values => validateFormik(values, learningResourceRules, t)}>
      {FormikChild}
    </Formik>
  );
};

export default LearningResourceForm;
