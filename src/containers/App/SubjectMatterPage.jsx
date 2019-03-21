/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import TopicArticlePage from '../TopicArticlePage/TopicArticlePage';
import LearningResourcePage from '../LearningResourcePage/LearningResourcePage';
import Footer from './components/Footer';

const SubjectMatterPage = ({ match, t }) => (
  <>
    <Switch>
      <PrivateRoute
        path={`${match.url}/topic-article/`}
        component={TopicArticlePage}
      />
      <PrivateRoute
        path={`${match.url}/learning-resource`}
        component={LearningResourcePage}
      />
      <Route component={NotFoundPage} />
    </Switch>
    <Footer showLocaleSelector={false} />
  </>
);

SubjectMatterPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectT(withRouter(SubjectMatterPage));
