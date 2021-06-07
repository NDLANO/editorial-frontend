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
import { injectT, tType } from '@ndla/i18n';
import { RouteComponentProps } from 'react-router';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import SubNavigation from '../Masthead/components/SubNavigation';
import { toSearch } from '../../util/routeHelpers';
import Footer from './components/Footer';
import { RoutePropTypes } from '../../shapes';
import { LocaleContext } from './App';
import SearchContainer from '../SearchPage/SearchContainer';

import { search as searchContent } from '../../modules/search/searchApi';
import { searchImages } from '../../modules/image/imageApi';
import { searchSeries } from '../../modules/audio/audioApi';
import { searchAudio } from '../../modules/audio/audioApi';
import { searchConcepts } from '../../modules/concept/conceptApi';

interface Props extends RouteComponentProps, tType {}

const SearchPage = ({ match, t }: Props) => {
  const locale = useContext(LocaleContext);
  const supportedTypes = [
    {
      title: t('subNavigation.searchContent'),
      type: 'content',
      url: toSearch(
        { page: '1', sort: '-lastUpdated', 'page-size': 10, language: locale, fallback: true },
        'content',
      ),
      icon: <SearchContent className="c-icon--large" />,
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
    },
    {
      title: t('subNavigation.searchConcepts'),
      type: 'concept',
      url: toSearch({ page: '1', sort: '-lastUpdated', 'page-size': 10 }, 'concept'),
      icon: <Concept className="c-icon--large" />,
    },
    {
      title: t('subNavigation.searchPodcastSeries'),
      type: 'podcast-series',
      url: toSearch({ page: '1', sort: '-lastUpdated', 'page-size': 10 }, 'podcast-series'),
      icon: <List className="c-icon--large" />,
    },
  ];

  return (
    <Fragment>
      <SubNavigation type="media" subtypes={supportedTypes} />
      <Switch>
        <PrivateRoute
          path={`${match.url}/content`}
          component={() => <SearchContainer type="content" searchFunction={searchContent} />}
        />
        <PrivateRoute
          path={`${match.url}/audio`}
          component={() => <SearchContainer type="audio" searchFunction={searchAudio} />}
        />
        <PrivateRoute
          path={`${match.url}/image`}
          component={() => <SearchContainer type="image" searchFunction={searchImages} />}
        />
        <PrivateRoute
          path={`${match.url}/concept`}
          component={() => <SearchContainer type="concept" searchFunction={searchConcepts} />}
        />
        <PrivateRoute
          path={`${match.url}/podcast-series`}
          component={() => <SearchContainer type="podcast-series" searchFunction={searchSeries} />}
        />
        <Route component={NotFoundPage} />
      </Switch>
      <Footer showLocaleSelector={false} />
    </Fragment>
  );
};

SearchPage.propTypes = {
  ...RoutePropTypes,
};

export default injectT(withRouter(SearchPage));
