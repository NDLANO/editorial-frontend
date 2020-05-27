/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectT } from '@ndla/i18n';
import config from '../../config';
import AlertModal from '../../components/AlertModal';

class FormikAlertModalWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { openModal: false, discardChanges: false };
    this.canNavigate = this.canNavigate.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onContinue = this.onContinue.bind(this);
  }

  canNavigate() {
    const { isSubmitting, formIsDirty } = this.props;
    return isSubmitting || !formIsDirty || this.state.discardChanges;
  }

  componentDidMount() {
    const { history } = this.props;
    this.unblock = history.block(nextLocation => {
      if (!this.canNavigate()) {
        this.setState({
          openModal: true,
          nextLocation,
        });
      } else {
        window.onbeforeunload = null;
        this.setState({
          discardChanges: false,
        });
      }
      return this.canNavigate();
    });

    if (config.isNdlaProdEnvironment) {
      window.onbeforeunload = () => this.canNavigate();
    }
  }

  componentWillUnmount() {
    this.unblock();
  }

  onCancel() {
    this.setState({ openModal: false });
  }

  onContinue() {
    this.props.onContinue();
    this.setState({ discardChanges: true, openModal: false }, () => {
      const nextLocation =
        this.state.nextLocation.pathname +
        this.state.nextLocation.hash +
        this.state.nextLocation.search;
      return this.props.history.push(nextLocation);
    });
  }

  render() {
    const { t, text, severity } = this.props;
    return (
      <AlertModal
        show={this.state.openModal}
        text={text}
        actions={[
          {
            text: t('form.abort'),
            onClick: this.onCancel,
          },
          {
            text: t('alertModal.continue'),
            onClick: this.onContinue,
          },
        ]}
        onCancel={this.onCancel}
        severity={severity}
      />
    );
  }
}

FormikAlertModalWrapper.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    block: PropTypes.func.isRequired,
  }).isRequired,
  text: PropTypes.string,
  severity: PropTypes.string,
  isSubmitting: PropTypes.bool,
  formIsDirty: PropTypes.bool,
  onContinue: PropTypes.func,
};

export default withRouter(injectT(FormikAlertModalWrapper));
