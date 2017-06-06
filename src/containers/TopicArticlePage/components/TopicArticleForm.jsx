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

import { injectT } from '../../../i18n';
import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
import {
  TextField,
  TextAreaField,
  MultiSelectField,
  RichTextField,
  PlainTextField,
  RemainingCharacters,
  Field,
} from '../../../components/Fields';
import ImageSelectField from '../../../components/ImageSelectField';
import converter from '../topicArticleContentConverter';
import {
  createEditorStateFromText,
  getPlainTextFromEditorState,
} from '../../../util/draftjsHelpers';

const DEFAULT_LICENSE = {
  description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
  license: 'by-sa',
  url: 'https://creativecommons.org/licenses/by-sa/2.0/',
};

export const getInitialModel = (article = {}) => ({
  id: article.id,
  revision: article.revision,
  title: article.title || '',
  introduction: createEditorStateFromText(article.introduction),
  content: article.content
    ? converter.toEditorState(article.content)
    : EditorState.createEmpty(),
  tags: article.tags || [],
  authors: article.copyright
    ? article.copyright.authors.map(author => author.name)
    : [],
  copyright: article.copyright
    ? article.copyright
    : { license: DEFAULT_LICENSE, origin: '' },
  visualElement: article.visualElement || '',
  metaDescription: article.metaDescription || '',
});

const classes = new BEMHelper({
  name: 'topic-article-form',
  prefix: 'c-',
});

class TopicArticleForm extends Component {
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
    } = this.props;
    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

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
      visualElement: [{ content: model.visualElement, language }],
      metaDescription: [{ metaDescription: model.metaDescription, language }],
      articleType: 'topic-article',
      copyright: {
        ...model.copyright,
        authors: model.authors.map(name => ({ type: 'Forfatter', name })),
      },
    });
  }

  render() {
    const {
      t,
      bindInput,
      schema,
      model: { id },
      submitted,
      tags,
      isSaving,
    } = this.props;
    const commonFieldProps = { bindInput, schema, submitted };
    return (
      <form onSubmit={this.handleSubmit} {...classes()}>
        <div {...classes('title')}>
          {id
            ? t('topicArticleForm.title.update')
            : t('topicArticleForm.title.create')}
        </div>
        <TextField
          label={t('topicArticleForm.fields.title.label')}
          name="title"
          big
          noBorder
          placeholder={t('topicArticleForm.fields.title.label')}
          {...commonFieldProps}
        />
        <PlainTextField
          label={t('topicArticleForm.fields.introduction.label')}
          placeholder={t('topicArticleForm.fields.introduction.label')}
          name="introduction"
          noBorder
          maxLength={300}
          {...commonFieldProps}>
          <RemainingCharacters
            maxLength={300}
            getRemainingLabel={(maxLength, remaining) =>
              t('form.remainingCharacters', { maxLength, remaining })}
            value={bindInput('introduction').value
              .getCurrentContent()
              .getPlainText()}
          />
        </PlainTextField>
        <ImageSelectField
          label={t('topicArticleForm.fields.visualElement.label')}
          schema={schema}
          submitted={submitted}
          {...bindInput('visualElement')}
        />
        <RichTextField
          noBorder
          label={t('topicArticleForm.fields.content.label')}
          placeholder={t('topicArticleForm.fields.content.placeholder')}
          name="content"
          {...commonFieldProps}
        />
        <hr />
        <MultiSelectField
          name="tags"
          data={tags}
          label={t('topicArticleForm.fields.tags.label')}
          description={t('topicArticleForm.fields.tags.description')}
          messages={{
            createNew: t('topicArticleForm.fields.tags.createNew'),
            emptyFilter: t('topicArticleForm.fields.tags.emptyFilter'),
            emptyList: t('topicArticleForm.fields.tags.emptyList'),
          }}
          {...commonFieldProps}
        />
        <TextAreaField
          label={t('topicArticleForm.fields.metaDescription.label')}
          description={t('topicArticleForm.fields.metaDescription.description')}
          name="metaDescription"
          maxLength={150}
          {...commonFieldProps}>
          <RemainingCharacters
            maxLength={150}
            getRemainingLabel={(maxLength, remaining) =>
              t('form.remainingCharacters', { maxLength, remaining })}
            value={bindInput('metaDescription').value}
          />
        </TextAreaField>
        <MultiSelectField
          name="authors"
          label={t('topicArticleForm.fields.authors.label')}
          messages={{
            createNew: t('topicArticleForm.fields.authors.createNew'),
            emptyFilter: t('topicArticleForm.fields.authors.emptyFilter'),
            emptyList: t('topicArticleForm.fields.authors.emptyList'),
          }}
          {...commonFieldProps}
        />
        <Field right>
          <Button
            submit
            outline
            disabled={isSaving}
            {...classes('save-button')}>
            {t('topicArticleForm.save')}
          </Button>
        </Field>
      </form>
    );
  }
}

TopicArticleForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
    isValid: PropTypes.bool.isRequired,
  }),
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
    },
    visualElement: {
      required: true,
    },
    tags: {
      minItems: 3,
    },
    authors: {
      minItems: 1,
    },
  }),
)(TopicArticleForm);
