/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from 'react';
import { FieldSection, Input, FieldRemoveButton } from '@ndla/forms';
import { IGlossExample } from '@ndla/types-backend/build/concept-api';
import TranscriptionsField from './TranscriptionsField';

interface Props {
  placeholder?: string;
  labelRemove?: string;
  example: IGlossExample;
  index: number;
  handleExampleChange: (
    event: FormEvent<HTMLSelectElement> | FormEvent<HTMLInputElement> | any,
    fieldname: string,
    index: number,
  ) => void;
  removeExample: (event: MouseEvent<HTMLButtonElement>, index: number) => void;
}

const Example = ({
  labelRemove,
  placeholder,
  example,
  index,
  handleExampleChange,
  removeExample,
}: Props) => {
  return (
    <>
      <FieldSection>
        <>
          <Input
            type="text"
            placeholder={placeholder}
            value={example.example}
            onChange={(e) => handleExampleChange(example, 'example', index)}
          />
          <Input
            type="text"
            placeholder={placeholder}
            value={example.language}
            onChange={(e) => handleExampleChange(example, 'language', index)}
          />
        </>
        <>
          <FieldRemoveButton onClick={(evt) => removeExample(evt, index)}>
            {'Remove this transcription'}
          </FieldRemoveButton>
        </>
      </FieldSection>
      <TranscriptionsField
        name={'transcriptions'}
        values={example.transcriptions}
        onChange={(e) => handleExampleChange(e, 'transcriptions', index)}
      />
    </>
  );
};

export default Example;
