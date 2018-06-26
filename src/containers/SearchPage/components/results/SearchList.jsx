/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import SearchResult from './SearchResult';
import Spinner from '../../../../components/Spinner';
import { SearchResultShape } from '../../../../shapes';
import { searchClasses } from '../../SearchContainer';

const SearchList = ({ results, query, type, locale, t, searching }) => (
  <div {...searchClasses('results')}>
    {searching && <Spinner cssModifier="absolute" />}
    <ReactCSSTransitionGroup
      transitionName={searchClasses('transition').className}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={0}>
      {results.length === 0 ? (
        <p>{t(`searchPage.${type}NoHits`, { query })}</p>
      ) : null}
      {results.map(result => (
        <SearchResult
          key={result.id}
          result={result}
          type={type}
          locale={locale}
        />
      ))}
    </ReactCSSTransitionGroup>
  </div>
);

SearchList.propTypes = {
  results: PropTypes.arrayOf(SearchResultShape).isRequired,
  query: PropTypes.string,
  type: PropTypes.string,
  locale: PropTypes.string.isRequired,
  searching: PropTypes.bool,
};

SearchList.defaultProps = {
  searching: true,
};

export default injectT(SearchList);
