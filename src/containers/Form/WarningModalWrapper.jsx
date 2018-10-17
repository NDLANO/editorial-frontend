/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectT } from 'ndla-i18n';
import config from '../../config';
import WarningModal from '../../components/WarningModal';
import { SchemaShape } from '../../shapes';
import { isFormDirty } from '../../util/formHelper';

class WarningModalWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { openModal: false, discardChanges: false };
    this.onSave = this.onSave.bind(this);
    this.onContinue = this.onContinue.bind(this);
  }

  componentDidMount() {
    const { history, model, initialModel, fields, showSaved } = this.props;
    const { discardChanges } = this.state;
    this.unblock = history.block(nextLocation => {
      const canNavigate =
        !isFormDirty(fields, initialModel, model, showSaved) ||
        discardChanges ||
        showSaved;

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
        !isFormDirty(fields, initialModel, model, showSaved) || discardChanges;
    }
  }

  componentWillUnmount() {
    this.unblock();
  }

  onSave(e) {
    const { schema, history, handleSubmit } = this.props;
    handleSubmit(e);
    if (schema.isValid) {
      this.setState({ discardChanges: true, openModal: false }, () => {
        const nextLocation =
          this.state.nextLocation.pathname +
          this.state.nextLocation.hash +
          this.state.nextLocation.search;
        return history.push(nextLocation);
      });
    } else {
      this.setState({ openModal: false });
    }
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
    const { t, text } = this.props;
    return (
      <WarningModal
        show={this.state.openModal}
        text={text}
        actions={[
          { text: t('form.save'), onClick: this.onSave },
          {
            text: t('warningModal.continue'),
            onClick: this.onContinue,
          },
        ]}
        onCancel={() => this.setState({ openModal: false })}
      />
    );
  }
}

WarningModalWrapper.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    articleType: PropTypes.string,
    language: PropTypes.string,
  }),
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
  }),
  fields: PropTypes.objectOf(PropTypes.object).isRequired,
  schema: SchemaShape,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    block: PropTypes.func.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func,
  text: PropTypes.string,
  showSaved: PropTypes.bool,
};

export default withRouter(injectT(WarningModalWrapper));
