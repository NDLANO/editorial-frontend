/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Link } from 'react-router-dom';
import { searchClasses } from '../../SearchContainer';
import SearchContentLanguage from './SearchContentLanguage';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';

const SearchConcept = ({ concept, locale, t }) => {
  const title = convertFieldWithFallback(concept, 'title', t('conceptSearch.noTitle'));
  const content = convertFieldWithFallback(concept, 'content', t('conceptSearch.noContent'));

  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('content')}>
        <div {...searchClasses('header')}>
          <Link
            {...searchClasses('link')}
            to={`/concept/${concept.id}/edit/${locale}`}>
            <h2 {...searchClasses('title')}>
              {title}
            </h2>
          </Link>
          {concept.supportedLanguages.map(lang => (
            <SearchContentLanguage
              key={`${lang}_search_content`}
              language={lang}
              content={concept}
            />
          ))}
        </div>
        <p {...searchClasses('description')}>
          {content}
        </p>
      </div>
    </div>
  );
};

SearchConcept.propTypes = {
  concept: {
    title: PropTypes.string,
    content: PropTypes.string,
  },
  locale: PropTypes.string,
};

export default injectT(SearchConcept);
