/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Concept } from '@ndla/icons/editor';
import { searchClasses } from '../../../SearchContainer';
import { convertFieldWithFallback } from '../../../../../util/convertFieldWithFallback';
import ContentView from './ContentView';
import FormView from './FormView';

const SearchConcept = ({ concept, locale, subjects, t }) => {
  const [showForm, setShowForm] = useState(false);
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
  const breadcrumbs = subjects.filter(s => concept.subjectIds?.includes(s.id));

  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('image')}>
        {metaImageSrc ? (
          <img src={metaImageSrc} alt={metaImageAlt} />
        ) : (
          <Concept className="c-icon--large" />
        )}
      </div>
      {showForm ? (
        <FormView
          title={title}
          concept={concept}
          content={content}
          cancel={() => setShowForm(false)}
        />
      ) : (
        <ContentView
          concept={concept}
          title={title}
          content={content}
          breadcrumbs={breadcrumbs}
          setShowForm={setShowForm}
          t={t}
        />
      )}
    </div>
  );
};

SearchConcept.propTypes = {
  concept: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.shape({
      title: PropTypes.string,
      language: PropTypes.string,
    }),
    content: PropTypes.shape({
      content: PropTypes.string,
    }),
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    subjectIds: PropTypes.arrayOf(PropTypes.string),
    metaImage: PropTypes.shape({
      alt: PropTypes.string,
      url: PropTypes.string,
    }),
    lastUpdated: PropTypes.string,
    status: PropTypes.shape({
      current: PropTypes.string,
      other: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  locale: PropTypes.string,
  subjects: PropTypes.array,
};

export default injectT(SearchConcept);
