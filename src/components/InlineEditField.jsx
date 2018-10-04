/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Done } from 'ndla-icons/editor';
import RoundIcon from './RoundIcon';
import handleError from '../util/handleError';
import Spinner from './Spinner';

class InlineEditField extends PureComponent {
  constructor() {
    super();
    this.state = {
      status: 'initial',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  async handleSubmit() {
    this.setState({ status: 'loading' });
    try {
      await this.props.onSubmit(this.state.input);
      this.setState({ status: 'success' });
      this.props.onClose();
    } catch (e) {
      handleError(e);
      this.setState({
        status: 'error',
      });
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Escape') {
      this.setState({ status: 'initial' });
    }
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    const {
      currentVal = '',
      classes,
      icon,
      messages = {},
      dataTestid = 'inlineEditInput',
    } = this.props;
    const { status, input } = this.state;
    const value = input === undefined ? currentVal : input;
    return (
      <React.Fragment>
        <div {...classes('menuItem')}>
          <RoundIcon open small icon={icon} />
          <input
            type="text"
            value={value}
            data-testid={dataTestid}
            onChange={e => this.setState({ input: e.target.value })}
            onKeyDown={this.handleKeyPress}
          />
          <Button
            {...classes('saveButton')}
            data-testid="inlineEditSaveButton"
            disabled={status === 'loading'}
            onClick={this.handleSubmit}>
            {status === 'loading' ? (
              <Spinner cssModifier="small" />
            ) : (
              <Done className="c-icon--small" />
            )}
          </Button>
        </div>
        {status === 'error' && (
          <div
            data-testid="inlineEditErrorMessage"
            {...classes('errorMessage')}>
            {messages.errorMessage}
          </div>
        )}
      </React.Fragment>
    );
  }
}

InlineEditField.propTypes = {
  onSubmit: PropTypes.func,
  icon: PropTypes.node,
  currentVal: PropTypes.string,
  classes: PropTypes.func,
  onClose: PropTypes.func,
  dataTestid: PropTypes.string,
  messages: PropTypes.shape({
    errorMessage: PropTypes.string,
  }),
};

export default InlineEditField;
