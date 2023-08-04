/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Input, FieldRemoveButton } from '@ndla/forms';
import { spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import FormikField from '../../../components/FormikField';

interface Props {
  label: string;
  name: string;
  value?: string;
  removeField: () => void;
}

const StyledTranscriptionField = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: ${spacing.small} 0;

  > :first-child {
    padding-right: ${spacing.small};
  }

  > :last-child {
    margin-bottom: ${spacing.small};
  }
`;

const TranscriptionField = ({ name, value, label, removeField }: Props) => {
  const { t } = useTranslation();

  return (
    <FormikField name={name}>
      {({ field }) => (
        <StyledTranscriptionField>
          <Input
            label={label}
            placeholder={t('form.concept.glossDataSection.transcription')}
            value={value ?? ''}
            data-cy="transcription-selector"
            {...field}
          />
          <FieldRemoveButton onClick={removeField} />
        </StyledTranscriptionField>
      )}
    </FormikField>
  );
};

export default TranscriptionField;
