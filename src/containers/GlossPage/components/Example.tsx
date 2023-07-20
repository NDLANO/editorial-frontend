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
import TranscriptionFieldArray from './TranscriptionFieldArray';
import { LANGUAGES } from '../glossData';
import FormikField from '../../../components/FormikField';

interface Props {
  example: IGlossExample;
  index: number;
  onChange: (event: { target: { value: IGlossExample; name: string } }) => void;
  name: string;
}

const Example = ({ example, onChange, name }: Props) => {
  const { t } = useTranslation();

  const handleExampleChange = (evt: any, fieldName: string) => {
    const target = evt.target ?? evt.currentTarget;

    if (target) {
      const newExample = { ...example, [fieldName]: target.value };
      onChange({
        target: {
          value: newExample,
          name,
        },
      });
    }
  };

  return (
    <FormikField name={`${name}.transcriptions`}>
      {() => (
        <>
          <FieldSection>
            <Input
              type="text"
              placeholder={t('form.concept.glossDataSection.example')}
              value={example.example}
              onChange={(e) => handleExampleChange(e, 'example')}
            />

            <Select value={example.language} onChange={(e) => handleExampleChange(e, 'language')}>
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
              <TranscriptionFieldArray
                name={`${name}.transcriptions`}
                values={example.transcriptions}
                onChange={(e) => handleExampleChange(e, 'transcriptions')}
              />
            </>
          )}
        </>
      )}
    </FormikField>
  );
};

export default Example;
