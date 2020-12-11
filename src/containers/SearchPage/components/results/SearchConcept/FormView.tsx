import React, { useState, useEffect } from 'react';
import { ContentTypeResultType } from '@ndla/ui/lib/types';
// @ts-ignore
import { RadioButtonGroup } from '@ndla/ui';
import { Spinner } from '@ndla/editor';
import { useFetchConceptData } from '../../../../FormikForm/formikConceptHooks';
import { fetchLicenses } from '../../../../../modules/draft/draftApi';
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
}

const FormView = ({ title, concept, cancel }: Props) => {
  const languageOptions = [
    { title: 'Bokmål', value: 'nb' },
    { title: 'Nynorsk', value: 'nn' },
    { title: 'Engelsk', value: 'en' },
    { title: 'Sørsamisk', value: 'sma' },
  ].filter(op => concept.supportedLanguages.includes(op.value));
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>(concept.title.language);
  const [licenses, setLicenses] = useState<License[]>([]);

  const conceptData = useFetchConceptData(concept.id, language);
  const { fetchSearchTags, subjects } = conceptData;
  useEffect(() => {
    fetchLicenses().then((licenses: License[]) => setLicenses(licenses));
  }, []);
  const [formValues, setFormValues] = useState<ConceptFormType>({
    title: title,
    license: undefined,
    subjects: [],
    tags: concept.tags ? concept.tags.tags : [],
    author: undefined,
  });

  useEffect(() => {
    if (subjects.length > 0) {
      setFormValues(v => ({
        ...v,
        subjects: concept.subjectIds
          ? concept.subjectIds.map((id: string) =>
              subjects.find((s: SubjectType) => s.id === id),
            )
          : [],
      }));
      setLoading(false);
    }
  }, [subjects]);

  const updatedConcept = conceptData.concept;
  useEffect(() => {
    if (updatedConcept) {
      const author = updatedConcept.copyright.creators.find(
        (cr: { type: string; name: string }) => cr.type === 'Writer',
      );
      setFormValues(values => ({
        ...values,
        title: updatedConcept.title,
        author: author,
      }));
    }
  }, [updatedConcept]);

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

      {updatedConcept && !loading ? (
        <ConceptForm
          initialValues={formValues}
          language={language}
          onSubmit={() => {}}
          licenses={licenses}
          allSubjects={subjects}
          fetchSearchTags={fetchSearchTags}
          cancel={cancel}
        />
      ) : (
        <Spinner />
      )}
    </StyledConceptView>
  );
};

export default FormView;
