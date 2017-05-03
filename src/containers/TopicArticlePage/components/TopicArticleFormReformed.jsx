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

const Field = ({ bindInput, name, label, submitted, schema }) => (
  <div style={{ marginTop: '3rem' }}>
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      type="text"
      className="form-control"
      {...bindInput(name)}
    />
    { !schema.fields[name].isValid && (schema.fields[name].isDirty || submitted) ? <span>{schema.fields[name].errors[0]}</span> : null}
  </div>
);

Field.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
    isValid: PropTypes.bool.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  setSubmitted: PropTypes.func.isRequired,
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
      title: [{ title: model.title, language: 'nb' }],
    });
  }

  render() {
    const { t, bindInput, schema, submitted } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className="topic-article-form">
        <div style={{ marginTop: '3rem' }}>
          <Field label={t('topicArticleForm.labels.title')} name="title" bindInput={bindInput} schema={schema} submitted={submitted} />
          <Field label={t('topicArticleForm.labels.introduction')} name="introduction" bindInput={bindInput} schema={schema} submitted={submitted} />
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
  }),
)(TopicArticleForm);
