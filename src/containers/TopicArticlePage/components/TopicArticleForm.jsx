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
import { Button } from 'ndla-ui';
import { injectT } from '../../../i18n';
import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
import { TextField, TextAreaField, MultiSelectField, RichTextField } from '../../../components/Fields';
import { convertEditorStateToHTML } from '../topicArticleContentConverter';

class TopicArticleForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const { model, schema, setSubmitted } = this.props;
    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

    this.props.onUpdate({
      id: model.id,
      revision: model.revision,
      title: [{ title: model.title, language: 'nb' }],
      introduction: [{ introduction: model.introduction, language: 'nb' }],
      tags: [{ tags: model.tags, language: 'nb' }],
      content: [{ content: convertEditorStateToHTML(model.content), language: 'nb' }],
      copyright: {
        ...model.copyright,
        authors: model.authors.map(name => ({ type: 'Forfatter', name })),
      },
    });
  }

  render() {
    const { t, bindInput, schema, submitted, tags } = this.props;
    const commonFieldProps = { bindInput, schema, submitted };
    return (
      <form onSubmit={this.handleSubmit} className="topic-article-form">
        <div style={{ marginTop: '3rem' }}>
          <TextField
            label={t('topicArticleForm.labels.title')}
            name="title"
            {...commonFieldProps}
          />
          <TextAreaField
            label={t('topicArticleForm.labels.introduction')}
            name="introduction"
            maxLength={300}
            getMaxLengthRemaingLabel={(maxLength, remaining) => t('form.remainingCharacters', { maxLength, remaining })}
            {...commonFieldProps}
          />
          <RichTextField
            label={t('topicArticleForm.fields.content.label')}
            placeholder={t('topicArticleForm.fields.content.placeholder')}
            name="content"
            {...commonFieldProps}
          />
          <hr />
          <TextAreaField
            label={t('topicArticleForm.labels.metaDescription')}
            name="metaDescription"
            maxLength={150}
            getMaxLengthRemaingLabel={(maxLength, remaining) => t('form.remainingCharacters', { maxLength, remaining })}
            {...commonFieldProps}
          />
          <MultiSelectField
            name="tags"
            data={tags}
            label={t('topicArticleForm.labels.tags')}
            messages={{
              createNew: t('topicArticleForm.fields.tags.createNew'),
              emptyFilter: t('topicArticleForm.fields.tags.emptyFilter'),
              emptyList: t('topicArticleForm.fields.tags.emptyList'),
            }}
            {...commonFieldProps}
          />
          <MultiSelectField
            name="authors"
            label={t('topicArticleForm.labels.authors')}
            messages={{
              createNew: t('topicArticleForm.fields.authors.createNew'),
              emptyFilter: t('topicArticleForm.fields.authors.emptyFilter'),
              emptyList: t('topicArticleForm.fields.authors.emptyList'),
            }}
            {...commonFieldProps}
          />
        </div>
        <Button submit outline>{t('topicArticleForm.save')}</Button>
      </form>
    );
  }
}

TopicArticleForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
  }),
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
    isValid: PropTypes.bool.isRequired,
  }),
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  setSubmitted: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
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
    },
    metaDescription: {
      required: true,
    },
  }),
)(TopicArticleForm);
