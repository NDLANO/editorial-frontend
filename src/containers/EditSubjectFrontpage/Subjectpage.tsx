/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect, useState } from 'react';
import { match, Route, RouteComponentProps, Switch } from 'react-router';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import EditSubjectpage from './EditSubjectpage';
import CreateSubjectpage from './CreateSubjectpage';
import Footer from '../App/components/Footer';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

interface Props {
  match: match;
  location: RouteComponentProps['location'];
}

const Subjectpage = ({ match, location }: Props) => {
  const [previousLocation, setPreviousLocation] = useState('');
  const [isNewlyCreated, setNewlyCreated] = useState(false);

  useEffect(() => {
    /\/subjectpage\/(.*)\/new/.test(location.pathname)
      ? setNewlyCreated(true)
      : setNewlyCreated(false);
    if (previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
    }
  }, [location.pathname, previousLocation]);

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
              const elementName =
                routeProps.location.state && routeProps.location.state.elementName;

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
