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
import FormikStatusActions from './components/FormikStatusActions';
import FormikStatusColumns from './components/FormikStatusColumns';
import FormikQualityAssurance from './components/FormikQualityAssurance';
import FormikDeleteLanguageVersion from './components/FormikDeleteLanguageVersion';
import * as articleStatuses from '../../util/constants/ArticleStatus';

export const formatErrorMessage = error => ({
  message: error.json.messages
    .map(message => `${message.field}: ${message.message}`)
    .join(', '),
  severity: 'danger',
  timeToLive: 0,
});

class FormikWorkflow extends Component {
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
      values,
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
        await draftApi.validateDraft(values.id, {
          ...getArticle(values),
          revision,
        });
      }
      updateStatusDraft({ id: values.id, status });
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
    const { values, articleStatus, getArticle, children } = this.props;
    const { possibleStatuses } = this.state;

    return (
      <Fragment>
        {children}
        <FormikStatusColumns articleStatus={articleStatus} />
        <FormikStatusActions
          articleStatus={articleStatus}
          possibleStatuses={possibleStatuses}
          onUpdateStatus={this.onUpdateStatus}
        />
        <FormikDeleteLanguageVersion values={values} />
        <FormikQualityAssurance
          getArticle={getArticle}
          values={values}
          onValidateClick={this.onValidateClick}
        />
      </Fragment>
    );
  }
}

FormikWorkflow.propTypes = {
  values: PropTypes.shape({
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

FormikWorkflow.defaultProps = {
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
)(FormikWorkflow);
