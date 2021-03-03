/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { SearchMedia, SearchContent, Concept, SquareAudio } from '@ndla/icons/editor';
import { injectT } from '@ndla/i18n';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import SubNavigation from '../Masthead/components/SubNavigation';
import SearchContentPage from '../SearchPage/SearchContentPage';
import SearchAudioPage from '../SearchPage/SearchAudioPage';
import SearchImagePage from '../SearchPage/SearchImagePage';
import { toSearch } from '../../util/routeHelpers';
import Footer from './components/Footer';
import SearchConceptPage from '../SearchPage/SearchConceptPage';
import { LocationShape, HistoryShape } from '../../shapes';
import { LocaleContext } from '../App/App';

const SearchPage = ({ match, t }) => {
  const locale = useContext(LocaleContext);
  const supportedTypes = [
    {
      title: t('subNavigation.searchContent'),
      type: 'content',
      url: toSearch(
        { page: '1', sort: '-lastUpdated', 'page-size': 10, language: locale },
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
  ];

  return (
    <Fragment>
      <SubNavigation type="media" subtypes={supportedTypes} />
      <Switch>
        <PrivateRoute path={`${match.url}/content`} component={SearchContentPage} />
        <PrivateRoute path={`${match.url}/audio`} component={SearchAudioPage} />
        <PrivateRoute path={`${match.url}/image`} component={SearchImagePage} />
        <PrivateRoute path={`${match.url}/concept`} component={SearchConceptPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <Footer showLocaleSelector={false} />
    </Fragment>
  );
};

SearchPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  location: LocationShape,
  history: HistoryShape.isRequired,
};

export default injectT(withRouter(SearchPage));
