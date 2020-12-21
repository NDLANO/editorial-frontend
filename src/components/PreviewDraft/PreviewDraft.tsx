/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { Remarkable } from 'remarkable';

//@ts-ignore
import { Article, ContentTypeBadge } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import { ArticleType } from '../../interfaces';
//@ts-ignore
import { transformArticle } from '../../util/articleUtil';

interface Props {
  article: ArticleType;
  label: string;
  contentType?: string;
}

class PreviewDraft extends Component<Props & tType, {}> {
  componentDidMount() {
    if (window.MathJax) window.MathJax.typesetPromise();
  }

  render() {
    const { article, contentType, label, t } = this.props;
    if (!article) {
      return null;
    }

    const markdown = new Remarkable({ breaks: true });
    markdown.inline.ruler.enable(['sub', 'sup']);

    const renderMarkdown = (text: string) => {
      return markdown.render(text);
    };

    const icon = contentType ? (
      <ContentTypeBadge type={contentType} background size="large" />
    ) : null;

    const formatted = transformArticle(article);

    return (
      <Article
        article={formatted}
        icon={icon}
        contentType={contentType}
        messages={{
          lastUpdated: t('article.lastUpdated'),
          edition: t('article.edition'),
          publisher: t('article.publisher'),
          label,
          useContent: t('article.useContent'),
          closeLabel: t('article.closeLabel'),
          additionalLabel: t('article.additionalLabel'),
          authorLabel: t('license.creditType.originator'),
          authorDescription: t('license.creditType.authorDesc'),
        }}
        renderMarkdown={renderMarkdown}
      />
    );
  }
}

export default injectT(PreviewDraft);
