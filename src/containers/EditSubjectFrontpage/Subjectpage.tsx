/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Route, RouteComponentProps, Switch } from 'react-router';
import { OneColumn } from '@ndla/ui';
import loadable from '@loadable/component';

import { usePreviousLocation } from '../../util/routeHelpers';
import Footer from '../App/components/Footer';
const EditSubjectpage = loadable(() => import('./EditSubjectpage'));
const CreateSubjectpage = loadable(() => import('./CreateSubjectpage'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

interface Props extends RouteComponentProps {}

type NewRouteProps = RouteComponentProps<
  { elementId: string; selectedLanguage: string },
  {},
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
