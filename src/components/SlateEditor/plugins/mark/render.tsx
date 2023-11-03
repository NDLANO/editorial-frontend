/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { Editor } from 'slate';

const StyledCode = styled.code`
  display: inline;
  padding: 0;
  margin: 0;
  background-color: #eee;
`;

export const markRenderer = (editor: Editor) => {
  const { renderLeaf } = editor;
  editor.renderLeaf = ({ attributes, children, leaf, text }) => {
    let ret;
    if (leaf.bold) {
      ret = <strong {...attributes}>{ret || children}</strong>;
    }
    if (leaf.italic) {
      ret = <em {...attributes}>{ret || children}</em>;
    }
    if (leaf.sup) {
      ret = <sup {...attributes}>{ret || children}</sup>;
    }
    if (leaf.sub) {
      ret = <sub {...attributes}>{ret || children}</sub>;
    }
    if (leaf.underlined) {
      ret = <u {...attributes}>{ret || children}</u>;
    }
    if (leaf.code) {
      ret = <StyledCode {...attributes}>{ret || children}</StyledCode>;
    }
    if (ret) {
      return ret;
    } else return renderLeaf?.({ attributes, children, leaf, text });
  };

  return editor;
};
