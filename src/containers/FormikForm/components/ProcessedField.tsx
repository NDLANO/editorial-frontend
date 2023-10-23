/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { CheckboxItem, FieldHeader } from '@ndla/forms';
import FormikField from '../../../components/FormikField';

const ProcessedField = () => {
  const { t } = useTranslation();
  const [originField] = useField<string>('origin');
  return (
    <>
      <FieldHeader title={t('form.processed.label')} width={3 / 4} />
      <FormikField name="processed">
        {({ field }) => (
          <CheckboxItem
            label={t('form.processed.description')}
            checked={field.value}
            disabled={!originField.value?.length}
            onChange={() =>
              field.onChange({
                target: {
                  name: field.name,
                  value: !field.value,
                },
              })
            }
          />
        )}
      </FormikField>
      {!originField.value?.length && <span>{t('form.processed.disabledCause')}</span>}
    </>
  );
};

export default ProcessedField;
