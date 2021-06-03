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
import { actions as licenseActions, getAllLicenses } from '../../../modules/license/license';
import EditResourceRedirect from './EditResourceRedirect';
import CreateLearningResource from './CreateLearningResource';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import { LicensesArrayOf } from '../../../shapes';
import * as messageActions from '../../Messages/messagesActions';
import { LocationShape } from '../../../shapes';
import { usePreviousLocation } from '../../../util/routeHelpers';

const LearningResourcePage = ({
  fetchLicenses,
  licenses,
  applicationError,
  createMessage,
  userAccess,
  match,
  history,
}) => {
  const previousLocation = usePreviousLocation();
  useEffect(() => {
    if (!licenses.length) {
      fetchLicenses();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resourceFormProps = { applicationError, licenses, createMessage, userAccess };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <OneColumn>
        <Switch>
          <Route
            path={`${match.url}/new`}
            render={() => <CreateLearningResource history={history} {...resourceFormProps} />}
          />
          <Route path={`${match.url}/:articleId/edit/`}>
            {params => (
              <EditResourceRedirect
                match={params.match}
                isNewlyCreated={previousLocation === '/subject-matter/learning-resource/new'}
                {...resourceFormProps}
              />
            )}
          </Route>

          <Route component={NotFoundPage} />
        </Switch>
      </OneColumn>
    </div>
  );
};

LearningResourcePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      articleId: PropTypes.string,
      selectedLanguage: PropTypes.string,
    }),
    url: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  licenses: LicensesArrayOf,
  fetchLicenses: PropTypes.func.isRequired,
  userAccess: PropTypes.string,
  createMessage: PropTypes.func.isRequired,
  applicationError: PropTypes.func.isRequired,
  location: LocationShape,
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

export default connect(mapStateToProps, mapDispatchToProps)(LearningResourcePage);
