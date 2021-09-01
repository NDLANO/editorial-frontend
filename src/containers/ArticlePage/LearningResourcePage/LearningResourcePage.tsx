/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { OneColumn } from '@ndla/ui';
import { actions as licenseActions, getAllLicenses } from '../../../modules/license/license';
import EditResourceRedirect from './EditResourceRedirect';
import CreateLearningResource from './CreateLearningResource';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import * as messageActions from '../../Messages/messagesActions';
import { usePreviousLocation } from '../../../util/routeHelpers';
import { ReduxState } from '../../../interfaces';
import { NewReduxMessage } from '../../../containers/Messages/messagesSelectors';

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
  createMessage: (message: NewReduxMessage) => messageActions.addMessage(message),
  applicationError: messageActions.applicationError,
};

const mapStateToProps = (state: ReduxState) => ({
  licenses: getAllLicenses(state),
  userAccess: state.session.user.scope,
});

const reduxConnector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

interface BaseProps {}

interface ParamsType {
  articleId: string;
}

type Props = BaseProps & RouteComponentProps<ParamsType> & PropsFromRedux;

const LearningResourcePage = ({
  fetchLicenses,
  licenses,
  applicationError,
  createMessage,
  userAccess,
  match,
  history,
  location,
}: Props) => {
  const previousLocation = usePreviousLocation();
  useEffect(() => {
    if (!licenses.length) {
      fetchLicenses();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <OneColumn>
        <Switch>
          <Route
            path={`${match.url}/new`}
            render={routeProps => (
              <CreateLearningResource
                {...routeProps}
                applicationError={applicationError}
                licenses={licenses}
                createMessage={createMessage}
                userAccess={userAccess}
              />
            )}
          />
          <Route path={`${match.url}/:articleId/edit/`}>
            {(params: RouteComponentProps<ParamsType>) => {
              return (
                <EditResourceRedirect
                  match={params.match}
                  history={history}
                  location={location}
                  isNewlyCreated={previousLocation === '/subject-matter/learning-resource/new'}
                  applicationError={applicationError}
                  licenses={licenses}
                  createMessage={createMessage}
                  userAccess={userAccess}
                />
              );
            }}
          </Route>

          <Route component={NotFoundPage} />
        </Switch>
      </OneColumn>
    </div>
  );
};

export default reduxConnector(LearningResourcePage);
