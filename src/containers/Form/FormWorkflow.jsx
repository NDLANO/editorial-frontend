/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { connect } from 'react-redux';
import { actions as draftActions } from '../../modules/draft/draft';
import * as draftApi from '../../modules/draft/draftApi';
import * as messageActions from '../Messages/messagesActions';
import { AddNotes } from '.';
import { CommonFieldPropsShape } from '../../shapes';
import FormStatusActions from './components/FormStatusActions';
import FormStatusColumns from './components/FormStatusColumns';
import FormQualityAssurance from './components/FormQualityAssurance';

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

  onUpdateStatus(status) {
    const {
      model: { id },
      updateStatusDraft,
    } = this.props;
    updateStatusDraft({ id, status });
  }

  onValidateClick() {
    const {
      model: { id },
      addMessage,
    } = this.props;
    draftApi
      .validateDraft(id)
      .then(() => {
        addMessage({
          translationKey: 'form.validationOk',
          severity: 'success',
        });
      })
      .catch(err => {
        if (err && err.json.messages) {
          addMessage({
            message: err.json.messages
              .map(message => `${message.field}: ${message.message}`)
              .join(', '),
            severity: 'danger',
            timeToLive: 0,
          });
        }
      });
  }

  render() {
    const {
      t,
      model,
      articleStatus,
      commonFieldProps,
      getArticle,
    } = this.props;
    const { possibleStatuses } = this.state;

    return (
      <Fragment>
        <AddNotes
          name="notes"
          labelHeading={t('form.notesHeading')}
          labelAddNote={t('form.addNotes')}
          labelRemoveNote={t('form.removeNotes')}
          labelWarningNote={t('form.warningNotes')}
          {...commonFieldProps}
        />
        <FormStatusColumns articleStatus={articleStatus} />
        <FormStatusActions
          articleStatus={articleStatus}
          possibleStatuses={possibleStatuses}
          onUpdateStatus={this.onUpdateStatus}
        />
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
  addMessage: PropTypes.func.isRequired,
  updateStatusDraft: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  getArticle: PropTypes.func.isRequired,
};

FormWorkflow.defaultProps = {
  articleStatus: {
    current: '',
    other: [],
  },
};

const mapDispatchToProps = {
  addMessage: messageActions.addMessage,
  updateStatusDraft: draftActions.updateStatusDraft,
};

export default connect(
  undefined,
  mapDispatchToProps,
)(injectT(FormWorkflow));
