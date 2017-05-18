/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import WelcomePage from './containers/WelcomePage/WelcomePage';
import App from './containers/App/App';
import SearchPage from './containers/SearchPage/SearchPage';
import TopicArticlePage from './containers/TopicArticlePage/TopicArticlePage';
import SubjectsPage from './containers/SubjectsPage/SubjectsPage';
import SubjectPage from './containers/SubjectPage/SubjectPage';
import ImageSearchPage from './containers/ImageSearch/ImageSearchPage';
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';
import { createQueryString } from './util/queryHelpers';

export function toSearch(queryString) {
  if (queryString) {
    return `/search?${createQueryString(queryString)}`;
  }
  return '/search';
}

export function toTopicArticle(articleId) {
  return `/topic-article/${articleId}`;
}

export function toLogin() {
  return '/login';
}

export function toLogout() {
  return '/logoutProviders';
}

export default (
  <App>
    <ScrollToTop />
    <Switch>
      <Route path="/" exact component={WelcomePage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/topic-article/:articleId" component={TopicArticlePage} />
      <Route path="/subjects/:subjectId" component={SubjectPage} />
      <Route path="/subjects/" component={SubjectsPage} />
      <Route path="/images/" component={ImageSearchPage} />
      <Route component={NotFoundPage} />
    </Switch>
  </App>
);
