/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'article-preview',
  prefix: 'c-',
});

interface Props {
  article: {
    id: number;
    metaDescription?: string;
    title?: string;
    imageUrl?: string;
  };
  locale?: string;
}

const ArticlePreview = ({ article, locale }: Props) => (
  <div data-testid="articlePreview" {...classes('')}>
    <div {...classes('image')}>
      <img src={article.imageUrl || '/placeholder.png'} alt="" />
    </div>
    <div {...classes('content')}>
      <h1 {...classes('title')}>{article.title}</h1>
      <p {...classes('description')}>{article.metaDescription}</p>
    </div>
  </div>
);

export default ArticlePreview;
