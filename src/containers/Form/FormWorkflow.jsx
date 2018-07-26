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
import { Button } from 'ndla-ui';
import { connect } from 'react-redux';
import Accordion from '../../components/Accordion';
import { validateDraft } from '../../modules/draft/draftApi';
import { actions as draftActions } from '../../modules/draft/draft';
import * as messageActions from '../Messages/messagesActions';
import { articleStatuses } from '../../util/formHelper';
import { AddNotes, formClasses } from '.';

import { CommonFieldPropsShape } from '../../shapes';

class FormWorkflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenWorkflow: true,
    };
    this.toggleWorkflow = this.toggleWorkflow.bind(this);
    this.onValidateClick = this.onValidateClick.bind(this);
  }

  onValidateClick() {
    const {
      model: { id },
      addMessage,
    } = this.props;
    validateDraft(id)
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
    const {
      t,
      model,
      publishDraft,
      saveDraft,
      articleStatus,
      commonFieldProps,
    } = this.props;
    return (
      <Accordion
        fill
        handleToggle={this.toggleWorkflow}
        header={t('form.workflowSection')}
        hidden={this.state.hiddenWorkflow}>
        <AddNotes name="notes" label="Legg til merknad" {...commonFieldProps} />
        <span {...formClasses('title')}>Status</span>
        <div {...formClasses('status-columns')}>
          {articleStatuses.map(status => (
            <span
              key={status.key}
              {...formClasses(
                `status-${status.columnSize || 1}-column`,
                articleStatus.includes(status.key) ? 'active' : '',
              )}>
              {t(`form.status.${status.key.toLowerCase()}`)}
            </span>
          ))}
        </div>
        <div {...formClasses('actions')}>
          {model.id ? (
            <Button outline onClick={this.onValidateClick}>
              {t('form.validate')}
            </Button>
          ) : (
            ''
          )}
          {model.id ? (
            <Button outline onClick={() => publishDraft({ draft: model })}>
              {t('form.publish')}
            </Button>
          ) : (
            ''
          )}
          <Button onClick={saveDraft}>{t('form.save')}</Button>
        </div>
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
  publishDraft: PropTypes.func.isRequired,
  saveDraft: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
};

FormWorkflow.defaultProps = {
  articleStatus: [],
};

const mapDispatchToProps = {
  addMessage: messageActions.addMessage,
  publishDraft: draftActions.publishDraft,
};

export default connect(
  undefined,
  mapDispatchToProps,
)(injectT(FormWorkflow));
