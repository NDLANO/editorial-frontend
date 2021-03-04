/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useState, useEffect } from 'react';
import { RouteComponentProps, Route, Switch } from 'react-router-dom';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT, tType } from '@ndla/i18n';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { getAllLicenses } from '../../modules/license/license';
import { fetchLicenses } from '../../modules/draft/draftApi'; // TODO er dette rett lisenser?
import { License } from '../../interfaces';
import CreatePodcast from './CreatePodcast';

interface Props {
  match: RouteComponentProps['match'];
  location: RouteComponentProps['location'];
  history: RouteComponentProps['history'];
}

const PodcastUploderPage: FC<RouteComponentProps & Props & tType> = ({ match, history }) => {
  // TODO fetchLicenses()
  const [licenses, setLicenses] = useState<License[]>([]);

  useEffect(() => {
    getLicenses();
  }, []);

  const getLicenses = async () => {
    const license = await fetchLicenses();
    setLicenses(license);
  };

  console.log('podcast uploader page', licenses);

  return (
    <OneColumn>
      <HelmetWithTracker title="last opp podcast episode" />{' '}
      {/* TODO replace with translated text */}
      <Switch>
        <Route
          path={`${match.url}/new`}
          render={() => <CreatePodcast history={history} licenses={licenses} />}
        />
        {/* <Route
          path={`${match.url}/:audioId/edit/:audioLanguage`}
          render={props => ( <EditPodcast/> )}
        /> */}
        <Route component={NotFoundPage} />
      </Switch>
    </OneColumn>
  );
};

export default injectT(PodcastUploderPage);
