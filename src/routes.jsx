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

import App from './containers/App/App';
import Login from './containers/Login/Login';
import Logout from './containers/Logout/Logout';
import PrivateRoute from './containers/PrivateRoute/PrivateRoute';
import WelcomePage from './containers/WelcomePage/WelcomePage';
import SearchPage from './containers/SearchPage/SearchPage';
import TopicArticlePage from './containers/TopicArticlePage/TopicArticlePage';
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
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <PrivateRoute path="/search" component={SearchPage} />
      <PrivateRoute path="/images/" component={ImageSearchPage} />
      <PrivateRoute path="/topic-article/" component={TopicArticlePage} />
      <Route component={NotFoundPage} />
    </Switch>
  </App>
);
