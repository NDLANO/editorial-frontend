import queryString from 'query-string';

export function toSearch(query) {
  if (query) {
    return `/search?${queryString.stringify(query)}`;
  }
  return '/search';
}

export function toEditTopicArticle(articleId) {
  return `/topic-article/${articleId}/edit`;
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
