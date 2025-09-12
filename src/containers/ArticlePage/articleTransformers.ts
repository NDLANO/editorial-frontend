/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEmpty } from "lodash-es";
import { Descendant } from "slate";
import { ILicenseDTO, IUpdatedArticleDTO, IArticleDTO } from "@ndla/types-backend/draft-api";
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from "../../constants";
import {
  editorValueToEmbedTag,
  editorValueToPlainText,
  embedTagToEditorValue,
  blockContentToEditorValue,
  blockContentToHTML,
  plainTextToEditorValue,
  inlineContentToEditorValue,
  inlineContentToHTML,
} from "../../util/articleContentConverter";
import { getSlugFromTitle, nullOrUndefined } from "../../util/articleUtil";
import { DEFAULT_LICENSE, parseImageUrl } from "../../util/formHelper";
import {
  ArticleFormType,
  LearningResourceFormType,
  TopicArticleFormType,
  FrontpageArticleFormType,
  SlateCommentType,
} from "../FormikForm/articleFormHooks";

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

const getCommentsDraftApiToArticleFormType = (
  article: IArticleDTO | undefined,
  articleType: string,
): SlateCommentType[] => {
  if (!article?.comments) return [];
  if (
    article?.status.current &&
    RESET_COMMENTS_STATUSES.includes(article?.status.current) &&
    articleType !== "topic-article"
  )
    return [];
  return article.comments.map((c) => ({ ...c, content: inlineContentToEditorValue(c.content, true) }));
};

const draftApiTypeToArticleFormType = (
  article: IArticleDTO | undefined,
  language: string,
  articleType: string,
  ndlaId: string | undefined,
  contentFunc: (html: string) => Descendant[],
): ArticleFormType => {
  const license = article?.copyright?.license?.license;
  const articleLicense = !license || license === "unknown" ? DEFAULT_LICENSE.license : license;
  return {
    articleType,
    content: contentFunc(article?.content?.content ?? ""),
    creators: article?.copyright?.creators ?? [],
    id: article?.id,
    introduction: inlineContentToEditorValue(article?.introduction?.htmlIntroduction ?? "", true),
    language,
    license: articleLicense,
    origin: article?.copyright?.origin,
    metaDescription: plainTextToEditorValue(article?.metaDescription?.metaDescription ?? ""),
    metaImageAlt: article?.metaImage?.alt ?? "",
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
    title: inlineContentToEditorValue(article?.title?.htmlTitle ?? "", true),
    updatePublished: false,
    updated: article?.updated,
    grepCodes: article?.grepCodes ?? [],
    conceptIds: article?.conceptIds ?? [],
    relatedContent: article?.relatedContent ?? [],
    revisionMeta: article?.revisions ?? [],
    slug: article?.slug,
    responsibleId: article === undefined ? ndlaId : article?.responsible?.responsibleId,
    comments: getCommentsDraftApiToArticleFormType(article, articleType),
    priority: article?.priority ?? "unspecified",
    disclaimer: inlineContentToEditorValue(article?.disclaimer?.disclaimer ?? "", true),
    saveAsNew: false,
  };
};

export const draftApiTypeToLearningResourceFormType = (
  article: IArticleDTO | undefined,
  language: string,
  ndlaId: string | undefined,
): LearningResourceFormType => {
  return {
    ...draftApiTypeToArticleFormType(article, language, "standard", ndlaId, blockContentToEditorValue),
  };
};

export const draftApiTypeToFrontpageArticleFormType = (
  article: IArticleDTO | undefined,
  language: string,
  ndlaId: string | undefined,
): FrontpageArticleFormType => {
  return {
    ...draftApiTypeToArticleFormType(article, language, "frontpage-article", ndlaId, blockContentToEditorValue),
  };
};

export const draftApiTypeToTopicArticleFormType = (
  article: IArticleDTO | undefined,
  language: string,
  ndlaId: string | undefined,
): TopicArticleFormType => {
  return {
    ...draftApiTypeToArticleFormType(article, language, "topic-article", ndlaId, inlineContentToEditorValue),
    visualElement: embedTagToEditorValue(article?.visualElement?.visualElement ?? ""),
  };
};

export const learningResourceFormTypeToDraftApiType = (
  article: LearningResourceFormType,
  initialValues: LearningResourceFormType,
  licenses: ILicenseDTO[],
  preview = false,
): IUpdatedArticleDTO => {
  const metaImage = article.metaImageId
    ? { id: article.metaImageId, alt: article.metaImageAlt ?? "" }
    : nullOrUndefined(article.metaImageId);
  return {
    revision: 0,
    articleType: "standard",
    content: blockContentToHTML(article.content),
    copyright: {
      license: licenses.find((lic) => lic.license === article.license),
      origin: article.origin,
      creators: article.creators,
      processors: article.processors,
      rightsholders: article.rightsholders,
      processed: article.processed,
    },
    introduction: inlineContentToHTML(article.introduction),
    language: article.language,
    metaImage,
    metaDescription: editorValueToPlainText(article.metaDescription),
    notes: article.notes,
    published: getPublishedDate(article, initialValues, preview) ?? "",
    tags: article.tags,
    title: inlineContentToHTML(article.title),
    grepCodes: article.grepCodes,
    conceptIds: article.conceptIds,
    relatedContent: article.relatedContent,
    revisionMeta: article.revisionMeta,
    responsibleId: article.responsibleId,
    comments: article.comments?.map((c) => ({ ...c, content: inlineContentToHTML(c.content) })),
    priority: article.priority ?? "unspecified",
    disclaimer: article.disclaimer ? inlineContentToHTML(article.disclaimer) : undefined,
  };
};

export const frontpageArticleFormTypeToDraftApiType = (
  article: FrontpageArticleFormType,
  initialValues: FrontpageArticleFormType,
  licenses: ILicenseDTO[],
  preview = false,
): IUpdatedArticleDTO => {
  const metaImage = article.metaImageId
    ? { id: article.metaImageId, alt: article.metaImageAlt ?? "" }
    : nullOrUndefined(article.metaImageId);
  return {
    revision: 0,
    slug: article.slug || getSlugFromTitle(editorValueToPlainText(article.title)),
    articleType: "frontpage-article",
    content: blockContentToHTML(article.content),
    copyright: {
      origin: article.origin,
      license: licenses.find((lic) => lic.license === article.license),
      creators: article.creators,
      processors: article.processors,
      rightsholders: article.rightsholders,
      processed: article.processed,
    },
    introduction: inlineContentToHTML(article.introduction),
    language: article.language,
    metaImage,
    metaDescription: editorValueToPlainText(article.metaDescription),
    notes: article.notes,
    published: getPublishedDate(article, initialValues, preview) ?? "",
    tags: article.tags,
    title: inlineContentToHTML(article.title),
    grepCodes: article.grepCodes,
    conceptIds: article.conceptIds,
    relatedContent: article.relatedContent,
    revisionMeta: article.revisionMeta,
    responsibleId: article.responsibleId,
    comments: article.comments?.map((c) => ({ ...c, content: inlineContentToHTML(c.content) })),
    priority: article.priority ?? "unspecified",
  };
};

export const topicArticleFormTypeToDraftApiType = (
  article: TopicArticleFormType,
  initialValues: TopicArticleFormType,
  licenses: ILicenseDTO[],
  preview = false,
): IUpdatedArticleDTO => {
  const metaImage = article.metaImageId
    ? { id: article.metaImageId, alt: article.metaImageAlt ?? "" }
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
    title: inlineContentToHTML(article.title),
    published: getPublishedDate(article, initialValues, preview) ?? "",
    content: inlineContentToHTML(article.content),
    tags: article.tags,
    introduction: inlineContentToHTML(article.introduction),
    metaDescription: editorValueToPlainText(article.metaDescription),
    metaImage: metaImage,
    visualElement: editorValueToEmbedTag(article.visualElement),
    copyright: copyright,
    articleType: article.articleType,
    notes: article.notes,
    grepCodes: article.grepCodes,
    conceptIds: article.conceptIds,
    relatedContent: article.relatedContent,
    revisionMeta: article.revisionMeta,
    responsibleId: article.responsibleId,
    comments: article.comments?.map((c) => ({ ...c, content: inlineContentToHTML(c.content) })),
    priority: article.priority ?? "unspecified",
  };
};
