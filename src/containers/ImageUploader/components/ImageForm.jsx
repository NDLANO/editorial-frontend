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
import { Camera } from 'ndla-icons/editor';

import BEMHelper from 'react-bem-helper';
import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  processorsWithDefault,
} from '../../../util/formHelper';

import ImageMetaData from './ImageMetaData';
import ImageContent from './ImageContent';
import { SchemaShape } from '../../../shapes';

export const getInitialModel = (image = {}) => ({
  id: image.id,
  revision: image.revision,
  language: image.language,
  title: image.title || '',
  alttext: image.alttext || '',
  caption: image.caption || '',
  imageFile: image.imageUrl,
  tags: image.tags || [],
  creators: parseCopyrightContributors(image, 'creators'),
  processors: processorsWithDefault(image),
  rightsholders: parseCopyrightContributors(image, 'rightsholders'),
  origin:
    image.copyright && image.copyright.origin ? image.copyright.origin : '',
  license:
    image.copyright && image.copyright.license
      ? image.copyright.license.license
      : DEFAULT_LICENSE.license,
});
const classes = new BEMHelper({
  name: 'form',
  prefix: 'c-',
});

class ImageForm extends Component {
  constructor(props) {
    super(props);
    this.state = { title: '', tags: [], license: '', image: {} };
  }

  handleSubmit(event) {
    event.preventDefault();

    const {
      model,
      schema,
      locale: language,
      licenses,
      setSubmitted,
      onUpdate,
      revision,
    } = this.props;

    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

    const imageMetaData = {
      id: model.id,
      revision,
      title: model.title,
      alttext: model.alttext,
      caption: model.caption,
      language,
      tags: model.tags,
      copyright: {
        license: licenses.find(license => license.license === model.license),
        origin: model.origin,
        creators: model.creators,
        processors: model.processors,
        rightsholders: model.rightsholders,
      },
    };
    onUpdate(imageMetaData, model.imageFile);
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
        <div {...classes('header', 'multimedia')}>
          <div className="u-4/6@desktop">
            <Camera />
            <span>
              {model.id
                ? t('imageForm.title.update')
                : t('imageForm.title.create')}
            </span>
          </div>
        </div>
        <ImageContent
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
          model={model}
        />
        <ImageMetaData
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

ImageForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
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
};

export default compose(
  injectT,
  reformed,
  validateSchema({
    title: {
      required: true,
    },
    alttext: {
      required: true,
    },
    caption: {
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
    imageFile: {
      required: true,
    },
  }),
)(ImageForm);
