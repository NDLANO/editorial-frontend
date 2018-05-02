/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import SearchResult from './SearchResult';
import Spinner from '../../../../components/Spinner';
import { SearchResultShape } from '../../../../shapes';

const SearchList = ({ results, query, type, locale, t, searching }) => {
  if (searching) return <Spinner />;
  if (results.length === 0)
    return <p>{t(`searchPage.${type}NoHits`, { query })}</p>;

  return (
    <Fragment>
      {results.map(result => (
        <SearchResult
          key={result.id}
          result={result}
          type={type}
          locale={locale}
        />
      ))}
    </Fragment>
  );
};

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
