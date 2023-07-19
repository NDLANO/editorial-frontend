/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Input, FieldRemoveButton, FieldSection } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
import FormikField from '../../../components/FormikField';

interface Props {
  label: string;
  name: string;
  arrayHelpers: any;
  value?: string;
}

const TranscriptionField = ({ name, value, label, arrayHelpers }: Props) => {
  const { t } = useTranslation();

  return (
    <FormikField name={name}>
      {({ field }) => (
        <>
          <FieldSection>
            <Input
              label={label}
              placeholder={t('form.concept.glossDataSection.transcription')}
              value={value ?? ''}
              data-cy="transcription-selector"
              onChange={(e) =>
                field.onChange({
                  target: {
                    name,
                    value: e.currentTarget.value,
                  },
                })
              }
            />
            <FieldRemoveButton onClick={() => arrayHelpers.remove(label)} />
          </FieldSection>
        </>
      )}
    </FormikField>
  );
};

export default TranscriptionField;
