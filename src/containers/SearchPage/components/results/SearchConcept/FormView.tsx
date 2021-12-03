/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { RadioButtonGroup } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ndla/editor';
import {
  fetchConcept,
  updateConcept,
  updateConceptStatus,
} from '../../../../../modules/concept/conceptApi';
import {
  ConceptApiType,
  SearchConceptType,
} from '../../../../../modules/concept/conceptApiInterfaces';
import { StyledConceptView } from './SearchStyles';
import ConceptForm, { InlineFormConcept } from './ConceptForm';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from '../../../../../constants';
import { SubjectType } from '../../../../../modules/taxonomy/taxonomyApiInterfaces';
import { useLicenses } from '../../../../Licenses/LicensesProvider';

interface Props {
  concept: SearchConceptType;
  cancel: () => void;
  subjects: SubjectType[];
  updateLocalConcept: (concept: ConceptApiType) => void;
}

const FormView = ({ concept, cancel, subjects, updateLocalConcept }: Props) => {
  const { t, i18n } = useTranslation();
  const languageOptions = concept.supportedLanguages.map(lan => ({
    title: t(`language.${lan}`),
    value: lan,
  }));

  const [language, setLanguage] = useState<string>(
    concept.supportedLanguages.find(l => l === i18n.language) ?? concept.supportedLanguages[0],
  );
  const [fullConcept, setFullConcept] = useState<ConceptApiType | undefined>();
  const { licenses, licensesLoading } = useLicenses();

  useEffect(() => {
    fetchConcept(concept.id, language).then(c => setFullConcept(c));
  }, [concept.id, language]);

  const [formValues, setFormValues] = useState<InlineFormConcept | undefined>();

  const conceptSubjects = subjects?.filter(
    s => s.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] === 'true',
  );

  useEffect(() => {
    if (fullConcept && !licensesLoading && subjects) {
      const subjectIds = concept.subjectIds;
      const author = fullConcept.copyright?.creators.find(cr => cr.type === 'Writer');
      setFormValues({
        title: fullConcept.title.title,
        author: author ? author.name : '',
        subjects: subjects.filter(s => subjectIds?.find(id => id === s.id)),
        license:
          licenses.find(l => l.license === fullConcept.copyright?.license?.license)?.license || '',
        tags: fullConcept.tags?.tags || [],
      });
    }
  }, [concept, fullConcept, licenses, licensesLoading, subjects]);

  const handleSubmit = async (formConcept: InlineFormConcept) => {
    if (!fullConcept || licensesLoading) return;
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
      content: fullConcept.content.content,
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
    const updatedConcept = await updateConcept(newConcept);
    if (formConcept.newStatus) {
      await updateConceptStatus(updatedConcept.id, formConcept.newStatus);
    }
    if (language === i18n.language) {
      updateLocalConcept(updatedConcept);
    }
    cancel();
  };

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

      {fullConcept && !licensesLoading && formValues ? (
        <ConceptForm
          initialValues={formValues}
          status={fullConcept.status.current}
          language={language}
          onSubmit={handleSubmit}
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
