import isString from 'lodash/isString';
import { Article, PreviewTypes } from './../SlateEditor/editorTypes';
import {
  transformArticle,
  transformArticleToApiVersion,
} from '../../util/articleUtil';
import * as articleApi from '../../modules/article/articleApi';
import * as draftApi from '../../modules/draft/draftApi';

// Transform article if title is a string. If not it's probably an api compatible article
function toApiVersion(article: Article) {
  return isString(article.title)
    ? transformArticleToApiVersion(article)
    : article;
}

const previewProductionArticle = async (article: Article) => {
  const { id, language } = article;
  const convertedArticle = await articleApi.getArticleFromArticleConverter(
    id,
    language,
  );
  return transformArticle(convertedArticle);
};

const previewLanguageArticle = async (
  originalArticle: Article,
  language?: string,
) => {
  const draftOtherLanguage = await draftApi.fetchDraft(
    originalArticle.id,
    language,
  );
  const article = await articleApi.getPreviewArticle(
    draftOtherLanguage,
    language,
  );
  return transformArticle(article);
};

export const fetchPreviews = async (
  typeOfPreview: PreviewTypes,
  article: Article,
  setState: any,
  secondArticleLanguage?: string,
) => {
  setState({ loading: true });
  const originalArticle = toApiVersion(article);
  const types = {
    previewProductionArticle: () => previewProductionArticle(article),
    previewLanguageArticle: () =>
      previewLanguageArticle(originalArticle, secondArticleLanguage),
    preview: () => undefined,
    '': () => undefined,
  };
  const firstArticle = await articleApi.getPreviewArticle(
    originalArticle,
    originalArticle.language,
  );

  const secondArticle = await types[typeOfPreview]();

  setState({
    loading: false,
    firstArticle: transformArticle(firstArticle),
    secondArticle,
    previewLanguage: secondArticleLanguage,
  });
};
