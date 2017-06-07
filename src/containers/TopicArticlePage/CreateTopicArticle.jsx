/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions } from '../../modules/article/article';
import TopicArticleForm, { getInitialModel } from './components/TopicArticleForm';

class CreateTopicArticle extends Component {
  constructor(props) {
    super(props);
    this.updateArticle = this.updateArticle.bind(this);
  }

  updateArticle(article) {
    const { updateArticle, history } = this.props;
    updateArticle({ article, history });
  }

  render() {
    const { locale, tags, isSaving } = this.props;

    return (
      <TopicArticleForm
        initialModel={getInitialModel({})}
        tags={tags}
        locale={locale}
        isSaving={isSaving}
        onUpdate={this.updateArticle}
      />
    );
  }
}

CreateTopicArticle.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  updateArticle: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
  updateArticle: actions.updateArticle,
};

export default connect(undefined, mapDispatchToProps)(CreateTopicArticle);
