/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { css } from 'react-emotion';
import { Done } from '@ndla/icons/editor';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';
import Spinner from '../../../../components/Spinner';

const menuItemEditFieldStyle = css`
  display: flex;
  align-items: center;
  margin: calc(${spacing.small} / 2);
`;

const menuItemInputFieldStyle = css`
  margin-right: calc(${spacing.small} / 2);
  max-height: ${spacing.normal};
  width: auto;
`;

const saveButtonStyle = css`
  &,
  &:disabled {
    height: 24px;
    width: 24px;
    min-width: 24px;
    background-color: ${colors.brand.greyDark};
    border-color: ${colors.brand.greyDark};
    padding: 0;
    line-height: 16.9px;
  }
`;

class MenuItemEditField extends PureComponent {
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
      placeholder,
    } = this.props;
    const { status, input } = this.state;
    const value = input === undefined ? currentVal : input;
    return (
      <Fragment>
        <div className={menuItemEditFieldStyle}>
          <RoundIcon open small icon={icon} />
          <input
            className={menuItemInputFieldStyle}
            type="text"
            placeholder={placeholder}
            value={value}
            data-testid={dataTestid}
            onChange={e => this.setState({ input: e.target.value })}
            onKeyDown={this.handleKeyPress}
          />
          <Button
            css={saveButtonStyle}
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
      </Fragment>
    );
  }
}

MenuItemEditField.propTypes = {
  onSubmit: PropTypes.func,
  icon: PropTypes.node,
  currentVal: PropTypes.string,
  classes: PropTypes.func,
  onClose: PropTypes.func,
  dataTestid: PropTypes.string,
  messages: PropTypes.shape({
    errorMessage: PropTypes.string,
  }),
  placeholder: PropTypes.string,
};

export default MenuItemEditField;
