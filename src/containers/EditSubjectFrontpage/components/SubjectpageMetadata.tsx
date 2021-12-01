/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import { FieldProps } from 'formik';
import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import { textTransformPlugin } from '../../../components/SlateEditor/plugins/textTransform';

import { FormikProperties } from '../../../interfaces';
import SubjectpageBanner from './SubjectpageBanner';
import { ImageApiType } from '../../../modules/image/imageApiInterfaces';

interface FormikProps {
  field: FieldProps<ImageApiType | undefined>['field'];
  form: FormikProperties['form'];
}

const SubjectpageMetadata = () => {
  const { t } = useTranslation();
  const plugins = [textTransformPlugin];
  return (
    <>
      <FormikField
        name="metaDescription"
        maxLength={300}
        showMaxLength
        label={t('form.metaDescription.label')}
        description={t('form.metaDescription.description')}>
        {({ field, form: { isSubmitting } }: FieldProps) => (
          <PlainTextEditor
            id={field.name}
            {...field}
            submitted={isSubmitting}
            placeholder={t('form.metaDescription.label')}
            plugins={plugins}
          />
        )}
      </FormikField>
      <FormikField name="desktopBanner">
        {({ field, form }: FormikProps) => (
          <SubjectpageBanner field={field} form={form} title={t('form.name.desktopBanner')} />
        )}
      </FormikField>
    </>
  );
};

export default SubjectpageMetadata;
