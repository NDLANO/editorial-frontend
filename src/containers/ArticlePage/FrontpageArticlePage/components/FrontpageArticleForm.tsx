/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { IArticle, IUpdatedArticle, IStatus } from '@ndla/types-backend/draft-api';
import { AlertModalWrapper } from '../../../FormikForm';
import validateFormik, { getWarnings } from '../../../../components/formikValidationSchema';
import { frontPageArticleRules, isFormikFormDirty } from '../../../../util/formHelper';
import { toEditArticle } from '../../../../util/routeHelpers';
import HeaderWithLanguage from '../../../../components/HeaderWithLanguage';
import EditorFooter from '../../../../components/SlateEditor/EditorFooter';
import {
  FrontpageArticleFormType,
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

interface Props {
  article?: IArticle;
  articleStatus?: IStatus;
  isNewlyCreated: boolean;
  articleChanged: boolean;
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
}: Props) => {
  const { t } = useTranslation();

  const { data: licenses } = useLicenses({ placeholderData: [] });
  const statusStateMachine = useDraftStatusStateMachine({ articleId: article?.id });
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

  const FormikChild = (formik: FormikProps<FrontpageArticleFormType>) => {
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
      frontpageArticleFormTypeToDraftApiType(values, initialValues, licenses!, false);
    const editUrl = values.id
      ? (lang: string) => toEditArticle(values.id!, values.articleType, lang)
      : undefined;
    return (
      <StyledForm>
        <HeaderWithLanguage
          values={values}
          content={{ ...article, title: article?.title?.title, language: articleLanguage }}
          editUrl={editUrl}
          isSubmitting={isSubmitting}
          type="frontpage-article"
          expirationDate={getExpirationDate(article)}
        />
        <FlexWrapper>
          <MainContent>
            <FrontpageArticlePanels
              articleLanguage={articleLanguage}
              article={article}
              handleSubmit={handleSubmit}
            />
          </MainContent>
          <CommentSection savedStatus={article?.status} />
        </FlexWrapper>
        <EditorFooter
          showSimpleFooter={!article}
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getArticle}
          onSaveClick={(saveAsNewVersion?: boolean) => {
            handleSubmit(values, formik, saveAsNewVersion || false, true);
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
      {FormikChild}
    </Formik>
  );
};

export default FrontpageArticleForm;
