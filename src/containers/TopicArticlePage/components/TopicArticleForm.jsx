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
import { parseEmbedTag } from '../../../util/embedTagHelpers';
import TopicArticleMetadata from './TopicArticleMetadata';

const DEFAULT_LICENSE = {
  description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
  license: 'by-sa',
  url: 'https://creativecommons.org/licenses/by-sa/2.0/',
};

export const getInitialModel = (article = {}) => {
  const image = parseEmbedTag(article.visualElement) || {};
  return {
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
    imageId: image.id || '',
    metaDescription: article.metaDescription || '',
    imageCaption: image.caption || '',
    imageAltText: image.alt || '',
  };
};

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
      visualElement: [
        {
          content: `<embed data-size="fullbredde" data-align="" data-alt="${model.imageAltText}" data-caption="${model.imageCaption}" data-resource="image" data-resource_id="${model.imageId}" />`,
          language,
        },
      ],
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
      model,
      submitted,
      tags,
      isSaving,
    } = this.props;

    const commonFieldProps = { bindInput, schema, submitted };
    const imageTag = {
      resource: 'image',
      id: model.imageId,
      caption: model.imageCaption,
      alt: model.imageAltText,
    };
    return (
      <form onSubmit={this.handleSubmit} {...classes()}>
        <div {...classes('title')}>
          {model.id
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
          embedTag={imageTag}
          {...bindInput('imageId')}
        />
        <TextField
          placeholder={t('topicArticleForm.fields.caption.placeholder')}
          label={t('topicArticleForm.fields.caption.label')}
          name="imageCaption"
          noBorder
          maxLength={300}
          {...commonFieldProps}
        />

        <TextField
          placeholder={t('topicArticleForm.fields.alt.placeholder')}
          label={t('topicArticleForm.fields.alt.label')}
          name="imageAltText"
          noBorder
          maxLength={300}
          {...commonFieldProps}
        />

        <RichTextField
          noBorder
          label={t('topicArticleForm.fields.content.label')}
          placeholder={t('topicArticleForm.fields.content.placeholder')}
          name="content"
          {...commonFieldProps}
        />
        <TopicArticleMetadata classes={classes} commonFieldProps={commonFieldProps} bindInput={bindInput} tags={tags} />
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
    imageId: {
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
