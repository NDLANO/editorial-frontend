/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from 'react';
import { Input, FieldSplitter, Select } from '@ndla/forms';
import { TRANSCRIPTION_OPTIONS } from '../glossaryData';

export interface TranscriptionType {
  key: string;
  value: string;
}

interface Props {
  transcription: { key: string; value: string };
  index: number;
  handleTranscriptionChange: (
    event: FormEvent<HTMLSelectElement> | FormEvent<HTMLInputElement>,
    fieldname: string,
    index: number,
  ) => void;
  removeTranscription: (event: MouseEvent<HTMLButtonElement>, index: number) => void;
  value: TranscriptionType;
}

const Transcription = ({ transcription, index, handleTranscriptionChange, value }: Props) => (
  <>
    <FieldSplitter>
      <Select
        onChange={(e) => handleTranscriptionChange(e, 'key', index)}
        value={transcription.key}
      >
        <option value="" />
        {TRANSCRIPTION_OPTIONS.map((t, index) => (
          <option value={t} key={index}>
            {t}
          </option>
        ))}
      </Select>
      <Input
        type="text"
        placeholder={'Transcription'}
        value={transcription.value}
        onChange={(e) => handleTranscriptionChange(e, 'value', index)}
        data-cy="transcription-selector"
      />
    </FieldSplitter>
  </>
);

export default Transcription;
