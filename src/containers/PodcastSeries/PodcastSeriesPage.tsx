/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Route, Switch, RouteProps } from 'react-router-dom';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT, tType } from '@ndla/i18n';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import CreatePodcastSeries from './CreatePodcastSeries';
import EditPodcastSeries from './EditPodcastSeries';

interface MatchParams {
  seriesId: string;
  seriesLanguage: string;
}

interface BetterRouteProps extends RouteProps {
  render?: (props: RouteComponentProps<MatchParams>) => React.ReactNode;
}

const PodcastSeriesPage = ({
  match,
  history,
  location,
  t,
}: RouteComponentProps<MatchParams> & tType) => {
  const [previousLocation, setPreviousLocation] = useState('');
  const [isNewlyCreated, setNewlyCreated] = useState(false);

  useEffect(() => {
    /\/podcast-series\/(.*)\/new/.test(location.pathname)
      ? setNewlyCreated(true)
      : setNewlyCreated(false);
    if (previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
    }
  }, [location.pathname, previousLocation]);

  return (
    <OneColumn>
      <HelmetWithTracker title={t('htmlTitles.podcastSeriesPage')} />
      <Switch>
        <Route<BetterRouteProps>
          path={`${match.url}/new`}
          render={() => <CreatePodcastSeries history={history} />}
        />
        <Route<BetterRouteProps>
          path={`${match.url}/:seriesId/edit/:seriesLanguage`}
          render={routeProps => (
            <EditPodcastSeries
              isNewlyCreated={isNewlyCreated}
              podcastSeriesId={Number(routeProps.match.params.seriesId)}
              podcastSeriesLanguage={routeProps.match.params.seriesLanguage}
            />
          )}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </OneColumn>
  );
};

export default injectT(PodcastSeriesPage);
