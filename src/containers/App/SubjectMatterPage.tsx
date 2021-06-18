/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import loadable from '@loadable/component';
import { LocationShape, HistoryShape } from '../../shapes';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));
const TopicArticlePage = loadable(() => import('../ArticlePage/TopicArticlePage/TopicArticlePage'));
const LearningResourcePage = loadable(() =>
  import('../ArticlePage/LearningResourcePage/LearningResourcePage'),
);
const Footer = loadable(() => import('./components/Footer'));

const SubjectMatterPage = ({ match }: RouteComponentProps) => (
  <Fragment>
    <Switch>
      <PrivateRoute path={`${match.url}/topic-article/`} component={TopicArticlePage} />
      <PrivateRoute path={`${match.url}/learning-resource`} component={LearningResourcePage} />
      <Route component={NotFoundPage} />
    </Switch>
    <Footer showLocaleSelector={false} />
  </Fragment>
);

SubjectMatterPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  location: LocationShape,
  history: HistoryShape,
};

export default withRouter(SubjectMatterPage);
