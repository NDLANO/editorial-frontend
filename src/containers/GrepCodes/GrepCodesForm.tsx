/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, Form } from 'formik';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { ILicense, IUpdatedArticle, IArticle } from '@ndla/types-draft-api';
import { useTranslation } from 'react-i18next';
import { ArticleFormType, useArticleFormHooks } from '../FormikForm/articleFormHooks';
import GrepCodesField from '../FormikForm/GrepCodesField';
import SaveMultiButton from '../../components/SaveMultiButton';
import { isFormikFormDirty } from '../../util/formHelper';
import { draftApiTypeToTopicArticleFormType } from '../ArticlePage/articleTransformers';

const SaveButtonContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-top: ${spacing.small};
`;

const getArticle = (
  values: ArticleFormType,
  initialValues: ArticleFormType,
  licenses: ILicense[],
  preview?: boolean,
): IUpdatedArticle => {
  return {
    revision: 0,
    grepCodes: values.grepCodes,
  };
};

interface Props {
  article: IArticle;
  articleChanged: boolean;
  updateArticle: (art: IUpdatedArticle) => Promise<IArticle>;
  updateArticleAndStatus?: (input: {
    updatedArticle: IUpdatedArticle;
    newStatus: string;
    dirty: boolean;
  }) => Promise<IArticle>;
}

const GrepCodesForm = ({
  article,
  articleChanged,
  updateArticle,
  updateArticleAndStatus,
}: Props) => {
  const { t, i18n } = useTranslation();
  const articleLanguage = article.title?.language ?? i18n.language;
  const { savedToServer, handleSubmit } = useArticleFormHooks({
    getInitialValues: draftApiTypeToTopicArticleFormType,
    article,
    t,
    articleStatus: article.status,
    updateArticle,
    updateArticleAndStatus,
    getArticleFromSlate: getArticle,
    articleLanguage,
  });

  return (
    <Formik
      initialValues={draftApiTypeToTopicArticleFormType(article, articleLanguage)}
      onSubmit={handleSubmit}>
      {({ submitForm, isSubmitting, errors, values, dirty }) => {
        const formIsDirty = isFormikFormDirty({
          initialValues: draftApiTypeToTopicArticleFormType(article, articleLanguage),
          values,
          dirty,
          changed: articleChanged,
        });
        return (
          <Form>
            <GrepCodesField />
            <SaveButtonContainer>
              <SaveMultiButton
                isSaving={isSubmitting}
                formIsDirty={formIsDirty}
                showSaved={savedToServer && !formIsDirty}
                onClick={submitForm}
                disabled={!!Object.keys(errors).length}
                hideSecondaryButton
              />
            </SaveButtonContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default GrepCodesForm;
