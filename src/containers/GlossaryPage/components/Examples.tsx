/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossExample } from '@ndla/types-backend/build/concept-api';

import { FormEvent, MouseEvent, useState } from 'react';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import Example from './Example';
import { FieldRemoveButton } from '@ndla/forms';
interface Props {
  label: string;
  onChange: (event: { target: { value: IGlossExample[][]; name: string } }) => void;
  errorMessages?: string[];
  showError?: boolean;
  placeholder?: string;
  disabled?: boolean;
  values: IGlossExample[][];
}

type ExampleListProps = {
  examples: IGlossExample[];
  /*handleExampleChange: (
    event: FormEvent<HTMLSelectElement> | FormEvent<HTMLInputElement> | any,
    fieldname: string,
    index: number,
  ) => void;
  removeExample: (event: MouseEvent<HTMLButtonElement>, index: number) => void;
  */
  index: number;
};

// An example can be given in multiple languages
const ExampleList = ({ examples, index }: ExampleListProps) => {
  const [example, changeExample] = useState<IGlossExample[]>([]);

  const addExample = (index: number) => {
    const newExample = [...example];
    newExample.push({ example: '', language: '', transcriptions: {} });
    //onExamplesChange(newExamples, index);
  };

  const removeExample = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    const newExample = example;
    newExample.splice(index);
    // onExamplesChange(newExamples, index);
  };

  const handleExampleChange = (
    evt: FormEvent<HTMLInputElement> | FormEvent<HTMLSelectElement> | any,
    fieldName: string,
    index: number,
  ) => {};

  return (
    <div key={index}>
      {examples.map((example, index) => {
        return (
          <>
            <Example
              example={example}
              key={`example_${index}`}
              index={index}
              handleExampleChange={handleExampleChange}
              removeExample={removeExample}
            />
            <FieldRemoveButton onClick={(evt) => removeExample(evt, index)}>
              {'Remove this example'}
            </FieldRemoveButton>
          </>
        );
      })}
    </div>
  );
};

const Examples = ({ label, onChange, values: examples, ...rest }: Props) => {
  const { t } = useTranslation();

  const addExampleList = () => {
    const newExamples = [...examples];
    newExamples.push([{ example: '', language: '', transcriptions: {} }]);
    onExamplesChange(newExamples);
  };

  const removeExampleList = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    const newExamples = examples;
    newExamples.splice(index);
    onExamplesChange(newExamples);
  };

  const onExamplesChange = (newExamples: IGlossExample[][]) => {
    onChange({
      target: {
        value: newExamples,
        name: 'glossData.examples',
      },
    });
  };

  const handleExampleChange = () => {};

  return (
    <>
      {examples.map((e, i) => (
        <>
          <ExampleList examples={e} index={i} key={i} />
          <FieldRemoveButton onClick={(evt) => removeExampleList(evt, i)}>
            {'Remove list'}
          </FieldRemoveButton>
        </>
      ))}
      <ButtonV2 variant="outline" onClick={addExampleList} data-cy="addExample">
        {t('form.concept.glossData.add', {
          type: t(`form.concept.glossData.examples`),
        })}
      </ButtonV2>
    </>
  );
};

export default Examples;
