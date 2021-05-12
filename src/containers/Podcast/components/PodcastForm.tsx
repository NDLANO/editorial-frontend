/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, ReactNode } from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { injectT, tType } from '@ndla/i18n';
import { Accordions, AccordionSection } from '@ndla/accordion';
import AudioContent from '../../AudioUploader/components/AudioContent';
import AudioMetaData from '../../AudioUploader/components/AudioMetaData';
import { formClasses, AbortButton, AlertModalWrapper } from '../../FormikForm';
import PodcastMetaData from './PodcastMetaData';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik from '../../../components/formikValidationSchema';
import SaveButton from '../../../components/SaveButton';
import Field from '../../../components/Field';
import Spinner from '../../../components/Spinner';
import {
  isFormikFormDirty,
  parseCopyrightContributors,
  DEFAULT_LICENSE,
} from '../../../util/formHelper';
import { toEditPodcast } from '../../../util/routeHelpers';
import {
  AudioFile,
  PodcastMeta,
  NewPodcastMetaInformation,
  PodcastFormValues,
  UpdatedPodcastMetaInformation,
} from '../../../modules/audio/audioApiInterfaces';
import {
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../util/articleContentConverter';
import { Copyright, License } from '../../../interfaces';

const podcastRules = {
  title: {
    required: true,
  },
  audioFile: {
    required: true,
  },
  introduction: {
    required: true,
    maxLength: 1000,
  },
  manuscript: {
    required: true,
  },
  coverPhotoId: {
    required: true,
  },
  metaImageAlt: {
    // coverPhotoAltText
    required: true,
    onlyValidateIf: (values: PodcastFormValues) => !!values.coverPhotoId,
  },
  tags: {
    minItems: 3,
  },
  license: {
    required: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
};

interface PodcastPropType {
  id?: number;
  revision?: number;
  title?: string;
  language?: string;
  supportedLanguages?: string[];
  audioFile?: AudioFile;
  copyright?: Copyright;
  tags?: string[];
  audioType?: string;
  podcastMeta?: PodcastMeta;
}

export const getInitialValues = (audio: PodcastPropType = {}): PodcastFormValues => ({
  id: audio.id,
  revision: audio.revision,
  language: audio.language,
  supportedLanguages: audio.supportedLanguages || [],
  title: plainTextToEditorValue(audio.title || '', true),
  audioFile: { storedFile: audio.audioFile },
  filepath: '',
  tags: audio.tags || [],
  origin: audio?.copyright?.origin || '',
  creators: parseCopyrightContributors(audio, 'creators'),
  processors: parseCopyrightContributors(audio, 'processors'),
  rightsholders: parseCopyrightContributors(audio, 'rightsholders'),
  license: audio?.copyright?.license?.license || DEFAULT_LICENSE.license,
  audioType: 'podcast',
  header: audio.podcastMeta?.header || ' ',
  introduction: plainTextToEditorValue(audio.podcastMeta?.introduction, true),
  coverPhotoId: audio.podcastMeta?.coverPhoto.id,
  metaImageAlt: audio.podcastMeta?.coverPhoto.altText, // coverPhotoAltText
  manuscript: plainTextToEditorValue(audio.podcastMeta?.manuscript, true),
});

const FormWrapper = ({ inModal, children }: { inModal?: boolean; children: ReactNode }) => {
  if (inModal) {
    return <div {...formClasses()}>{children}</div>;
  }
  return <Form>{children}</Form>;
};

type OnCreateFunc = (newPodcast: NewPodcastMetaInformation, file?: string | Blob) => void;
type OnUpdateFunc = (newPodcast: UpdatedPodcastMetaInformation, file?: string | Blob) => void;

interface Props {
  audio: PodcastPropType;
  podcastChanged?: boolean;
  inModal?: boolean;
  isNewlyCreated?: boolean;
  formikProps?: FormikProps<PodcastPropType>;
  licenses: License[];
  onUpdate: OnCreateFunc | OnUpdateFunc;
  revision?: number;
  translating?: boolean;
  translateArticle?: () => void;
}

const PodcastForm = ({
  t,
  audio,
  podcastChanged,
  inModal,
  isNewlyCreated,
  licenses,
  onUpdate,
  translating,
  translateArticle,
}: Props & tType) => {
  const [savedToServer, setSavedToServer] = useState(false);

  const handleSubmit = async (
    values: PodcastFormValues,
    actions: FormikHelpers<PodcastFormValues>,
  ) => {
    const license = licenses.find(license => license.license === values.license);

    if (
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
      values.metaImageAlt === undefined
    ) {
      actions.setSubmitting(false);
      setSavedToServer(false);
      return;
    }

    actions.setSubmitting(true);
    const podcastMetaData = {
      id: values.id,
      revision: values.revision,
      title: editorValueToPlainText(values.title),
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
        introduction: editorValueToPlainText(values.introduction),
        coverPhotoId: values.coverPhotoId,
        coverPhotoAltText: values.metaImageAlt,
        manuscript: editorValueToPlainText(values.manuscript),
      },
    };

    await onUpdate(podcastMetaData, values.audioFile.newFile?.file);
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
        const { values, dirty, isSubmitting, errors, submitForm, handleBlur } = formikProps;
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
          changed: podcastChanged,
        });
        return (
          <FormWrapper inModal={inModal}>
            <HeaderWithLanguage
              noStatus
              values={values}
              type="podcast"
              content={audio}
              editUrl={(lang: string) => toEditPodcast(values.id, lang)}
              translateArticle={translateArticle}
            />
            {translating ? (
              <Spinner withWrapper />
            ) : (
              <Accordions>
                <AccordionSection
                  id="podcast-upload-content"
                  title={t('form.contentSection')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={['title', 'audioFile'].some(field => field in errors)}
                  startOpen>
                  <AudioContent classes={formClasses} />
                </AccordionSection>
                <AccordionSection
                  id="podcast-upload-podcastmeta"
                  title={t('form.podcastSection')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={['introduction', 'coverPhotoId', 'metaImageAlt', 'manuscript'].some(
                    field => field in errors,
                  )}>
                  <PodcastMetaData
                    handleSubmit={submitForm}
                    onBlur={(event, editor, next) => {
                      next();
                      // this is a hack since formik onBlur-handler interferes with slates
                      // related to: https://github.com/ianstormtaylor/slate/issues/2434
                      // formik handleBlur needs to be called for validation to work (and touched to be set)
                      setTimeout(() => handleBlur({ target: { name: 'introduction' } }), 0);
                    }}
                  />
                </AccordionSection>
                <AccordionSection
                  id="podcast-upload-metadata"
                  title={t('form.metadataSection')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={['tags', 'creators', 'rightsholders', 'processors', 'license'].some(
                    field => field in errors,
                  )}>
                  <AudioMetaData classes={formClasses} licenses={licenses} />
                </AccordionSection>
              </Accordions>
            )}

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
                  submitForm();
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
