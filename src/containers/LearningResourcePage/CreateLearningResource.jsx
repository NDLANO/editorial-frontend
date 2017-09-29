/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions as tagActions, getAllTags } from '../../modules/tag/tag';
import { actions } from '../../modules/article/article';
import LearningResourceForm, {
  getInitialModel,
} from './components/LearningResourceForm';

class CreateLearningResource extends Component {
  constructor(props) {
    super(props);
    this.updateArticle = this.updateArticle.bind(this);
  }

  componentWillMount() {
    const { locale, fetchTags } = this.props;
    fetchTags({ language: locale });
  }

  updateArticle(article) {
    const { updateArticle, history } = this.props;
    updateArticle({ article, history });
  }

  render() {
    const { tags, locale, isSaving, licenses, fetchArticle } = this.props;

    return (
      <LearningResourceForm
        initialModel={getInitialModel({ language: locale })}
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
  fetchTags: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
  updateArticle: actions.updateArticle,
  fetchTags: tagActions.fetchTags,
};

const mapStateToProps = state => ({
  tags: getAllTags(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  CreateLearningResource,
);
