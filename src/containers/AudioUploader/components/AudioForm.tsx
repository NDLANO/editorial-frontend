/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordions, AccordionSection } from '@ndla/accordion';
import {
  IAudio,
  IAudioMetaInformation as AudioApiType,
  INewAudioMetaInformation,
  IUpdatedAudioMetaInformation,
} from '@ndla/types-audio-api';
import { Formik, FormikHelpers } from 'formik';
import PropTypes from 'prop-types';
import { Descendant } from 'slate';
import { editorValueToPlainText } from '../../../util/articleContentConverter';
import Field from '../../../components/Field';
import Spinner from '../../../components/Spinner';
import SaveButton from '../../../components/SaveButton';
import { isFormikFormDirty } from '../../../util/formHelper';
import { AbortButton, formClasses, AlertModalWrapper } from '../../FormikForm';
import AudioMetaData from './AudioMetaData';
import AudioContent from './AudioContent';
import AudioManuscript from './AudioManuscript';
import { toCreateAudioFile, toEditAudio } from '../../../util/routeHelpers';
import validateFormik, { getWarnings, RulesType } from '../../../components/formikValidationSchema';
import { AudioShape } from '../../../shapes';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import { Author, FormikFormBaseType } from '../../../interfaces';
import FormWrapper from '../../ConceptPage/ConceptForm/FormWrapper';
import { audioApiTypeToFormType } from '../../../util/audioHelpers';
import { MessageError, useMessages } from '../../Messages/MessagesProvider';
import { useLicenses } from '../../../modules/draft/draftQueries';

export interface AudioFormikType extends FormikFormBaseType {
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
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  origin: string;
  license: string;
}

const rules: RulesType<AudioFormikType, AudioApiType> = {
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

type onSubmitFuncType = (
  audio: INewAudioMetaInformation | IUpdatedAudioMetaInformation,
  file?: string | Blob,
  id?: number,
) => void;

interface Props {
  onSubmitFunc: onSubmitFuncType;
  audio?: AudioApiType;
  audioLanguage: string;
  revision?: number;
  isNewlyCreated?: boolean;
  translating?: boolean;
  translateToNN?: () => void;
}

const AudioForm = ({
  audioLanguage,
  audio,
  isNewlyCreated,
  translating,
  translateToNN,
  onSubmitFunc,
  revision,
}: Props) => {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const prevAudioLanguage = useRef<string | null>(null);
  const { applicationError } = useMessages();
  const { data: licenses } = useLicenses({ placeholderData: [] });

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
          license: licenses?.find(license => license.license === values.license)!,
          origin: values.origin,
          creators: values.creators,
          processors: values.processors,
          rightsholders: values.rightsholders,
        },
      };
      const audioData = revision ? { ...audioMetaData, revision: revision } : audioMetaData;
      await onSubmitFunc(audioData, values.audioFile.newFile?.file, values.id!);

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
      initialStatus={{ warnings: initialWarnings }}>
      {formikProps => {
        const { values, dirty, isSubmitting, submitForm, errors } = formikProps;
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
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
              translateToNN={translateToNN}
            />
            {translating ? (
              <Spinner withWrapper />
            ) : (
              <Accordions>
                <AccordionSection
                  id="audio-upload-content"
                  className="u-4/6@desktop u-push-1/6@desktop"
                  title={t('form.contentSection')}
                  hasError={hasError(['title', 'audioFile'])}
                  startOpen>
                  <AudioContent classes={formClasses} />
                </AccordionSection>
                <AccordionSection
                  id="podcast-upload-podcastmanus"
                  title={t('podcastForm.fields.manuscript')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={[].some(field => field in errors)}>
                  <AudioManuscript />
                </AccordionSection>
                <AccordionSection
                  id="audio-upload-metadataSection"
                  className="u-4/6@desktop u-push-1/6@desktop"
                  title={t('form.metadataSection')}
                  hasError={hasError([
                    'tags',
                    'creators',
                    'rightsholders',
                    'processors',
                    'license',
                  ])}>
                  <AudioMetaData classes={formClasses} />
                </AccordionSection>
              </Accordions>
            )}
            <Field right>
              <AbortButton outline disabled={isSubmitting}>
                {t('form.abort')}
              </AbortButton>
              <SaveButton
                {...formClasses}
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

AudioForm.propTypes = {
  onSubmitFunc: PropTypes.func.isRequired,
  revision: PropTypes.number,
  audio: AudioShape,
  audioLanguage: PropTypes.string.isRequired,
  isNewlyCreated: PropTypes.bool,
  translating: PropTypes.bool,
  translateToNN: PropTypes.func,
};

export default AudioForm;
