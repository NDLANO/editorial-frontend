/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { toEditArticle } from '../../../util/routeHelpers';
import { ArticleResultShape } from '../../../shapes';
import { searchClasses } from '../SearchPage';

const SearchArticle = ({ article }) =>
  <div {...searchClasses('result')}>
    <div {...searchClasses('content')}>
      <Link
        {...searchClasses('link')}
        to={toEditArticle(article.id, article.articleType)}>
        <h1 {...searchClasses('title')}>
          {article.title}
        </h1>
      </Link>
      <p {...searchClasses('description')}>
        {article.introduction}
      </p>
    </div>
    <div {...searchClasses('image')}>
      <img src="/assets/placeholder.png" alt="" />
    </div>
  </div>;

SearchArticle.propTypes = {
  article: ArticleResultShape.isRequired,
};

export default SearchArticle;
