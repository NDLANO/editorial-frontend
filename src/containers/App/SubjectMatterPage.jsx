/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { injectT } from 'ndla-i18n';
import { TopicArticle, LearningResource, Concept } from 'ndla-icons/editor';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import TopicArticlePage from '../TopicArticlePage/TopicArticlePage';
import LearningResourcePage from '../LearningResourcePage/LearningResourcePage';
import SubNavigation from '../Masthead/components/SubNavigation';

const DEFAULT_TYPE = 'learning-resource';

class SubjectMatterPage extends React.Component {
  constructor() {
    super();
    this.state = {
      type: DEFAULT_TYPE,
    };
  }
  componentWillMount() {
    const { location: { pathname } } = this.props;
    const splittedPathname = pathname.split('/');
    const type =
      splittedPathname.length > 3 ? splittedPathname[2] : DEFAULT_TYPE;
    this.setState({ type });
  }

  componentWillReceiveProps(nextProps) {
    const { location: { pathname } } = nextProps;
    const splittedPathname = this.props.location.pathname.split('/');
    const type =
      splittedPathname.length > 3 ? splittedPathname[2] : DEFAULT_TYPE;

    const nextSplittedPathname = pathname.split('/');
    const nextType =
      nextSplittedPathname.length > 3 ? nextSplittedPathname[2] : DEFAULT_TYPE;
    if (type !== nextType) {
      this.setState({ type: nextType });
    }
  }

  render() {
    const { match, t } = this.props;
    const supportedTypes = [
      {
        title: t('typeMasthead.learningResource'),
        type: 'learning-resource',
        url: '/subject-matter/learning-resource/new',
        icon: <LearningResource className="c-icon--large" />,
      },
      {
        title: t('typeMasthead.topicArticle'),
        type: 'topic-article',
        url: '/subject-matter/topic-article/new',
        icon: <TopicArticle className="c-icon--large" />,
      },
      {
        title: t('typeMasthead.concept'),
        type: 'concept',
        url: '#',
        icon: <Concept className="c-icon--large" />,
      },
    ];

    return (
      <div>
        <SubNavigation
          type="subject-matter"
          subtypes={supportedTypes}
          activeSubtype={this.state.type}
        />
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
      </div>
    );
  }
}

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
