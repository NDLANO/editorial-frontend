/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect, useState } from 'react';
import { Route, RouteComponentProps, Switch, useLocation } from 'react-router';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import EditSubjectpage from './EditSubjectpage';
import CreateSubjectpage from './CreateSubjectpage';
import Footer from '../App/components/Footer';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

interface LocationState {
  elementName: string;
}

interface MatchParams {
  elementId: string;
  selectedLanguage: string;
  subjectpageId: string;
}
interface Props extends RouteComponentProps<MatchParams, any, LocationState> {}

const Subjectpage = ({ match }: Props) => {
  const [previousLocation, setPreviousLocation] = useState('');
  const [isNewlyCreated, setNewlyCreated] = useState(false);

  const location = useLocation<LocationState>();

  useEffect(() => {
    /\/subjectpage\/(.*)\/new/.test(location.pathname)
      ? setNewlyCreated(true)
      : setNewlyCreated(false);
    if (previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <OneColumn>
        <Switch>
          <Route
            path={`${match.url}/:elementId/:subjectpageId/edit/:selectedLanguage`}
            render={routeProps => {
              return (
                <EditSubjectpage
                  elementId={routeProps.match.params.elementId}
                  selectedLanguage={routeProps.match.params.selectedLanguage}
                  subjectpageId={routeProps.match.params.subjectpageId}
                  isNewlyCreated={isNewlyCreated}
                />
              );
            }}
          />
          <Route
            path={`${match.url}/:elementId/new/:selectedLanguage`}
            render={routeProps => {
              const elementName = location.state && location.state.elementName;

              return (
                <CreateSubjectpage
                  elementId={routeProps.match.params.elementId}
                  selectedLanguage={routeProps.match.params.selectedLanguage}
                  elementName={elementName}
                  // @ts-ignore
                  history={routeProps.history}
                />
              );
            }}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </OneColumn>
      <Footer showLocaleSelector={false} />
    </>
  );
};

export default Subjectpage;
