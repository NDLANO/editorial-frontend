/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

/* global history */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';
import { LicensesArrayOf } from '../../shapes';
import { actions as draftActions } from '../../modules/draft/draft';
import LearningResourceForm, {
  getInitialModel,
} from './components/LearningResourceForm';

class CreateLearningResource extends PureComponent {
  constructor(props) {
    super(props);
    this.updateDraft = this.updateDraft.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { locale, fetchTags } = this.props;
    fetchTags({ language: locale });
  }

  updateDraft(article) {
    const { updateDraft } = this.props;
    updateDraft({ draft: article, history: this.props.history });
  }

  render() {
    const { locale, ...rest } = this.props;
    return (
      <LearningResourceForm
        initialModel={getInitialModel({ language: locale })}
        {...rest}
        onUpdate={this.updateDraft}
      />
    );
  }
}

CreateLearningResource.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  licenses: LicensesArrayOf,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateLearningResource);
