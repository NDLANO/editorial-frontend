/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { CheckboxItem, FieldHeader } from '@ndla/forms';
import FormikField from '../../../components/FormikField';

const ProcessedField = () => {
  const { t } = useTranslation();
  return (
    <>
      <FieldHeader title={t('form.processed.label')} width={3 / 4} />
      <FormikField name="processed">
        {({ field }) => (
          <CheckboxItem
            label={t('form.processed.description')}
            checked={field.value}
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
    </>
  );
};

export default ProcessedField;
