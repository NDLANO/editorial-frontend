/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useState } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Concept } from '@ndla/icons/editor';
import { IConcept, IConceptSummary } from '@ndla/types-concept-api';
import { searchClasses } from '../../../SearchContainer';
import { convertFieldWithFallback } from '../../../../../util/convertFieldWithFallback';
import ContentView from './ContentView';
import FormView from './FormView';
import { SubjectType } from '../../../../../modules/taxonomy/taxonomyApiInterfaces';
import { LocaleType } from '../../../../../interfaces';

interface Props {
  concept: IConceptSummary;
  locale: LocaleType;
  subjects: SubjectType[];
  editingState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const SearchConcept = ({ concept, locale, subjects, editingState }: Props) => {
  const { t } = useTranslation();
  const [editing, setEditing] = editingState;
  const [localConcept, setLocalConcept] = useState<IConceptSummary>(concept);
  const [showForm, setShowForm] = useState(false);
  const toggleShowForm = () => {
    setEditing(true);
    setShowForm(true);
  };
  const { url: metaImageSrc, alt: metaImageAlt } = localConcept.metaImage || {};
  const title = convertFieldWithFallback<'title', string>(
    localConcept,
    'title',
    t('conceptSearch.noTitle'),
  );
  const content = convertFieldWithFallback<'content', string>(
    localConcept,
    'content',
    t('conceptSearch.noContent'),
  );
  const breadcrumbs = subjects.filter(s => localConcept.subjectIds?.includes(s.id));

  const updateLocalConcept = (newConcept: IConcept): void => {
    const localConcept: IConceptSummary = {
      id: newConcept.id,
      title: newConcept.title,
      content: newConcept.content ?? { content: '', language: 'und' },
      metaImage: newConcept.metaImage ?? { alt: '', url: '', language: 'und' },
      tags: newConcept.tags,
      subjectIds: newConcept.subjectIds,
      supportedLanguages: newConcept.supportedLanguages,
      lastUpdated: newConcept.updated,
      status: newConcept.status,
      updatedBy: newConcept.updatedBy ?? [],
      license: newConcept.copyright?.license?.license,
      visualElement: newConcept.visualElement,
    };
    setLocalConcept(localConcept);
  };

  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('image')}>
        {metaImageSrc ? (
          <img src={`${metaImageSrc}?width=200`} alt={metaImageAlt} />
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
          updateLocalConcept={updateLocalConcept}
        />
      ) : (
        <ContentView
          concept={localConcept}
          title={title}
          content={content}
          locale={locale}
          breadcrumbs={breadcrumbs}
          setShowForm={toggleShowForm}
          editing={editing}
        />
      )}
    </div>
  );
};

SearchConcept.propTypes = {
  concept: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.shape({ title: PropTypes.string, language: PropTypes.string }),
    content: PropTypes.shape({ content: PropTypes.string, language: PropTypes.string }),
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
};

export default SearchConcept;
