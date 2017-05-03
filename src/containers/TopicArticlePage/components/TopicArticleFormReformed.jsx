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

class TopicArticleForm extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.setState({ title: evt.target.value });
  }

  handleSubmit(evt) {
    const { model } = this.props;
    evt.preventDefault();
    this.props.onUpdate({
      id: model.id,
      title: [{ title: model.title, language: 'nb' }],
    });
  }

  render() {
    const { t, bindInput } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className="topic-article-form">
        <div style={{ marginTop: '3rem' }}>
          <label htmlFor="title">{t('topicArticleForm.labels.title')}</label>
          <input
            id="title"
            type="text"
            className="form-control"
            {...bindInput('title')}
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
  bindInput: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default compose(
  injectT,
  reformed(),
  validateSchema({
    title: {
      required: true,
    },
  }),
)(TopicArticleForm);
