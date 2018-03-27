/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { SearchMedia, SearchContent } from 'ndla-icons/editor';
import { injectT } from 'ndla-i18n';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import SubNavigation from '../Masthead/components/SubNavigation';
import SearchContentPage from '../SearchPage/SearchContentPage';

const SearchPage = ({ match, t }) => {
  const supportedTypes = [
    {
      title: t('subNavigation.image'),
      type: 'content',
      url: '/search/content',
      icon: <SearchContent className="c-icon--large" />,
    },
    {
      title: t('subNavigation.audio'),
      type: 'media',
      url: '/search/media',
      icon: <SearchMedia className="c-icon--large" />,
    },
  ];

  return (
    <div>
      <SubNavigation type="media" subtypes={supportedTypes} />
      <Switch>
        <PrivateRoute
          path={`${match.url}/content`}
          component={SearchContentPage}
        />
        <PrivateRoute
          path={`${match.url}/media`}
          component={SearchContentPage}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
};

SearchPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectT(withRouter(SearchPage));
