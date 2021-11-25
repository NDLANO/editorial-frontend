/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLProps, ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionButton from './ActionButton';
import { FirstLoadContext } from '../../App/App';

interface Props extends HTMLProps<HTMLButtonElement> {
  children?: ReactNode;
  outline?: boolean;
}

const AbortButton = ({ children, ...rest }: Props) => {
  const isFirstLoad = useContext(FirstLoadContext);
  const navigate = useNavigate();
  return (
    <ActionButton onClick={isFirstLoad ? () => navigate('/') : () => navigate(-1)} {...rest}>
      {children}
    </ActionButton>
  );
};

export default AbortButton;
