/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Route, Switch } from 'react-router-dom';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT, tType } from '@ndla/i18n';
import loadable from '@loadable/component';
import { fetchLicenses } from '../../modules/draft/draftApi';
import { License } from '../../interfaces';
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));
const CreatePodcast = loadable(() => import('./CreatePodcast'));
const EditPodcast = loadable(() => import('./EditPodcast'));

interface Props {
  match: RouteComponentProps['match'];
  history: RouteComponentProps['history'];
  location: RouteComponentProps['location'];
}

const PodcastUploderPage = ({
  match,
  history,
  location,
  t,
}: RouteComponentProps & Props & tType) => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [previousLocation, setPreviousLocation] = useState('');
  const [isNewlyCreated, setNewlyCreated] = useState(false);

  useEffect(() => {
    /\/podcast-upload\/(.*)\/new/.test(location.pathname)
      ? setNewlyCreated(true)
      : setNewlyCreated(false);
    if (previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
    }

    getLicenses();
  }, [location.pathname, previousLocation]);

  const getLicenses = async () => {
    const license = await fetchLicenses();
    setLicenses(license);
  };

  return (
    <OneColumn>
      <HelmetWithTracker title={t('htmlTitles.podcastUploaderPage')} />
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
