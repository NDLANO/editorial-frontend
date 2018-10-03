/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { injectT } from 'ndla-i18n';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import BEMHelper from 'react-bem-helper';
import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';
import SaveButton from '../../../components/SaveButton';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
} from '../../../util/formHelper';
import { SchemaShape } from '../../../shapes';
import { FormHeader, WarningModalWrapper } from '../../Form';
import AudioMetaData from './AudioMetaData';
import AudioContent from './AudioContent';
import { toEditAudio } from '../../../util/routeHelpers';

export const getInitialModel = (audio = {}) => ({
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

const classes = new BEMHelper({
  name: 'form',
  prefix: 'c-',
});

class AudioForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { initialModel, setModel } = nextProps;
    if (
      initialModel.id !== this.props.initialModel.id ||
      initialModel.language !== this.props.initialModel.language
    ) {
      setModel(initialModel);
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const {
      model,
      schema,
      licenses,
      setSubmitted,
      onUpdate,
      revision,
    } = this.props;

    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

    const audioMetaData = {
      id: model.id,
      revision,
      title: model.title,
      language: model.language,
      tags: model.tags,
      copyright: {
        license: licenses.find(license => license.license === model.license),
        origin: model.origin,
        creators: model.creators,
        processors: model.processors,
        rightsholders: model.rightsholders,
      },
    };
    onUpdate(audioMetaData, model.audioFile);
  }

  render() {
    const {
      t,
      bindInput,
      schema,
      initialModel,
      model,
      submitted,
      tags,
      licenses,
      isSaving,
      audioInfo,
      showSaved,
      fields,
      history,
    } = this.props;

    const commonFieldProps = { bindInput, schema, submitted };

    return (
      <form onSubmit={this.handleSubmit} {...classes()}>
        <FormHeader
          model={model}
          type="audio"
          editUrl={lang => toEditAudio(model.id, lang)}
        />
        <AudioContent
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
          model={model}
          audioInfo={audioInfo}
        />
        <AudioMetaData
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
          licenses={licenses}
        />
        <Field right {...classes('form-actions')}>
          <Button outline disabled={isSaving} onClick={history.goBack}>
            {t('form.abort')}
          </Button>
          <SaveButton isSaving={isSaving} showSaved={showSaved} />
        </Field>
        <WarningModalWrapper
          initialModel={initialModel}
          model={model}
          schema={schema}
          showSaved={showSaved}
          fields={fields}
          handleSubmit={this.handleSubmit}
          text={t('warningModal.notSaved')}
        />
      </form>
    );
  }
}

AudioForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
  }),
  setModel: PropTypes.func.isRequired,
  schema: SchemaShape,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  setSubmitted: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  showSaved: PropTypes.bool.isRequired,
  revision: PropTypes.number,
  fields: PropTypes.objectOf(PropTypes.object).isRequired,
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
  reformed,
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
  }),
)(AudioForm);
