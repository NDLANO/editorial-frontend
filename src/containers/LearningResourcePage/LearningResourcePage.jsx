/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { OneColumn } from 'ndla-ui';

import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { getSaving } from '../../modules/draft/draft';
import { getLocale } from '../../modules/locale/locale';
import { getShowSaved } from '../Messages/messagesSelectors';
import EditLearningResource from './EditLearningResource';
import CreateLearningResource from './CreateLearningResource';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { LicensesArrayOf } from '../../shapes';

class LearningResourcePage extends Component {
  componentWillMount() {
    const { fetchLicenses } = this.props;
    fetchLicenses();
  }

  render() {
    const { match, history, ...rest } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <OneColumn>
          <Switch>
            <Route
              path={`${match.url}/new`}
              render={() => (
                <CreateLearningResource history={history} {...rest} />
              )}
            />
            <Route
              path={`${match.url}/:articleId/edit/:selectedLanguage`}
              render={props => (
                <EditLearningResource
                  articleId={props.match.params.articleId}
                  selectedLanguage={props.match.params.selectedLanguage}
                  {...rest}
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

LearningResourcePage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  licenses: LicensesArrayOf,
  fetchLicenses: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  showSaved: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  licenses: getAllLicenses(state),
  isSaving: getSaving(state),
  showSaved: getShowSaved(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LearningResourcePage);
