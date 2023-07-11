/**
 * Copyright (c) 2016-present, NDLA.
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
import LearningResourcePanels from './LearningResourcePanels';
import { isFormikFormDirty, learningResourceRules } from '../../../../util/formHelper';
import HeaderWithLanguage from '../../../../components/HeaderWithLanguage';
import EditorFooter from '../../../../components/SlateEditor/EditorFooter';
import {
  HandleSubmitFunc,
  LearningResourceFormType,
  useArticleFormHooks,
} from '../../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../../FormikForm/preventWindowUnloadHook';
import { useLicenses, useDraftStatusStateMachine } from '../../../../modules/draft/draftQueries';
import { validateDraft } from '../../../../modules/draft/draftApi';
import {
  draftApiTypeToLearningResourceFormType,
  getExpirationDate,
  learningResourceFormTypeToDraftApiType,
} from '../../articleTransformers';
import { ArticleTaxonomy } from '../../../FormikForm/formikDraftHooks';
import { blockContentToHTML } from '../../../../util/articleContentConverter';
import StyledForm from '../../../../components/StyledFormComponents';
import { TaxonomyVersionProvider } from '../../../StructureVersion/TaxonomyVersionProvider';
import { useSession } from '../../../../containers/Session/SessionProvider';
import { FlexWrapper, MainContent } from '../../styles';
import CommentSection from '../../components/CommentSection';

interface Props {
  article?: IArticle;
  articleTaxonomy?: ArticleTaxonomy;
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
}: Props) => {
  const { t } = useTranslation();
  const { ndlaId } = useSession();

  const validate = useCallback(
    (values: LearningResourceFormType) => validateFormik(values, learningResourceRules, t),
    [t],
  );

  const { savedToServer, formikRef, initialValues, handleSubmit } =
    useArticleFormHooks<LearningResourceFormType>({
      getInitialValues: draftApiTypeToLearningResourceFormType,
      article,
      t,
      articleStatus,
      updateArticle,
      getArticleFromSlate: learningResourceFormTypeToDraftApiType,
      articleLanguage,
      rules: learningResourceRules,
      ndlaId,
    });

  const initialHTML = useMemo(() => blockContentToHTML(initialValues.content), [initialValues]);

  const initialWarnings = useMemo(() => {
    return {
      warnings: getWarnings(initialValues, learningResourceRules, t, article),
    };
  }, [article, initialValues, t]);

  const initialErrors = useMemo(
    () => validateFormik(initialValues, learningResourceRules, t),
    [initialValues, t],
  );

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
          supportedLanguages={supportedLanguages}
          taxonomy={articleTaxonomy}
          title={article?.title?.title}
          type="standard"
          expirationDate={getExpirationDate(article)}
        />
        <FlexWrapper>
          <MainContent>
            <TaxonomyVersionProvider>
              <LearningResourcePanels
                articleLanguage={articleLanguage}
                article={article}
                taxonomy={articleTaxonomy}
                updateNotes={updateArticle}
                handleSubmit={handleSubmit}
              />
            </TaxonomyVersionProvider>
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
  handleSubmit: HandleSubmitFunc<LearningResourceFormType>;
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
  const formik = useFormikContext<LearningResourceFormType>();
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

export default LearningResourceForm;
