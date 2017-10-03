/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import SearchResult from './SearchResult';
import { SearchResultShape } from '../../../shapes';

const SearchList = ({ results, query, locale, t }) => {
  const noSearchHits = query.query && results.length === 0;
  return (
    <div>
      {noSearchHits ? (
        <p>{t('searchPage.noHits', { query: query.query })}</p>
      ) : (
        results.map(result => (
          <div key={result.type}>
            {result.results.map(item => (
              <SearchResult
                key={item.id}
                resultType={result.type}
                item={item}
                locale={locale}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

SearchList.propTypes = {
  results: PropTypes.arrayOf(SearchResultShape).isRequired,
  query: PropTypes.shape({
    query: PropTypes.string,
  }),
  locale: PropTypes.string.isRequired,
};

export default injectT(SearchList);
