/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useField, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import { IArticleSummaryV2 } from '@ndla/types-backend/build/article-api';
import { IMultiSearchSummary } from '@ndla/types-backend/search-api';
import DropdownSearch from '../../NdlaFilm/components/DropdownSearch';
import { getUrnFromId, getIdFromUrn } from '../../../util/ndlaFilmHelpers';
import { searchArticles } from '../../../modules/article/articleApi';

interface Props {
  fieldName: string;
  onUpdateArticle: Function;
}

const ArticleElement = styled.div`
  align-items: center;
  background: ${colors.brand.greyLighter};
  display: flex;
  justify-content: space-between;
  margin: 0 0 ${spacing.normal};
  padding: ${spacing.small};
`;

const NdlaFilmArticle = ({ fieldName, onUpdateArticle }: Props) => {
  const { t } = useTranslation();
  const form = useFormikContext();
  const [field] = useField<string>(fieldName);
  const [selectedArticle, setSelectedArticle] = useState<
    null | IMultiSearchSummary | IArticleSummaryV2
  >(null);

  const fetchArticle = async () => {
    if (field.value) {
      const article = await searchArticles({ ids: `${getIdFromUrn(field.value)}` });
      setSelectedArticle(article.results[0]);
    } else {
      setSelectedArticle(null);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [field.value, fetchArticle]);

  return (
    <>
      {selectedArticle && (
        <ArticleElement>
          <Link
            to={`/subject-matter/learning-resource/${selectedArticle.id}/edit/${selectedArticle.title.language}`}
          >
            {selectedArticle.title.title}
          </Link>
          <Tooltip tooltip={t('ndlaFilm.editor.removeArticleFromMoreInformation')}>
            <IconButtonV2
              aria-label={t('ndlaFilm.editor.removeArticleFromMoreInformation')}
              variant="ghost"
              colorTheme="danger"
              data-testid="elementListItemDeleteButton"
              onClick={() => onUpdateArticle(field, form, null)}
            >
              <DeleteForever />
            </IconButtonV2>
          </Tooltip>
        </ArticleElement>
      )}
      <DropdownSearch
        contextTypes="article"
        selectedElements={[]}
        onChange={(article: IMultiSearchSummary) => {
          console.log(article);
          onUpdateArticle(field, form, getUrnFromId(article.id));
        }}
        placeholder={t('ndlaFilm.editor.addArticleToMoreInformation')}
        clearInputField
      />
    </>
  );
};

export default NdlaFilmArticle;
