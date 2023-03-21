/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { FieldProps, Form, Formik, FormikProps } from 'formik';
import { Input, TextArea } from '@ndla/forms';
import { spacing } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { BrightcoveEmbed, ExternalEmbed } from '../../../../interfaces';
import {
  addBrightCoveTimeStampVideoid,
  addYoutubeTimeStamps,
  getBrightCoveStartTime,
  getStartTime,
  getStopTime,
} from '../../../../util/videoUtil';
import validateFormik, { RulesType } from '../../../formikValidationSchema';
import FormikField from '../../../FormikField';
import { SlateVideoWrapper, StyledVideo } from './SlateVideo';

interface Props {
  embed: BrightcoveEmbed | ExternalEmbed;
  saveEmbedUpdates: (change: { [x: string]: string }) => void;
  activeSrc: string;
  close: () => void;
  setHasError: (hasError: boolean) => void;
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
  padding-top: ${spacing.small};
`;

const StyledFormikField = styled(FormikField)`
  margin-top: ${spacing.small};
`;

interface FormValues {
  alttext: string;
  caption: string;
  url?: string;
  videoid?: string;
  startTime: string;
  endTime: string;
  resource: BrightcoveEmbed['resource'] | ExternalEmbed['resource'];
}

export const toVideoEmbedFormValues = (embed: BrightcoveEmbed | ExternalEmbed): FormValues => {
  return {
    alttext: embed.alt ?? '',
    caption: embed.caption ?? '',
    url: embed.resource === 'external' ? embed.url : '',
    startTime: 'videoid' in embed ? getBrightCoveStartTime(embed.videoid) : getStartTime(embed.url),
    endTime: embed.resource === 'external' ? getStopTime(embed.url) : '',
    resource: embed.resource,
  };
};

export const brightcoveEmbedFormRules: RulesType<FormValues> = {
  alttext: {
    required: true,
  },
  caption: {
    required: true,
    translationKey: 'form.video.caption.label',
  },
};

const EditVideo = ({ embed, saveEmbedUpdates, activeSrc, close, setHasError }: Props) => {
  const { t } = useTranslation();

  const initialValues = useMemo(() => toVideoEmbedFormValues(embed), [embed]);

  const handleSave = (values: FormValues) => {
    if (embed.resource === 'brightcove') {
      saveEmbedUpdates({
        alt: values.alttext,
        caption: values.caption,
        videoid: addBrightCoveTimeStampVideoid(embed.videoid, values.startTime),
      });
    } else {
      saveEmbedUpdates({
        alt: values.alttext,
        url: addYoutubeTimeStamps(embed.url!, values.startTime, values.endTime),
      });
    }
    close();
  };

  return (
    <>
      <ModalHeader modifier="no-bottom-padding">
        <h1 id="editVideoEmbed">{t('form.video.editVideo')}</h1>
        <ModalCloseButton onClick={close} />
      </ModalHeader>
      <ModalBody>
        <SlateVideoWrapper>
          <StyledVideo
            title={`Video: ${embed.metaData ? embed.metaData.name : ''}`}
            frameBorder="0"
            src={activeSrc}
            allowFullScreen
          />
        </SlateVideoWrapper>
        <Formik
          initialValues={initialValues}
          validate={
            embed.resource === 'brightcove'
              ? (values) => validateFormik(values, brightcoveEmbedFormRules, t)
              : undefined
          }
          validateOnBlur={false}
          validateOnMount
          onSubmit={handleSave}
        >
          {(formik) => (
            <VideoEmbedForm {...formik} setHasError={setHasError} close={close} embed={embed} />
          )}
        </Formik>
      </ModalBody>
    </>
  );
};
interface VideoEmbedFormProps extends FormikProps<FormValues> {
  setHasError: (hasError: boolean) => void;
  close: () => void;
  embed: BrightcoveEmbed | ExternalEmbed;
}

const StyledInputTimeWrapper = styled.div`
  display: flex;
  flex-flow: row;
`;

const timeInputCss = css`
  width: 120px;
  margin-right: ${spacing.small};
  label {
    width: auto;
  }
`;

const VideoEmbedForm = ({ setHasError, close, embed, isValid, dirty }: VideoEmbedFormProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    setHasError(!isValid);
  }, [isValid, setHasError]);

  return (
    <Form>
      {embed.resource === 'brightcove' && (
        <>
          <StyledFormikField name="alttext" showError>
            {({ field }: FieldProps) => (
              <Input
                white
                {...field}
                placeholder={t('topicArticleForm.fields.alt.placeholder')}
                label={t('topicArticleForm.fields.alt.label')}
              />
            )}
          </StyledFormikField>
          <StyledFormikField name="caption">
            {({ field }) => (
              <TextArea
                {...field}
                white
                label={t('form.video.caption.label')}
                placeholder={t('form.video.caption.placeholder')}
              />
            )}
          </StyledFormikField>
        </>
      )}
      <StyledInputTimeWrapper>
        <StyledFormikField name="startTime">
          {({ field }: FieldProps) => (
            <Input
              {...field}
              label={t('form.video.time.start')}
              placeholder={t('form.video.time.hms')}
              white
              customCss={timeInputCss}
            />
          )}
        </StyledFormikField>
        {embed.resource === 'external' && (
          <StyledFormikField name="endTime">
            {({ field }: FieldProps) => (
              <Input
                {...field}
                label={t('form.video.time.stop')}
                placeholder={t('form.video.time.hms')}
                white
                customCss={timeInputCss}
              />
            )}
          </StyledFormikField>
        )}
      </StyledInputTimeWrapper>
      <ButtonWrapper>
        <ButtonV2 onClick={close}>{t('form.abort')}</ButtonV2>
        <ButtonV2 disabled={!isValid || !dirty} type="submit">
          {t('form.save')}
        </ButtonV2>
      </ButtonWrapper>
    </Form>
  );
};

export default EditVideo;
