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

const SearchArticle = ({ article }) => {
  console.log(article);
  return (
    <div className="search-result">
      <Link
        className="search-result__link"
        to={toEditArticle(article.id, article.articleType)}>
        <h1 className="search-result__title">
          {article.title}
        </h1>
      </Link>

      <p className="search-result__description">
        {article.introduction}
      </p>
    </div>
  );
};

SearchArticle.propTypes = {
  article: ArticleResultShape.isRequired,
};

export default SearchArticle;
