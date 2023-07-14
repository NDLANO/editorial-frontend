/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from 'react';
import { Input, Select, FieldRemoveButton, FieldSection } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
import { ROMANIZATION_OPTIONS } from '../glossaryData';
import FormikField from '../../../components/FormikField';

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

const Transcription = ({
  transcription,
  index,
  handleTranscriptionChange,
  value,
  removeTranscription,
}: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <FieldSection>
        <FieldRemoveButton onClick={(evt) => removeTranscription(evt, index)} />

        <Select
          onChange={(e) => handleTranscriptionChange(e, 'key', index)}
          value={transcription.key}
        >
          {!transcription.key && (
            <option>
              {t('form.concept.glossDataSection.choose', {
                label: t('form.concept.glossDataSection.romanization'),
              })}
            </option>
          )}
          {ROMANIZATION_OPTIONS.map((t, index) => (
            <option value={t} key={index}>
              {t}
            </option>
          ))}
        </Select>
        <Input
          type="text"
          placeholder={t('form.concept.glossDataSection.transcription')}
          value={transcription.value}
          onChange={(e) => handleTranscriptionChange(e, 'value', index)}
          data-cy="transcription-selector"
        />
      </FieldSection>
    </>
  );
};

export default Transcription;
