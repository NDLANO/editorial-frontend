/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from 'react';
import parse from 'html-react-parser';
import { ContentTypeBadge, Article, FrontpageArticle } from '@ndla/ui';
import { IArticle, IDraftCopyright } from '@ndla/types-backend/draft-api';
import { transform } from '@ndla/article-converter';
import { LocaleType } from '../../interfaces';
import '../DisplayEmbed/helpers/h5pResizer';
import formatDate from '../../util/formatDate';
import { usePreviewArticle } from '../../modules/article/articleGqlQueries';
import config from '../../config';
import { articleIsWide } from '../WideArticleEditorProvider';
import parseMarkdown from '../../util/parseMarkdown';

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
  copyright?: IDraftCopyright;
  articleType?: string;
}

type Props = PreviewArticleV2Props | PreviewFormArticleV2Props;

export const PreviewDraft = ({ type, draft: draftProp, label, contentType, language }: Props) => {
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
  }, [transformedContent]);

  const article = useMemo(() => {
    if (!transformedContent.data) return;
    const content = transform(transformedContent.data, {
      previewAlt: true,
      frontendDomain: config.ndlaFrontendDomain,
    });
    return {
      title: draft.title ?? '',
      introduction: parse(parseMarkdown({ markdown: draft.introduction ?? '' })),
      content,
      copyright: draft.copyright,
      published: draft.published ? formatDate(draft.published) : '',
      footNotes: [],
    };
  }, [transformedContent.data, draft]);

  const isWide = useMemo(() => articleIsWide(draft.id), [draft.id]);

  if (!transformedContent.data) {
    return null;
  }

  if (!!article && draftProp.articleType === 'frontpage-article') {
    return <FrontpageArticle article={article} id={draft.id.toString()} isWide={isWide} />;
  }

  return (
    <Article
      //@ts-ignore
      article={article}
      contentTransformed
      icon={contentType ? <ContentTypeBadge type={contentType} background size="large" /> : null}
      id={draft.id.toString()}
      locale={language as LocaleType}
      messages={{ label }}
    />
  );
};

export default PreviewDraft;
