import queryString from 'query-string';

const articleTypes = {
  'topic-article': 'topic-article',
  standard: 'learning-resource',
};

export function toSearch(query) {
  if (query) {
    return `/search?${queryString.stringify(query)}`;
  }
  return '/search';
}

export function toEditArticle(articleId, articleType, locale) {
  return `/${articleTypes[articleType]}/${articleId}/edit/${locale}`;
}
export function toCreateLearningResource() {
  return `/learning-resource/new`;
}

export function toCreateTopicArticle() {
  return '/topic-article/new';
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
  return '/audio-upload/new';
}

export function toEditAudio(audioId) {
  return `/audio-upload/${audioId}/edit`;
}

export function toCreateImage() {
  return '/image-upload/new';
}

export function toEditImage(imageId) {
  return `/image-upload/${imageId}/edit`;
}

export function to404() {
  return '/404';
}
