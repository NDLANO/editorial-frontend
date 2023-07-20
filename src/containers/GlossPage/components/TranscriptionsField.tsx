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
import FormikField from '../../../components/FormikField';

interface Props {
  name: string;
  values: { [key: string]: string };
}

const TranscriptionsField = ({ name, values: transcriptions }: Props) => {
  const { t } = useTranslation();

  const transcriptionKeys = Object.keys(transcriptions);
  const availableRomanizations = ROMANIZATION_OPTIONS.filter((o) => !transcriptionKeys.includes(o));

  return (
    <FormikField name={name}>
      {({ field }) => (
        <>
          <FieldArray
            name={name}
            render={() =>
              Object.keys(transcriptions).map((key) => (
                <TranscriptionField
                  key={key}
                  label={key}
                  name={`${name}.${key}`}
                  value={transcriptions[key]}
                  removeField={() => {
                    const copy: { [key: string]: string } = {};
                    Object.keys(transcriptions).forEach((k) => {
                      if (k !== key) {
                        copy[k] = transcriptions[k];
                      }
                    });

                    field.onChange({
                      target: {
                        name,
                        value: copy,
                      },
                    });
                  }}
                />
              ))
            }
          />

          {availableRomanizations.length > 0 && (
            <Select
              value={'placeholder'}
              onChange={(e) =>
                field.onChange({
                  target: {
                    name,
                    value: { ...transcriptions, [e.currentTarget.value]: '' },
                  },
                })
              }
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
    </FormikField>
  );
};

export default TranscriptionsField;
