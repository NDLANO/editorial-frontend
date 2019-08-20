import queryString from 'query-string';
import config from '../config';

const articleTypes = {
  'topic-article': 'topic-article',
  standard: 'learning-resource',
};

export function toSearch(query, type = 'content') {
  if (query) {
    return `/search/${type}?${queryString.stringify(query)}`;
  }
  return `/search/${type}`;
}

export function toEditArticle(articleId, articleType, locale) {
  const url = articleTypes[articleType] || articleTypes.standard;
  return `/subject-matter/${url}/${articleId}/edit/${locale}`;
}

export function toEditConcept(conceptId, locale) {
  return `/concept/${conceptId}/edit/${locale}`;
}

export function toEditMarkup(id, language) {
  return `/edit-markup/${id}/${language}`;
}

export function toCreateLearningResource() {
  return '/subject-matter/learning-resource/new';
}

export function toCreateTopicArticle() {
  return '/subject-matter/topic-article/new';
}

export function toCreateConcept() {
  return '/concept/new';
}

export function toLogin() {
  return '/login';
}

export function toLogout() {
  return '/logout';
}

export function toLogoutSession() {
  return '/logout/session';
}

export function toLogoutFederated() {
  return '/logout/federated';
}

export function toCreateAudioFile() {
  return '/media/audio-upload/new';
}

export function toEditAudio(audioId, language) {
  return `/media/audio-upload/${audioId}/edit/${language}`;
}

export function toCreateImage() {
  return '/media/image-upload/new';
}

export function toEditImage(imageId, language) {
  return `/media/image-upload/${imageId}/edit/${language}`;
}

export function toCreateAgreement() {
  return '/agreement/new';
}

export function toEditAgreement(agreementId) {
  return `/agreement/${agreementId}/edit`;
}

export function toPreviewDraft(draftId, language) {
  return `/preview/${draftId}/${language}`;
}

export function to404() {
  return '/404';
}

export function getResourceIdFromPath(path) {
  if (typeof path !== 'string') return undefined;
  const learningPath = path.match(/learningpaths\/(\d+)/);
  if (learningPath && learningPath[1]) return learningPath[1];
  const resource = path.match(/(resource:[:\d]+)\/?$/);
  return resource ? `urn:${resource[1]}` : '';
}

export const removeLastItemFromUrl = url =>
  url
    .split('/')
    .splice(0, url.split('/').length - 1)
    .join('/');

export const getPathsFromUrl = url =>
  url
    .split('/')
    .filter(item => item.includes('urn:'))
    .reduce(
      (acc, curr) => [
        ...acc,
        acc
          .slice(-1)
          .concat(curr)
          .join('/'),
      ],
      [],
    );

export const toConcept = ({ id, accessToken, name, create }) => {
  const baseUrl = config.explanationFrontendDomain;
  if (id) {
    return `${baseUrl}/embedded/concept/${id}/edit?accessToken=${accessToken}`;
  }
  if (create) {
    return `${baseUrl}/embedded/concept/new?accessToken=${accessToken}&title=${name}`;
  }
  return `${baseUrl}/embedded?accessToken=${accessToken}&term=${name}`;
};
