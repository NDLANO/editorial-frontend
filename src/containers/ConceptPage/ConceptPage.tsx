/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import loadable from '@loadable/component';
import { actions as licenseActions, getAllLicenses } from '../../modules/license/license';
import * as messageActions from '../Messages/messagesActions';
import { getLocale } from '../../modules/locale/locale';
import Footer from '../App/components/Footer';
import { ReduxState } from '../../interfaces';
const CreateConcept = loadable(() => import('./CreateConcept'));
const EditConcept = loadable(() => import('./EditConcept'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

interface BaseProps {}

type Props = BaseProps & RouteComponentProps & PropsFromRedux;

const ConceptPage = (props: Props) => {
  const [previousLocation, setPreviousLocation] = useState('');
  const prevProps = useRef<Props | undefined>(undefined);

  const { licenses, fetchLicenses, match, location, ...rest } = props;

  useEffect(() => {
    if (!licenses.length) {
      fetchLicenses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (prevProps.current && location.pathname !== prevProps.current.location.pathname) {
      setPreviousLocation(prevProps.current.location.pathname);
    }
    prevProps.current = props;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <OneColumn>
        <Switch>
          <Route
            path={`${match.url}/new`}
            render={() => <CreateConcept licenses={licenses} {...rest} />}
          />
          <Route
            path={`${match.url}/:conceptId/edit/:selectedLanguage`}
            render={routeProps => (
              <EditConcept
                licenses={licenses}
                conceptId={routeProps.match.params.conceptId}
                selectedLanguage={routeProps.match.params.selectedLanguage}
                isNewlyCreated={previousLocation === '/concept/new'}
                {...rest}
              />
            )}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </OneColumn>
      <Footer showLocaleSelector={false} />
    </div>
  );
};

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
  applicationError: messageActions.applicationError,
};

const mapStateToProps = (state: ReduxState) => ({
  locale: getLocale(state),
  licenses: getAllLicenses(state),
});

const reduxConnector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

export default memo(connect(mapStateToProps, mapDispatchToProps)(ConceptPage));
