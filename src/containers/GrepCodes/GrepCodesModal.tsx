/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IUpdatedArticle } from '@ndla/types-draft-api';
import { useFetchArticleData } from '../FormikForm/formikDraftHooks';
import { getIdFromUrn } from '../../util/taxonomyHelpers';
import TaxonomyLightbox from '../../components/Taxonomy/TaxonomyLightbox';
import Spinner from '../../components/Spinner';
import GrepCodesForm from './GrepCodesForm';
import { LocaleType } from '../../interfaces';

interface Props {
  contentUri?: string;
  onClose: (newGrepCodes?: string[]) => void;
  locale: LocaleType;
}

const GrepCodesModal = ({ contentUri, onClose, locale }: Props) => {
  const { t } = useTranslation();
  const articleId = getIdFromUrn(contentUri);
  const [newGrepCodes, setNewGrepCodes] = useState<string[] | undefined>(undefined);

  const {
    loading,
    article,
    articleChanged,
    updateArticle,
    updateArticleAndStatus,
  } = useFetchArticleData(articleId?.toString(), locale);

  const onUpdateArticle = async (updated: IUpdatedArticle) => {
    const res = await updateArticle(updated);
    setNewGrepCodes(updated.grepCodes);
    return res;
  };

  return (
    <TaxonomyLightbox title={t('form.name.grepCodes')} onClose={() => onClose(newGrepCodes)} wide>
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
