/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { OneColumn } from '@ndla/ui';
import { RouteComponentProps } from 'react-router-dom';
import * as messageActions from '../../Messages/messagesActions';
import EditArticleRedirect from './EditArticleRedirect';
import CreateTopicArticle from './CreateTopicArticle';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import { actions as licenseActions, getAllLicenses } from '../../../modules/license/license';
import { usePreviousLocation } from '../../../util/routeHelpers';
import { ReduxState } from '../../../interfaces';

interface Props extends RouteComponentProps<{ articleId: string }> {}

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
  createMessage: (message = {}) => messageActions.addMessage(message),
  applicationError: messageActions.applicationError,
};

const mapStateToProps = (state: ReduxState) => ({
  licenses: getAllLicenses(state),
});

const reduxConnector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

const TopicArticlePage = ({
  match,
  licenses,
  fetchLicenses,
  applicationError,
  createMessage,
}: Props & PropsFromRedux) => {
  const previousLocation = usePreviousLocation();

  useEffect(() => {
    if (!licenses.length) {
      fetchLicenses();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <OneColumn>
      <Switch>
        <Route
          path={`${match.url}/new`}
          render={() => (
            <CreateTopicArticle
              applicationError={applicationError}
              licenses={licenses}
              createMessage={createMessage}
            />
          )}
        />
        <Route path={`${match.url}/:articleId/edit/`}>
          <EditArticleRedirect
            isNewlyCreated={previousLocation === '/subject-matter/topic-article/new'}
            applicationError={applicationError}
            licenses={licenses}
            createMessage={createMessage}
          />
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
    </OneColumn>
  );
};

export default reduxConnector(withRouter(TopicArticlePage));
