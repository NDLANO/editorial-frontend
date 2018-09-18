/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { connect } from 'react-redux';
import Accordion from '../../components/Accordion';
import { actions as draftActions } from '../../modules/draft/draft';
import * as draftApi from '../../modules/draft/draftApi';
import * as messageActions from '../Messages/messagesActions';
import { AddNotes, formClasses } from '.';
import { CommonFieldPropsShape } from '../../shapes';
import FormStatusActions from './components/FormStatusActions';
import FormStatusColumns from './components/FormStatusColumns';

class FormWorkflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenWorkflow: true,
      possibleStatuses: [],
    };
    this.toggleWorkflow = this.toggleWorkflow.bind(this);
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

  toggleWorkflow() {
    this.setState(prevState => ({
      hiddenWorkflow: !prevState.hiddenWorkflow,
    }));
  }

  render() {
    const { t, model, saveDraft, articleStatus, commonFieldProps } = this.props;
    const { possibleStatuses } = this.state;

    return (
      <Accordion
        fill
        handleToggle={this.toggleWorkflow}
        header={t('form.workflowSection')}
        hidden={this.state.hiddenWorkflow}>
        <AddNotes
          name="notes"
          label={t('form.addNotes')}
          {...commonFieldProps}
        />
        <span {...formClasses('title')}>Status</span>
        <FormStatusColumns articleStatus={articleStatus} />
        <FormStatusActions
          articleStatus={articleStatus}
          model={model}
          saveDraft={saveDraft}
          onValidateClick={this.onValidateClick}
          possibleStatuses={possibleStatuses}
          onUpdateStatus={this.onUpdateStatus}
        />
      </Accordion>
    );
  }
}

FormWorkflow.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
  articleStatus: PropTypes.arrayOf(PropTypes.string),
  addMessage: PropTypes.func.isRequired,
  updateStatusDraft: PropTypes.func.isRequired,
  saveDraft: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
};

FormWorkflow.defaultProps = {
  articleStatus: [],
};

const mapDispatchToProps = {
  addMessage: messageActions.addMessage,
  updateStatusDraft: draftActions.updateStatusDraft,
};

export default connect(
  undefined,
  mapDispatchToProps,
)(injectT(FormWorkflow));
