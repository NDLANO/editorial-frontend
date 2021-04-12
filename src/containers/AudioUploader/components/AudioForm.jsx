/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectT } from '@ndla/i18n';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import Field from '../../../components/Field';
import SaveButton from '../../../components/SaveButton';
import {
  DEFAULT_LICENSE,
  isFormikFormDirty,
  parseCopyrightContributors,
} from '../../../util/formHelper';
import { AbortButton, formClasses, AlertModalWrapper } from '../../FormikForm';
import AudioMetaData from './AudioMetaData';
import AudioContent from './AudioContent';
import { toEditAudio } from '../../../util/routeHelpers';
import validateFormik from '../../../components/formikValidationSchema';
import { AudioShape } from '../../../shapes';
import * as messageActions from '../../Messages/messagesActions';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';

export const getInitialValues = (audio = {}) => ({
  id: audio.id,
  revision: audio.revision,
  language: audio.language,
  supportedLanguages: audio.supportedLanguages || [],
  title: audio.title || '',
  audioFile: audio.audioFile,
  filepath: '',
  tags: audio.tags || [],
  creators: parseCopyrightContributors(audio, 'creators'),
  processors: parseCopyrightContributors(audio, 'processors'),
  rightsholders: parseCopyrightContributors(audio, 'rightsholders'),
  origin: audio.copyright?.origin || '',
  license: audio.copyright?.license?.license || DEFAULT_LICENSE.license,
});

const rules = {
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
};

class AudioForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedToServer: false,
    };
  }

  componentDidUpdate({ audioLanguage: prevAudioLanguage }) {
    const { audioLanguage } = this.props;
    if (audioLanguage && audioLanguage !== prevAudioLanguage) {
      this.setState({ savedToServer: false });
    }
  }

  handleSubmit = async (values, actions) => {
    const { licenses, onUpdate, revision, applicationError } = this.props;
    try {
      actions.setSubmitting(true);
      const audioMetaData = {
        id: values.id,
        revision,
        title: values.title,
        language: values.language,
        tags: values.tags,
        copyright: {
          license: licenses.find(license => license.license === values.license),
          origin: values.origin,
          creators: values.creators,
          processors: values.processors,
          rightsholders: values.rightsholders,
        },
      };
      await onUpdate(audioMetaData, values.audioFile);
      actions.setSubmitting(false);
      this.setState({ savedToServer: true });
    } catch (err) {
      applicationError(err);
      actions.setSubmitting(false);
      this.setState({ savedToServer: false });
    }
  };

  render() {
    const { t, licenses, audio, isNewlyCreated } = this.props;
    const { savedToServer } = this.state;

    const initialValues = getInitialValues(audio);
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        enableReinitialize
        validateOnMount
        validate={values => validateFormik(values, rules, t)}>
        {formikProps => {
          const { values, errors, dirty, isSubmitting, submitForm, setFieldValue } = formikProps;
          const formIsDirty = isFormikFormDirty({
            values,
            initialValues,
            dirty,
          });
          return (
            <Form {...formClasses()}>
              <HeaderWithLanguage
                noStatus
                values={values}
                type="audio"
                content={audio}
                editUrl={lang => toEditAudio(values.id, lang)}
              />
              <Accordions>
                <AccordionSection
                  id="audio-upload-content"
                  className="u-4/6@desktop u-push-1/6@desktop"
                  title={t('form.contentSection')}
                  hasError={['title', 'audioFile'].some(field => !!errors[field])}
                  startOpen>
                  <AudioContent
                    classes={formClasses}
                    setFieldValue={setFieldValue}
                    values={values}
                  />
                </AccordionSection>
                <AccordionSection
                  id="audio-upload-metadataSection"
                  className="u-4/6@desktop u-push-1/6@desktop"
                  title={t('form.metadataSection')}
                  hasError={['tags', 'creators', 'rightsholders', 'processors', 'license'].some(
                    field => !!errors[field],
                  )}>
                  <AudioMetaData
                    classes={formClasses}
                    licenses={licenses}
                    audioLanguage={audio.language}
                    audioTags={audio.tags}
                  />
                </AccordionSection>
              </Accordions>
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
            </Form>
          );
        }}
      </Formik>
    );
  }
}

const mapDispatchToProps = {
  applicationError: messageActions.applicationError,
};

AudioForm.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  onUpdate: PropTypes.func.isRequired,
  revision: PropTypes.number,
  audio: AudioShape,
  applicationError: PropTypes.func.isRequired,
  audioLanguage: PropTypes.string,
  isNewlyCreated: PropTypes.bool,
};

export default compose(connect(undefined, mapDispatchToProps), injectT)(AudioForm);
