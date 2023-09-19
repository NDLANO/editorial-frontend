/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState, useRef, useCallback, useMemo } from 'react';
import { Formik, FormikHelpers, FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  IAudioMetaInformation,
  IUpdatedAudioMetaInformation,
  INewAudioMetaInformation,
} from '@ndla/types-backend/audio-api';
import { ButtonV2 } from '@ndla/button';
import AudioContent from '../../AudioUploader/components/AudioContent';
import AudioMetaData from '../../AudioUploader/components/AudioMetaData';
import AudioManuscript from '../../AudioUploader/components/AudioManuscript';
import { AlertModalWrapper } from '../../FormikForm';
import PodcastMetaData from './PodcastMetaData';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik, { getWarnings, RulesType } from '../../../components/formikValidationSchema';
import SaveButton from '../../../components/SaveButton';
import Field from '../../../components/Field';
import Spinner from '../../../components/Spinner';
import { isFormikFormDirty } from '../../../util/formHelper';
import { PodcastFormValues } from '../../../modules/audio/audioApiInterfaces';
import { editorValueToPlainText } from '../../../util/articleContentConverter';
import PodcastSeriesInformation from './PodcastSeriesInformation';
import handleError from '../../../util/handleError';
import { audioApiTypeToPodcastFormType } from '../../../util/audioHelpers';
import { useLicenses } from '../../../modules/draft/draftQueries';
import FormWrapper from '../../../components/FormWrapper';
import FormAccordions from '../../../components/Accordion/FormAccordions';
import FormAccordion from '../../../components/Accordion/FormAccordion';
import { SAVE_BUTTON_ID } from '../../../constants';

const podcastRules: RulesType<PodcastFormValues, IAudioMetaInformation> = {
  title: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  manuscript: {
    required: false,
    warnings: {
      languageMatch: true,
    },
  },
  audioFile: {
    required: true,
  },
  introduction: {
    required: true,
    maxLength: 1000,
    warnings: {
      languageMatch: true,
      apiField: 'podcastMeta',
    },
  },
  coverPhotoId: {
    required: true,
  },
  metaImageAlt: {
    // coverPhotoAltText
    required: true,
    onlyValidateIf: (values: PodcastFormValues) => !!values.coverPhotoId,
    warnings: {
      languageMatch: true,
    },
  },
  tags: {
    minItems: 3,
    warnings: {
      languageMatch: true,
    },
  },
  license: {
    required: true,
    test: (values) => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (authors.length > 0) return undefined;
      return { translationKey: 'validation.noLicenseWithoutCopyrightHolder' };
    },
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

interface Props {
  audio?: IAudioMetaInformation;
  podcastChanged?: boolean;
  inModal?: boolean;
  isNewlyCreated?: boolean;
  language: string;
  onCreatePodcast?: (newPodcast: INewAudioMetaInformation, file?: string | Blob) => void;
  onUpdatePodcast?: (updatedPodcast: IUpdatedAudioMetaInformation, file?: string | Blob) => void;
  translating?: boolean;
  supportedLanguages: string[];
}

const PodcastForm = ({
  audio,
  podcastChanged,
  inModal,
  isNewlyCreated,
  language,
  onCreatePodcast,
  onUpdatePodcast,
  translating,
  supportedLanguages,
}: Props) => {
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const size = useRef<[number, number] | undefined>(undefined);
  const navigate = useNavigate();

  const handleSubmit = async (
    values: PodcastFormValues,
    actions: FormikHelpers<PodcastFormValues>,
  ) => {
    const license = licenses!.find((license) => license.license === values.license);

    if (
      license === undefined ||
      values.title === undefined ||
      values.manuscript === undefined ||
      values.language === undefined ||
      values.tags === undefined ||
      values.origin === undefined ||
      values.creators === undefined ||
      values.processors === undefined ||
      values.rightsholders === undefined ||
      values.introduction === undefined ||
      values.coverPhotoId === undefined ||
      values.metaImageAlt === undefined
    ) {
      actions.setSubmitting(false);
      setSavedToServer(false);
      return;
    }

    actions.setSubmitting(true);
    const podcastMetaData: INewAudioMetaInformation = {
      title: values.title ? editorValueToPlainText(values.title) : '',
      manuscript: values.manuscript ? editorValueToPlainText(values.manuscript) : '',
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
        introduction: values.introduction ? editorValueToPlainText(values.introduction) : '',
        coverPhotoId: values.coverPhotoId,
        coverPhotoAltText: values.metaImageAlt,
      },
      seriesId: values.series?.id,
    };
    try {
      audio?.revision
        ? await onUpdatePodcast?.(
            { ...podcastMetaData, revision: audio.revision },
            values.audioFile.newFile?.file,
          )
        : await onCreatePodcast?.(podcastMetaData, values.audioFile.newFile?.file);
    } catch (e) {
      handleError(e);
    }
    setSavedToServer(true);
  };

  const validateMetaImage = useCallback(
    (
      [width, height]: [number, number],
      values: PodcastFormValues,
    ): FormikErrors<PodcastFormValues> => {
      if (values.coverPhotoId) {
        if (width !== height) {
          return { coverPhotoId: t('validation.podcastImageShape') };
        } else if (width < 1400 || width > 3000) {
          return { coverPhotoId: t('validation.podcastImageSize') };
        }
      }
      return {};
    },
    [t],
  );

  const validateFunction = useCallback(
    (values: PodcastFormValues): FormikErrors<PodcastFormValues> => {
      const errors = validateFormik(values, podcastRules, t);
      const metaImageErrors = size.current ? validateMetaImage(size.current, values) : {};
      const resp = { ...errors, ...metaImageErrors };
      return resp;
    },
    [t, validateMetaImage],
  );

  const initialValues = audioApiTypeToPodcastFormType(audio, language);
  const initialWarnings = getWarnings(initialValues, podcastRules, t, audio);
  const initialErrors = useMemo(
    () => validateFunction(initialValues),
    [initialValues, validateFunction],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnMount
      initialErrors={initialErrors}
      enableReinitialize
      validate={validateFunction}
      initialStatus={{ warnings: initialWarnings }}
    >
      {(formikProps) => {
        const { values, dirty, isSubmitting, errors, submitForm, validateForm } = formikProps;
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
          changed: podcastChanged,
        });
        return (
          <FormWrapper inModal={inModal}>
            <HeaderWithLanguage
              id={audio?.id}
              language={language}
              noStatus
              supportedLanguages={supportedLanguages}
              type="podcast"
              title={audio?.title.title}
            />
            {translating ? (
              <Spinner withWrapper />
            ) : (
              <FormAccordions defaultOpen={['podcast-upload-content']}>
                <FormAccordion
                  id="podcast-upload-content"
                  title={t('form.contentSection')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={['title', 'audioFile'].some((field) => field in errors)}
                >
                  <AudioContent handleSubmit={handleSubmit} />
                </FormAccordion>
                <FormAccordion
                  id="podcast-upload-podcastmanus"
                  title={t('podcastForm.fields.manuscript')}
                  className={'u-6/6'}
                  hasError={[].some((field) => field in errors)}
                >
                  <AudioManuscript />
                </FormAccordion>
                <FormAccordion
                  id="podcast-upload-podcastmeta"
                  title={t('form.podcastSection')}
                  className={'u-6/6'}
                  hasError={['introduction', 'coverPhotoId', 'metaImageAlt'].some(
                    (field) => field in errors,
                  )}
                >
                  <PodcastMetaData
                    language={language}
                    onImageLoad={(width, height) => {
                      size.current = [width, height];
                      validateForm();
                    }}
                  />
                  <PodcastSeriesInformation />
                </FormAccordion>

                <FormAccordion
                  id="podcast-upload-metadata"
                  title={t('form.metadataSection')}
                  className={'u-6/6'}
                  hasError={['tags', 'creators', 'rightsholders', 'processors', 'license'].some(
                    (field) => field in errors,
                  )}
                >
                  <AudioMetaData />
                </FormAccordion>
              </FormAccordions>
            )}

            <Field right>
              <ButtonV2 variant="outline" disabled={isSubmitting} onClick={() => navigate(-1)}>
                {t('form.abort')}
              </ButtonV2>
              <SaveButton
                id={SAVE_BUTTON_ID}
                type={!inModal ? 'submit' : 'button'}
                isSaving={isSubmitting}
                showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
                formIsDirty={formIsDirty}
                onClick={(evt) => {
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

export default PodcastForm;
