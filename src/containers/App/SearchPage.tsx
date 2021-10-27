/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { SearchMedia, SearchContent, Concept, SquareAudio } from '@ndla/icons/editor';
import { List } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import loadable from '@loadable/component';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import SubNavigation from '../Masthead/components/SubNavigation';
import { toSearch } from '../../util/routeHelpers';

import { RoutePropTypes } from '../../shapes';
import SearchContainer, { ResultType } from '../SearchPage/SearchContainer';

import { search as searchContent } from '../../modules/search/searchApi';
import { searchImages } from '../../modules/image/imageApi';
import { searchSeries } from '../../modules/audio/audioApi';
import { searchAudio } from '../../modules/audio/audioApi';
import { searchConcepts } from '../../modules/concept/conceptApi';
import { SearchType } from '../../interfaces';
import { SearchParams } from '../SearchPage/components/form/SearchForm';
import Footer from './components/Footer';
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

interface Props extends RouteComponentProps {}

const SearchPage = ({ match }: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const supportedTypes: {
    title: string;
    type: SearchType;
    url: string;
    icon: React.ReactElement;
    path: string;
    searchFunction: (query: SearchParams) => Promise<ResultType>;
  }[] = [
    {
      title: t('subNavigation.searchContent'),
      type: 'content',
      url: toSearch(
        {
          page: '1',
          sort: '-lastUpdated',
          'page-size': 10,
        },
        'content',
      ),
      icon: <SearchContent className="c-icon--large" />,
      path: `${match.url}/content`,
      searchFunction: searchContent,
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
      searchFunction: searchAudio,
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
      searchFunction: searchImages,
    },
    {
      title: t('subNavigation.searchConcepts'),
      type: 'concept',
      url: toSearch({ page: '1', sort: '-lastUpdated', 'page-size': 10 }, 'concept'),
      icon: <Concept className="c-icon--large" />,
      path: `${match.url}/concept`,
      searchFunction: searchConcepts,
    },
    {
      title: t('subNavigation.searchPodcastSeries'),
      type: 'podcast-series',
      url: toSearch({ page: '1', sort: '-lastUpdated', 'page-size': 10 }, 'podcast-series'),
      icon: <List className="c-icon--large" />,
      path: `${match.url}/podcast-series`,
      searchFunction: searchSeries,
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
              searchFunction={type.searchFunction}
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
