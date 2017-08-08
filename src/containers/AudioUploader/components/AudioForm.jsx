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

import AudioMetaData from './AudioMetaData';
import AudioContent from './AudioContent';

const DEFAULT_LICENSE = {
  description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
  license: 'by-sa',
  url: 'https://creativecommons.org/licenses/by-sa/2.0/',
};

const parseCopyrightAuthors = (audio, type) =>
  audio.copyright
    ? audio.copyright.authors
        .filter(author => author.type === type)
        .map(author => author.name)
    : [];

export const getInitialModel = (audio = {}) => {
  const authors = parseCopyrightAuthors(audio, 'Forfatter');
  return {
    id: audio.id,
    language: audio.language,
    title: audio.title || '',
    audioFile: audio.audioFile,
    tags: audio.tags || [],
    authors,
    copyrightOrigin:
      audio.copyright && audio.copyright.origin ? audio.copyright.origin : '',
    license:
      audio.copyright && audio.copyright.license
        ? audio.copyright.license.license
        : DEFAULT_LICENSE.license,
  };
};

const classes = new BEMHelper({
  name: 'topic-article-form',
  prefix: 'c-',
});

class AudioForm extends Component {
  constructor(props) {
    super(props);
    this.state = { title: '', tags: [], license: '', audio: {} };
  }

  handleSubmit(event) {
    event.preventDefault();

    const {
      model,
      schema,
      locale: language,
      licenses,
      setSubmitted,
    } = this.props;

    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

    this.props.onUpdate(
      {
        title: model.title,
        language,
        tags: model.tags,
        copyright: {
          license: licenses.find(license => license.license === model.license),
          origin: model.origin,
          authors: model.authors.map(name => ({ type: 'Forfatter', name })),
        },
      },
      model.audioFile,
    );
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
    } = this.props;
    const commonFieldProps = { bindInput, schema, submitted };

    return (
      <form onSubmit={event => this.handleSubmit(event)} {...classes()}>
        <div {...classes('title')}>
          {model.id ? t('audioForm.title.update') : t('audioForm.title.create')}
        </div>
        <AudioContent
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
        />
        <AudioMetaData
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
          licenses={licenses}
          model={model}
        />
        <Field right>
          <Link
            to={'/'}
            {...classes('abort-button', '', 'c-button c-button--outline')}
            disabled={isSaving}>
            {t('audioForm.abort')}
          </Link>
          <Button submit outline disabled={false} {...classes('save-button')}>
            {t('audioForm.save')}
          </Button>
        </Field>
      </form>
    );
  }
}

AudioForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
    isValid: PropTypes.bool.isRequired,
  }),
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
    authors: {
      minItems: 1,
    },
    audioFile: {
      required: true,
    },
  }),
)(AudioForm);
