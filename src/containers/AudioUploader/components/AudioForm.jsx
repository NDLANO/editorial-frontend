/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
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

class AudioForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate({ initialModel: prevModel }) {
    /*const { initialModel, setModel } = this.props;
    if (
      prevModel.id !== initialModel.id ||
      prevModel.language !== initialModel.language
    ) {
      setModel(initialModel);
    }*/
  }

  handleSubmit(values, actions) {
    const {
      //validationErrors,
      licenses,
      onUpdate,
      revision,
    } = this.props;

    /*if (!validationErrors.isValid) {
      actions.setSubmitting(false);
      return;
    }*/

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
    } = this.props;

    // const commonFieldProps = { bindInput, schema, submitted };

    const panels = ({errors, touced onChange}) => [
      {
        id: 'audio-upload-content',
        title: t('form.contentSection'),
        hasError: ['title', 'audioFile'].some(field =>
          errors[field] && touched[field],
        ),
        component: (
          <AudioContent
            classes={formClasses}
            tags={tags}
            audioInfo={audioInfo}
          />
        ),
      },
      {
        id: 'audio-upload-metadataSection',
        title: t('form.metadataSection'),
        hasError: [
          errors.tags,
          errors.creators,
          errors.rightsholders,
          errors.processors,
          errors.license,
        ].some(field => checkTouchedInvalidField(field, submitted)),
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
        onSubmit={this.handleSubmit}>
        {(props) => {
          const {
             handleSubmit,
              handleChange,
              handleBlur,
              values,
              errors,
          } = props;
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
                  {panels(props).map(panel => (
                    <React.Fragment key={panel.id}>
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
                    </React.Fragment>
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
              model={values}
              severity="danger"
              showSaved={showSaved}
              fields={[]}//TODO!
              text={t('alertModal.notSaved')}
            />
          </form>
        )}}
        </Formik>
    );
  }
}

AudioForm.propTypes = {
  /*model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
  }),*/
  //setModel: PropTypes.func.isRequired,
  //validationErrors: SchemaShape,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  //submitted: PropTypes.bool.isRequired,
  //bindInput: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  setSubmitted: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  showSaved: PropTypes.bool.isRequired,
  revision: PropTypes.number,
  //fields: PropTypes.objectOf(PropTypes.object).isRequired,
  audioInfo: PropTypes.shape({
    fileSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};

export default compose(
  injectT,
  withRouter,
  //reformed,
  validateSchema({
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
  }),
)(AudioForm);
