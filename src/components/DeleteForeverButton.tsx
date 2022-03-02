/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from 'react';
import { DeleteForever } from '@ndla/icons/editor';
import Button from '@ndla/button';
import { SerializedStyles } from '@emotion/core';

interface Props {
  'data-cy'?: string;
  stripped?: boolean;
  css?: (SerializedStyles | string | undefined)[];
  onMouseDown?: (event: MouseEvent) => void;
  onClick?: (event: MouseEvent) => void;
  title?: string;
}

export const DeleteForeverButton = ({ ...rest }: Props) => (
  <Button contentEditable={false} {...rest}>
    <DeleteForever />
  </Button>
);

export default DeleteForeverButton;
