/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
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

  componentDidMount() {
    const { locale, fetchTags } = this.props;
    fetchTags({ language: locale });
  }

  updateDraft(article) {
    const { updateDraft, history } = this.props;
    updateDraft({ draft: article, history });
  }

  render() {
    const { locale, t, ...rest } = this.props;

    return (
      <Fragment>
        <HelmetWithTracker title={t('htmlTitles.createTopicArticlePage')} />
        <TopicArticleForm
          initialModel={getInitialModel({ language: locale })}
          locale={locale}
          onUpdate={this.updateDraft}
          {...rest}
        />
      </Fragment>
    );
  }
}

CreateTopicArticle.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  updateDraft: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
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
export default injectT(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CreateTopicArticle),
);
