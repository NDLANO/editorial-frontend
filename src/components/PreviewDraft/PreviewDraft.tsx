/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { IArticle, IDraftCopyright } from "@ndla/types-backend/draft-api";
import { TransformedPreviewDraft } from "./TransformedPreviewDraft";
import "../DisplayEmbed/helpers/h5pResizer";
import { useTransformedArticle } from "./useTransformedArticle";

interface BaseProps {
  label: string;
  contentType?: string;
  language: string;
  type: "article" | "formArticle";
}

interface PreviewArticleV2Props extends BaseProps {
  type: "article";
  draft: IArticle;
}

interface PreviewFormArticleV2Props extends BaseProps {
  type: "formArticle";
  draft: FormArticle;
}

export interface FormArticle {
  id: number;
  title?: string;
  content?: string;
  introduction?: string;
  visualElement?: string;
  published?: string;
  copyright?: IDraftCopyright;
  articleType?: string;
  language?: string;
}

type Props = PreviewArticleV2Props | PreviewFormArticleV2Props;

export const toFormArticle = (article: IArticle, language: string): FormArticle => {
  return {
    id: article.id,
    content: article.content?.content,
    visualElement: article.visualElement?.visualElement,
    title: article.title?.htmlTitle,
    introduction: article.introduction?.htmlIntroduction,
    published: article.published,
    copyright: article.copyright,
    language: article.title?.language ?? language,
  };
};

export const PreviewDraft = (props: Props) => {
  const { label, type, language, contentType, draft: draftProp } = props;
  const draft = useMemo(() => {
    if (type === "article") return toFormArticle(draftProp, language);
    return draftProp;
  }, [draftProp, type, language]);

  const { article } = useTransformedArticle({ draft, language });

  return <TransformedPreviewDraft article={article} contentType={contentType} draft={draft} label={label} />;
};

export default PreviewDraft;
