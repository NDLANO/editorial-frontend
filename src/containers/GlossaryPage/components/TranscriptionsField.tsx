/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from 'react';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { FieldRemoveButton } from '@ndla/forms';
import Transcription from './Transcription';

interface Props {
  name: string;
  onChange: (event: { target: { value: { [key: string]: string }; name: string } }) => void;
  errorMessages?: string[];
  showError?: boolean;
  placeholder?: string;
  disabled?: boolean;
  values: { [key: string]: string };
}

const TranscriptionsField = ({ name, onChange, values: transcriptions }: Props) => {
  const { t } = useTranslation();

  const transcriptionsArray = Object.entries(transcriptions).map(([key, value]) => ({
    key,
    value,
  }));

  const onTranscriptionChange = (newTranscriptions: { [key: string]: string }[]) => {
    const transcriptionsObject = newTranscriptions.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});

    onChange({
      target: {
        value: transcriptionsObject,
        name,
      },
    });
  };

  const addTranscription = () => {
    const newTranscriptions = [...transcriptionsArray];
    newTranscriptions.push({ key: '', value: '' });
    onTranscriptionChange(newTranscriptions);
  };

  const removeTranscription = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    const newTranscriptions = [...transcriptionsArray];
    newTranscriptions.splice(index, 1);
    onTranscriptionChange(newTranscriptions);
  };

  const handleTranscriptionChange = (
    evt: FormEvent<HTMLInputElement> | FormEvent<HTMLSelectElement>,
    fieldName: string,
    index: number,
  ) => {
    const newTranscriptions = [...transcriptionsArray];

    newTranscriptions[index] = {
      ...newTranscriptions[index],
      [fieldName]: evt.currentTarget.value,
    };
    onTranscriptionChange(newTranscriptions);
  };

  return (
    <>
      {transcriptionsArray.map((transcription, index) => (
        <div key={index}>
          {transcriptionsArray.length > 0 && (
            <FieldRemoveButton onClick={(evt) => removeTranscription(evt, index)} />
          )}

          <Transcription
            key={`transcription_${index}`} // eslint-disable-line react/no-array-index-key
            index={index}
            transcription={transcription}
            value={transcription}
            handleTranscriptionChange={handleTranscriptionChange}
            removeTranscription={removeTranscription}
          />
        </div>
      ))}
      <ButtonV2 variant="outline" onClick={addTranscription} data-cy="addTranscription">
        {t('form.concept.glossData.add', {
          type: t(`form.concept.glossData.transcriptions`),
        })}
      </ButtonV2>
    </>
  );
};

export default TranscriptionsField;
