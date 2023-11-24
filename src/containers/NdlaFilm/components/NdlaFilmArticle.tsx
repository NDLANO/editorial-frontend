/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useField, useFormikContext } from 'formik';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { FieldHeader } from '@ndla/forms';
import { colors, spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import { IArticleSummaryV2 } from '@ndla/types-backend/article-api';
import { IMultiSearchSummary } from '@ndla/types-backend/search-api';
import DropdownSearch from '../../NdlaFilm/components/DropdownSearch';
import { useArticleSearch } from '../../../modules/article/articleQueries';
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

  const article = useArticleSearch(
    { ids: field.value ? `${getIdFromUrn(field.value)}` : undefined },
    { enabled: !!field.value },
  );

  const selectedArticle: undefined | IArticleSummaryV2 = useMemo(() => {
    if (article.isLoading || !article.data) {
      return undefined;
    }
    return article.data.results[0];
  }, [article.data, article.isLoading]);

  return (
    <>
      <FieldHeader
        title={t('ndlaFilm.editor.moreInfoTitle')}
        subTitle={t('ndlaFilm.editor.moreInfoSubTitle')}
      />
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
      <DropdownSearch
        contextTypes="article"
        selectedElements={[]}
        onChange={(article: IMultiSearchSummary) => {
          onUpdateArticle(field, form, getUrnFromId(article.id));
        }}
        placeholder={t('ndlaFilm.editor.addArticleToMoreInformation')}
        clearInputField
      />
    </>
  );
};

export default NdlaFilmArticle;
