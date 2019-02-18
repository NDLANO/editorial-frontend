/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions as draftActions } from '../../modules/draft/draft';
import * as draftApi from '../../modules/draft/draftApi';
import { CommonFieldPropsShape, NewArticleShape } from '../../shapes';
import FormStatusActions from './components/FormStatusActions';
import FormStatusColumns from './components/FormStatusColumns';
import FormQualityAssurance from './components/FormQualityAssurance';
import FormDeleteLanguageVersion from './components/FormDeleteLanguageVersion';
import * as articleStatuses from '../../util/constants/ArticleStatus';

export const formatErrorMessage = error => ({
  message: error.json.messages
    .map(message => `${message.field}: ${message.message}`)
    .join(', '),
  severity: 'danger',
  timeToLive: 0,
});

class FormWorkflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleStatuses: {},
    };
    this.onValidateClick = this.onValidateClick.bind(this);
    this.onUpdateStatus = this.onUpdateStatus.bind(this);
  }

  async componentDidMount() {
    const possibleStatuses = await draftApi.fetchStatusStateMachine();
    this.setState({ possibleStatuses });
  }

  async onUpdateStatus(status) {
    const {
      model: { id },
      updateStatusDraft,
      getArticle,
      createMessage,
      revision,
    } = this.props;

    try {
      if (
        status === articleStatuses.PUBLISHED ||
        status === articleStatuses.QUEUED_FOR_PUBLISHING
      ) {
        await draftApi.validateDraft(id, {
          ...getArticle(),
          revision,
        });
      }
      updateStatusDraft({ id, status });
    } catch (error) {
      if (error && error.json && error.json.messages) {
        createMessage(formatErrorMessage(error));
      }
    }
  }

  async onValidateClick() {
    const {
      model: { id },
      createMessage,
      getArticle,
      revision,
    } = this.props;

    try {
      await draftApi.validateDraft(id, { ...getArticle(), revision });
      createMessage({
        translationKey: 'form.validationOk',
        severity: 'success',
      });
    } catch (error) {
      if (error && error.json && error.json.messages) {
        createMessage(formatErrorMessage(error));
      } else {
        createMessage(error);
      }
    }
  }

  render() {
    const {
      t,
      model,
      articleStatus,
      getArticle,
      children,
    } = this.props;
    const { possibleStatuses } = this.state;

    return (
      <Fragment>
        {children}
        <FormStatusColumns articleStatus={articleStatus} />
        <FormStatusActions
          articleStatus={articleStatus}
          possibleStatuses={possibleStatuses}
          onUpdateStatus={this.onUpdateStatus}
        />
        <FormDeleteLanguageVersion model={model} />
        <FormQualityAssurance
          getArticle={getArticle}
          model={model}
          onValidateClick={this.onValidateClick}
        />
      </Fragment>
    );
  }
}

FormWorkflow.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  createMessage: PropTypes.func.isRequired,
  updateStatusDraft: PropTypes.func.isRequired,
  getArticle: PropTypes.func.isRequired,
};

FormWorkflow.defaultProps = {
  articleStatus: {
    current: '',
    other: [],
  },
  article: {},
};

const mapDispatchToProps = {
  updateStatusDraft: draftActions.updateStatusDraft,
};

export default connect(
  undefined,
  mapDispatchToProps,
)(FormWorkflow);
