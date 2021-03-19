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

const SearchConcept = ({ concept, locale, subjects, t, editingState, licenses }) => {
  const [editing, setEditing] = editingState;
  const [localConcept, setLocalConcept] = useState(concept);
  const [showForm, setShowForm] = useState(false);
  const toggleShowForm = () => {
    setEditing(true);
    setShowForm(true);
  };
  const { url: metaImageSrc, alt: metaImageAlt } = localConcept.metaImage || {};
  const title = convertFieldWithFallback(localConcept, 'title', t('conceptSearch.noTitle'));
  const content = convertFieldWithFallback(localConcept, 'content', t('conceptSearch.noContent'));
  const breadcrumbs = subjects.filter(s => localConcept.subjectIds?.includes(s.id));

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
          concept={localConcept}
          cancel={() => {
            setShowForm(false);
            setEditing(false);
          }}
          subjects={subjects}
          updateLocalConcept={newConcept => {
            setLocalConcept({ ...newConcept, lastUpdated: newConcept.updated });
          }}
          licenses={licenses}
          t={t}
        />
      ) : (
        <ContentView
          concept={localConcept}
          title={title}
          content={content}
          locale={locale}
          breadcrumbs={breadcrumbs}
          setShowForm={toggleShowForm}
          t={t}
          editing={editing}
          licenses={licenses}
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
  editingState: PropTypes.array,
  licenses: PropTypes.array,
};

export default injectT(SearchConcept);
