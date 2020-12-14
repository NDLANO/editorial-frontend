import React, { useEffect } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { useFormik } from 'formik';
import { Select } from '@ndla/forms';
import Button from '@ndla/button';
import { fetchSearchTags } from '../../../../../modules/draft/draftApi';
import AsyncSearchTags from '../../../../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import { MultiSelectDropdown } from '../../../../../components/Dropdown/MultiSelectDropdown';
import { SubjectType } from '../../../../../interfaces';
import { InputField, InputPair } from './SearchStyles';

export interface License {
  description: string;
  license: string;
  url?: string;
}

export interface ConceptFormType {
  title: string;
  author: string;
  license?: string;
  subjects: SubjectType[];
  tags: string[];
}

interface Props {
  initialValues: ConceptFormType;
  language: string;
  onSubmit: (c: ConceptFormType) => void;
  licenses: License[];
  allSubjects: SubjectType[];
  cancel: () => void;
}

const ConceptForm = ({
  initialValues,
  language,
  onSubmit,
  licenses,
  allSubjects,
  cancel,
  t,
}: Props & tType) => {
  const formik = useFormik<ConceptFormType>({
    initialValues,
    onSubmit,
  });
  const { values, handleChange, setValues } = formik;
  useEffect(() => {
    setValues({ ...values, title: initialValues.title });
  }, [initialValues.title]);

  return (
    <form>
      <InputPair>
        <InputField>
          <label htmlFor="title">Tittel</label>
          <input
            id="title"
            name="title"
            type="text"
            aria-label="Tittel"
            value={values.title}
            onChange={handleChange}
          />
        </InputField>
        <InputField>
          <label htmlFor="author">Forfatter</label>
          <input
            id="author"
            name="author"
            type="text"
            aria-label="Forfatter"
            value={values.author}
            onChange={handleChange}
          />
        </InputField>
      </InputPair>

      <InputField>
        <label htmlFor="license">Lisens</label>
        <Select
          value={values.license}
          onChange={(v: any) => {
            const value = v.target.value;
            setValues({
              ...values,
              license: value,
            });
          }}>
          {!values.license && <option>{t('form.license.choose')}</option>}
          {licenses.map(license => (
            <option value={license.license} key={license.license}>
              {license.description}
            </option>
          ))}
        </Select>
      </InputField>
      <InputField>
        <label htmlFor="subjects">Fag</label>
        <MultiSelectDropdown
          id="subjects"
          name="subjects"
          value={values.subjects}
          onChange={handleChange}
          minSearchLength={1}
          data={allSubjects}
        />
      </InputField>
      <InputField>
        <label htmlFor="tags">Liste og filter</label>
        <AsyncSearchTags
          language={language}
          value={values.tags}
          updateValue={updatedValue => {
            setValues({ ...values, tags: updatedValue });
          }}
          fetchTags={fetchSearchTags}
        />
      </InputField>
      <div className="buttons">
        <Button className="secondary" onClick={cancel}>
          Avbryt
        </Button>
        <Button onClick={() => onSubmit(values)}>Lagre</Button>
        <Button>Publiser</Button>
      </div>
    </form>
  );
};

export default injectT(ConceptForm);
