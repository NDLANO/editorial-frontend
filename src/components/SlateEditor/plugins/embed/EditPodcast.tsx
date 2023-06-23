/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { Form, Formik, FormikProps } from 'formik';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { Input } from '@ndla/forms';
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle } from '@ndla/modal';
import { AudioEmbed, LocaleType, SlateAudio } from '../../../../interfaces';
import FormikField from '../../../FormikField';
import validateFormik, { RulesType } from '../../../formikValidationSchema';
import AudioPlayerMounter from './AudioPlayerMounter';

interface Props {
  podcast: SlateAudio;
  embed: AudioEmbed;
  language: string;
  close: () => void;
  speech?: boolean;
  locale: LocaleType;
  setHasError: (error: boolean) => void;
  saveEmbedUpdates: (updates: Record<string, string>) => void;
}

interface FormValues {
  alttext: string;
}

export const podcastEmbedFormRules: RulesType<FormValues> = {
  alttext: {
    required: true,
  },
};

export const toPodcastEmbedFormValues = (embed: AudioEmbed): FormValues => {
  return {
    alttext: embed.alt ?? '',
  };
};

const EditPodcast = ({
  podcast,
  embed,
  language,
  locale,
  close,
  setHasError,
  saveEmbedUpdates,
}: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toPodcastEmbedFormValues(embed), [embed]);
  const handleSubmit = ({ alttext }: FormValues) => {
    saveEmbedUpdates({ alt: alttext });
    close();
  };

  return (
    <>
      <ModalHeader>
        <ModalTitle id="editPodcastEmbed">{t('form.editPodcast')}</ModalTitle>
        <ModalCloseButton onClick={close} />
      </ModalHeader>
      <ModalBody>
        <AudioPlayerMounter audio={podcast} locale={locale} speech={false} />
        <Formik
          initialValues={initialValues}
          validate={(values) => validateFormik(values, podcastEmbedFormRules, t)}
          validateOnMount
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {(formik) => <SlatePodcastForm {...formik} setHasError={setHasError} close={close} />}
        </Formik>
      </ModalBody>
    </>
  );
};

interface SlatePodcastFormProps extends FormikProps<FormValues> {
  setHasError: (hasError: boolean) => void;
  close: () => void;
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
  padding: ${spacing.small} 0;
`;

const StyledFormikField = styled(FormikField)`
  margin-top: ${spacing.small};
`;

const SlatePodcastForm = ({ setHasError, isValid, dirty, close }: SlatePodcastFormProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    setHasError(!isValid);
  }, [isValid, setHasError]);

  return (
    <Form>
      <StyledFormikField name="alttext">
        {({ field }) => (
          <Input
            white
            {...field}
            label={t('form.name.alttext')}
            placeholder={t('form.name.alttext')}
          />
        )}
      </StyledFormikField>
      <ButtonWrapper>
        <ButtonV2 onClick={close}>{t('form.abort')}</ButtonV2>
        <ButtonV2 disabled={!isValid || !dirty} type="submit">
          {t('form.save')}
        </ButtonV2>
      </ButtonWrapper>
    </Form>
  );
};

export default EditPodcast;
