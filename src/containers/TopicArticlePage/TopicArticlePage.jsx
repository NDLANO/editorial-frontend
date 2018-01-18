/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { OneColumn, Hero } from 'ndla-ui';

import { getSaving } from '../../modules/draft/draft';
import { getLocale } from '../../modules/locale/locale';
import EditTopicArticle from './EditTopicArticle';
import CreateTopicArticle from './CreateTopicArticle';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';

class TopicArticlePage extends React.Component {
  componentWillMount() {
    const { fetchLicenses } = this.props;
    fetchLicenses();
  }

  render() {
    const { locale, match, history, isSaving, licenses } = this.props;
    return (
      <div>
        <Hero alt />
        <OneColumn>
          <Switch>
            <Route
              path={`${match.url}/new`}
              render={() => (
                <CreateTopicArticle
                  history={history}
                  locale={locale}
                  isSaving={isSaving}
                  licenses={licenses}
                />
              )}
            />
            <Route
              path={`${match.url}/:articleId/edit/:articleLanguage`}
              render={routeProps => (
                <EditTopicArticle
                  articleId={routeProps.match.params.articleId}
                  articleLanguage={routeProps.match.params.articleLanguage}
                  locale={locale}
                  isSaving={isSaving}
                  licenses={licenses}
                />
              )}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </OneColumn>
      </div>
    );
  }
}
TopicArticlePage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  fetchLicenses: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  isSaving: getSaving(state),
  licenses: getAllLicenses(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopicArticlePage);
