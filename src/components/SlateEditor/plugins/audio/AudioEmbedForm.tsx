/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, Form, Formik, useFormikContext } from 'formik';
import { useCallback, useMemo, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { ModalBody, ModalHeader, ModalTitle } from '@ndla/modal';
import { IAudioMetaInformation } from '@ndla/types-backend/audio-api';
import { AudioEmbedData } from '@ndla/types-embed';
import { AudioPlayer } from '@ndla/ui';
import FormikField from '../../../FormikField';
import validateFormik, { RulesType } from '../../../formikValidationSchema';
import ObjectSelector from '../../../ObjectSelector';

interface Props {
  embed: AudioEmbedData;
  audio: IAudioMetaInformation;
  onCancel: () => void;
  onSave: (embed: AudioEmbedData) => void;
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
  padding: ${spacing.small} 0;
`;

interface FormValues {
  type: string;
}

export const toAudioEmbedFormValues = (embed: AudioEmbedData): FormValues => {
  return {
    type: embed.type,
  };
};

export const audioEmbedFormRules: RulesType<FormValues> = {
  type: {
    required: true,
  },
};

const AudioEmbedForm = ({ embed, onCancel, onSave, audio }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toAudioEmbedFormValues(embed), [embed]);

  const validate = useCallback((values: FormValues) => validateFormik(values, audioEmbedFormRules, t), [t]);

  const handleSubmit = useCallback(
    (values: FormValues) => {
      onSave({ ...embed, ...values });
    },
    [embed, onSave],
  );

  return (
    <>
      <ModalHeader>
        <ModalTitle>{t('form.editAudio')}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          validate={validate}
          enableReinitialize
          validateOnMount
          onSubmit={handleSubmit}
        >
          <EmbedForm audio={audio} onCancel={onCancel} />
        </Formik>
      </ModalBody>
    </>
  );
};

interface EmbedFormProps {
  onCancel: () => void;
  audio: IAudioMetaInformation;
}

const EmbedForm = ({ onCancel, audio }: EmbedFormProps) => {
  const { t } = useTranslation();
  const { isValid, dirty, values } = useFormikContext<FormValues>();
  return (
    <Form>
      <FormikField name="type">
        {({ field }: FieldProps) => (
          <ObjectSelector
            onClick={(evt: MouseEvent) => evt.stopPropagation()}
            onChange={field.onChange}
            onBlur={field.onChange}
            key="type"
            name="type"
            labelKey="label"
            idKey="id"
            value={field.value}
            options={[
              {
                id: 'standard',
                label: t('form.audio.sound'),
              },
              {
                id: 'minimal',
                label: t('form.audio.speech'),
              },
            ]}
          />
        )}
      </FormikField>
      <AudioPlayer src={audio.audioFile.url} title={audio.title.title} speech={values.type === 'minimal'} />
      <ButtonWrapper>
        <ButtonV2 onClick={onCancel}>{t('form.abort')}</ButtonV2>
        <ButtonV2 disabled={!isValid || !dirty} type="submit">
          {t('form.save')}
        </ButtonV2>
      </ButtonWrapper>
    </Form>
  );
};

export default AudioEmbedForm;
