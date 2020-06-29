/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import {match, Route, Switch} from 'react-router';
import { injectT } from '@ndla/i18n';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import EditSubjectpage from './EditSubjectpage';
import { TranslateType } from '../../interfaces';
import CreateSubjectpage from './CreateSubjectpage';

interface Props {
  t: TranslateType;
  match: match;
}

const Subjectpage: FC<Props> = ({ t, match }) => {
  return (
      <OneColumn>
      <Switch>
    <Route
      path={`${match.url}/:subjectId/edit/:selectedLanguage`}
      render={routeProps => (
        <EditSubjectpage
          subjectId={routeProps.match.params.subjectId}
          selectedLanguage={routeProps.match.params.selectedLanguage}
        />
      )}
    />
          <Route
              path={`${match.url}/new`}
              render={routeProps => (
                  <CreateSubjectpage
                      subjectId={routeProps.match.params.subjectId}
                      selectedLanguage={routeProps.match.params.selectedLanguage}
                  />
              )}
          />

      </Switch>
      </OneColumn>
  );
};

export default injectT(Subjectpage);
