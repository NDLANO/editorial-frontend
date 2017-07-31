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
import { EditorState } from 'draft-js';
import { injectT } from 'ndla-i18n';

import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';

import converter from '../../../util/articleContentConverter';
import {
  createEditorStateFromText,
  getPlainTextFromEditorState,
} from '../../../util/draftjsHelpers';
import { parseEmbedTag } from '../../../util/embedTagHelpers';

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
    introduction: createEditorStateFromText(article.introduction),
    content: article.content
      ? converter.toEditorState(article.content)
      : EditorState.createEmpty(),
    tags: article.tags || [],
    authors: parseCopyrightAuthors(article, 'Forfatter'),
    licensees: parseCopyrightAuthors(article, 'Rettighetshaver'),
    contributors: parseCopyrightAuthors(article, 'Bidragsyter'),
    copyrightOrigin:
      article.copyright && article.copyright.origin
        ? article.copyright.origin
        : '',
    license: article.copyright
      ? article.copyright.license.license
      : DEFAULT_LICENSE.license,
    metaDescription: createEditorStateFromText(article.metaDescription) || '',
    metaImageId: metaImage.id || '',
    metaImageCaption: metaImage.caption || '',
    metaImageAlt: metaImage.alt || '',
  };
};

const classes = new BEMHelper({
  name: 'topic-article-form',
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
      title: [{ title: model.title, language }],
      introduction: [
        {
          introduction: getPlainTextFromEditorState(model.introduction),
          language,
        },
      ],
      tags: [{ tags: model.tags, language }],
      content: [{ content: converter.toHtml(model.content), language }],
      visualElement: [
        {
          content: `<embed data-size="fullbredde" data-align="" data-alt="${model.metaImageAlt}" data-caption="${model.metaImageCaption}" data-resource="image" data-resource_id="${model.metaImageId}" />`,
          language,
        },
      ],
      metaDescription: [
        {
          metaDescription: getPlainTextFromEditorState(model.metaDescription),
          language,
        },
      ],
      articleType: 'standard',
      copyright: {
        license: licenses.find(license => license.license === model.license),
        origin: model.origin,
        authors: authors.concat(licensees).concat(contributors),
      },
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
          <Button outline disabled={isSaving} {...classes('abort-button')}>
            {t('learningResourceForm.abort')}
          </Button>
          <Button
            submit
            outline
            disabled={isSaving}
            {...classes('save-button')}>
            {t('learningResourceForm.save')}
          </Button>
        </Field>
      </form>
    );
  }
}

LearningResourceForm.propTypes = {
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
      required: true,
      maxLength: 300,
    },
    content: {
      required: true,
    },
    metaDescription: {
      required: true,
      maxLength: 150,
    },
    metaImageId: {
      required: true,
    },
    tags: {
      minItems: 3,
    },
    authors: {
      minItems: 1,
    },
  }),
)(LearningResourceForm);
