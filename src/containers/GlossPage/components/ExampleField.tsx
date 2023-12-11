/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Input, Select, FieldSplitter } from '@ndla/forms';
import { IGlossExample } from '@ndla/types-backend/concept-api';
import TranscriptionsField from './TranscriptionsField';
import FormikField from '../../../components/FormikField';
import { LANGUAGES } from '../glossData';

interface Props {
  example: IGlossExample;
  name: string;
}

const StyledFormikField = styled(FormikField)`
  margin: 0px;
  // Important is to override styling with higher specificity coming from FieldSection
  border-top: none !important;
`;

const ExampleField = ({ example, name }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledFormikField name={name}>
      {({ field }) => (
        <>
          <FieldSplitter>
            <Input
              type="text"
              placeholder={t('form.gloss.example')}
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
                  {t('form.gloss.choose', {
                    label: t('form.gloss.language').toLowerCase(),
                  })}
                </option>
              )}
              {LANGUAGES.map((language, languageIndex) => (
                <option value={language} key={languageIndex}>
                  {t(`languages.${language}`)}
                </option>
              ))}
            </Select>
          </FieldSplitter>
          {example.language === 'zh' && <TranscriptionsField name={`${name}.transcriptions`} />}
        </>
      )}
    </StyledFormikField>
  );
};

export default ExampleField;
