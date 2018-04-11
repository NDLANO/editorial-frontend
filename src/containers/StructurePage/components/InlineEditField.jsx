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
import Spinner from '../../../components/Spinner';

class InlineEditField extends PureComponent {
  constructor() {
    super();
    this.state = {
      status: 'initial',
      errorMessage: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  async handleSubmit() {
    this.setState({ status: 'loading' });
    try {
      await this.props.onSubmit(this.state.input);
      this.props.onClose();
      this.setState({ status: 'success' });
    } catch (e) {
      this.setState({
        errorMessage: this.props.t('taxonomy.errorMessage'),
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
    const { title, icon, currentVal, classes } = this.props;
    const { status, input, errorMessage } = this.state;
    const value = input === undefined ? currentVal : input;
    return status === 'edit' || status === 'error' || status === 'loading' ? (
      <React.Fragment>
        <div {...classes('menuItem')}>
          <RoundIcon open small icon={icon} />
          <input
            type="text"
            value={value}
            data-testid="inlineEditInput"
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
        {errorMessage && (
          <div
            data-testid="inlineEditErrorMessage"
            {...classes('errorMessage')}>
            {errorMessage}
          </div>
        )}
      </React.Fragment>
    ) : (
      <Button
        {...classes('menuItem')}
        stripped
        data-testid="inlineEditFieldButton"
        onClick={() => this.setState({ status: 'edit' })}>
        <div {...classes('iconButton', 'item')}>{icon}</div>
        {title}
      </Button>
    );
  }
}

InlineEditField.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
  onSubmit: PropTypes.func,
  currentVal: PropTypes.string,
  classes: PropTypes.func,
  onClose: PropTypes.func,
};

export default InlineEditField;
