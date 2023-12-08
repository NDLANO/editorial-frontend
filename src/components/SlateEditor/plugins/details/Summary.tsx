/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { RenderElementProps } from 'slate-react';

const Summary = ({ children, element, attributes }: RenderElementProps) => {
  return <span {...attributes}>{children}</span>;
};

export default Summary;
