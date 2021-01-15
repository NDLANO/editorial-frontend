/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { DeleteForever } from '@ndla/icons/editor';
import Button from '@ndla/button';

export const CrossButton = ({ children, ...rest }) => (
  <Button {...rest}>
    <DeleteForever />
  </Button>
);

export default CrossButton;
