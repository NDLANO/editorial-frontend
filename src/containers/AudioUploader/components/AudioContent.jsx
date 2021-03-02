/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT } from '@ndla/i18n';
import { useFormikContext } from 'formik';
import AudioPlayer from './AudioPlayer';
import FormikField from '../../../components/FormikField';

const AudioContent = ({ t }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <Fragment>
      <FormikField
        label={t('form.title.label')}
        name="title"
        title
        noBorder
        placeholder={t('form.title.label')}
      />
      {!values.id && (
        <FormikField noBorder name="audioFile" label={t('form.audio.file')}>
          {() => (
            <input
              id="audioFile"
              name="audioFile"
              type="file"
              onChange={evt => {
                setFieldValue(
                  'filepath',
                  evt.target && evt.target.files[0]
                    ? URL.createObjectURL(evt.target.files[0])
                    : undefined,
                );
                setFieldValue('audioFile', evt.target.files[0]);
              }}
            />
          )}
        </FormikField>
      )}
      {(values.id || (values.audioFile && values.filepath)) && (
        <AudioPlayer audio={values.audioFile} filepath={values.filepath} />
      )}
    </Fragment>
  );
};

AudioContent.propTypes = {};

export default injectT(AudioContent);
