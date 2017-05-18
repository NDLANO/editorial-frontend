/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import queryString from 'query-string';

import WelcomePage from './containers/WelcomePage/WelcomePage';
import App from './containers/App/App';
import SearchPage from './containers/SearchPage/SearchPage';
import TopicArticlePage from './containers/TopicArticlePage/TopicArticlePage';
import SubjectsPage from './containers/SubjectsPage/SubjectsPage';
import SubjectPage from './containers/SubjectPage/SubjectPage';
import ImageSearchPage from './containers/ImageSearch/ImageSearchPage';
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';

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


class ScrollToTop extends React.Component {
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

export default (
  <App>
    <ScrollToTop />
    <Switch>
      <Route path="/" exact component={WelcomePage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/topic-article/" component={TopicArticlePage} />
      <Route path="/subjects/:subjectId" component={SubjectPage} />
      <Route path="/subjects/" component={SubjectsPage} />
      <Route path="/images/" component={ImageSearchPage} />
      <Route component={NotFoundPage} />
    </Switch>
  </App>
);
