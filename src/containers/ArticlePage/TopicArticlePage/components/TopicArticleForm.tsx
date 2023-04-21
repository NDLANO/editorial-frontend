/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { IUpdatedArticle, IArticle, IStatus } from '@ndla/types-backend/draft-api';
import { AlertModalWrapper } from '../../../FormikForm';
import { toEditArticle } from '../../../../util/routeHelpers';
import validateFormik, { getWarnings } from '../../../../components/formikValidationSchema';
import TopicArticleAccordionPanels from './TopicArticleAccordionPanels';
import HeaderWithLanguage from '../../../../components/HeaderWithLanguage';
import EditorFooter from '../../../../components/SlateEditor/EditorFooter';
import { TopicArticleFormType, useArticleFormHooks } from '../../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../../FormikForm/preventWindowUnloadHook';
import { useLicenses, useDraftStatusStateMachine } from '../../../../modules/draft/draftQueries';
import {
  draftApiTypeToTopicArticleFormType,
  getExpirationDate,
  topicArticleFormTypeToDraftApiType,
} from '../../articleTransformers';
import { validateDraft } from '../../../../modules/draft/draftApi';
import { isFormikFormDirty, topicArticleRules } from '../../../../util/formHelper';
import { ArticleTaxonomy } from '../../../FormikForm/formikDraftHooks';
import { blockContentToHTML } from '../../../../util/articleContentConverter';
import StyledForm from '../../../../components/StyledFormComponents';
import { TaxonomyVersionProvider } from '../../../StructureVersion/TaxonomyVersionProvider';
import { useSession } from '../../../../containers/Session/SessionProvider';

interface Props {
  article?: IArticle;
  articleTaxonomy?: ArticleTaxonomy;
  revision?: number;
  updateArticle: (art: IUpdatedArticle) => Promise<IArticle>;
  articleStatus?: IStatus;
  articleChanged: boolean;
  isNewlyCreated: boolean;
  articleLanguage: string;
}

const TopicArticleForm = ({
  article,
  articleTaxonomy,
  updateArticle,
  articleChanged,
  isNewlyCreated,
  articleLanguage,
  articleStatus,
}: Props) => {
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const statusStateMachine = useDraftStatusStateMachine({ articleId: article?.id });

  const { t } = useTranslation();
  const { ndlaId } = useSession();
  const { savedToServer, formikRef, initialValues, handleSubmit } =
    useArticleFormHooks<TopicArticleFormType>({
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
    });

  const initialHTML = useMemo(() => blockContentToHTML(initialValues.content), [initialValues]);

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
      <StyledForm>
        <HeaderWithLanguage
          taxonomy={articleTaxonomy}
          article={article}
          values={values}
          content={{
            ...article,
            title: article?.title?.title,
            language: articleLanguage,
            supportedLanguages: values.supportedLanguages,
          }}
          editUrl={editUrl}
          isSubmitting={isSubmitting}
          type="topic-article"
          expirationDate={getExpirationDate(article)}
        />
        <TaxonomyVersionProvider>
          <TopicArticleAccordionPanels
            taxonomy={articleTaxonomy}
            articleLanguage={articleLanguage}
            updateNotes={updateArticle}
            article={article}
            handleSubmit={async () => handleSubmit(values, formik)}
          />
        </TaxonomyVersionProvider>
        <EditorFooter
          showSimpleFooter={!article?.id}
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getArticle}
          onSaveClick={(saveAsNewVersion) => {
            handleSubmit(values, formik, saveAsNewVersion ?? false);
          }}
          entityStatus={article?.status}
          statusStateMachine={statusStateMachine.data}
          validateEntity={validateDraft}
          isArticle
          isNewlyCreated={isNewlyCreated}
          isConcept={false}
          hideSecondaryButton={false}
          responsibleId={article?.responsible?.responsibleId}
        />
        <AlertModalWrapper
          isSubmitting={isSubmitting}
          formIsDirty={formIsDirty}
          severity="danger"
          text={t('alertModal.notSaved')}
        />
      </StyledForm>
    );
  };

  const initialWarnings = getWarnings(initialValues, topicArticleRules, t, article);
  const initialErrors = useMemo(
    () => validateFormik(initialValues, topicArticleRules, t),
    [initialValues, t],
  );

  return (
    <Formik
      validateOnMount
      initialValues={initialValues}
      initialErrors={initialErrors}
      validateOnBlur={false}
      innerRef={formikRef}
      onSubmit={handleSubmit}
      validate={(values) => validateFormik(values, topicArticleRules, t)}
      initialStatus={{ warnings: initialWarnings }}
    >
      {FormikChild}
    </Formik>
  );
};

export default TopicArticleForm;
