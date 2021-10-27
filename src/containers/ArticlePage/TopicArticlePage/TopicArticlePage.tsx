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
import EditArticleRedirect from './EditArticleRedirect';
import CreateTopicArticle from './CreateTopicArticle';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import { actions as licenseActions, getAllLicenses } from '../../../modules/license/license';
import { usePreviousLocation } from '../../../util/routeHelpers';
import { ReduxState } from '../../../interfaces';

interface Props extends RouteComponentProps<{ articleId: string }> {}

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
};

const mapStateToProps = (state: ReduxState) => ({
  licenses: getAllLicenses(state),
});

const reduxConnector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

const TopicArticlePage = ({ match, licenses, fetchLicenses }: Props & PropsFromRedux) => {
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
          render={() => <CreateTopicArticle licenses={licenses} />}
        />
        <Route path={`${match.url}/:articleId/edit/`}>
          <EditArticleRedirect
            isNewlyCreated={previousLocation === '/subject-matter/topic-article/new'}
            licenses={licenses}
          />
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
    </OneColumn>
  );
};

export default reduxConnector(withRouter(TopicArticlePage));
