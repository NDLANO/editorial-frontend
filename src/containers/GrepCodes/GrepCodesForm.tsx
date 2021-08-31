/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Formik, Form } from 'formik';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { ArticleFormikType, useArticleFormHooks } from '../FormikForm/articleFormHooks';
import GrepCodesField from '../FormikForm/GrepCodesField';
import SaveMultiButton from '../../components/SaveMultiButton';
import { DraftApiType } from '../../modules/draft/draftApiInterfaces';
import { isFormikFormDirty } from '../../util/formHelper';
import { ConvertedDraftType } from '../../interfaces';

const SaveButtonContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-top: ${spacing.small};
`;

const getInitialValues = (article: ConvertedDraftType) => {
  return {
    id: article.id,
    revision: article.revision,
    notes: [],
    grepCodes: article.grepCodes || [],
  };
};

const getArticle = ({ values }: { values: DraftApiType }) => {
  return {
    id: values.id,
    grepCodes: values.grepCodes,
  };
};

interface Props {
  article: ConvertedDraftType;
  articleChanged: boolean;
}

const GrepCodesForm = ({ article, articleChanged, ...articleHooks }: Props) => {
  const { savedToServer, handleSubmit } = useArticleFormHooks({
    // @ts-ignore TODO:
    getInitialValues,
    // @ts-ignore TODO:
    getArticleFromSlate: getArticle,
    article,
    ...articleHooks,
  });

  return (
    // @ts-ignore TODO:
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
