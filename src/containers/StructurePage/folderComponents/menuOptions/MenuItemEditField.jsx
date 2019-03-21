/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { spacing, colors } from '@ndla/core';
import styled from '@emotion/styled';
import { Done } from '@ndla/icons/editor';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';
import Spinner from '../../../../components/Spinner';
import MenuItemSaveButton from './MenuItemSaveButton';

const StyledMenuItemEditField = styled('div')`
  display: flex;
  align-items: center;
  margin: calc(${spacing.small} / 2);
`;

const StyledmenuItemInputField = styled('input')`
  margin-right: calc(${spacing.small} / 2);
  max-height: ${spacing.normal};
`;

export const StyledErrorMessage = styled('div')`
  color: ${colors.support.red};
  text-align: center;
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
      icon,
      messages = {},
      dataTestid = 'inlineEditInput',
      placeholder,
    } = this.props;
    const { status, input } = this.state;
    const value = input === undefined ? currentVal : input;
    return (
      <Fragment>
        <StyledMenuItemEditField>
          <RoundIcon open small icon={icon} />
          <StyledmenuItemInputField
            type="text"
            placeholder={placeholder}
            value={value}
            data-testid={dataTestid}
            onChange={e => this.setState({ input: e.target.value })}
            onKeyDown={this.handleKeyPress}
          />
          <MenuItemSaveButton
            data-testid="inlineEditSaveButton"
            disabled={status === 'loading'}
            onClick={this.handleSubmit}>
            {status === 'loading' ? (
              <Spinner appearance="small" />
            ) : (
              <Done className="c-icon--small" />
            )}
          </MenuItemSaveButton>
        </StyledMenuItemEditField>
        {status === 'error' && (
          <StyledErrorMessage data-testid="inlineEditErrorMessage">
            {messages.errorMessage}
          </StyledErrorMessage>
        )}
      </Fragment>
    );
  }
}

MenuItemEditField.propTypes = {
  onSubmit: PropTypes.func,
  icon: PropTypes.node,
  currentVal: PropTypes.string,
  onClose: PropTypes.func,
  dataTestid: PropTypes.string,
  messages: PropTypes.shape({
    errorMessage: PropTypes.string,
  }),
  placeholder: PropTypes.string,
};

export default MenuItemEditField;
