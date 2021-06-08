/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { RadioButtonGroup } from '@ndla/ui';
import { tType } from '@ndla/i18n';
import { Spinner } from '@ndla/editor';
import {
  fetchConcept,
  updateConcept,
  updateConceptStatus,
} from '../../../../../modules/concept/conceptApi';
import { SearchConceptType } from '../../../../../modules/concept/conceptApiInterfaces';
import { StyledConceptView } from './SearchStyles';
import ConceptForm, { InlineFormConcept } from './ConceptForm';
import { SubjectType, License, ConceptType } from '../../../../../interfaces';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from '../../../../../constants';

interface Props {
  concept: SearchConceptType;
  cancel: () => void;
  subjects: SubjectType[];
  updateLocalConcept: (concept: ConceptType) => void;
  licenses: License[] | undefined;
}

const FormView = ({
  concept,
  cancel,
  subjects,
  updateLocalConcept,
  licenses,
  t,
}: Props & tType) => {
  const languageOptions = concept.supportedLanguages.map(lan => ({
    title: t(`language.${lan}`),
    value: lan,
  }));
  const [language, setLanguage] = useState<string>(concept.supportedLanguages[0]);
  const [fullConcept, setFullConcept] = useState<ConceptType | undefined>();

  useEffect(() => {
    fetchConcept(concept.id, language).then((c: any) => setFullConcept(c));
  }, [concept.id, language]);

  const [formValues, setFormValues] = useState<InlineFormConcept | undefined>();

  const conceptSubjects = subjects?.filter(
    s => s.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] === 'true',
  );

  useEffect(() => {
    if (fullConcept && licenses && subjects) {
      const subjectIds = concept.subjectIds;
      const author = fullConcept.copyright?.creators.find(cr => cr.type === 'Writer');
      setFormValues({
        title: fullConcept.title,
        author: author ? author.name : '',
        subjects: subjects.filter(s => subjectIds?.find(id => id === s.id)),
        license:
          licenses.find(l => l.license === fullConcept.copyright?.license?.license)?.license || '',
        tags: fullConcept.tags || [],
      });
    }
  }, [concept, fullConcept, licenses, subjects]);

  return (
    <StyledConceptView border>
      <h2>{t('form.inlineEdit')}</h2>
      <RadioButtonGroup
        options={languageOptions}
        selected={language}
        onChange={(e: string) => {
          const l = e.split('-')[0];
          setLanguage(l);
        }}
        uniqeIds
      />

      {fullConcept && licenses && formValues ? (
        <ConceptForm
          initialValues={formValues}
          status={fullConcept.status.current}
          language={language}
          onSubmit={(formConcept: InlineFormConcept) => {
            const getCreators = (creators: { type: string; name: string }[], newAuthor: string) => {
              const author = creators.find(cr => cr.type === 'Writer');
              if (newAuthor !== '') {
                if (author) {
                  return creators.map(cr => (cr === author ? { ...cr, name: newAuthor } : cr));
                } else {
                  return creators.concat({
                    type: 'Writer',
                    name: newAuthor,
                  });
                }
              } else {
                return creators.filter(cr => cr !== author);
              }
            };
            const creators = getCreators(fullConcept.copyright?.creators || [], formConcept.author);

            const newConcept = {
              id: fullConcept.id,
              supportedLanguages: fullConcept.supportedLanguages,
              content: fullConcept.content,
              source: fullConcept.source,
              language: language,
              subjectIds: formConcept.subjects.map(s => s.id),
              tags: formConcept.tags,
              title: formConcept.title,
              copyright: {
                ...fullConcept.copyright,
                creators,
                license: licenses.find(l => l.license === formConcept.license),
                rightsholders: [],
                processors: [],
              },
            };
            updateConcept(newConcept).then((updatedConcept: ConceptType) => {
              if (formConcept.newStatus) {
                updateConceptStatus(updatedConcept.id, formConcept.newStatus);
              }
              updateLocalConcept(updatedConcept);
              cancel();
            });
          }}
          licenses={licenses}
          allSubjects={conceptSubjects}
          cancel={cancel}
        />
      ) : (
        <Spinner />
      )}
    </StyledConceptView>
  );
};

export default FormView;
