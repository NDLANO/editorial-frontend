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
import { OneColumn, Hero } from 'ndla-ui';

import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { getSaving } from '../../modules/draft/draft';
import { getLocale } from '../../modules/locale/locale';
import EditLearningResource from './EditLearningResource';
import CreateLearningResource from './CreateLearningResource';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

class LearningResourcePage extends Component {
  componentWillMount() {
    const { fetchLicenses } = this.props;
    fetchLicenses();
  }

  render() {
    const { locale, match, history, isSaving, licenses } = this.props;

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Hero>
          <OneColumn>
            <div className="c-hero__content" />
          </OneColumn>
        </Hero>
        <OneColumn cssModifier="narrow">
          <Switch>
            <Route
              path={`${match.url}/new`}
              render={() => (
                <CreateLearningResource
                  history={history}
                  locale={locale}
                  licenses={licenses}
                  isSaving={isSaving}
                />
              )}
            />
            <Route
              path={`${match.url}/:articleId/edit/:articleLanguage`}
              render={props => (
                <EditLearningResource
                  articleId={props.match.params.articleId}
                  articleLanguage={props.match.params.articleLanguage}
                  licenses={licenses}
                  locale={locale}
                  isSaving={isSaving}
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
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  fetchLicenses: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  licenses: getAllLicenses(state),
  isSaving: getSaving(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  LearningResourcePage,
);
