/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHeader, FieldSection, Input, Select } from '@ndla/forms';
import { IGlossExample } from '@ndla/types-backend/build/concept-api';
import { useTranslation } from 'react-i18next';
import TranscriptionsField from './TranscriptionsField';
import { LANGUAGES } from '../glossData';
import FormikField from '../../../components/FormikField';

interface Props {
  example: IGlossExample;
  index: number;
  name: string;
}

const ExampleField = ({ example, name }: Props) => {
  const { t } = useTranslation();

  return (
    <FormikField name={name}>
      {({ field }) => (
        <>
          <FieldSection>
            <Input
              type="text"
              placeholder={t('form.concept.glossDataSection.example')}
              value={example.example}
              onChange={(e) =>
                field.onChange({
                  target: {
                    value: { ...example, example: e.currentTarget.value },
                    name,
                  },
                })
              }
            />

            <Select
              value={example.language}
              onChange={(e) =>
                field.onChange({
                  target: {
                    value: { ...example, language: e.currentTarget.value },
                    name,
                  },
                })
              }
            >
              {!example.language && (
                <option>
                  {t('form.concept.glossDataSection.choose', {
                    label: t('form.concept.glossDataSection.language').toLowerCase(),
                  })}
                </option>
              )}
              {LANGUAGES.map((l, language_index) => (
                <option value={l} key={language_index}>
                  {t(`languages.${l}`)}
                </option>
              ))}
            </Select>
          </FieldSection>

          {example.language === 'zh' && (
            <>
              <FieldHeader title={t('form.concept.glossDataSection.transcriptions')} />
              <TranscriptionsField
                name={`${name}.transcriptions`}
                values={example.transcriptions}
              />
            </>
          )}
        </>
      )}
    </FormikField>
  );
};

export default ExampleField;
