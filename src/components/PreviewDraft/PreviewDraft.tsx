/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component, useCallback, useEffect, useMemo } from 'react';
import { Remarkable } from 'remarkable';
import { ContentTypeBadge, Article } from '@ndla/ui';
import { IArticle, ICopyright } from '@ndla/types-draft-api';
import { transform } from '@ndla/article-converter';
import { LocaleType } from '../../interfaces';
import '../DisplayEmbed/helpers/h5pResizer';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';
import formatDate from '../../util/formatDate';
import { usePreviewArticle } from '../../modules/article/articleGqlQueries';
import config from '../../config';

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

interface BaseProps {
  label: string;
  contentType?: string;
  language: string;
  type: 'article' | 'formArticle';
}

interface PreviewArticleV2Props extends BaseProps {
  type: 'article';
  draft: IArticle;
}

interface PreviewFormArticleV2Props extends BaseProps {
  type: 'formArticle';
  draft: FormArticle;
}

interface FormArticle {
  id: number;
  title?: string;
  content?: string;
  introduction?: string;
  visualElement?: string;
  published?: string;
  copyright?: ICopyright;
}

type PreviewDraftV2Props = PreviewArticleV2Props | PreviewFormArticleV2Props;

export const PreviewDraftV2 = ({
  type,
  draft: draftProp,
  label,
  contentType,
  language,
}: PreviewDraftV2Props) => {
  const draft = useMemo(() => {
    if (type === 'article') {
      return {
        id: draftProp.id,
        content: draftProp.content?.content,
        visualElement: draftProp.visualElement?.visualElement,
        title: draftProp.title?.title,
        introduction: draftProp.introduction?.introduction,
        published: draftProp.published,
        copyright: draftProp.copyright,
      };
    }
    return draftProp;
  }, [draftProp, type]);

  const transformedContent = usePreviewArticle(draft.content!, language, draft.visualElement);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [draft.content]);

  const markdown = useMemo(() => {
    const markdown = new Remarkable({ breaks: true });
    markdown.inline.ruler.enable(['sub', 'sup']);
    markdown.block.ruler.disable(['list']);
    return markdown;
  }, []);

  const renderMarkdown = useCallback((text: string) => markdown.render(text), [markdown]);

  const article = useMemo(() => {
    if (!transformedContent.data) return;
    const content = transform(transformedContent.data, {
      previewAlt: true,
      frontendDomain: config.ndlaFrontendDomain,
    });
    return {
      title: draft.title ?? '',
      introduction: draft.introduction ?? '',
      content,
      copyright: draft.copyright!,
      published: draft.published ? formatDate(draft.published) : '',
    };
  }, [transformedContent.data, draft]);

  if (!transformedContent.data) {
    return null;
  }

  return (
    <Article
      //@ts-ignore
      article={article}
      contentTransformed={!config.useArticleConverter}
      icon={contentType ? <ContentTypeBadge type={contentType} background size="large" /> : null}
      id={draft.id.toString()}
      locale={language as LocaleType}
      messages={{ label }}
      renderMarkdown={renderMarkdown}
    />
  );
};

export default PreviewDraft;
