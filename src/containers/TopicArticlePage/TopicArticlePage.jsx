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
import * as messageActions from '../Messages/messagesActions';
import { getLocale } from '../../modules/locale/locale';
import { fetchDraft } from '../../modules/draft/draftApi';
import EditTopicArticle from './EditTopicArticle';
import CreateTopicArticle from './CreateTopicArticle';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import { toEditArticle } from '../../util/routeHelpers';

class TopicArticlePage extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }
  componentDidMount() {
    const { fetchLicenses, licenses } = this.props;
    if (!licenses.length) {
      fetchLicenses();
    }
  }

  async getDraft(id) {
    const draft = await fetchDraft(id);
    this.setState({ draft });
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
          <Route
            path={`${match.url}/:articleId/edit`}
            render={routeProps => {
              this.getDraft(routeProps.match.params.articleId);
              const draft = this.state.draft;
              const language =
                draft &&
                draft.supportedLanguages.find(
                  lang => lang === this.props.locale,
                );
              draft &&
                history.push(
                  toEditArticle(
                    draft.id,
                    'topic-article',
                    language || draft.supportedLanguages[0],
                  ),
                );
            }}
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
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  fetchLicenses: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  applicationError: PropTypes.func.isRequired,
  userAccess: PropTypes.string,
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

export default connect(mapStateToProps, mapDispatchToProps)(TopicArticlePage);
