/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioButtonGroup } from '@ndla/forms';
import { Spinner } from '@ndla/icons';
import { IConcept, IConceptSummary, IUpdatedConcept } from '@ndla/types-backend/concept-api';
import { Node } from '@ndla/types-taxonomy';
import ConceptForm, { InlineFormConcept } from './ConceptForm';
import { StyledConceptView } from './SearchStyles';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from '../../../../../constants';
import { fetchConcept, updateConcept, updateConceptStatus } from '../../../../../modules/concept/conceptApi';
import { useLicenses } from '../../../../../modules/draft/draftQueries';

interface Props {
  concept: IConceptSummary;
  cancel: () => void;
  subjects: Node[];
  updateLocalConcept: (concept: IConcept) => void;
}

const FormView = ({ concept, cancel, subjects, updateLocalConcept }: Props) => {
  const { t, i18n } = useTranslation();
  const languageOptions = concept.supportedLanguages.map((lan) => ({
    title: t(`languages.${lan}`),
    value: lan,
  }));

  const [language, setLanguage] = useState<string>(
    concept.supportedLanguages.find((l) => l === i18n.language) ?? concept.supportedLanguages[0],
  );
  const [fullConcept, setFullConcept] = useState<IConcept | undefined>();
  const { data: licenses, isLoading: licensesLoading } = useLicenses({
    placeholderData: [],
  });

  useEffect(() => {
    fetchConcept(concept.id, language).then((c) => setFullConcept(c));
  }, [concept.id, language]);

  const [formValues, setFormValues] = useState<InlineFormConcept | undefined>();

  const conceptSubjects = subjects?.filter(
    (s) => s.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] === 'true',
  );

  useEffect(() => {
    if (fullConcept && !licensesLoading && subjects) {
      const subjectIds = concept.subjectIds;
      setFormValues({
        title: fullConcept.title.title,
        subjects: subjects.filter((s) => subjectIds?.find((id) => id === s.id)),
        license: licenses!.find((l) => l.license === fullConcept.copyright?.license?.license)?.license || '',
        tags: fullConcept.tags?.tags || [],
      });
    }
  }, [concept, fullConcept, licenses, licensesLoading, subjects]);

  const handleSubmit = async (formConcept: InlineFormConcept) => {
    if (!fullConcept || licensesLoading) return;

    const newConcept: IUpdatedConcept = {
      content: fullConcept.content?.content,
      language: language,
      subjectIds: formConcept.subjects.map((s) => s.id),
      tags: formConcept.tags,
      title: formConcept.title,
      copyright: {
        ...fullConcept.copyright,
        creators: fullConcept.copyright?.creators || [],
        license: licenses!.find((l) => l.license === formConcept.license),
        rightsholders: fullConcept.copyright?.rightsholders || [],
        processors: fullConcept.copyright?.processors || [],
        processed: fullConcept.copyright?.processed ?? false,
      },
      responsibleId: fullConcept?.responsible?.responsibleId,
    };
    const updatedConcept = await updateConcept(fullConcept.id, newConcept);
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
