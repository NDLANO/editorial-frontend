/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField, useFormikContext } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { FieldHeader } from '@ndla/forms';
import { DeleteForever } from '@ndla/icons/editor';
import { IArticleSummaryV2, IArticleV2 } from '@ndla/types-backend/article-api';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { getArticle, searchArticles } from '../../../modules/article/articleApi';
import { getUrnFromId, getIdFromUrn } from '../../../util/ndlaFilmHelpers';
import { toEditFrontPageArticle } from '../../../util/routeHelpers';

interface Props {
  fieldName: string;
  onUpdateArticle: Function;
}

const ArticleElement = styled.div`
  align-items: center;
  background: ${colors.brand.greyLighter};
  display: flex;
  justify-content: space-between;
  margin: ${spacing.normal} 0;
  padding: ${spacing.small};
`;

const NdlaFilmArticle = ({ fieldName, onUpdateArticle }: Props) => {
  const { t } = useTranslation();
  const form = useFormikContext();
  const [field] = useField<string>(fieldName);
  const [selectedArticle, setSelectedArticle] = useState<undefined | IArticleV2>(undefined);

  useEffect(() => {
    const initSelectedArticle = async () => {
      if (field.value) {
        const response = await getArticle(getIdFromUrn(field.value));
        setSelectedArticle(response);
      } else {
        setSelectedArticle(undefined);
      }
    };
    initSelectedArticle();
  }, [field.value]);

  const onSearch = useCallback((query: string, page?: number) => {
    return searchArticles({ articleTypes: ['frontpage-article'], page, query });
  }, []);

  return (
    <>
      <FieldHeader title={t('ndlaFilm.editor.moreInfoTitle')} subTitle={t('ndlaFilm.editor.moreInfoSubTitle')} />
      {selectedArticle && (
        <ArticleElement>
          <Link to={toEditFrontPageArticle(selectedArticle.id, selectedArticle.title.language)}>
            {selectedArticle.title.title}
          </Link>
          <IconButtonV2
            aria-label={t('ndlaFilm.editor.removeArticleFromMoreInformation')}
            variant="ghost"
            title={t('ndlaFilm.editor.removeArticleFromMoreInformation')}
            colorTheme="danger"
            data-testid="elementListItemDeleteButton"
            onClick={() => onUpdateArticle(field, form, null)}
          >
            <DeleteForever />
          </IconButtonV2>
        </ArticleElement>
      )}
      <AsyncDropdown<IArticleSummaryV2>
        idField="id"
        labelField="title"
        placeholder={t('frontpageForm.search')}
        apiAction={onSearch}
        disableSelected
        onChange={(article: IArticleSummaryV2) => onUpdateArticle(field, form, getUrnFromId(article.id))}
        startOpen={!field.value}
        showPagination
        initialSearch={!field.value}
        clearInputField
      />
    </>
  );
};

export default NdlaFilmArticle;
