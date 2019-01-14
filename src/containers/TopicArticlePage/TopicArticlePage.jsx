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
import { OneColumn } from '@ndla/ui';

import { getSaving } from '../../modules/draft/draft';
import { getLocale } from '../../modules/locale/locale';
import { getShowSaved } from '../Messages/messagesSelectors';
import EditTopicArticle from './EditTopicArticle';
import CreateTopicArticle from './CreateTopicArticle';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';

class TopicArticlePage extends React.Component {
  UNSAFE_componentWillMount() {
    const { fetchLicenses } = this.props;
    fetchLicenses();
  }

  render() {
    const { match, history, ...rest } = this.props;
    return (
      <OneColumn>
        <Switch>
          <Route
            path={`${match.url}/new`}
            render={() => <CreateTopicArticle history={history} {...rest} />}
          />
          <Route
            path={`${match.url}/:articleId/edit/:selectedLanguage`}
            render={routeProps => (
              <EditTopicArticle
                articleId={routeProps.match.params.articleId}
                selectedLanguage={routeProps.match.params.selectedLanguage}
                {...rest}
              />
            )}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </OneColumn>
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
  showSaved: getShowSaved(state),
  licenses: getAllLicenses(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopicArticlePage);
