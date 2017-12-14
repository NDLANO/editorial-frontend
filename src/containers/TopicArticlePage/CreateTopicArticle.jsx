/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions as draftActions } from '../../modules/draft/draft';
import TopicArticleForm, {
  getInitialModel,
} from './components/TopicArticleForm';
import {
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';

class CreateTopicArticle extends Component {
  constructor(props) {
    super(props);
    this.updateDraft = this.updateDraft.bind(this);
  }

  componentWillMount() {
    const { locale, fetchTags } = this.props;
    fetchTags({ language: locale });
  }

  updateDraft(article) {
    const { updateDraft, history } = this.props;
    updateDraft({ draft: article, history });
  }

  render() {
    const { locale, tags, isSaving } = this.props;

    return (
      <TopicArticleForm
        initialModel={getInitialModel({ language: locale })}
        tags={tags}
        locale={locale}
        isSaving={isSaving}
        onUpdate={this.updateDraft}
      />
    );
  }
}

CreateTopicArticle.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  updateDraft: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  fetchTags: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  updateDraft: draftActions.updateDraft,
  fetchTags: tagActions.fetchTags,
};

const mapStateToProps = (state, props) => {
  const getAllTagsSelector = getAllTagsByLanguage(props.locale);
  return {
    tags: getAllTagsSelector(state),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateTopicArticle);
