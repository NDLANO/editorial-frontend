/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { Link } from 'react-router-dom';
import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';
import converter from '../../../util/articleContentConverter';
import {
  parseEmbedTag,
  createEmbedTag,
  isUserProvidedEmbedDataValid,
} from '../../../util/embedTagHelpers';
import { findEmbedNodes } from '../../../util/slateHelpers';
import { SchemaShape } from '../../../shapes';

import LearningResourceMetadata from './LearningResourceMetadata';
import LearningResourceContent from './LearningResourceContent';
import LearningResourceCopyright from './LearningResourceCopyright';

const DEFAULT_LICENSE = {
  description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
  license: 'by-sa',
  url: 'https://creativecommons.org/licenses/by-sa/2.0/',
};

const parseCopyrightAuthors = (article, type) =>
  article.copyright
    ? article.copyright.authors
        .filter(author => author.type === type)
        .map(author => author.name)
    : [];

export const getInitialModel = (article = {}) => {
  const metaImage = parseEmbedTag(article.visualElement) || {};
  return {
    id: article.id,
    revision: article.revision,
    title: article.title || '',
    introduction: converter.toPlainSlateEditorState(article.introduction),
    content: converter.toSlateEditorState(article.content, true),
    tags: article.tags || [],
    authors: parseCopyrightAuthors(article, 'Forfatter'),
    licensees: parseCopyrightAuthors(article, 'Rettighetshaver'),
    contributors: parseCopyrightAuthors(article, 'Bidragsyter'),
    origin:
      article.copyright && article.copyright.origin
        ? article.copyright.origin
        : '',
    license: article.copyright
      ? article.copyright.license.license
      : DEFAULT_LICENSE.license,
    metaDescription: converter.toPlainSlateEditorState(
      article.metaDescription,
      true,
    ),
    metaImage,
  };
};

const classes = new BEMHelper({
  name: 'learning-resource-form',
  prefix: 'c-',
});

class LearningResourceForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const {
      model,
      schema,
      revision,
      locale: language,
      setSubmitted,
      licenses,
    } = this.props;
    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

    const authors = model.authors.map(name => ({ type: 'Forfatter', name }));
    const licensees = model.licensees.map(name => ({
      type: 'Rettighetshaver',
      name,
    }));
    const contributors = model.contributors.map(name => ({
      type: 'Bidragsyter',
      name,
    }));

    this.props.onUpdate({
      id: model.id,
      revision,
      title: model.title,
      introduction:  converter.slateToText(model.introduction),
      tags: model.tags,
      content: converter.slateToHtml(model.content, true),
      visualElement: createEmbedTag(model.metaImage),
      metaDescription:  converter.slateToText(model.metaDescription),
      articleType: 'standard',
      copyright: {
        license: licenses.find(license => license.license === model.license),
        origin: model.origin,
        authors: authors.concat(licensees).concat(contributors),
      },
      language,
    });
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
      <form onSubmit={this.handleSubmit} {...classes()}>
        <div {...classes('title')}>
          {model.id
            ? t('learningResourceForm.title.update')
            : t('learningResourceForm.title.create')}
        </div>
        <LearningResourceMetadata
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
          model={model}
        />
        <LearningResourceContent
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
        />
        <LearningResourceCopyright
          commonFieldProps={commonFieldProps}
          licenses={licenses}
        />
        <Field right>
          <Link
            to={'/'}
            {...classes('abort-button', '', 'c-button c-button--outline')}
            disabled={isSaving}>
            {t('form.abort')}
          </Link>
          <Button
            submit
            outline
            disabled={isSaving}
            {...classes('save-button')}>
            {t('form.save')}
          </Button>
        </Field>
      </form>
    );
  }
}

LearningResourceForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
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
  revision: PropTypes.number,
  setSubmitted: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

export default compose(
  injectT,
  reformed,
  validateSchema({
    title: {
      required: true,
    },
    introduction: {
      maxLength: 300,
    },
    content: {
      required: true,
      test: (value, model, setError) => {
        const embedsHasErrors = value.find(block => {
          const embeds = findEmbedNodes(block.state.document).map(node =>
            node.get('data').toJS(),
          );
          const notValidEmbeds = embeds.filter(
            embed => !isUserProvidedEmbedDataValid(embed),
          );
          return notValidEmbeds.length > 0;
        });

        if (embedsHasErrors) {
          setError('learningResourceForm.validation.missingEmbedData');
        }
      },
    },
    metaDescription: {
      required: true,
      maxLength: 150,
    },
    metaImage: {
      required: true,
    },
    'metaImage.alt': {
      required: true,
      onlyValidateIf: model =>
        model.metaImage && model.metaImage.resource === 'image',
    },
    'metaImage.caption': {
      required: true,
      onlyValidateIf: model =>
        model.metaImage && model.metaImage.resource === 'image',
    },
    tags: {
      minItems: 3,
    },
    authors: {
      minItems: 1,
    },
  }),
)(LearningResourceForm);
