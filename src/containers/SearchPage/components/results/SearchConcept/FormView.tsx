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
import ConceptForm, { ConceptFormType, License } from './ConceptForm';
import { Concept } from '../../../../../components/SlateEditor/editorTypes';
import { SubjectType } from '../../../../../interfaces';

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
  const [language, setLanguage] = useState<string>(concept.title.language);
  const [licenses, setLicenses] = useState<License[] | undefined>();
  const [fullConcept, setFullConcept] = useState<Concept | undefined>();

  useEffect(() => {
    fetchLicenses().then((licenses: License[]) => setLicenses(licenses));
  }, []);
  useEffect(() => {
    fetchConcept(concept.id, language).then((c: any) => setFullConcept(c));
  }, [concept.id, language]);

  const [formValues, setFormValues] = useState<ConceptFormType | undefined>();

  useEffect(() => {
    if (fullConcept && licenses && subjects) {
      const subjectIds = concept.subjectIds;
      console.log('full concept', fullConcept);
      console.log('licenses', licenses);
      const author = fullConcept.copyright.creators.find(
        cr => cr.type === 'Writer',
      );
      setFormValues({
        title: fullConcept.title.title,
        author: author ? author.name : '',
        subjects: subjects.filter(s => subjectIds?.find(id => id === s.id)),
        license: licenses.find(
          l => l.license === fullConcept.copyright.license.license,
        )?.license,
        tags: concept.tags ? concept.tags.tags : [],
      });
    }
  }, [fullConcept, licenses, subjects]);

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

      {fullConcept && licenses && formValues ? (
        <ConceptForm
          initialValues={formValues}
          language={language}
          onSubmit={(c: ConceptFormType) => {
            const getCreators = (
              creators: { type: string; name: string }[],
              newAuthor: string,
            ) => {
              const author = creators.find(cr => cr.type === 'Writer');
              if (newAuthor !== '') {
                if (author) {
                  return creators.map(cr =>
                    cr === author ? { ...cr, name: newAuthor } : cr,
                  );
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
            const creators = getCreators(
              fullConcept.copyright.creators,
              c.author,
            );

            const newConcept = {
              id: fullConcept.id,
              supportedLanguages: fullConcept.supportedLanguages,
              content: fullConcept.content.content,
              revision: fullConcept.revision,
              source: fullConcept.source,
              language: language,
              subjectIds: c.subjects.map(s => s.id),
              tags: c.tags,
              title: c.title,
              copyright: { ...fullConcept.copyright, creators },
            };
            updateConcept(newConcept).then(() => cancel());
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
