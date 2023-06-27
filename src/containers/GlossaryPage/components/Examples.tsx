/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossExample } from '@ndla/types-backend/build/concept-api';

import { FormEvent, MouseEvent } from 'react';
import { ButtonV2 } from '@ndla/button';
import { FieldHeader } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
import Example from './Example';
interface Props {
  label: string;
  onChange: (event: { target: { value: IGlossExample[]; name: string } }) => void;
  errorMessages?: string[];
  showError?: boolean;
  placeholder?: string;
  disabled?: boolean;
  values: IGlossExample[];
}

const Examples = ({ label, onChange, values: examples, ...rest }: Props) => {
  const { t } = useTranslation();

  const onExamplesChange = (newExamples: IGlossExample[]) => {
    onChange({
      target: {
        value: newExamples,
        name: 'glossData.examples',
      },
    });
  };

  const addExample = () => {
    const newExamples = [...examples];
    newExamples.push({ example: 'string', language: 'string', transcriptions: {} });
    onExamplesChange(newExamples);
  };

  const removeExample = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    const newExamples = examples;
    newExamples.splice(index);
    onExamplesChange(newExamples);
  };

  const handleExampleChange = (
    evt: FormEvent<HTMLInputElement> | FormEvent<HTMLSelectElement> | any,
    fieldName: string,
    index: number,
  ) => {
    const newExamples = [...examples];
    const target = evt.currentTarget ?? evt.target;
    newExamples[index] = {
      ...newExamples[index],
      [fieldName]: target.value,
    };
    onExamplesChange(newExamples);
  };

  return (
    <>
      {examples.map((example, index) => (
        <Example
          key={`example_${index}`} // eslint-disable-line react/no-array-index-key
          index={index}
          example={example}
          handleExampleChange={handleExampleChange}
          removeExample={removeExample}
          {...rest}
        />
      ))}
      <ButtonV2 variant="outline" onClick={addExample} data-cy="addExample">
        {t('form.concept.glossData.add', {
          type: t(`form.concept.glossData.examples`),
        })}
      </ButtonV2>
    </>
  );
};

export default Examples;
