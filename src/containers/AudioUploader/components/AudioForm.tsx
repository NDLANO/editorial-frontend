/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { Formik, FormikHelpers } from 'formik';
import PropTypes from 'prop-types';
import { Value } from 'slate';
import {
  plainTextToEditorValue,
  editorValueToPlainText,
} from '../../../util/articleContentConverter';
import Field from '../../../components/Field';
import Spinner from '../../../components/Spinner';
import SaveButton from '../../../components/SaveButton';
import {
  DEFAULT_LICENSE,
  isFormikFormDirty,
  parseCopyrightContributors,
} from '../../../util/formHelper';
import { AbortButton, formClasses, AlertModalWrapper } from '../../FormikForm';
import AudioMetaData from './AudioMetaData';
import AudioContent from './AudioContent';
import AudioManuscript from './AudioManuscript';
import { toCreateAudioFile, toEditAudio } from '../../../util/routeHelpers';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import { AudioShape } from '../../../shapes';
import * as messageActions from '../../Messages/messagesActions';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import { Author, License } from '../../../interfaces';
import {
  FlattenedAudioApiType,
  NewAudioMetaInformation,
  UpdatedAudioMetaInformation,
} from '../../../modules/audio/audioApiInterfaces';
import FormWrapper from '../../ConceptPage/ConceptForm/FormWrapper';
import { ReduxMessageError } from '../../Messages/messagesSelectors';

export interface AudioFormikType {
  id?: number;
  revision?: number;
  language: string;
  supportedLanguages: string[];
  title: Value;
  manuscript: Value;
  audioFile: {
    storedFile?: {
      url: string;
      mimeType: string;
      fileSize: number;
      language: string;
    };
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

export const getInitialValues = (
  audio: Partial<FlattenedAudioApiType> & { language: string },
): AudioFormikType => {
  return {
    id: audio.id,
    revision: audio.revision,
    language: audio.language,
    supportedLanguages: audio.supportedLanguages || [],
    title: plainTextToEditorValue(audio.title || '', true),
    manuscript: plainTextToEditorValue(audio?.manuscript, true),
    audioFile: audio.audioFile ? { storedFile: audio.audioFile } : {},
    tags: audio.tags || [],
    creators: parseCopyrightContributors(audio, 'creators'),
    processors: parseCopyrightContributors(audio, 'processors'),
    rightsholders: parseCopyrightContributors(audio, 'rightsholders'),
    origin: audio.copyright?.origin || '',
    license: audio.copyright?.license?.license || DEFAULT_LICENSE.license,
  };
};

const rules: RulesType<AudioFormikType> = {
  title: {
    required: true,
  },
  manuscript: {
    required: false,
  },
  tags: {
    minItems: 3,
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
  },
};

const mapDispatchToProps = {
  applicationError: messageActions.applicationError,
};

const reduxConnector = connect(undefined, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

type OnCreateFunc = (audio: NewAudioMetaInformation, file?: string | Blob) => void;
type OnUpdateFunc = (audio: UpdatedAudioMetaInformation, file?: string | Blob) => void;

interface BaseProps extends PropsFromRedux {
  licenses: License[];
  onUpdate: OnCreateFunc | OnUpdateFunc;
  audio: Partial<FlattenedAudioApiType> & { language: string };
  audioLanguage: string;
  revision?: number;
  isNewlyCreated?: boolean;
  translating?: boolean;
  translateToNN?: () => void;
}

interface State {
  savedToServer: boolean;
}

type Props = BaseProps & WithTranslation;

class AudioForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      savedToServer: false,
    };
  }

  componentDidUpdate({ audioLanguage: prevAudioLanguage }: Props) {
    const { audioLanguage } = this.props;
    if (audioLanguage && audioLanguage !== prevAudioLanguage) {
      this.setState({ savedToServer: false });
    }
  }

  handleSubmit = async (values: AudioFormikType, actions: FormikHelpers<AudioFormikType>) => {
    const { licenses, onUpdate, revision, applicationError } = this.props;
    try {
      actions.setSubmitting(true);
      const audioMetaData = {
        id: values.id,
        revision: revision,
        title: editorValueToPlainText(values.title),
        manuscript: editorValueToPlainText(values.manuscript),
        language: values.language,
        tags: values.tags,
        audioType: 'standard',
        copyright: {
          license: licenses.find(license => license.license === values.license),
          origin: values.origin,
          creators: values.creators,
          processors: values.processors,
          rightsholders: values.rightsholders,
        },
      };

      await onUpdate(audioMetaData, values.audioFile.newFile?.file);

      actions.setSubmitting(false);
      this.setState({ savedToServer: true });
    } catch (err) {
      applicationError(err as ReduxMessageError);
      actions.setSubmitting(false);
      this.setState({ savedToServer: false });
    }
  };

  render() {
    const { t, licenses, audio, isNewlyCreated, translating, translateToNN } = this.props;
    const { savedToServer } = this.state;

    const initialValues = getInitialValues(audio);
    const initialErrors = validateFormik(initialValues, rules, t);

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        enableReinitialize
        validateOnMount
        initialErrors={initialErrors}
        validate={values => validateFormik(values, rules, t)}>
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
                content={audio}
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
                    <AudioManuscript classes={formClasses} />
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
                    <AudioMetaData classes={formClasses} licenses={licenses} />
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
  }

  static propTypes = {
    licenses: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        license: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
    onUpdate: PropTypes.func.isRequired,
    revision: PropTypes.number,
    audio: AudioShape,
    applicationError: PropTypes.func.isRequired,
    audioLanguage: PropTypes.string.isRequired,
    isNewlyCreated: PropTypes.bool,
    translating: PropTypes.bool,
    translateToNN: PropTypes.func,
  };
}

export default reduxConnector(withTranslation()(AudioForm));
