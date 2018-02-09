/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { injectT } from 'ndla-i18n';
import { Button } from 'ndla-ui';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  processorsWithDefault,
} from '../../../util/formHelper';
import { SchemaShape } from '../../../shapes';
import { FormHeader } from '../../Form';
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
  processors: processorsWithDefault(audio),
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
    this.state = { title: '', tags: [], license: '', audio: {} };
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
      model,
      submitted,
      tags,
      licenses,
      isSaving,
      audioInfo,
    } = this.props;
    const commonFieldProps = { bindInput, schema, submitted };

    return (
      <form onSubmit={event => this.handleSubmit(event)} {...classes()}>
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
        <Field right>
          <Link
            to={'/'}
            className="c-button c-button--outline c-abort-button"
            disabled={isSaving}>
            {t('form.abort')}
          </Link>
          <Button submit outline disabled={false} className="c-save-button">
            {t('form.save')}
          </Button>
        </Field>
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
  locale: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  setSubmitted: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  revision: PropTypes.number,
  audioInfo: PropTypes.shape({
    fileSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
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
