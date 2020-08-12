/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { injectT } from '@ndla/i18n';

import formatDate from '../../../util/formatDate';
import { ArticleType, TranslateType } from '../../../interfaces';
import { toEditArticle } from '../../../util/routeHelpers';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { classes } from '../WelcomePage';

interface Props {
  articleId: number;
  locale: string;
  t: TranslateType;
}

const LastUsedContent: FC<Props> = ({ articleId, locale, t }) => {
  const [article, setArticle] = useState<ArticleType>();

  const fetchArticle = async (articleId: number, locale: string) => {
    const article = await fetchDraft(articleId, locale);
    setArticle(article);
  };

  useEffect(() => {
    if (articleId) {
      fetchArticle(articleId, locale);
    }
  }, []);

  return (
    <div {...classes('result')}>
      {article && (
        <Link
          {...classes('link')}
          to={toEditArticle(article.id, article.articleType)}>
          {article.title.title} ({t('article.lastUpdated')}{' '}
          {article && formatDate(article.updated)})
        </Link>
      )}
    </div>
  );
};

export default injectT(LastUsedContent);
