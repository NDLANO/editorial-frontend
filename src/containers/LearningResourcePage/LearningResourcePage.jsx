/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { OneColumn } from '@ndla/ui';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { getLocale } from '../../modules/locale/locale';
import { fetchDraft } from '../../modules/draft/draftApi';
import EditLearningResource from './EditLearningResource';
import CreateLearningResource from './CreateLearningResource';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { LicensesArrayOf } from '../../shapes';
import * as messageActions from '../Messages/messagesActions';
import { toEditArticle } from '../../util/routeHelpers';

class LearningResourcePage extends PureComponent {
  constructor(props) {
    super();
    this.state = {};
  }
  componentDidMount() {
    const { fetchLicenses, licenses } = this.props;
    if (!licenses.length) {
      fetchLicenses();
    }
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  componentDidUpdate() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  async getDraft(id) {
    const draft = await fetchDraft(id);
    this.setState({ draft });
  }

  render() {
    const { match, history, locale, ...rest } = this.props;
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
            <Route
              path={`${match.url}/:articleId/edit`}
              render={props => {
                this.getDraft(props.match.params.articleId);
                const draft = this.state.draft;
                const language =
                  draft &&
                  draft.supportedLanguages.find(lang => lang === locale);
                draft &&
                  history.push(
                    toEditArticle(
                      draft.id,
                      'standard',
                      language || draft.supportedLanguages[0],
                    ),
                  );
              }}
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
  userAccess: PropTypes.string,
  createMessage: PropTypes.func.isRequired,
  applicationError: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
  createMessage: (message = {}) => messageActions.addMessage(message),
  applicationError: messageActions.applicationError,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  licenses: getAllLicenses(state),
  userAccess: state.session.user.scope,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LearningResourcePage);
