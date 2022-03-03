/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import {ButtonProps} from "@ndla/button";
import { useNavigate } from 'react-router-dom';
import ActionButton from './ActionButton';

interface Props extends ButtonProps {
  children?: ReactNode;
  outline?: boolean;
}

const AbortButton = ({ children, ...rest }: Props) => {
  const navigate = useNavigate();
  return (
    <ActionButton onClick={() => navigate(-1)} {...rest}>
      {children}
    </ActionButton>
  );
};

export default AbortButton;
