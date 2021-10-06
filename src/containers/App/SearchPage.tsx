/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment, useContext } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { SearchMedia, SearchContent, Concept, SquareAudio } from '@ndla/icons/editor';
import { List } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { UseQueryResult } from 'react-query';
import loadable from '@loadable/component';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import SubNavigation from '../Masthead/components/SubNavigation';
import { toSearch } from '../../util/routeHelpers';
import { RoutePropTypes } from '../../shapes';
import { LocaleContext } from './App';
import SearchContainer, { ResultType } from '../SearchPage/SearchContainer';
import { useSearchAudio, useSearchSeries } from '../../modules/audio/audioApi';
import { SearchType } from '../../interfaces';
import { SearchParams } from '../SearchPage/components/form/SearchForm';
import Footer from './components/Footer';
import { useSearch } from '../../modules/search/searchQueries';
import { useSearchImages } from '../../modules/image/imageQueries';
import { useSearchConcepts } from '../../modules/concept/conceptQueries';
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

interface Props extends RouteComponentProps {}

const SearchPage = ({ match }: Props) => {
  const { t } = useTranslation();
  const locale = useContext(LocaleContext);
  const supportedTypes: {
    title: string;
    type: SearchType;
    url: string;
    icon: React.ReactElement;
    path: string;
    searchHook: (query: SearchParams) => UseQueryResult<ResultType>;
  }[] = [
    {
      title: t('subNavigation.searchContent'),
      type: 'content',
      url: toSearch(
        {
          page: '1',
          sort: '-lastUpdated',
          'page-size': 10,
          fallback: false,
          'include-other-statuses': false,
        },
        'content',
      ),
      icon: <SearchContent className="c-icon--large" />,
      path: `${match.url}/content`,
      searchHook: useSearch,
    },
    {
      title: t('subNavigation.searchAudio'),
      type: 'audio',
      url: toSearch(
        {
          page: '1',
          sort: '-relevance',
          'page-size': 10,
        },
        'audio',
      ),
      icon: <SquareAudio className="c-icon--large" />,
      path: `${match.url}/audio`,
      searchHook: useSearchAudio,
    },
    {
      title: t('subNavigation.searchImage'),
      type: 'image',
      url: toSearch(
        {
          page: '1',
          sort: '-relevance',
          'page-size': 10,
        },
        'image',
      ),
      icon: <SearchMedia className="c-icon--large" />,
      path: `${match.url}/image`,
      searchHook: useSearchImages,
    },
    {
      title: t('subNavigation.searchConcepts'),
      type: 'concept',
      url: toSearch({ page: '1', sort: '-lastUpdated', 'page-size': 10 }, 'concept'),
      icon: <Concept className="c-icon--large" />,
      path: `${match.url}/concept`,
      searchHook: useSearchConcepts,
    },
    {
      title: t('subNavigation.searchPodcastSeries'),
      type: 'podcast-series',
      url: toSearch({ page: '1', sort: '-lastUpdated', 'page-size': 10 }, 'podcast-series'),
      icon: <List className="c-icon--large" />,
      path: `${match.url}/podcast-series`,
      searchHook: useSearchSeries,
    },
  ];

  return (
    <Fragment>
      <SubNavigation type="media" subtypes={supportedTypes} />
      <Switch>
        {supportedTypes.map(type => {
          return (
            <PrivateRoute
              locale={locale}
              key={type.type}
              path={type.path}
              component={SearchContainer}
              type={type.type}
              searchHook={type.searchHook}
            />
          );
        })}
        <Route component={NotFoundPage} />
      </Switch>
      <Footer showLocaleSelector={false} />
    </Fragment>
  );
};

SearchPage.propTypes = {
  ...RoutePropTypes,
};

export default withRouter(SearchPage);
