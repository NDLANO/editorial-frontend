import React, { useState, useEffect } from 'react';
import { ContentTypeResultType } from '@ndla/ui/lib/types';
// @ts-ignore
import { RadioButtonGroup } from '@ndla/ui';
import { Spinner } from '@ndla/editor';
import { fetchLicenses } from '../../../../../modules/draft/draftApi';
import {
  fetchConcept,
  updateConcept,
} from '../../../../../modules/concept/conceptApi';
import { StyledConceptView } from './SearchStyles';
import ConceptForm, { ConceptFormType } from './ConceptForm';
import { Concept } from '../../../../../components/SlateEditor/editorTypes';
import { SubjectType } from '../../../../../interfaces';

interface License {
  description: string;
  license: string;
}
interface Props {
  title: string;
  concept: Concept;
  content: ContentTypeResultType;
  breadcrumbs: [];
  cancel: () => void;
  subjects: SubjectType[];
}

const FormView = ({ title, concept, cancel, subjects }: Props) => {
  const languageOptions = [
    { title: 'Bokmål', value: 'nb' },
    { title: 'Nynorsk', value: 'nn' },
    { title: 'Engelsk', value: 'en' },
    { title: 'Sørsamisk', value: 'sma' },
  ].filter(op => concept.supportedLanguages.includes(op.value));
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>(concept.title.language);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [fullConcept, setFullConcept] = useState<Concept | undefined>();

  useEffect(() => {
    fetchLicenses().then((licenses: License[]) => setLicenses(licenses));
  }, []);
  useEffect(() => {
    fetchConcept(concept.id, language).then((c: any) => setFullConcept(c));
  }, [concept.id, language]);

  const [formValues, setFormValues] = useState<ConceptFormType>({
    title: title,
    license: undefined,
    subjects: [],
    tags: concept.tags ? concept.tags.tags : [],
    author: undefined,
  });

  useEffect(() => {
    if (subjects.length > 0) {
      const subjectIds = concept.subjectIds;
      setFormValues(v => ({
        ...v,
        subjects: subjects.filter(s => subjectIds?.find(id => id === s.id)),
      }));
      setLoading(false);
    }
  }, [subjects]);

  useEffect(() => {
    if (fullConcept) {
      const author = fullConcept.copyright.creators.find(
        cr => cr.type === 'Writer',
      );
      setFormValues(values => ({
        ...values,
        title: fullConcept.title.title,
        author: author,
      }));
    }
  }, [fullConcept]);

  return (
    <StyledConceptView border>
      <h2>Hurtigredigering</h2>
      <RadioButtonGroup
        options={languageOptions}
        selected={language}
        onChange={(e: string) => {
          const l = e.split('-')[0];
          setLanguage(l);
        }}
        uniqeIds
      />

      {fullConcept && !loading ? (
        <ConceptForm
          initialValues={formValues}
          language={language}
          onSubmit={(c: ConceptFormType) => {
            const newConcept = {
              id: fullConcept.id,
              supportedLanguages: fullConcept.supportedLanguages,
              content: fullConcept.content.content,
              revision: fullConcept.revision,
              source: fullConcept.source,
              language: language,
              subjectIds: fullConcept.subjectIds,
              tags: fullConcept.tags,
              title: c.title,
              copyright: { ...fullConcept.copyright },
            };
            updateConcept(newConcept);
          }}
          licenses={licenses}
          allSubjects={subjects}
          cancel={cancel}
        />
      ) : (
        <Spinner />
      )}
    </StyledConceptView>
  );
};

export default FormView;
