/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useEffect, useState } from 'react';
import { match, Route, RouteComponentProps, Switch } from 'react-router';
import { injectT } from '@ndla/i18n';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import EditSubjectpage from './EditSubjectpage';
import { TranslateType } from '../../interfaces';
import CreateSubjectpage from './CreateSubjectpage';
import Footer from '../App/components/Footer';

interface Props {
  t: TranslateType;
  match: match;
  location: RouteComponentProps['location'];
}

const Subjectpage: FC<Props> = ({ t, match, location }) => {
  const [previousLocation, setPreviousLocation] = useState('');
  const [isNewlyCreated, setNewlyCreated] = useState(false);

  useEffect(() => {
    /\/subjectpage\/(.*)\/new/.test(location.pathname)
      ? setNewlyCreated(true)
      : setNewlyCreated(false);
    if (previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
    }
  }, []);

  return (
    <div>
      <OneColumn>
        <Switch>
          <Route
            path={`${match.url}/:subjectId/:subjectpageId/edit/:selectedLanguage`}
            render={routeProps => {
              return (
                <EditSubjectpage
                  subjectId={routeProps.match.params.subjectId}
                  selectedLanguage={routeProps.match.params.selectedLanguage}
                  subjectpageId={routeProps.match.params.subjectpageId}
                  isNewlyCreated={isNewlyCreated}
                />
              );
            }}
          />
          <Route
            path={`${match.url}/:subjectId/new/:selectedLanguage`}
            render={routeProps => {
              const { subjectName } = routeProps.location.state;
              return (
                <CreateSubjectpage
                  subjectId={routeProps.match.params.subjectId}
                  selectedLanguage={routeProps.match.params.selectedLanguage}
                  subjectName={subjectName}
                  history={routeProps.history}
                />
              );
            }}
          />
        </Switch>
      </OneColumn>
      <Footer showLocaleSelector={false} />
    </div>
  );
};

export default injectT(Subjectpage);
