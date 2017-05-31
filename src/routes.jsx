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
import LogoutSession from './containers/Logout/LogoutSession';
import LoginProviders from './containers/Login/LoginProviders';
import LogoutFederated from './containers/Logout/LogoutFederated';
import LogoutProviders from './containers/Logout/LogoutProviders';
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
  return '/logoutSession';
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
      <Route path="/login" component={LoginProviders} />
      <Route path="/logout" component={LogoutProviders} />
      <Route path="/logoutSession" component={LogoutSession} />
      <Route path="/logoutFederated" component={LogoutFederated} />
      <PrivateRoute path="/search" component={SearchPage} />
      <PrivateRoute path="/images/" component={ImageSearchPage} />
      <PrivateRoute path="/topic-article/" component={TopicArticlePage} />
      <Route component={NotFoundPage} />
    </Switch>
  </App>
);
