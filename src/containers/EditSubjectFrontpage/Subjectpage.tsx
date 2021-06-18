/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { Route, RouteComponentProps, StaticContext, Switch } from 'react-router';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import loadable from '@loadable/component';

import { usePreviousLocation } from '../../util/routeHelpers';
const EditSubjectpage = loadable(() => import('./EditSubjectpage'));
const CreateSubjectpage = loadable(() => import('./CreateSubjectpage'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));
const Footer = loadable(() => import('../App/components/Footer'));

interface Props extends RouteComponentProps {}

type NewRouteProps = RouteComponentProps<
  { elementId: string; selectedLanguage: string },
  StaticContext,
  { elementName: string }
>;

type EditRouteProps = RouteComponentProps<{
  elementId: string;
  selectedLanguage: string;
  subjectpageId: string;
}>;

const Subjectpage = ({ match }: Props) => {
  const previousLocation = usePreviousLocation();

  return (
    <>
      <OneColumn>
        <Switch>
          <Route
            path={`${match.url}/:elementId/:subjectpageId/edit/:selectedLanguage`}
            render={rp => {
              const routeProps = rp as EditRouteProps; // Dirty assertion since react-router types are lacking for <Route>
              return (
                <EditSubjectpage
                  elementId={routeProps.match.params.elementId}
                  selectedLanguage={routeProps.match.params.selectedLanguage}
                  subjectpageId={routeProps.match.params.subjectpageId}
                  isNewlyCreated={/\/subjectpage\/(.*)\/new/.test(previousLocation ?? '')}
                />
              );
            }}
          />
          <Route
            path={`${match.url}/:elementId/new/:selectedLanguage`}
            render={rp => {
              const routeProps = rp as NewRouteProps; // Dirty assertion since react-router types are lacking for <Route>

              const elementName =
                routeProps.location.state && routeProps.location.state.elementName;

              return (
                <CreateSubjectpage
                  elementId={routeProps.match.params.elementId}
                  selectedLanguage={routeProps.match.params.selectedLanguage}
                  elementName={elementName}
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
