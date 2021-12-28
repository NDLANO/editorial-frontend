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
import { useTranslation } from 'react-i18next';
import { ArticleFormikType, useArticleFormHooks } from '../FormikForm/articleFormHooks';
import GrepCodesField from '../FormikForm/GrepCodesField';
import SaveMultiButton from '../../components/SaveMultiButton';
import { DraftStatusTypes, UpdatedDraftApiType } from '../../modules/draft/draftApiInterfaces';
import { isFormikFormDirty } from '../../util/formHelper';
import { ConvertedDraftType } from '../../interfaces';

const SaveButtonContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-top: ${spacing.small};
`;

const getInitialValues = (article: Partial<ConvertedDraftType>): ArticleFormikType => {
  return {
    articleType: article.articleType ?? '',
    conceptIds: article.conceptIds ?? [],
    creators: article.copyright?.creators ?? [],
    processors: article.copyright?.processors ?? [],
    relatedContent: article.relatedContent ?? [],
    rightsholders: article.copyright?.rightsholders ?? [],
    supportedLanguages: article.supportedLanguages ?? [],
    tags: article.tags ?? [],
    updatePublished: false,
    id: article.id,
    revision: article.revision,
    notes: [],
    grepCodes: article.grepCodes || [],
  };
};

const getArticle = ({
  values,
}: {
  values: ArticleFormikType;
  initialValues: ArticleFormikType;
  preview: boolean;
}): UpdatedDraftApiType => {
  return {
    revision: 0,
    id: values.id,
    grepCodes: values.grepCodes,
    supportedLanguages: [],
  };
};

interface Props {
  article: ConvertedDraftType;
  articleChanged: boolean;
  updateArticle: (art: UpdatedDraftApiType) => Promise<ConvertedDraftType>;
  updateArticleAndStatus?: (input: {
    updatedArticle: UpdatedDraftApiType;
    newStatus: DraftStatusTypes;
    dirty: boolean;
  }) => Promise<ConvertedDraftType>;
}

const GrepCodesForm = ({
  article,
  articleChanged,
  updateArticle,
  updateArticleAndStatus,
}: Props) => {
  const { t } = useTranslation();
  const { savedToServer, handleSubmit } = useArticleFormHooks({
    getInitialValues,
    article,
    t,
    articleStatus: article.status,
    updateArticle,
    updateArticleAndStatus,
    getArticleFromSlate: getArticle,
  });

  return (
    <Formik initialValues={getInitialValues(article)} onSubmit={handleSubmit}>
      {({ submitForm, isSubmitting, errors, values, dirty }) => {
        const formIsDirty = isFormikFormDirty({
          initialValues: getInitialValues(article),
          values,
          dirty,
          changed: articleChanged,
        });
        return (
          <Form>
            <GrepCodesField grepCodes={article?.grepCodes || []} />
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
