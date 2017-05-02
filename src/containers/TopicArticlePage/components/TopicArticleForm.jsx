/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { injectT } from '../../../i18n';
import { ArticleShape } from '../../../shapes';

class TopicArticleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.article !== this.props.article) {
      this.setState({
        title: nextProps.article.title,
      });
    }
  }
  handleChange(evt) {
    this.setState({ title: evt.target.value });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.props.onUpdate();
  }

  render() {
    const { t } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className="topic-article-form">
        <div style={{ marginTop: '3rem' }}>
          <label htmlFor="title">{t('topicArticleForm.labels.title')}</label>
          <input
            id="title"
            type="text" className="field"
            onChange={this.handleChange}
            value={this.state.title}
          />
        </div>
        <Button submit outline>{t('topicArticleForm.save')}</Button>
      </form>
    );
  }
}

TopicArticleForm.propTypes = {
  article: ArticleShape,
  onUpdate: PropTypes.func.isRequired,
};

export default injectT(TopicArticleForm);
