/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { connect, FormikContextType } from 'formik';
import BEMHelper from 'react-bem-helper';

import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import { textTransformPlugin } from '../../../components/SlateEditor/plugins/textTransform';
import { AudioFormikType } from './AudioForm';

interface BaseProps {
  classes: BEMHelper<BEMHelper.ReturnObject>;
}

interface Props extends BaseProps {
  formik: FormikContextType<AudioFormikType>;
}

const plugins = [textTransformPlugin];

const AudioManuscript = ({ t, formik }: Props & tType) => {
  const { submitForm } = formik;

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
        />
      )}
    </FormikField>
  );
};

export default injectT(connect<BaseProps & tType, AudioFormikType>(AudioManuscript));
