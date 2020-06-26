/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import { match, Route } from 'react-router';
import { injectT } from '@ndla/i18n';
import EditSubjectFrontpage from './EditSubjectFrontpage';
import { TranslateType } from '../../interfaces';

interface Props {
  t: TranslateType;
  match: match;
}

const SubjectFrontpageEditor: FC<Props> = ({ t, match }) => {
  return (
    <Route
      path={`${match.url}/:subjectId/edit/:selectedLanguage`}
      render={routeProps => (
        <EditSubjectFrontpage
          subjectId={routeProps.match.params.subjectId}
          selectedLanguage={routeProps.match.params.selectedLanguage}
        />
      )}
    />
  );
};

export default injectT(SubjectFrontpageEditor);
