/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useState, KeyboardEvent } from 'react';

import PropTypes from 'prop-types';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { Done } from '@ndla/icons/editor';
import { StyledMenuItemInputField, StyledErrorMessage } from '../../styles';
import RoundIcon from '../../../../../components/RoundIcon';
import handleError from '../../../../../util/handleError';
import Spinner from '../../../../../components/Spinner';
import MenuItemSaveButton from './MenuItemSaveButton';

const StyledMenuItemEditField = styled('div')`
  display: flex;
  align-items: center;
  margin: calc(${spacing.small} / 2);
`;

interface Props {
  onSubmit: (input: string) => Promise<void>;
  onClose: () => void;
  currentVal?: string;
  icon?: ReactNode;
  messages?: {
    errorMessage?: string;
  };
  dataTestid?: string;
  placeholder?: string;
  autoFocus?: boolean;
  initialValue?: string;
}

const MenuItemEditField = ({
  onSubmit,
  onClose,
  currentVal = '',
  icon,
  messages = {},
  dataTestid = 'inlineEditInput',
  placeholder,
  autoFocus,
}: Props) => {
  const [status, setStatus] = useState('initial');
  const [input, setInput] = useState<string>(currentVal);

  const handleSubmit = async () => {
    setStatus('loading');
    try {
      await onSubmit(input);
      setStatus('success');
      onClose();
    } catch (e) {
      handleError(e);
      setStatus('error');
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setStatus('initial');
    }
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const value = input ?? currentVal;
  return (
    <>
      <StyledMenuItemEditField>
        <RoundIcon open small icon={icon} />
        <StyledMenuItemInputField
          type="text"
          placeholder={placeholder}
          value={value}
          data-testid={dataTestid}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus={autoFocus}
        />
        <MenuItemSaveButton
          data-testid="inlineEditSaveButton"
          disabled={status === 'loading'}
          onClick={handleSubmit}>
          {status === 'loading' ? (
            <Spinner appearance="small" data-testid="inlineEditSpinner" />
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
    </>
  );
};

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
  autoFocus: PropTypes.bool,
};

export default MenuItemEditField;
