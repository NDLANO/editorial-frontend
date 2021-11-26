/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import BEMHelper from 'react-bem-helper';
import { ArticleSearchSummaryApiType } from '../modules/article/articleApiInterfaces';

const classes = new BEMHelper({
  name: 'article-preview',
  prefix: 'c-',
});

interface Props {
  article: Pick<ArticleSearchSummaryApiType, 'title' | 'metaDescription'> & {
    metaUrl?: string;
  };
  imageWidth?: number;
}

const ArticlePreview = ({ article, imageWidth = 200 }: Props) => {
  const imageUrl = article.metaUrl ? `${article.metaUrl}?width=${imageWidth}` : undefined;
  return (
    <div data-testid="articlePreview" {...classes('')}>
      <div {...classes('image')}>
        <img src={imageUrl ?? '/placeholder.png'} alt="" />
      </div>
      <div {...classes('content')}>
        <h1 {...classes('title')}>{article.title.title}</h1>
        <p {...classes('description')}>{article.metaDescription?.metaDescription}</p>
      </div>
    </div>
  );
};

export default ArticlePreview;
