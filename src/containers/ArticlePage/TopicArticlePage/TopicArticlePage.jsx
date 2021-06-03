/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { OneColumn } from '@ndla/ui';
import * as messageActions from '../../Messages/messagesActions';
import EditArticleRedirect from './EditArticleRedirect';
import CreateTopicArticle from './CreateTopicArticle';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import { actions as licenseActions, getAllLicenses } from '../../../modules/license/license';
import { usePreviousLocation } from '../../../util/routeHelpers';

const TopicArticlePage = ({
  match,
  history,
  licenses,
  fetchLicenses,
  applicationError,
  createMessage,
  userAccess,
}) => {
  const previousLocation = usePreviousLocation();

  useEffect(() => {
    if (!licenses.length) {
      fetchLicenses();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const articleFormProps = { applicationError, licenses, createMessage, userAccess };

  return (
    <OneColumn>
      <Switch>
        <Route
          path={`${match.url}/new`}
          render={() => <CreateTopicArticle history={history} {...articleFormProps} />}
        />
        <Route path={`${match.url}/:articleId/edit/`}>
          {params => (
            <EditArticleRedirect
              match={params.match}
              isNewlyCreated={previousLocation === '/subject-matter/topic-article/new'}
              {...articleFormProps}
            />
          )}
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
    </OneColumn>
  );
};

TopicArticlePage.propTypes = {
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
  licenses: getAllLicenses(state),
  userAccess: state.session.user.scope,
});

export default connect(mapStateToProps, mapDispatchToProps)(TopicArticlePage);
