import queryString from 'query-string';

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
export function toCreateLearningResource() {
  return '/subject-matter/learning-resource/new';
}

export function toCreateTopicArticle() {
  return '/subject-matter/topic-article/new';
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

export function to404() {
  return '/404';
}

export function getResourceIdFromPath(path) {
  if (typeof path !== 'string') return undefined;
  let lastPath = path;
  if (path[path.length - 1] === '/') lastPath = path.slice(0, -1);
  lastPath = lastPath.split('/').pop();
  if (!lastPath) return undefined;
  const id = lastPath.startsWith('resource') ? `urn:${lastPath}` : lastPath;
  return id.includes('resource') ? id : '';
}
