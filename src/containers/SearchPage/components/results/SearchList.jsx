/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import SearchResult from './SearchResult';
import Spinner from '../../../../components/Spinner';
import { SearchResultShape } from '../../../../shapes';
import { searchClasses } from '../../SearchContainer';

const SearchList = ({
  results,
  searchObject,
  type,
  t,
  searching,
  locale,
  subjects,
}) => {
  if (searching) return <Spinner />;
  if (results.length === 0)
    return (
      <p>{t(`searchPage.${type}NoHits`, { query: searchObject.query })}</p>
    );
  return (
    <div {...searchClasses('results')}>
      <TransitionGroup>
        {results.map(result => (
          <CSSTransition
            key={`transition-${result.id}`}
            classNames={searchClasses('transition').className}
            timeout={{ enter: 500, exit: 0 }}>
            <SearchResult
              key={result.id}
              result={result}
              type={type}
              locale={locale || result.title.language}
              subjects={subjects}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

SearchList.propTypes = {
  results: PropTypes.arrayOf(SearchResultShape).isRequired,
  searchObject: PropTypes.shape({
    query: PropTypes.string,
    language: PropTypes.string,
  }),
  type: PropTypes.string,
  searching: PropTypes.bool,
  locale: PropTypes.string,
  subjects: PropTypes.array,
};

SearchList.defaultProps = {
  searching: true,
};

export default injectT(SearchList);
