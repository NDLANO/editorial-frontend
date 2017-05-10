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
import TagsInput from './TagsInput';

const FieldMessage = ({ field, submitted }) => (field && !field.isValid && (field.isDirty || submitted) ? <span>{field.errors[0]}</span> : null);

FieldMessage.propTypes = {
  field: PropTypes.shape({
    isDirty: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    errors: PropTypes.array,
  }),
  submitted: PropTypes.bool.isRequired,
};

const FieldText = ({ bindInput, name, label, submitted, schema, ...rest }) => (
  <div style={{ marginTop: '3rem' }}>
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      type="text"
      className="form-control"
      {...bindInput(name)}
      {...rest}
    />
    <div>
      <FieldMessage field={schema.fields[name]} submitted={submitted} />
    </div>
  </div>
);

FieldText.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
};

const ShowRemainingCharacters = ({ value, maxLength, getMaxLengthRemaingLabel }) => (<span>{getMaxLengthRemaingLabel(maxLength, maxLength - value.length)}</span>);

ShowRemainingCharacters.propTypes = {
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  getMaxLengthRemaingLabel: PropTypes.func.isRequired,
};


const FieldTextArea = ({ bindInput, name, label, submitted, schema, maxLength, getMaxLengthRemaingLabel, ...rest }) => (
  <div style={{ marginTop: '3rem' }}>
    <label htmlFor={name}>{label}</label>
    <textarea
      id={name}
      className="form-control"
      maxLength={maxLength}
      {...bindInput(name)}
      {...rest}
    />
    <div>
      <FieldMessage field={schema.fields[name]} submitted={submitted} />
    </div>
    { getMaxLengthRemaingLabel ? <ShowRemainingCharacters maxLength={maxLength} getMaxLengthRemaingLabel={getMaxLengthRemaingLabel} value={bindInput(name).value} /> : null }
  </div>
);


FieldTextArea.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  maxLength: PropTypes.number,
  getMaxLengthRemaingLabel: PropTypes.func,
};

const FieldTags = ({ bindInput, name, label, submitted, schema, ...rest }) => (
  <div style={{ marginTop: '3rem' }}>
    <label htmlFor={name}>{label}</label>
    <TagsInput
      name={name}
      {...bindInput(name)}
      {...rest}
    />
    <div>
      <FieldMessage field={schema.fields[name]} submitted={submitted} />
    </div>
  </div>
);


FieldTags.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitted: PropTypes.bool.isRequired,
};

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
    });
  }

  render() {
    const { t, bindInput, schema, submitted, tags } = this.props;
    const commonFieldProps = { bindInput, schema, submitted };
    return (
      <form onSubmit={this.handleSubmit} className="topic-article-form">
        <div style={{ marginTop: '3rem' }}>
          <FieldText
            label={t('topicArticleForm.labels.title')}
            name="title"
            {...commonFieldProps}
          />
          <FieldTextArea
            label={t('topicArticleForm.labels.introduction')}
            name="introduction"
            maxLength={300}
            getMaxLengthRemaingLabel={(maxLength, remaining) => t('form.remainingCharacters', { maxLength, remaining })}
            {...commonFieldProps}
          />
          <br />
          <FieldTextArea
            label={t('topicArticleForm.labels.metaDescription')}
            name="metaDescription"
            maxLength={150}
            getMaxLengthRemaingLabel={(maxLength, remaining) => t('form.remainingCharacters', { maxLength, remaining })}
            {...commonFieldProps}
          />
          <FieldTags
            name="tags"
            data={tags}
            label={t('topicArticleForm.labels.tags')}
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
