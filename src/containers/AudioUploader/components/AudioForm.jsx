/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { injectT } from '@ndla/i18n';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Field } from '../../../components/Fields';
import SaveButton from '../../../components/SaveButton';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
} from '../../../util/formHelper';
import {
  FormHeader,
  AlertModalWrapper,
  FormActionButton,
  formClasses,
} from '../../Form';
import AudioMetaData from './AudioMetaData';
import AudioContent from './AudioContent';
import { toEditAudio } from '../../../util/routeHelpers';
import validateFormik from '../../../components/formikValidationSchema';
import { AudioShape } from '../../../shapes';

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
  origin:
    audio.copyright && audio.copyright.origin ? audio.copyright.origin : '',
  license:
    audio.copyright && audio.copyright.license
      ? audio.copyright.license.license
      : DEFAULT_LICENSE.license,
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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values, actions) {
    const { licenses, onUpdate, revision } = this.props;
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
    onUpdate(audioMetaData, values.audioFile);
  }

  render() {
    const {
      t,
      tags,
      licenses,
      isSaving,
      audioInfo,
      showSaved,
      history,
      audio,
    } = this.props;

    const panels = ({ values, errors, touched, setFieldValue }) => [
      {
        id: 'audio-upload-content',
        title: t('form.contentSection'),
        hasError: ['title', 'audioFile'].some(
          field => errors[field] && touched[field],
        ),
        component: (
          <AudioContent
            classes={formClasses}
            tags={tags}
            setFieldValue={setFieldValue}
            audioInfo={audioInfo}
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
        ].some(field => errors[field] && touched[field]),
        component: (
          <AudioMetaData
            classes={formClasses}
            tags={tags}
            licenses={licenses}
          />
        ),
      },
    ];
    return (
      <Formik
        initialValues={getInitialValues(audio)}
        onSubmit={this.handleSubmit}
        enableReinitialize
        validate={values => validateFormik(values, rules, t)}>
        {formikProps => {
          const { handleSubmit, values } = formikProps;
          return (
            <form onSubmit={handleSubmit} {...formClasses()}>
              <FormHeader
                model={values}
                type="audio"
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
                          isOpen={openIndexes.includes(panel.id)}>
                          {panel.title}
                        </AccordionBar>
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
                <FormActionButton
                  outline
                  disabled={isSaving}
                  onClick={history.goBack}>
                  {t('form.abort')}
                </FormActionButton>
                <SaveButton isSaving={isSaving} showSaved={showSaved} />
              </Field>
              <AlertModalWrapper
                isFormik
                model={values}
                {...formikProps}
                severity="danger"
                showSaved={showSaved}
                text={t('alertModal.notSaved')}
              />
            </form>
          );
        }}
      </Formik>
    );
  }
}

AudioForm.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  showSaved: PropTypes.bool.isRequired,
  revision: PropTypes.number,
  audioInfo: PropTypes.shape({
    fileSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  audio: AudioShape,
};

export default compose(
  withRouter,
  injectT,
)(AudioForm);
