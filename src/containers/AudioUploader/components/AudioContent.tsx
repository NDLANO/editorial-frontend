/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FormikHelpers } from 'formik';
import BEMHelper from 'react-bem-helper';
import AudioPlayer from './AudioPlayer';
import FormikField from '../../../components/FormikField';
import { AudioFormikType } from './AudioForm';

interface Props {
  classes: BEMHelper<BEMHelper.ReturnObject>;
  values: AudioFormikType;
  setFieldValue: FormikHelpers<AudioFormikType>['setFieldValue'];
}

const AudioContent = ({ t, values, setFieldValue }: Props & tType) => {
  const PlayerOrSelector = () => {
    if (values.id || (values.audioFile && values.filepath)) {
      return <AudioPlayer audio={values.audioFile!} filepath={values.filepath} />;
    } else {
      return (
        <FormikField noBorder name="audioFile" label={t('form.audio.file')}>
          {() => (
            <input
              id="audioFile"
              name="audioFile"
              type="file"
              onChange={evt => {
                const targetFile = evt.currentTarget.files?.[0];
                const filepathValue = targetFile ? URL.createObjectURL(targetFile) : undefined;
                setFieldValue('filepath', filepathValue);
                setFieldValue('audioFile', targetFile);
              }}
            />
          )}
        </FormikField>
      );
    }
  };

  return (
    <Fragment>
      <FormikField
        label={t('form.title.label')}
        name="title"
        title
        noBorder
        placeholder={t('form.title.label')}
      />
      <PlayerOrSelector />
    </Fragment>
  );
};

export default injectT(AudioContent);
