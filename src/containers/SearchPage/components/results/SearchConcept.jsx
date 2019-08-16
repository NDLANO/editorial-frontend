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
import { Concept } from '@ndla/icons/editor';
import { searchClasses } from '../../SearchContainer';
import { toEditConcept } from '../../../../../src/util/routeHelpers.js';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';

const SearchConcept = ({ concept, locale, t }) => {
  const { url: metaImageSrc, alt: metaImageAlt } = concept.metaImage || {};
  const title = convertFieldWithFallback(
    concept,
    'title',
    t('conceptSearch.noTitle'),
  );
  const content = convertFieldWithFallback(
    concept,
    'content',
    t('conceptSearch.noContent'),
  );

  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('image')}>
        {metaImageSrc ? (
          <img src={metaImageSrc} alt={metaImageAlt} />
        ) : (
          <Concept className="c-icon--large" />
        )}
      </div>
      <div {...searchClasses('content')}>
        <div {...searchClasses('header')}>
          <Link
            {...searchClasses('link')}
            to={toEditConcept(concept.id, locale)}>
            <h2 {...searchClasses('title')}>{title}</h2>
          </Link>
          {concept.supportedLanguages.map(lang => {
            return lang !== locale ? (
              <span {...searchClasses('other-link')}>
                <Link
                  {...searchClasses('link')}
                  key={`${lang}_search_content`}
                  to={toEditConcept(concept.id, lang)}>
                  {t(`language.${lang}`)}
                </Link>
              </span>
            ) : (
              ''
            );
          })}
        </div>
        <p {...searchClasses('description')}>{content}</p>
      </div>
    </div>
  );
};

SearchConcept.propTypes = {
  concept: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.shape({
      title: PropTypes.string,
    }),
    content: PropTypes.shape({
      content: PropTypes.string,
    }),
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    metaImage: PropTypes.shape({
      alt: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
  locale: PropTypes.string,
};

export default injectT(SearchConcept);
