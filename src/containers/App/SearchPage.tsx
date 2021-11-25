/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { ReactElement } from 'react';

import { Route, Routes } from 'react-router-dom';
import { SearchMedia, SearchContent, Concept, SquareAudio } from '@ndla/icons/editor';
import { List } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import loadable from '@loadable/component';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import SubNavigation from '../Masthead/components/SubNavigation';
import { toSearch } from '../../util/routeHelpers';
import SearchContainer, { ResultType } from '../SearchPage/SearchContainer';
import { SearchType } from '../../interfaces';
import { SearchParams } from '../SearchPage/components/form/SearchForm';
import Footer from './components/Footer';
import { useSearch } from '../../modules/search/searchQueries';
import { useSearchImages } from '../../modules/image/imageQueries';
import { useSearchConcepts } from '../../modules/concept/conceptQueries';
import { useSearchAudio, useSearchSeries } from '../../modules/audio/audioQueries';
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

const SearchPage = () => {
  const { t } = useTranslation();
  const supportedTypes: {
    title: string;
    type: SearchType;
    url: string;
    icon: ReactElement;
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
        },
        'content',
      ),
      icon: <SearchContent className="c-icon--large" />,
      path: 'content',
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
      path: 'audio',
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
      path: 'image',
      searchHook: useSearchImages,
    },
    {
      title: t('subNavigation.searchConcepts'),
      type: 'concept',
      url: toSearch({ page: '1', sort: '-lastUpdated', 'page-size': 10 }, 'concept'),
      icon: <Concept className="c-icon--large" />,
      path: 'concept',
      searchHook: useSearchConcepts,
    },
    {
      title: t('subNavigation.searchPodcastSeries'),
      type: 'podcast-series',
      url: toSearch({ page: '1', sort: '-lastUpdated', 'page-size': 10 }, 'podcast-series'),
      icon: <List className="c-icon--large" />,
      path: 'podcast-series',
      searchHook: useSearchSeries,
    },
  ];

  return (
    <>
      <SubNavigation type="media" subtypes={supportedTypes} />
      <Routes>
        {supportedTypes.map(type => {
          return (
            <Route
              key={type.type}
              path={`${type.path}/*`}
              element={
                <PrivateRoute
                  key={type.type}
                  component={<SearchContainer searchHook={type.searchHook} type={type.type} />}
                />
              }
            />
          );
        })}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer showLocaleSelector={false} />
    </>
  );
};

export default SearchPage;
