/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { FieldHeader, InputV2 } from '@ndla/forms';
import FormikField from '../../../components/FormikField';

const OriginField = () => {
  const { t } = useTranslation();
  return (
    <>
      <FieldHeader title={t('form.origin.label')} width={3 / 4} />
      <FormikField name="origin">
        {({ field }) => (
          <InputV2
            customCss={{ width: '75%' }}
            label={t('form.origin.label')}
            labelHidden={true}
            {...field}
          ></InputV2>
        )}
      </FormikField>
    </>
  );
};

export default OriginField;
