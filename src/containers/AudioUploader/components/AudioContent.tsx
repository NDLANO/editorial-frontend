/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { connect, FormikContextType } from 'formik';
import BEMHelper from 'react-bem-helper';
import { UploadDropZone } from '@ndla/forms';
import styled from '@emotion/styled';
import Tooltip from '@ndla/tooltip';
import { DeleteForever } from '@ndla/icons/editor';
import IconButton from '../../../components/IconButton';
import AudioPlayer from './AudioPlayer';
import FormikField from '../../../components/FormikField';
import { AudioFormikType } from './AudioForm';
import { TitleField } from '../../FormikForm';

interface BaseProps {
  classes: BEMHelper<BEMHelper.ReturnObject>;
}

interface Props extends BaseProps {
  formik: FormikContextType<AudioFormikType>;
}

const StyledDeleteButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const getPlayerObject = (
  values: AudioFormikType,
): { src: string; mimeType: string } | undefined => {
  const { newFile, storedFile } = values.audioFile;

  if (newFile) {
    return {
      src: newFile.filepath,
      mimeType: newFile.file.type,
    };
  } else if (storedFile) {
    return {
      src: storedFile.url,
      mimeType: storedFile.mimeType,
    };
  }
  return undefined;
};

const AudioContent = ({ t, formik }: Props & tType) => {
  const { values, setFieldValue, submitForm, handleBlur } = formik;
  const PlayerOrSelector = () => {
    const playerObject = getPlayerObject(values);
    if (playerObject) {
      return (
        <>
          <StyledDeleteButtonContainer>
            <AudioPlayer audio={playerObject} />
            <Tooltip tooltip={t('form.audio.remove')}>
              <IconButton
                onClick={() => {
                  setFieldValue('audioFile', {});
                }}
                tabIndex={-1}>
                <DeleteForever />
              </IconButton>
            </Tooltip>
          </StyledDeleteButtonContainer>
        </>
      );
    } else {
      return (
        <UploadDropZone
          name="audioFile"
          allowedFiles={['audio/mp3', 'audio/mpeg']}
          onAddedFiles={(files: FileList, evt: React.FormEvent<HTMLInputElement>) => {
            const file = evt.currentTarget.files?.[0];
            const filepath = file ? URL.createObjectURL(file) : undefined;
            const newFile = file && filepath ? { file, filepath } : undefined;
            setFieldValue('audioFile', { newFile });
          }}
          ariaLabel={t('form.audio.dragdrop.ariaLabel')}>
          <strong>{t('form.audio.dragdrop.main')}</strong>
          {t('form.audio.dragdrop.sub')}
        </UploadDropZone>
      );
    }
  };

  return (
    <Fragment>
      <TitleField
        handleSubmit={submitForm}
        name={'title'}
        onBlur={(event: Event, editor: unknown, next: Function) => {
          next();
          // this is a hack since formik onBlur-handler interferes with slates
          // related to: https://github.com/ianstormtaylor/slate/issues/2434
          // formik handleBlur needs to be called for validation to work (and touched to be set)
          setTimeout(() => handleBlur({ target: { name: 'title' } }), 0);
        }}
      />

      <FormikField noBorder name="audioFile" label={t('form.audio.file')}>
        {() => <PlayerOrSelector />}
      </FormikField>
    </Fragment>
  );
};

export default injectT(connect<BaseProps & tType, AudioFormikType>(AudioContent));
