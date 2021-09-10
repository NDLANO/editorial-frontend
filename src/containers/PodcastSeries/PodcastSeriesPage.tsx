/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { RouteComponentProps, Route, Switch, RouteProps } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import loadable from '@loadable/component';
import { usePreviousLocation } from '../../util/routeHelpers';
const CreatePodcastSeries = loadable(() => import('./CreatePodcastSeries'));
const EditPodcastSeries = loadable(() => import('./EditPodcastSeries'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

interface MatchParams {
  seriesId: string;
  seriesLanguage: string;
}

interface BetterRouteProps extends RouteProps {
  render?: (props: RouteComponentProps<MatchParams>) => React.ReactNode;
}

const PodcastSeriesPage = ({ match, history, location }: RouteComponentProps<MatchParams>) => {
  const { t } = useTranslation();
  const previousLocation = usePreviousLocation();

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
              isNewlyCreated={previousLocation === '/media/podcast-series/new'}
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

export default PodcastSeriesPage;
