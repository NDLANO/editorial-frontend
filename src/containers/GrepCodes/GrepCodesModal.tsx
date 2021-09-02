/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchArticleData } from '../FormikForm/formikDraftHooks';
import { getIdFromUrn } from '../../util/taxonomyHelpers';
import TaxonomyLightbox from '../../components/Taxonomy/TaxonomyLightbox';
import Spinner from '../../components/Spinner';
import GrepCodesForm from './GrepCodesForm';

interface Props {
  contentUri?: string;
  onClose: () => void;
  locale: string;
}

const GrepCodesModal = ({ contentUri, onClose, locale }: Props) => {
  const { t } = useTranslation();
  const { loading, article, articleChanged, ...articleHooks } = useFetchArticleData(
    getIdFromUrn(contentUri),
    locale,
  );

  return (
    <TaxonomyLightbox title={t('form.name.grepCodes')} onClose={onClose} wide>
      {loading || !article || !article.id ? (
        <Spinner />
      ) : (
        <GrepCodesForm article={article} articleChanged={articleChanged} {...articleHooks} />
      )}
    </TaxonomyLightbox>
  );
};

export default GrepCodesModal;
