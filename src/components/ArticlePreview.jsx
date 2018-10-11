/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import { toEditArticle } from '../util/routeHelpers';

const classes = new BEMHelper({
  name: 'article-preview',
  prefix: 'c-',
});

const ArticlePreview = ({ article, locale }) => (
  <div data-testid="articlePreview" {...classes('')}>
    <div {...classes('image')}>
      <img src={article.imageUrl || '/placeholder.png'} alt="" />
    </div>
    <div {...classes('content')}>
      <Link to={toEditArticle(article.id, article.articleType, locale)}>
        <h1 {...classes('title')}>{article.title}</h1>
      </Link>
      <p {...classes('description')}>{article.metaDescription}</p>
    </div>
  </div>
);

ArticlePreview.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.number,
    articleType: PropTypes.string,
    metaDescription: PropTypes.string,
    title: PropTypes.string,
  }),
  locale: PropTypes.string,
};

export default ArticlePreview;
