/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Select } from '@ndla/forms';
import { FieldArray } from 'formik';
import TranscriptionField from './TranscriptionField';
import { ROMANIZATION_OPTIONS } from '../glossData';

interface Props {
  name: string;
  onChange: (event: { target: { value: { [key: string]: string }; name: string } }) => void;
  values: { [key: string]: string };
}

const TranscriptionFieldArray = ({ name, onChange, values: transcriptions }: Props) => {
  const { t } = useTranslation();

  const transcriptionKeys = Object.keys(transcriptions);
  const availableRomanizations = ROMANIZATION_OPTIONS.filter((o) => !transcriptionKeys.includes(o));

  const onTranscriptionChange = (newTranscriptions: { [key: string]: string }) => {
    onChange({
      target: {
        value: newTranscriptions,
        name,
      },
    });
  };
  const handleTranscriptionChange = (key: string, value: string) => {
    if (value === 'placeholder') return;
    const newTranscriptions = transcriptions;
    newTranscriptions[key] = value;
    onTranscriptionChange(newTranscriptions);
  };

  return (
    <>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <>
            {Object.keys(transcriptions).map((key, index) => (
              <TranscriptionField
                key={key}
                label={key}
                name={`${name}.${key}`}
                value={transcriptions[key]}
                arrayHelpers={arrayHelpers}
              />
            ))}
            {availableRomanizations.length > 0 && (
              <Select
                value={'placeholder'}
                onChange={(e) => handleTranscriptionChange(e.currentTarget.value, '')}
              >
                <option value={'placeholder'}>
                  {t('form.concept.glossDataSection.choose', {
                    label: t('form.concept.glossDataSection.romanization').toLowerCase(),
                  })}
                </option>

                {availableRomanizations.map((t, index) => (
                  <option value={t} key={index}>
                    {t}
                  </option>
                ))}
              </Select>
            )}
          </>
        )}
      />
    </>
  );
};

export default TranscriptionFieldArray;
