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
import {
  fetchResourceTypes,
  fetchFilters,
  fetchTopics,
} from '../../modules/taxonomy';
import { getSaving } from '../../modules/draft/draft';
import { getLocale } from '../../modules/locale/locale';
import EditLearningResource from './EditLearningResource';
import CreateLearningResource from './CreateLearningResource';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

class LearningResourcePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taxonomy: {
        resourceTypes: [],
        filters: [],
        topics: [],
      },
    };
  }

  async componentWillMount() {
    const { fetchLicenses, locale } = this.props;
    fetchLicenses();

    try {
      const resourceTypes = await fetchResourceTypes(locale);
      const filters = await fetchFilters(locale);
      const topics = await fetchTopics(locale);
      this.setState({ taxonomy: { resourceTypes, filters, topics } });
    } catch (e) {
      throw new Error(e);
    }
  }

  render() {
    const { taxonomy } = this.state;
    const { locale, match, history, isSaving, licenses } = this.props;

    const defaultResourceProps = {
      locale,
      isSaving,
      licenses,
      taxonomy,
    };

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
                  {...defaultResourceProps}
                  history={history}
                />
              )}
            />
            <Route
              path={`${match.url}/:articleId/edit/:articleLanguage`}
              render={props => (
                <EditLearningResource
                  {...defaultResourceProps}
                  articleId={props.match.params.articleId}
                  articleLanguage={props.match.params.articleLanguage}
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
