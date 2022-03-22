/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Cross } from '@ndla/icons/action';
import Button from '@ndla/button';
import { MouseEvent } from 'react';

interface Props {
  stripped?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const CrossButton = ({ ...rest }: Props) => (
  <Button {...rest}>
    <Cross />
  </Button>
);

export default CrossButton;
