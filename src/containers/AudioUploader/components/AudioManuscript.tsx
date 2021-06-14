/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { ReactEditor } from 'slate-react';
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
          onBlur={(event, editor) => {
            // Forcing slate field to be deselected before selecting new field.
            // Fixes a problem where slate field is not properly focused on click.
            ReactEditor.deselect(editor);

            // TODO: Can possibly be removed
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

export default injectT(connect<BaseProps & tType, AudioFormikType>(AudioManuscript));
