/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import TopicArticlePage from '../TopicArticlePage/TopicArticlePage';
import LearningResourcePage from '../LearningResourcePage/LearningResourcePage';
import Footer from './components/Footer';
import { LocationShape, HistoryShape } from '../../shapes';

const SubjectMatterPage: FC<RouteComponentProps> = ({ match }) => (
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
