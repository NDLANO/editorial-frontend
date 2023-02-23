/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IconButtonV2 } from '@ndla/button';
import { DeleteForever } from '@ndla/icons/editor';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof IconButtonV2> {}

export const DeleteButton = ({ children, ...rest }: Props) => (
  <IconButtonV2
    colorTheme="danger"
    variant="ghost"
    contentEditable={false}
    data-cy="close-related-button"
    {...rest}>
    <DeleteForever />
  </IconButtonV2>
);

export default DeleteButton;
