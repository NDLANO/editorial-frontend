/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect} from 'react';
import { Formik, Form } from 'formik';
import TaxonomyLightbox from './Taxonomy/TaxonomyLightbox';
import { fetchDraft, updateDraft } from '../modules/draft/draftApi';
import { DraftApiType } from '../modules/draft/draftApiInterfaces';
import { getIdFromUrn } from '../util/taxonomyHelpers';
import GrepCodesField from '../containers/FormikForm/GrepCodesField';
import SaveMultiButton from './SaveMultiButton';


const getInitialValues = (article?: DraftApiType) => {
  return {
    grepCodes: article?.grepCodes || [],
  };
};

interface Props {
  contentUri: string;
  onClose: () => void;
  locale: string;
}

const GrepCodesModal = ({ contentUri, onClose, locale }: Props) => {
  const [article, setArticle] = useState<DraftApiType>();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      const articleId = getIdFromUrn(contentUri);
      if (articleId) {
        const draft = await fetchDraft(articleId, locale);
        setArticle(draft);
      }
    }
    fetchArticle();
  }, [contentUri, locale]);

  const handleSubmit = async (values: {grepCodes: string[]}) => {
    await updateDraft({
      id: article?.id,
      revision: article?.revision ?? -1,
      grepCodes: values.grepCodes,
    });
    setSaved(true);
  }

  const initialValues = getInitialValues(article)

  return (
    <TaxonomyLightbox title={'Title'} onClose={onClose} loading={!initialValues.grepCodes} wide>
      <Formik
        initialValues={getInitialValues(article)}
        onSubmit={handleSubmit}
      >
      {({ submitForm, isSubmitting, values, dirty }) => {
        return (
          <Form>
            <GrepCodesField grepCodes={article?.grepCodes || []} />
            <SaveMultiButton
              large={false}
              disabled={false}
              showSaved={!dirty && saved}
              onClick={submitForm} 
              formIsDirty={dirty}
              isSaving={isSubmitting}
              hideSecondaryButton
            />
          </Form>
        );
      }}
      </Formik>
    </TaxonomyLightbox>
  );
};

export default GrepCodesModal;
