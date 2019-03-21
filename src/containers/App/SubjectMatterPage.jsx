/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import { colors } from '@ndla/core';
import { TopicArticle, LearningResource, Concept } from '@ndla/icons/editor';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import TopicArticlePage from '../TopicArticlePage/TopicArticlePage';
import LearningResourcePage from '../LearningResourcePage/LearningResourcePage';
import SubNavigation from '../Masthead/components/SubNavigation';
import Footer from './components/Footer';

const StyledSubjectMatterPage = styled('div')`
  background-color: ${colors.brand.greyLightest};
`;

const SubjectMatterPage = ({ match, t }) => {
  const supportedTypes = [
    {
      title: t('subNavigation.learningResource'),
      type: 'learning-resource',
      url: '/subject-matter/learning-resource/new',
      icon: <LearningResource className="c-icon--large" />,
    },
    {
      title: t('subNavigation.topicArticle'),
      type: 'topic-article',
      url: '/subject-matter/topic-article/new',
      icon: <TopicArticle className="c-icon--large" />,
    },
    {
      title: t('subNavigation.concept'),
      type: 'concept',
      url: '#',
      icon: <Concept className="c-icon--large" />,
    },
  ];

  return (
    <Fragment>
      <StyledSubjectMatterPage>
        <SubNavigation type="subject-matter" subtypes={supportedTypes} />
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
      </StyledSubjectMatterPage>
      <Footer showLocaleSelector={false} />
    </Fragment>
  );
};

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
