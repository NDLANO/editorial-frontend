/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, ReactNode } from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { injectT, tType } from '@ndla/i18n';
import { AccordionWrapper } from '@ndla/accordion';
import AccordionSection from '../../ConceptPage/ConceptForm/AccordionSection';
import AudioContent from '../../AudioUploader/components/AudioContent';
import AudioMetaData from '../../AudioUploader/components/AudioMetaData';
import { formClasses, AbortButton, AlertModalWrapper } from '../../FormikForm';
import PodcastMetaData from './PodcastMetaData';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik from '../../../components/formikValidationSchema';
import SaveButton from '../../../components/SaveButton';
import Field from '../../../components/Field';
import { isFormikFormDirty, parseCopyrightContributors } from '../../../util/formHelper';
import { toEditPodcast } from '../../../util/routeHelpers';
import {
  NewPodcastMeta,
  NewPodcastMetaInformation,
  NewAudioMetaInformation,
  PodcastFormValues,
} from '../../../modules/audio/audioApiInterfaces';
import { Copyright, License } from '../../../interfaces';

const podcastRules = {
  title: {
    required: true,
  },
  tags: {
    minItems: 3,
  },
  creators: {
    minItems: 1,
    allObjectFieldsRequired: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
  audioFile: {
    required: true,
  },
  license: {
    required: true,
  },
  header: {
    required: true,
  },
  manuscript: {
    required: true,
  },
  metaImageAlt: {
    // coverPhotoAltText
    required: true,
    onlyValidateIf: (values: PodcastFormValues) => !!values.coverPhotoId,
  },
  introduction: {
    required: true,
  },
  coverPhotoId: {
    required: true,
  },
};

export const getInitialValues = (audio: PodcastPropType = {}): PodcastFormValues => {
  return {
    id: audio?.id || 0, // TODO remove ||
    revision: audio?.revision || 0, // TODO remove ||
    language: audio?.language || '', // TODO remove ||
    supportedLanguages: audio.supportedLanguages || [],
    title: audio.title,
    audioFile: audio.audioFile,
    filepath: '',
    tags: audio.tags || [],
    origin: audio?.copyright?.origin || '',
    creators: parseCopyrightContributors(audio, 'creators'),
    processors: parseCopyrightContributors(audio, 'processors'),
    rightsholders: parseCopyrightContributors(audio, 'rightsholders'),
    license: audio?.copyright?.license?.license,
    audioType: 'podcast',
    header: audio.podcastMeta?.header,
    introduction: audio.podcastMeta?.introduction,
    coverPhotoId: audio.podcastMeta?.coverPhotoId,
    metaImageAlt: audio.podcastMeta?.coverPhotoAltText, // coverPhotoAltText
    manuscript: audio.podcastMeta?.manuscript,
  };
};

interface PodcastPropType {
  id?: number;
  revision?: number;
  title?: string;
  language?: string;
  supportedLanguages?: string[];
  audioFile?: {
    url: string;
    mimeType: string;
    fileSize: number;
    language: string;
  };
  copyright?: Copyright;
  tags?: string[];
  audioType?: 'podcast';
  podcastMeta?: NewPodcastMeta;
}

type ErrorFields =
  | 'alttext'
  | 'audioFile'
  | 'caption'
  | 'creators'
  | 'coverPhotoId'
  | 'header'
  | 'introduction'
  | 'license'
  | 'metaImageAlt'
  | 'manuscript'
  | 'processors'
  | 'rightsholders'
  | 'tags'
  | 'title'
  | 'audioFile';

const FormWrapper = ({ inModal, children }: { inModal?: boolean; children: ReactNode }) => {
  if (inModal) {
    return <div {...formClasses()}>{children}</div>;
  }
  return <Form>{children}</Form>;
};

interface Props {
  audio: PodcastPropType;
  inModal?: boolean;
  isNewlyCreated?: boolean;
  formikProps?: FormikProps<PodcastPropType>; // TODO type in <?>
  licenses: License[];
  onUpdate: (audioMetadata: NewAudioMetaInformation, podcastFile: string | Blob) => void;
}

const PodcastForm = ({ t, audio, inModal, isNewlyCreated, licenses, onUpdate }: Props & tType) => {
  const [savedToServer, setSavedToServer] = useState(false);

  const handleSubmit = async (
    values: PodcastFormValues,
    actions: FormikHelpers<PodcastFormValues>,
  ) => {
    console.log('kjem hit 1?');
    const license = licenses.find(license => license.license === values.license);

    if (
      // TODO burde vel finnes en bedre måte å gjøre dette på
      license === undefined ||
      values.title === undefined ||
      values.language === undefined ||
      values.tags === undefined ||
      values.origin === undefined ||
      values.creators === undefined ||
      values.processors === undefined ||
      values.rightsholders === undefined ||
      values.header === undefined ||
      values.manuscript === undefined ||
      values.introduction === undefined ||
      values.coverPhotoId === undefined ||
      values.metaImageAlt === undefined ||
      values.metaImageUrl === undefined
    ) {
      actions.setSubmitting(false);
      setSavedToServer(false);
      return;
    }

    actions.setSubmitting(true);
    const podcastMetaData: NewPodcastMetaInformation = {
      id: values.id, // Used only to check if image was newly created. This id is discarded by backend. TODO
      title: values.title,
      tags: values.tags,
      audioType: 'podcast',
      language: values.language,
      copyright: {
        license,
        origin: values.origin,
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
      },
      podcastMeta: {
        header: values.header,
        introduction: values.introduction,
        coverPhotoId: values.coverPhotoId,
        coverPhotoAltText: values.metaImageAlt,
        manuscript: values.manuscript,
        language: values.language,
      },
    };

    await onUpdate(podcastMetaData, values.audioFile);
    setSavedToServer(true);
  };

  const initialValues = getInitialValues(audio);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnMount
      enableReinitialize
      validate={values => validateFormik(values, podcastRules, t)}>
      {formikProps => {
        const { values, dirty, isSubmitting, errors, submitForm } = formikProps;
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });
        return (
          <FormWrapper inModal={inModal}>
            <HeaderWithLanguage
              noStatus
              values={values}
              type="audio"
              content={audio}
              editUrl={(lang: string) => toEditPodcast(values.id, lang)}
            />
            <AccordionWrapper>
              <AccordionSection
                id="podcast-upload-content"
                title={t('form.contentSection')}
                className="u-6/6"
                hasError={['title', 'audioFile'].some(field => field in errors)}
                startOpen>
                <AudioContent />
              </AccordionSection>

              <AccordionSection
                id="podcast-upload-podcastmeta"
                title={t('form.podcastSection')}
                className="u-6/6"
                hasError={[
                  'header',
                  'introduction',
                  'coverPhotoId',
                  'metaImageAlt',
                  'manuscript',
                ].some(field => field in errors)}>
                <PodcastMetaData />
              </AccordionSection>

              <AccordionSection
                id="podcast-upload-metadata"
                title={t('form.metadataSection')}
                className="u-6/6"
                hasError={['tags', 'creators', 'rightsholders', 'processors', 'license'].some(
                  field => field in errors,
                )}>
                <AudioMetaData classes={formClasses} licenses={licenses} />
              </AccordionSection>
            </AccordionWrapper>
            <Field right>
              <AbortButton outline disabled={isSubmitting}>
                {t('form.abort')}
              </AbortButton>
              <SaveButton
                isSaving={isSubmitting}
                showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
                formIsDirty={formIsDirty}
                submit={!inModal}
                onClick={(evt: Event) => {
                  evt.preventDefault();
                  console.log('klikk!');
                  submitForm();
                  console.log(isSubmitting, errors);
                }}
              />
            </Field>
            <AlertModalWrapper
              {...formikProps}
              formIsDirty={formIsDirty}
              severity="danger"
              text={t('alertModal.notSaved')}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

export default injectT(PodcastForm);
