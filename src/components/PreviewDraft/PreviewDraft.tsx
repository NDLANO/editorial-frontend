/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component } from 'react';
import { Remarkable } from 'remarkable';

//@ts-ignore
import { ContentTypeBadge } from '@ndla/ui';
import { Article } from '@ndla/ui';
import { LocaleType } from '../../interfaces';
//@ts-ignore
import '../DisplayEmbed/helpers/h5pResizer';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';
import formatDate from '../../util/formatDate';

interface Props {
  article: ArticleConverterApiType;
  label: string;
  language: string;
  contentType?: string;
}

class PreviewDraft extends Component<Props, {}> {
  componentDidMount() {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.article.content !== this.props.article.content) {
      if (window.MathJax) {
        window.MathJax.typesetPromise();
      }
    }
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

    const requiredLibraries = article.requiredLibraries?.map(lib => {
      if (lib.url.startsWith('http://')) {
        return { ...lib, url: lib.url.replace('http://', 'https://') };
      } else return lib;
    });
    const formattedDates = {
      created: formatDate(article.created),
      updated: formatDate(article.updated),
      published: formatDate(article.published),
    };
    const formatted: ArticleConverterApiType = { ...article, requiredLibraries, ...formattedDates };
    return (
      <Article
        // @ts-ignore TODO: denne må kanskje fikses i frontend-packages? En draft kan vel være lisensløs?
        article={formatted}
        children={undefined}
        icon={icon}
        id={formatted?.id.toString() ?? ''}
        locale={language as LocaleType} // Sørsamisk er ikke en del av LocaleType nå.
        messages={{
          label,
        }}
        renderMarkdown={renderMarkdown}
      />
    );
  }
}

export default PreviewDraft;
