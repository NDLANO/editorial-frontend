/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { FieldProps, FormikValues } from 'formik';
import FormikField from '../../components/FormikField';
import GrepCodesFieldContent from './GrepCodesFieldContent';

interface Props {
  grepCodes: string[];
}

const GrepCodesField = ({ grepCodes }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <FormikField name="grepCodes" label={t('form.grepCodes.label')}>
        {({ field, form }: FieldProps<string[], FormikValues>) => (
          <GrepCodesFieldContent articleGrepCodes={grepCodes} field={field} form={form} />
        )}
      </FormikField>
    </>
  );
};

export default GrepCodesField;
