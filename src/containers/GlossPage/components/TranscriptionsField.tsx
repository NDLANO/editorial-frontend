/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Select } from '@ndla/forms';
import { useField } from 'formik';
import { useMemo } from 'react';
import TranscriptionField from './TranscriptionField';
import FormikField from '../../../components/FormikField';
import { ROMANIZATION_OPTIONS } from '../glossData';

interface Props {
  name: string;
}

const TranscriptionsField = ({ name }: Props) => {
  const [_, { value }] = useField<{ [key: string]: string }>(name);
  const { t } = useTranslation();

  const transcriptionKeys = Object.keys(value);
  const availableRomanizations = useMemo(
    () => ROMANIZATION_OPTIONS.filter((option) => !transcriptionKeys.includes(option)),
    [transcriptionKeys],
  );
  return (
    <FormikField name={name}>
      {({ field }) => (
        <>
          {Object.keys(value).map((key) => (
            <TranscriptionField
              key={key}
              label={key}
              name={`${name}.${key}`}
              value={value[key]}
              removeField={() => {
                // Delete key from value object, keep remainingTranscriptions
                const { [key]: _, ...remainingTranscriptions } = value;
                field.onChange({
                  target: {
                    name,
                    value: remainingTranscriptions,
                  },
                });
              }}
            />
          ))}

          {availableRomanizations.length > 0 && (
            <Select
              value={'placeholder'}
              onChange={(e) =>
                field.onChange({
                  target: {
                    name,
                    value: { ...value, [e.currentTarget.value]: '' },
                  },
                })
              }
            >
              <option value={'placeholder'}>
                {t('form.concept.glossDataSection.choose', {
                  label: t('form.concept.glossDataSection.romanization').toLowerCase(),
                })}
              </option>

              {availableRomanizations.map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
            </Select>
          )}
        </>
      )}
    </FormikField>
  );
};

export default TranscriptionsField;