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
import { ContentTypeBadge } from '@ndla/ui';
import { Article } from '@ndla/ui';
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
        // @ts-ignore TODO: denne må kanskje fikses i frontend-packages? En draft kan vel være lisensløs?
        article={formatted}
        children={undefined}
        icon={icon}
        id={formatted?.id.toString() ?? ''}
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
