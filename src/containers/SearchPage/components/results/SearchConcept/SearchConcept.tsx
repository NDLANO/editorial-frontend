/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Concept } from '@ndla/icons/editor';
import { IConcept, IConceptSummary } from '@ndla/types-concept-api';
import { convertFieldWithFallback } from '../../../../../util/convertFieldWithFallback';
import ContentView from './ContentView';
import FormView from './FormView';
import { SubjectType } from '../../../../../modules/taxonomy/taxonomyApiInterfaces';
import { LocaleType } from '../../../../../interfaces';
import { StyledSearchImageContainer, StyledSearchResult } from '../../form/StyledSearchComponents';

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
      articleIds: newConcept.articleIds ?? [],
      created: newConcept.created,
      copyright: newConcept.copyright,
      source: newConcept.source,
    };
    setLocalConcept(localConcept);
  };

  return (
    <StyledSearchResult>
      <StyledSearchImageContainer>
        {metaImageSrc ? (
          <img src={`${metaImageSrc}?width=200`} alt={metaImageAlt} />
        ) : (
          <Concept className="c-icon--large" />
        )}
      </StyledSearchImageContainer>
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
    </StyledSearchResult>
  );
};

export default SearchConcept;
