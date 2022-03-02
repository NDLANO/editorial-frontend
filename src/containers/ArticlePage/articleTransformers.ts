/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEmpty } from 'lodash';
import { Descendant } from 'slate';
import {
  ILicense as DraftApiLicense,
  IUpdatedArticle as UpdatedDraftApiType,
  IArticle as DraftApiType,
} from '@ndla/types-draft-api';
import {
  editorValueToEmbedTag,
  editorValueToPlainText,
  embedTagToEditorValue,
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
  plainTextToEditorValue,
  topicArticleContentToEditorValue,
  topicArticleContentToHTML,
} from '../../util/articleContentConverter';
import {
  ArticleFormType,
  LearningResourceFormType,
  TopicArticleFormType,
} from '../FormikForm/articleFormHooks';
import { DEFAULT_LICENSE, parseImageUrl } from '../../util/formHelper';
import { nullOrUndefined } from '../../util/articleUtil';
import { DRAFT } from '../../util/constants/ArticleStatus';

const getPublishedDate = (
  values: ArticleFormType,
  initialValues: ArticleFormType,
  preview: boolean = false,
) => {
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

const draftApiTypeToArticleFormType = (
  article: DraftApiType | undefined,
  language: string,
  articleType: string,
  contentFunc: (html: string) => Descendant[],
): ArticleFormType => {
  return {
    agreementId: article?.copyright?.agreementId,
    articleType,
    content: contentFunc(article?.content?.content ?? ''),
    creators: article?.copyright?.creators ?? [],
    id: article?.id,
    introduction: plainTextToEditorValue(article?.introduction?.introduction ?? ''),
    language,
    license: article?.copyright?.license?.license ?? DEFAULT_LICENSE.license,
    metaDescription: plainTextToEditorValue(article?.metaDescription?.metaDescription ?? ''),
    metaImageAlt: article?.metaImage?.alt ?? '',
    metaImageId: parseImageUrl(article?.metaImage),
    notes: [],
    processors: article?.copyright?.processors ?? [],
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
  };
};

export const draftApiTypeToLearningResourceFormType = (
  article: DraftApiType | undefined,
  language: string,
): LearningResourceFormType => {
  return {
    ...draftApiTypeToArticleFormType(
      article,
      language,
      'standard',
      learningResourceContentToEditorValue,
    ),
    origin: article?.copyright?.origin,
  };
};

export const draftApiTypeToTopicArticleFormType = (
  article: DraftApiType | undefined,
  language: string,
): TopicArticleFormType => {
  return {
    ...draftApiTypeToArticleFormType(
      article,
      language,
      'topic-article',
      topicArticleContentToEditorValue,
    ),
    visualElement: embedTagToEditorValue(article?.visualElement?.visualElement ?? ''),
  };
};

export const learningResourceFormTypeToDraftApiType = (
  article: LearningResourceFormType,
  initialValues: LearningResourceFormType,
  licenses: DraftApiLicense[],
  preview = false,
): UpdatedDraftApiType => {
  const metaImage = article.metaImageId
    ? { id: article.metaImageId, alt: article.metaImageAlt ?? '' }
    : nullOrUndefined(article.metaImageId);
  return {
    revision: 0,
    articleType: 'standard',
    content: learningResourceContentToHTML(article.content),
    copyright: {
      license: licenses.find(lic => lic.license === article.license),
      origin: article.origin,
      creators: article.creators,
      processors: article.processors,
      rightsholders: article.rightsholders,
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
  };
};

export const topicArticleFormTypeToDraftApiType = (
  article: TopicArticleFormType,
  initialValues: TopicArticleFormType,
  licenses: DraftApiLicense[],
  preview = false,
): UpdatedDraftApiType => {
  const metaImage = article.metaImageId
    ? { id: article.metaImageId, alt: article.metaImageAlt ?? '' }
    : nullOrUndefined(article.metaImageId);

  const copyright = {
    license: licenses.find(l => l.license === article.license),
    creators: article.creators,
    processors: article.processors,
    rightsholders: article.rightsholders,
    agreementId: article.agreementId,
  };
  return {
    revision: article.revision ?? 0,
    language: article.language,
    title: editorValueToPlainText(article.title),
    published: getPublishedDate(article, initialValues, preview) ?? '',
    content: topicArticleContentToHTML(article.content),
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
  };
};

export const updatedDraftApiTypeToDraftApiType = (article: UpdatedDraftApiType): DraftApiType => {
  const language = article.language!;

  return {
    id: 0, // TODO: Check if we can pass id as prop to this function
    revision: article.revision,
    status: { current: article.status ?? DRAFT, other: [] },
    title: article.title ? { title: article.title, language } : undefined,
    content: article.content ? { content: article.content, language } : undefined,
    copyright: article.copyright,
    tags: article.tags ? { tags: article.tags, language } : undefined,
    requiredLibraries: article.requiredLibraries ?? [],
    visualElement: article.visualElement
      ? { visualElement: article.visualElement, language }
      : undefined,
    introduction: article.introduction
      ? { introduction: article.introduction, language }
      : undefined,
    metaDescription: article.metaDescription
      ? { metaDescription: article.metaDescription, language }
      : undefined,
    metaImage: article.metaImage ? { ...article.metaImage, language, url: '' } : undefined,
    created: '',
    updated: '',
    updatedBy: '',
    published: article.published ?? '',
    articleType: article.articleType ?? 'topic-article',
    supportedLanguages: [],
    notes: [],
    editorLabels: article.editorLabels ?? [],
    grepCodes: article.grepCodes ?? [],
    conceptIds: article.conceptIds ?? [],
    availability: article.availability ?? 'everyone',
    relatedContent: article.relatedContent ?? [],
  };
};
