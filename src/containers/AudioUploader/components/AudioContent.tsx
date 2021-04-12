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

const getPlayerObject = (
  values: AudioFormikType,
): { src: string; mimeType: string } | undefined => {
  if (values.newAudio) {
    return {
      src: values.newAudio.filepath,
      mimeType: values.newAudio.file.type,
    };
  } else if (values.storedAudioFile) {
    return {
      src: values.storedAudioFile.url,
      mimeType: values.storedAudioFile.mimeType,
    };
  }
  return undefined;
};

const AudioContent = ({ t, values, setFieldValue }: Props & tType) => {
  const PlayerOrSelector = () => {
    const playerObject = getPlayerObject(values);
    if (playerObject) {
      return <AudioPlayer audio={playerObject} />;
    } else {
      return (
        <FormikField noBorder name="audioFile" label={t('form.audio.file')}>
          {() => (
            <input
              id="audioFile"
              name="audioFile"
              type="file"
              onChange={evt => {
                const file = evt.currentTarget.files?.[0];
                const filepath = file ? URL.createObjectURL(file) : undefined;
                setFieldValue('newAudio', { filepath, file });
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
