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
import { fetchLicenses } from '../../modules/draft/draftApi'; // TODO er dette rett lisenser?
import { License } from '../../interfaces';
import CreatePodcast from './CreatePodcast';
import EditPodcast from './EditPodcast';

interface Props {
  match: RouteComponentProps['match'];
  history: RouteComponentProps['history'];
  location: RouteComponentProps['location'];
}

const PodcastUploderPage: FC<RouteComponentProps & Props & tType> = ({
  match,
  history,
  location,
}) => {
  // TODO fetchLicenses()
  const [licenses, setLicenses] = useState<any>([]); // TODO type License
  const [previousLocation, setPreviousLocation] = useState('');
  const [isNewlyCreated, setNewlyCreated] = useState(false);

  useEffect(() => {
    // TODO Ingeborg sin kode, kan det lages en util?
    /\/subjectpage\/(.*)\/new/.test(location.pathname)
      ? setNewlyCreated(true)
      : setNewlyCreated(false);
    if (previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
    }
  }, []);

  useEffect(() => {
    getLicenses();
  }, []);

  const getLicenses = async () => {
    const license = await fetchLicenses();
    setLicenses(license);
  };

  return (
    <OneColumn>
      <HelmetWithTracker title="last opp podcast episode" />
      {/* TODO replace with translated text */}
      <Switch>
        <Route
          path={`${match.url}/new`}
          render={() => <CreatePodcast history={history} licenses={licenses} />}
        />
        <Route
          path={`${match.url}/:audioId/edit/:audioLanguage`}
          render={routeProps => (
            <EditPodcast
              licenses={licenses}
              isNewlyCreated={isNewlyCreated}
              podcastId={routeProps.match.params.audioId}
              podcastLanguage={routeProps.match.params.audioLanguage}
            />
          )}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </OneColumn>
  );
};

export default injectT(PodcastUploderPage);
