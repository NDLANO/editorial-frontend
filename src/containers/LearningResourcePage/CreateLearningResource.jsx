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
import LearningResourceForm, {
  getInitialModel,
} from './components/LearningResourceForm';

class CreateLearningResource extends Component {
  constructor(props) {
    super(props);
    this.updateArticle = this.updateArticle.bind(this);
  }

  updateArticle(article) {
    const { updateArticle, history } = this.props;
    updateArticle({ article, history });
  }

  render() {
    const { tags, isSaving, licenses, fetchArticle } = this.props;

    return (
      <LearningResourceForm
        initialModel={getInitialModel({})}
        tags={tags}
        licenses={licenses}
        isSaving={isSaving}
        onUpdate={this.updateArticle}
        fetchArticle={fetchArticle}
      />
    );
  }
}

CreateLearningResource.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  updateArticle: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  fetchArticle: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
  updateArticle: actions.updateArticle,
};

export default connect(undefined, mapDispatchToProps)(CreateLearningResource);
