/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { IArticle, IUpdatedArticle, IStatus } from '@ndla/types-draft-api';
import { AlertModalWrapper } from '../../../FormikForm';
import validateFormik, { getWarnings } from '../../../../components/formikValidationSchema';
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
import { useLicenses, useDraftStatusStateMachine } from '../../../../modules/draft/draftQueries';
import { validateDraft } from '../../../../modules/draft/draftApi';
import {
  draftApiTypeToLearningResourceFormType,
  getExpirationDate,
  learningResourceFormTypeToDraftApiType,
} from '../../articleTransformers';
import { ArticleTaxonomy } from '../../../FormikForm/formikDraftHooks';
import { learningResourceContentToHTML } from '../../../../util/articleContentConverter';
import { DraftStatusType } from '../../../../interfaces';
import StyledForm from '../../../../components/StyledFormComponents';

interface Props {
  article?: IArticle;
  articleTaxonomy?: ArticleTaxonomy;
  translating: boolean;
  translateToNN?: () => void;
  articleStatus?: IStatus;
  isNewlyCreated: boolean;
  articleChanged: boolean;
  updateArticle: (updatedArticle: IUpdatedArticle) => Promise<IArticle>;
  updateArticleAndStatus: (input: {
    updatedArticle: IUpdatedArticle;
    newStatus: DraftStatusType;
    dirty: boolean;
  }) => Promise<IArticle>;
  articleLanguage: string;
}

const LearningResourceForm = ({
  article,
  articleTaxonomy,
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
  const statusStateMachine = useDraftStatusStateMachine({ articleId: article?.id });

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
    rules: learningResourceRules,
  });

  const initialHTML = useMemo(() => learningResourceContentToHTML(initialValues.content), [
    initialValues,
  ]);

  const [translateOnContinue, setTranslateOnContinue] = useState(false);

  const FormikChild = (formik: FormikProps<LearningResourceFormType>) => {
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
    const getArticle = () =>
      learningResourceFormTypeToDraftApiType(values, initialValues, licenses!, false);
    const editUrl = values.id
      ? (lang: string) => toEditArticle(values.id!, values.articleType, lang)
      : undefined;
    return (
      <StyledForm>
        <HeaderWithLanguage
          values={values}
          taxonomy={articleTaxonomy}
          content={{ ...article, title: article?.title?.title, language: articleLanguage }}
          editUrl={editUrl}
          getEntity={getArticle}
          formIsDirty={formIsDirty}
          isSubmitting={isSubmitting}
          translateToNN={translateToNN}
          setTranslateOnContinue={setTranslateOnContinue}
          type="standard"
          expirationDate={getExpirationDate(article)}
        />
        {translating ? (
          <Spinner withWrapper />
        ) : (
          <LearningResourcePanels
            articleLanguage={articleLanguage}
            article={article}
            taxonomy={articleTaxonomy}
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
      </StyledForm>
    );
  };

  const initialWarnings = getWarnings(initialValues, learningResourceRules, t, article);
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
      validate={values => validateFormik(values, learningResourceRules, t)}
      initialStatus={{ warnings: initialWarnings }}>
      {FormikChild}
    </Formik>
  );
};

export default LearningResourceForm;
