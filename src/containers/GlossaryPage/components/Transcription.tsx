/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from 'react';
import { FieldSection, FieldSplitter, Input, FieldRemoveButton } from '@ndla/forms';

export interface TranscriptionType {
  key: string;
  value: string;
}

interface Props {
  placeholder?: string;
  labelRemove?: string;
  transcription: { key: string; value: string };
  index: number;
  handleTranscriptionChange: (
    event: FormEvent<HTMLSelectElement> | FormEvent<HTMLInputElement>,
    fieldname: string,
    index: number,
  ) => void;
  removeTranscription: (event: MouseEvent<HTMLButtonElement>, index: number) => void;
}

const Transcription = ({
  labelRemove,
  placeholder,
  transcription,
  index,
  handleTranscriptionChange,
  removeTranscription,
}: Props) => (
  <FieldSection>
    <>
      <FieldSplitter>
        <Input
          type="text"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          placeholder={placeholder}
          value={transcription.key}
          onChange={(e) => handleTranscriptionChange(e, 'key', index)}
        />
        <Input
          type="text"
          value={transcription.value}
          onChange={(e) => handleTranscriptionChange(e, 'value', index)}
          data-cy="transcription-selector"
        />
      </FieldSplitter>
    </>
    <div>
      <FieldRemoveButton onClick={(evt) => removeTranscription(evt, index)}>
        {labelRemove}
      </FieldRemoveButton>
    </div>
  </FieldSection>
);

export default Transcription;
