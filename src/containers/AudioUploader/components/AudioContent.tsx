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
import styled from '@emotion/styled';
import Tooltip from '@ndla/tooltip';
import { spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import IconButton from '../../../components/IconButton';
import AudioPlayer from './AudioPlayer';
import FormikField from '../../../components/FormikField';
import { AudioFormikType } from './AudioForm';

interface BaseProps {
  classes: BEMHelper<BEMHelper.ReturnObject>;
}

interface Props extends BaseProps {
  formik: FormikContextType<AudioFormikType>;
}

const StyledDeleteButtonContainer = styled.div`
  position: absolute;
  right: -${spacing.medium};
  transform: translateY(${spacing.normal});
  z-index: 1;
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
  const { values, setFieldValue } = formik;
  const PlayerOrSelector = () => {
    const playerObject = getPlayerObject(values);
    if (playerObject) {
      return (
        <>
          <StyledDeleteButtonContainer>
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
          <AudioPlayer audio={playerObject} />
        </>
      );
    } else {
      return (
        <input
          id="audioFile"
          name="audioFile"
          type="file"
          onChange={evt => {
            const file = evt.currentTarget.files?.[0];
            const filepath = file ? URL.createObjectURL(file) : undefined;
            const newFile = file && filepath ? { file, filepath } : undefined;
            setFieldValue('audioFile', { newFile });
          }}
        />
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

      <FormikField noBorder name="audioFile" label={t('form.audio.file')}>
        {() => <PlayerOrSelector />}
      </FormikField>
    </Fragment>
  );
};

export default injectT(connect<BaseProps & tType, AudioFormikType>(AudioContent));
