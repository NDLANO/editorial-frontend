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
import { ArticleType, LocaleType } from '../../interfaces';
//@ts-ignore
import { transformArticle } from '../../util/articleUtil';

interface Props {
  article: ArticleType;
  label: string;
  language: LocaleType;
  contentType?: string;
}

class PreviewDraft extends Component<Props, {}> {
  componentDidMount() {
    if (window.MathJax) window.MathJax.typesetPromise();
  }

  render() {
    const { article, contentType, label, language } = this.props;
    if (!article) {
      return null;
    }

    const markdown = new Remarkable({ breaks: true });
    markdown.inline.ruler.enable(['sub', 'sup']);
    markdown.block.ruler.disable(['list']);

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
        //@ts-ignore Must update wrong proptype in Article
        icon={icon}
        contentType={contentType}
        locale={language}
        messages={{
          label,
        }}
        renderMarkdown={renderMarkdown}
      />
    );
  }
}

export default PreviewDraft;
