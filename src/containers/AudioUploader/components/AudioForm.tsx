/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ButtonV2 } from '@ndla/button';
import { Accordions, AccordionSection } from '@ndla/accordion';
import {
  IAudio,
  IAuthor,
  IAudioMetaInformation,
  INewAudioMetaInformation,
  IUpdatedAudioMetaInformation,
} from '@ndla/types-audio-api';
import { Formik, FormikHelpers } from 'formik';
import { Descendant } from 'slate';
import { editorValueToPlainText } from '../../../util/articleContentConverter';
import Field from '../../../components/Field';
import SaveButton from '../../../components/SaveButton';
import { DEFAULT_LICENSE, isFormikFormDirty } from '../../../util/formHelper';
import { AlertModalWrapper } from '../../FormikForm';
import AudioMetaData from './AudioMetaData';
import AudioContent from './AudioContent';
import AudioManuscript from './AudioManuscript';
import { toCreateAudioFile, toEditAudio } from '../../../util/routeHelpers';
import validateFormik, { getWarnings, RulesType } from '../../../components/formikValidationSchema';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import { audioApiTypeToFormType } from '../../../util/audioHelpers';
import { MessageError, useMessages } from '../../Messages/MessagesProvider';
import { useLicenses } from '../../../modules/draft/draftQueries';
import FormWrapper from '../../../components/FormWrapper';

export interface AudioFormikType {
  id?: number;
  revision?: number;
  language: string;
  supportedLanguages: string[];
  title: Descendant[];
  manuscript: Descendant[];
  audioFile: {
    storedFile?: IAudio;
    newFile?: {
      filepath: string;
      file: File;
    };
  };
  tags: string[];
  creators: IAuthor[];
  processors: IAuthor[];
  rightsholders: IAuthor[];
  origin: string;
  license: string;
}

const rules: RulesType<AudioFormikType, IAudioMetaInformation> = {
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
  tags: {
    minItems: 3,
    warnings: {
      languageMatch: true,
    },
  },
  creators: {
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
    test: values => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (authors.length > 0) return undefined;
      return { translationKey: 'validation.noLicenseWithoutCopyrightHolder' };
    },
  },
};

interface Props {
  onCreateAudio?: (audio: INewAudioMetaInformation, file?: string | Blob) => Promise<void>;
  onUpdateAudio?: (audio: IUpdatedAudioMetaInformation, file?: string | Blob) => Promise<void>;
  audio?: IAudioMetaInformation;
  audioLanguage: string;
  isNewlyCreated?: boolean;
  isNewLanguage?: boolean;
}

const AudioForm = ({
  audioLanguage,
  audio,
  isNewlyCreated,
  onCreateAudio,
  onUpdateAudio,
  isNewLanguage,
}: Props) => {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const prevAudioLanguage = useRef<string | null>(null);
  const { applicationError } = useMessages();
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!prevAudioLanguage.current) {
      prevAudioLanguage.current = audioLanguage;
      return;
    }
    if (audioLanguage !== prevAudioLanguage.current) {
      setSavedToServer(false);
    }
  });

  const handleSubmit = async (values: AudioFormikType, actions: FormikHelpers<AudioFormikType>) => {
    try {
      actions.setSubmitting(true);
      const audioMetaData: INewAudioMetaInformation = {
        title: editorValueToPlainText(values.title),
        manuscript: editorValueToPlainText(values.manuscript),
        language: values.language,
        tags: values.tags,
        audioType: 'standard',
        copyright: {
          license: licenses?.find(license => license.license === values.license) ?? DEFAULT_LICENSE,
          origin: values.origin,
          creators: values.creators,
          processors: values.processors,
          rightsholders: values.rightsholders,
        },
      };
      if (audio?.revision) {
        await onUpdateAudio?.(
          { ...audioMetaData, revision: audio.revision },
          values.audioFile.newFile?.file,
        );
      } else {
        await onCreateAudio?.(audioMetaData, values.audioFile.newFile?.file);
      }

      actions.setSubmitting(false);
      setSavedToServer(true);
    } catch (err) {
      applicationError(err as MessageError);
      actions.setSubmitting(false);
      setSavedToServer(false);
    }
  };

  const initialValues = audioApiTypeToFormType(audio, audioLanguage);
  const initialErrors = validateFormik(initialValues, rules, t);
  const initialWarnings = getWarnings(initialValues, rules, t, audio);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
      initialErrors={initialErrors}
      validate={values => validateFormik(values, rules, t)}
      initialStatus={{ warnings: initialWarnings }}
    >
      {formikProps => {
        const { values, dirty, isSubmitting, submitForm, errors } = formikProps;
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
          changed: isNewLanguage,
        });

        const hasError = (errFields: (keyof AudioFormikType)[]): boolean => {
          return errFields.some(field => !!errors[field]);
        };
        return (
          <FormWrapper>
            <HeaderWithLanguage
              noStatus
              values={values}
              type="audio"
              content={{ ...audio, language: audioLanguage, title: audio?.title.title }}
              editUrl={(lang: string) => {
                if (values.id) return toEditAudio(values.id, lang);
                else return toCreateAudioFile();
              }}
            />
            <Accordions>
              <AccordionSection
                id="audio-upload-content"
                className="u-4/6@desktop u-push-1/6@desktop"
                title={t('form.contentSection')}
                hasError={hasError(['title', 'audioFile'])}
                startOpen
              >
                <AudioContent />
              </AccordionSection>
              <AccordionSection
                id="podcast-upload-podcastmanus"
                title={t('podcastForm.fields.manuscript')}
                className="u-4/6@desktop u-push-1/6@desktop"
                hasError={[].some(field => field in errors)}
              >
                <AudioManuscript />
              </AccordionSection>
              <AccordionSection
                id="audio-upload-metadataSection"
                className="u-4/6@desktop u-push-1/6@desktop"
                title={t('form.metadataSection')}
                hasError={hasError(['tags', 'creators', 'rightsholders', 'processors', 'license'])}
              >
                <AudioMetaData />
              </AccordionSection>
            </Accordions>
            <Field right>
              <ButtonV2 variant="outline" disabled={isSubmitting} onClick={() => navigate(-1)}>
                {t('form.abort')}
              </ButtonV2>
              <SaveButton
                isSaving={isSubmitting}
                formIsDirty={formIsDirty}
                showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
                onClick={evt => {
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

export default AudioForm;
