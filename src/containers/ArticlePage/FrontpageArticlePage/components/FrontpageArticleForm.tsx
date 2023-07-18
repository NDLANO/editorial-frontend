/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, useFormikContext } from 'formik';
import { IArticle, IUpdatedArticle, IStatus } from '@ndla/types-backend/draft-api';
import { AlertModalWrapper } from '../../../FormikForm';
import validateFormik, { getWarnings } from '../../../../components/formikValidationSchema';
import { frontPageArticleRules, isFormikFormDirty } from '../../../../util/formHelper';
import HeaderWithLanguage from '../../../../components/HeaderWithLanguage';
import EditorFooter from '../../../../components/SlateEditor/EditorFooter';
import {
  FrontpageArticleFormType,
  HandleSubmitFunc,
  useArticleFormHooks,
} from '../../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../../FormikForm/preventWindowUnloadHook';
import { useLicenses, useDraftStatusStateMachine } from '../../../../modules/draft/draftQueries';
import { validateDraft } from '../../../../modules/draft/draftApi';
import {
  draftApiTypeToFrontpageArticleFormType,
  frontpageArticleFormTypeToDraftApiType,
  getExpirationDate,
} from '../../articleTransformers';
import { blockContentToHTML } from '../../../../util/articleContentConverter';
import StyledForm from '../../../../components/StyledFormComponents';
import FrontpageArticlePanels from './FrontpageArticlePanels';
import { useSession } from '../../../../containers/Session/SessionProvider';
import CommentSection from '../../components/CommentSection';
import { FlexWrapper, MainContent } from '../../styles';
import { useWideArticle } from '../../../../components/WideArticleEditorProvider';

interface Props {
  article?: IArticle;
  articleStatus?: IStatus;
  isNewlyCreated: boolean;
  articleChanged: boolean;
  supportedLanguages: string[];
  updateArticle: (updatedArticle: IUpdatedArticle) => Promise<IArticle>;
  articleLanguage: string;
}

const FrontpageArticleForm = ({
  article,
  articleStatus,
  isNewlyCreated = false,
  updateArticle,
  articleChanged,
  articleLanguage,
  supportedLanguages,
}: Props) => {
  const { t } = useTranslation();
  const { isWideArticle } = useWideArticle();
  const { ndlaId } = useSession();
  const { savedToServer, formikRef, initialValues, handleSubmit } =
    useArticleFormHooks<FrontpageArticleFormType>({
      getInitialValues: draftApiTypeToFrontpageArticleFormType,
      article,
      t,
      articleStatus,
      updateArticle,
      getArticleFromSlate: frontpageArticleFormTypeToDraftApiType,
      articleLanguage,
      rules: frontPageArticleRules,
      ndlaId,
    });

  const initialHTML = useMemo(() => blockContentToHTML(initialValues.content), [initialValues]);

  const initialWarnings = getWarnings(initialValues, frontPageArticleRules, t, article);
  const initialErrors = useMemo(
    () => validateFormik(initialValues, frontPageArticleRules, t),
    [initialValues, t],
  );

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
      <StyledForm>
        <HeaderWithLanguage
          id={article?.id}
          title={article?.title?.title}
          language={articleLanguage}
          supportedLanguages={supportedLanguages}
          status={article?.status}
          type="frontpage-article"
          expirationDate={getExpirationDate(article)}
        />
        <FlexWrapper>
          <MainContent data-wide={isWideArticle}>
            <FrontpageArticlePanels
              articleLanguage={articleLanguage}
              article={article}
              handleSubmit={handleSubmit}
            />
          </MainContent>
          <CommentSection savedStatus={article?.status} />
        </FlexWrapper>
        <FormFooter
          initialHTML={initialHTML}
          articleChanged={!!articleChanged}
          isNewlyCreated={isNewlyCreated}
          savedToServer={savedToServer}
          handleSubmit={handleSubmit}
          article={article}
        />
      </StyledForm>
    </Formik>
  );
};

interface FormFooterProps {
  initialHTML: string;
  articleChanged: boolean;
  article?: IArticle;
  isNewlyCreated: boolean;
  savedToServer: boolean;
  handleSubmit: HandleSubmitFunc<FrontpageArticleFormType>;
}

const _FormFooter = ({
  initialHTML,
  articleChanged,
  article,
  isNewlyCreated,
  savedToServer,
  handleSubmit,
}: FormFooterProps) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
  const statusStateMachine = useDraftStatusStateMachine({ articleId: article?.id });
  const formik = useFormikContext<FrontpageArticleFormType>();
  const { values, dirty, isSubmitting, initialValues } = formik;

  const formIsDirty = useMemo(
    () =>
      isFormikFormDirty({
        values,
        initialValues,
        dirty,
        changed: articleChanged,
        initialHTML,
      }),
    [articleChanged, dirty, initialHTML, initialValues, values],
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
        prioritized={article?.prioritized}
      />
      <AlertModalWrapper
        isSubmitting={isSubmitting}
        formIsDirty={formIsDirty}
        severity="danger"
        text={t('alertModal.notSaved')}
      />
    </>
  );
};

const FormFooter = memo(_FormFooter);

export default FrontpageArticleForm;
