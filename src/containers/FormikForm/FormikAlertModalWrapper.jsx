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
import { isFormikFormDirty } from '../../util/formHelper';

class FormikAlertModalWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { openModal: false, discardChanges: false };
    this.onCancel = this.onCancel.bind(this);
    this.onContinue = this.onContinue.bind(this);
  }

  componentDidMount() {
    const { history, isSubmitting } = this.props;
    this.unblock = history.block(nextLocation => {
      const canNavigate =
        !isSubmitting ||
        !isFormikFormDirty(this.props) ||
        this.state.discardChanges;
      if (!canNavigate) {
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
      return canNavigate;
    });

    if (config.isNdlaProdEnvironment) {
      window.onbeforeunload = () =>
        isSubmitting ||
        !isFormikFormDirty(this.props) ||
        this.state.discardChanges;
    }
  }

  componentWillUnmount() {
    this.unblock();
  }

  onCancel() {
    this.setState({ openModal: false });
  }

  onContinue() {
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
  values: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    articleType: PropTypes.string,
    language: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    block: PropTypes.func.isRequired,
  }).isRequired,
  text: PropTypes.string,
  severity: PropTypes.string,
  isFormik: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  initialValues: PropTypes.object,
};

export default withRouter(injectT(FormikAlertModalWrapper));
