/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { FieldProps, Form, Formik, FormikProps } from 'formik';
import { AudioPlayer } from '@ndla/ui';
import { spacing } from '@ndla/core';
import { ModalBody, ModalHeader } from '@ndla/modal';
import Button from '@ndla/button';
import { Input } from '@ndla/forms';
import ObjectSelector from '../../../ObjectSelector';
import { SlateAudio, AudioEmbed } from '../../../../interfaces';
import validateFormik, { RulesType } from '../../../formikValidationSchema';
import FormikField from '../../../FormikField';

interface Props {
  audio: SlateAudio;
  embed: AudioEmbed;
  onExit: () => void;
  type: string;
  setHasError: (error: boolean) => void;
  saveEmbedUpdates: (updates: Record<string, string>) => void;
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
  padding: ${spacing.small} 0;
`;

interface FormValues {
  alttext: string;
  type: string;
}

export const audioEmbedFormRules: RulesType<FormValues> = {
  alttext: {
    required: true,
  },
  type: {
    required: true,
  },
};

export const toAudioEmbedFormValues = (embed: AudioEmbed, type: string): FormValues => {
  return {
    alttext: embed.alt ?? '',
    type,
  };
};

const EditAudio = ({ embed, onExit, type, audio, setHasError, saveEmbedUpdates }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toAudioEmbedFormValues(embed, type), [embed, type]);
  const handleSubmit = ({ alttext, type }: FormValues) => {
    saveEmbedUpdates({ alt: alttext, type });
    setHasError(false);
    onExit();
  };

  return (
    <>
      <ModalHeader>
        <h1 id="editAudioEmbed">{t('form.editAudio')}</h1>
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          validate={values => validateFormik(values, audioEmbedFormRules, t)}
          enableReinitialize
          validateOnMount
          onSubmit={handleSubmit}>
          {formik => (
            <AudioEmbedForm audio={audio} {...formik} setHasError={setHasError} close={onExit} />
          )}
        </Formik>
      </ModalBody>
    </>
  );
};

interface AudioEmbedFormProps extends FormikProps<FormValues> {
  setHasError: (hasError: boolean) => void;
  close: () => void;
  audio: SlateAudio;
}

const StyledFormikField = styled(FormikField)`
  margin-top: ${spacing.small};
`;

const AudioEmbedForm = ({
  setHasError,
  close,
  audio,
  isValid,
  dirty,
  values,
  initialErrors,
}: AudioEmbedFormProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    setHasError(!isValid);
  }, [isValid, setHasError]);

  const onClose = () => {
    setHasError(!!Object.keys(initialErrors).length);
    close();
  };

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
      <AudioPlayer
        src={audio.audioFile.url}
        title={audio.title}
        speech={values.type === 'minimal'}
      />
      <StyledFormikField name="alttext">
        {({ field }: FieldProps) => (
          <Input
            white
            {...field}
            label={t('form.name.alttext')}
            placeholder={t('form.name.alttext')}
          />
        )}
      </StyledFormikField>
      <ButtonWrapper>
        <Button onClick={onClose}>{t('form.abort')}</Button>
        <Button disabled={!isValid || !dirty} type="submit">
          {t('form.save')}
        </Button>
      </ButtonWrapper>
    </Form>
  );
};

export default EditAudio;
