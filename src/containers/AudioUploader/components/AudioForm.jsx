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
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import Field from '../../../components/Field';
import SaveButton from '../../../components/SaveButton';
import {
  DEFAULT_LICENSE,
  isFormikFormDirty,
  parseCopyrightContributors,
} from '../../../util/formHelper';
import {
  FormikAbortButton,
  formClasses,
  FormikAlertModalWrapper,
} from '../../FormikForm';
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
    const { t, tags, licenses, audio } = this.props;
    const { savedToServer } = this.state;
    const panels = ({ values, errors, touched, setFieldValue }) => [
      {
        id: 'audio-upload-content',
        title: t('form.contentSection'),
        hasError: ['title', 'audioFile'].some(
          field => !!errors[field] && touched[field],
        ),
        component: (
          <AudioContent
            classes={formClasses}
            tags={tags}
            setFieldValue={setFieldValue}
            values={values}
          />
        ),
      },
      {
        id: 'audio-upload-metadataSection',
        title: t('form.metadataSection'),
        hasError: [
          'tags',
          'creators',
          'rightsholders',
          'processors',
          'license',
        ].some(field => !!errors[field] && touched[field]),
        component: (
          <AudioMetaData
            classes={formClasses}
            tags={tags}
            licenses={licenses}
          />
        ),
      },
    ];
    const initialValues = getInitialValues(audio);
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        enableReinitialize
        validate={values => validateFormik(values, rules, t)}>
        {formikProps => {
          const { values, dirty, isSubmitting, submitForm } = formikProps;
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
              <Accordion openIndexes={['audio-upload-content']}>
                {({ openIndexes, handleItemClick }) => (
                  <AccordionWrapper>
                    {panels(formikProps).map(panel => (
                      <Fragment key={panel.id}>
                        <AccordionBar
                          panelId={panel.id}
                          ariaLabel={panel.title}
                          onClick={() => handleItemClick(panel.id)}
                          hasError={panel.hasError}
                          title={panel.title}
                          isOpen={openIndexes.includes(panel.id)}
                        />
                        {openIndexes.includes(panel.id) && (
                          <AccordionPanel
                            id={panel.id}
                            hasError={panel.hasError}
                            isOpen={openIndexes.includes(panel.id)}>
                            <div className="u-4/6@desktop u-push-1/6@desktop">
                              {panel.component}
                            </div>
                          </AccordionPanel>
                        )}
                      </Fragment>
                    ))}
                  </AccordionWrapper>
                )}
              </Accordion>
              <Field right>
                <FormikAbortButton outline disabled={isSubmitting}>
                  {t('form.abort')}
                </FormikAbortButton>
                <SaveButton
                  {...formClasses}
                  isSaving={isSubmitting}
                  formIsDirty={formIsDirty}
                  showSaved={savedToServer && !formIsDirty}
                  onClick={evt => {
                    evt.preventDefault();
                    submitForm();
                  }}
                />
              </Field>
              <FormikAlertModalWrapper
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
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdate: PropTypes.func.isRequired,
  revision: PropTypes.number,
  audio: AudioShape,
  applicationError: PropTypes.func.isRequired,
  audioLanguage: PropTypes.string,
};

export default compose(
  connect(undefined, mapDispatchToProps),
  injectT,
)(AudioForm);
