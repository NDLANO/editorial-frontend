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
import { IUpdatedArticle, IArticle, IStatus } from '@ndla/types-backend/draft-api';
import { AlertModalWrapper } from '../../../FormikForm';
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
import { FlexWrapper, MainContent } from '../../styles';
import CommentSection from '../../components/CommentSection';

interface Props {
  article?: IArticle;
  articleTaxonomy?: ArticleTaxonomy;
  revision?: number;
  updateArticle: (art: IUpdatedArticle) => Promise<IArticle>;
  articleStatus?: IStatus;
  articleChanged: boolean;
  isNewlyCreated: boolean;
  supportedLanguages: string[];
  articleLanguage: string;
}

const TopicArticleForm = ({
  article,
  articleTaxonomy,
  updateArticle,
  articleChanged,
  isNewlyCreated,
  supportedLanguages,
  articleLanguage,
  articleStatus,
}: Props) => {
  const [existInTaxonomy, setExistInTaxonomy] = useState(
    !!articleTaxonomy?.topics.find((t) => t.breadcrumbs?.length),
  );
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

    return (
      <StyledForm>
        <HeaderWithLanguage
          id={article?.id}
          language={articleLanguage}
          taxonomy={articleTaxonomy}
          article={article}
          status={article?.status}
          supportedLanguages={supportedLanguages}
          title={article?.title?.title}
          isSubmitting={isSubmitting}
          type="topic-article"
          expirationDate={getExpirationDate(article)}
        />
        <TaxonomyVersionProvider>
          <FlexWrapper>
            <MainContent>
              <TopicArticleAccordionPanels
                taxonomy={articleTaxonomy}
                articleLanguage={articleLanguage}
                updateNotes={updateArticle}
                article={article}
                handleSubmit={async () => handleSubmit(values, formik)}
                existInTaxonomy={existInTaxonomy}
                setExistInTaxonomy={setExistInTaxonomy}
              />
            </MainContent>
            <CommentSection savedStatus={article?.status} />
          </FlexWrapper>
        </TaxonomyVersionProvider>
        <EditorFooter
          showSimpleFooter={!article?.id}
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getArticle}
          onSaveClick={(saveAsNewVersion) => {
            handleSubmit(values, formik, saveAsNewVersion ?? false, existInTaxonomy);
          }}
          entityStatus={article?.status}
          statusStateMachine={statusStateMachine.data}
          validateEntity={validateDraft}
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
