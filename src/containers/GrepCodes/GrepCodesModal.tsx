/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchArticleData } from '../FormikForm/formikDraftHooks';
import { getIdFromUrn } from '../../util/taxonomyHelpers';
import TaxonomyLightbox from '../../components/Taxonomy/TaxonomyLightbox';
import Spinner from '../../components/Spinner';
import GrepCodesForm from './GrepCodesForm';
import { LocaleType } from '../../interfaces';
import { UpdatedDraftApiType } from '../../modules/draft/draftApiInterfaces';

interface Props {
  contentUri?: string;
  onClose: (updated: boolean) => void;
  locale: LocaleType;
}

const GrepCodesModal = ({ contentUri, onClose, locale }: Props) => {
  const { t } = useTranslation();
  const articleId = getIdFromUrn(contentUri);
  const [changed, setChanged] = useState(false);

  const {
    loading,
    article,
    articleChanged,
    updateArticle,
    updateArticleAndStatus,
  } = useFetchArticleData(articleId?.toString(), locale);

  const onUpdateArticle = async (updated: UpdatedDraftApiType) => {
    const res = await updateArticle(updated);
    const sameLength = res.grepCodes?.length === article?.grepCodes.length;
    setChanged(!sameLength);
    return res;
  };

  return (
    <TaxonomyLightbox title={t('form.name.grepCodes')} onClose={() => onClose(changed)} wide>
      {loading || !article || !article.id ? (
        <Spinner />
      ) : (
        <GrepCodesForm
          article={article}
          articleChanged={articleChanged}
          updateArticle={onUpdateArticle}
          updateArticleAndStatus={updateArticleAndStatus}
        />
      )}
    </TaxonomyLightbox>
  );
};

export default GrepCodesModal;
