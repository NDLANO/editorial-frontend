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
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';
import { createQueryString } from './util/queryHelpers';

export function toSearch(queryString) {
  if (queryString) {
    return `/search?${createQueryString(queryString)}`;
  }
  return '/search';
}

export function toTopic(subjectId, ...topicIds) {
  if (topicIds.length === 0) {
    return toSubject(subjectId);
  }
  return `/subjects/${subjectId}/${topicIds.join('/')}`;
}

export const toTopicPartial = (subjectId, ...topicIds) => topicId => toTopic(subjectId, ...topicIds, topicId);

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
      <Route component={NotFoundPage} />
    </Switch>
  </App>
);
