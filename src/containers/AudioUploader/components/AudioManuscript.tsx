/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect, FormikContextType } from 'formik';
import BEMHelper from 'react-bem-helper';

import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import textTransformPlugin from '../../../components/SlateEditor/plugins/textTransform';
import { AudioFormikType } from './AudioForm';

interface BaseProps {
  classes: BEMHelper<BEMHelper.ReturnObject>;
}

interface Props extends BaseProps {
  formik: FormikContextType<AudioFormikType>;
}

const plugins = [textTransformPlugin()];

const AudioManuscript = ({ formik }: Props) => {
  const { t } = useTranslation();
  const { submitForm, handleBlur } = formik;

  return (
    <FormikField label={t('podcastForm.fields.manuscript')} name="manuscript">
      {({ field }) => (
        <PlainTextEditor
          id={field.name}
          {...field}
          className={'manuscript'}
          placeholder={t('podcastForm.fields.manuscript')}
          handleSubmit={submitForm}
          plugins={plugins}
          onBlur={(event: Event, editor: unknown, next: Function) => {
            next();
            // this is a hack since formik onBlur-handler interferes with slates
            // related to: https://github.com/ianstormtaylor/slate/issues/2434
            // formik handleBlur needs to be called for validation to work (and touched to be set)
            setTimeout(() => handleBlur({ target: { name: 'manuscript' } }), 0);
          }}
        />
      )}
    </FormikField>
  );
};

export default connect<BaseProps, AudioFormikType>(AudioManuscript);
