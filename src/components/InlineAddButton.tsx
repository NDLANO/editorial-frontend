/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PureComponent, KeyboardEvent, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { Done } from '@ndla/icons/editor';
import { Plus } from '@ndla/icons/action';
import { withTranslation, CustomWithTranslation } from 'react-i18next';
import handleError from '../util/handleError';
import Spinner from './Spinner';

const addButtonStyle = css`
  height: 50px;
  margin-left: auto;
  padding: 0 ${spacing.small};
  white-space: nowrap;
  font-size: 1.1rem;
  background: linear-gradient(
    rgba(226, 226, 226, 0.1),
    ${colors.brand.secondary} 50%,
    rgba(226, 226, 226, 0.1) 100%
  );

  &:hover {
    color: white;
  }
`;

const StyledEditMode = styled('div')`
  display: flex;
  height: 100%;
  margin-left: auto;
  position: absolute;
  right: 0;

  & svg {
    height: 38px;
    width: 38px;
  }
`;

const StyledErrorMessage = styled('span')`
  color: ${colors.support.red};
  position: absolute;
  right: 55px;
  top: 50px;
`;

const StyledInputField = styled('input')`
  margin: calc(${spacing.small} / 2);
  width: 200px;
`;

const saveButtonStyle = css`
  &,
  &:hover {
    background-color: ${colors.brand.greyDark};
    color: white;
    min-width: 50px;
    height: 50px;
  }
`;

interface State {
  status: string;
  inputValue: string;
}

interface Props {
  title: string;
  action: Function;
}

export class InlineAddButton extends PureComponent<Props & CustomWithTranslation, State> {
  constructor(props: Props & CustomWithTranslation) {
    super(props);
    this.state = {
      status: 'initial',
      inputValue: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  async handleClick(e: KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();

    this.setState(
      prevState => {
        return prevState.inputValue.trim() === ''
          ? { inputValue: '', status: 'initial' }
          : { status: 'loading', inputValue: prevState.inputValue };
      },
      async () => {
        const { inputValue, status } = this.state;
        if (status !== 'initial') {
          try {
            await this.props.action(inputValue);
            this.setState({ status: 'success', inputValue: '' });
          } catch (error) {
            handleError(error);
            this.setState({
              status: 'error',
              inputValue: '',
            });
          }
        }
      },
    );
  }

  handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    e.stopPropagation();
    this.setState({ inputValue: e.target.value });
  }

  handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      this.setState({ status: 'initial' });
    }
    if (e.key === 'Enter') {
      this.handleClick(e);
    }
  }

  render() {
    const { title } = this.props;
    const { status, inputValue } = this.state;

    return status === 'edit' || status === 'loading' || status === 'error' ? (
      <>
        <StyledInputField
          type="text"
          autoFocus //  eslint-disable-line
          /* allow autofocus when it happens when clicking a dialog and not at page load
         ref: https://w3c.github.io/html/sec-forms.html#autofocusing-a-form-control-the-autofocus-attribute */
          data-testid="addSubjectInputField"
          value={inputValue}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyPress}
        />
        <StyledEditMode>
          <Button
            stripped
            css={saveButtonStyle}
            disabled={status === 'loading'}
            onClick={this.handleClick}>
            {status === 'loading' ? <Spinner appearance="small" /> : <Done />}
          </Button>
        </StyledEditMode>
        {status === 'error' && (
          <StyledErrorMessage>{this.props.t('taxonomy.errorMessage')}</StyledErrorMessage>
        )}
      </>
    ) : (
      <Button
        css={addButtonStyle}
        stripped
        data-testid="AddSubjectButton"
        onClick={() => {
          this.setState({ status: 'edit' });
        }}>
        <Plus />
        {title}
      </Button>
    );
  }
}

export default withTranslation()(InlineAddButton);
