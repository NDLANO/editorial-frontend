/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEmpty from 'lodash/isEmpty';
import { Descendant } from 'slate';
import { ILicense, IUpdatedArticle, IArticle, IRevisionMeta } from '@ndla/types-backend/draft-api';
import { ARCHIVED, PUBLISHED, UNPUBLISHED, Revision } from '../../constants';
import {
  editorValueToEmbedTag,
  editorValueToPlainText,
  embedTagToEditorValue,
  blockContentToEditorValue,
  blockContentToHTML,
  plainTextToEditorValue,
  inlineContentToEditorValue,
  inlineContentToHTML,
} from '../../util/articleContentConverter';
import { getSlugFromTitle, nullOrUndefined } from '../../util/articleUtil';
import { DEFAULT_LICENSE, parseImageUrl } from '../../util/formHelper';
import {
  ArticleFormType,
  LearningResourceFormType,
  TopicArticleFormType,
  FrontpageArticleFormType,
} from '../FormikForm/articleFormHooks';

const getPublishedDate = (values: ArticleFormType, initialValues: ArticleFormType, preview: boolean = false) => {
  if (isEmpty(values.published)) {
    return undefined;
  }
  if (preview) {
    return values.published;
  }

  const hasPublishedDateChanged = initialValues.published !== values.published;
  if (hasPublishedDateChanged || values.updatePublished) {
    return values.published;
  }
  return undefined;
};

export const RESET_COMMENTS_STATUSES = [PUBLISHED, ARCHIVED, UNPUBLISHED];

const draftApiTypeToArticleFormType = (
  article: IArticle | undefined,
  language: string,
  articleType: string,
  ndlaId: string | undefined,
  contentFunc: (html: string) => Descendant[],
): ArticleFormType => {
  const license = article?.copyright?.license?.license;
  const articleLicense = !license || license === 'unknown' ? DEFAULT_LICENSE.license : license;
  return {
    articleType,
    content: contentFunc(article?.content?.content ?? ''),
    creators: article?.copyright?.creators ?? [],
    id: article?.id,
    introduction: plainTextToEditorValue(article?.introduction?.introduction ?? ''),
    language,
    license: articleLicense,
    origin: article?.copyright?.origin,
    metaDescription: plainTextToEditorValue(article?.metaDescription?.metaDescription ?? ''),
    metaImageAlt: article?.metaImage?.alt ?? '',
    metaImageId: parseImageUrl(article?.metaImage),
    notes: [],
    processors: article?.copyright?.processors ?? [],
    processed: article?.copyright?.processed ?? false,
    published: article?.published,
    revision: article?.revision,
    rightsholders: article?.copyright?.rightsholders ?? [],
    status: article?.status,
    supportedLanguages: article?.supportedLanguages ?? [],
    tags: article?.tags?.tags ?? [],
    title: plainTextToEditorValue(article?.title?.title ?? ''),
    updatePublished: false,
    updated: article?.updated,
    grepCodes: article?.grepCodes ?? [],
    conceptIds: article?.conceptIds ?? [],
    availability: article?.availability ?? 'everyone',
    relatedContent: article?.relatedContent ?? [],
    revisionMeta: article?.revisions ?? [],
    slug: article?.slug,
    responsibleId: article === undefined ? ndlaId : article?.responsible?.responsibleId,
    comments:
      !article?.comments || (article?.status.current && RESET_COMMENTS_STATUSES.includes(article?.status.current))
        ? []
        : article.comments,
    priority: article?.priority ?? 'unspecified',
  };
};

export const draftApiTypeToLearningResourceFormType = (
  article: IArticle | undefined,
  language: string,
  ndlaId: string | undefined,
): LearningResourceFormType => {
  return {
    ...draftApiTypeToArticleFormType(article, language, 'standard', ndlaId, blockContentToEditorValue),
  };
};

export const draftApiTypeToFrontpageArticleFormType = (
  article: IArticle | undefined,
  language: string,
  ndlaId: string | undefined,
): FrontpageArticleFormType => {
  return {
    ...draftApiTypeToArticleFormType(article, language, 'frontpage-article', ndlaId, blockContentToEditorValue),
  };
};

export const draftApiTypeToTopicArticleFormType = (
  article: IArticle | undefined,
  language: string,
  ndlaId: string | undefined,
): TopicArticleFormType => {
  return {
    ...draftApiTypeToArticleFormType(article, language, 'topic-article', ndlaId, inlineContentToEditorValue),
    visualElement: embedTagToEditorValue(article?.visualElement?.visualElement ?? ''),
  };
};

export const learningResourceFormTypeToDraftApiType = (
  article: LearningResourceFormType,
  initialValues: LearningResourceFormType,
  licenses: ILicense[],
  preview = false,
): IUpdatedArticle => {
  const metaImage = article.metaImageId
    ? { id: article.metaImageId, alt: article.metaImageAlt ?? '' }
    : nullOrUndefined(article.metaImageId);
  return {
    revision: 0,
    articleType: 'standard',
    content: blockContentToHTML(article.content),
    copyright: {
      license: licenses.find((lic) => lic.license === article.license),
      origin: article.origin,
      creators: article.creators,
      processors: article.processors,
      rightsholders: article.rightsholders,
      processed: article.processed,
    },
    introduction: editorValueToPlainText(article.introduction),
    language: article.language,
    metaImage,
    metaDescription: editorValueToPlainText(article.metaDescription),
    notes: article.notes,
    published: getPublishedDate(article, initialValues, preview) ?? '',
    tags: article.tags,
    title: editorValueToPlainText(article.title),
    grepCodes: article.grepCodes,
    conceptIds: article.conceptIds,
    availability: article.availability,
    relatedContent: article.relatedContent,
    revisionMeta: article.revisionMeta,
    responsibleId: article.responsibleId,
    comments: article.comments,
    priority: article.priority ?? 'unspecified',
  };
};

export const frontpageArticleFormTypeToDraftApiType = (
  article: FrontpageArticleFormType,
  initialValues: FrontpageArticleFormType,
  licenses: ILicense[],
  preview = false,
): IUpdatedArticle => {
  const metaImage = article.metaImageId
    ? { id: article.metaImageId, alt: article.metaImageAlt ?? '' }
    : nullOrUndefined(article.metaImageId);
  return {
    revision: 0,
    slug: article.slug || getSlugFromTitle(editorValueToPlainText(article.title)),
    articleType: 'frontpage-article',
    content: blockContentToHTML(article.content),
    copyright: {
      origin: article.origin,
      license: licenses.find((lic) => lic.license === article.license),
      creators: article.creators,
      processors: article.processors,
      rightsholders: article.rightsholders,
      processed: article.processed,
    },
    introduction: editorValueToPlainText(article.introduction),
    language: article.language,
    metaImage,
    metaDescription: editorValueToPlainText(article.metaDescription),
    notes: article.notes,
    published: getPublishedDate(article, initialValues, preview) ?? '',
    tags: article.tags,
    title: editorValueToPlainText(article.title),
    grepCodes: article.grepCodes,
    conceptIds: article.conceptIds,
    availability: article.availability,
    relatedContent: article.relatedContent,
    revisionMeta: article.revisionMeta,
    responsibleId: article.responsibleId,
    comments: article.comments,
    priority: article.priority ?? 'unspecified',
  };
};

export const topicArticleFormTypeToDraftApiType = (
  article: TopicArticleFormType,
  initialValues: TopicArticleFormType,
  licenses: ILicense[],
  preview = false,
): IUpdatedArticle => {
  const metaImage = article.metaImageId
    ? { id: article.metaImageId, alt: article.metaImageAlt ?? '' }
    : nullOrUndefined(article.metaImageId);

  const copyright = {
    license: licenses.find((l) => l.license === article.license),
    origin: article.origin,
    creators: article.creators,
    processors: article.processors,
    rightsholders: article.rightsholders,
    processed: article.processed,
  };

  return {
    revision: article.revision ?? 0,
    language: article.language,
    title: editorValueToPlainText(article.title),
    published: getPublishedDate(article, initialValues, preview) ?? '',
    content: inlineContentToHTML(article.content),
    tags: article.tags,
    introduction: editorValueToPlainText(article.introduction),
    metaDescription: editorValueToPlainText(article.metaDescription),
    metaImage: metaImage,
    visualElement: editorValueToEmbedTag(article.visualElement),
    copyright: copyright,
    articleType: article.articleType,
    notes: article.notes,
    grepCodes: article.grepCodes,
    conceptIds: article.conceptIds,
    availability: article.availability,
    relatedContent: article.relatedContent,
    revisionMeta: article.revisionMeta,
    responsibleId: article.responsibleId,
    comments: article.comments,
    priority: article.priority ?? 'unspecified',
  };
};

export const getExpirationDate = (article?: { revisions: IRevisionMeta[] }): string | undefined => {
  if (!article) return undefined;

  const withParsed =
    article.revisions?.map((r) => {
      return { parsed: new Date(r.revisionDate), ...r };
    }) ?? [];
  const sorted = withParsed.sort((a, b) => a.parsed.getTime() - b.parsed.getTime());
  return sorted.find((r) => r.status !== Revision.revised)?.revisionDate;
};
