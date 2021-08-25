/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Formik, Form } from 'formik';
import { useArticleFormHooks } from '../FormikForm/articleFormHooks';
import GrepCodesField from '../FormikForm/GrepCodesField';
import SaveMultiButton from '../../components/SaveMultiButton';
import { DraftApiType } from '../../modules/draft/draftApiInterfaces';
import { isFormikFormDirty } from '../../util/formHelper';

const getInitialValues = (article: DraftApiType) => {
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
  article: DraftApiType;
  articleChanged: boolean;
}

const GrepCodesForm = ({ article, articleChanged, ...articleHooks }: Props) => {
  const { savedToServer, handleSubmit } = useArticleFormHooks({
    getInitialValues,
    getArticleFromSlate: getArticle,
    article,
    ...articleHooks,
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
            <SaveMultiButton
              large={false}
              isSaving={isSubmitting}
              formIsDirty={formIsDirty}
              showSaved={savedToServer && !formIsDirty}
              onClick={submitForm}
              disabled={!!Object.keys(errors).length}
              hideSecondaryButton
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default GrepCodesForm;
