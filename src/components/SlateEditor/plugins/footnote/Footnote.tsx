/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { Editor } from 'slate';
import { RenderElementProps, useFocused, useSelected } from 'slate-react';
import { colors } from '@ndla/core';
import EditFootnote from './EditFootnote';
import { FootnoteElement } from '.';

// Todo: a -> button
/* eslint jsx-a11y/no-static-element-interactions: 1 */

interface Props extends RenderElementProps {
  editor: Editor;
  element: FootnoteElement;
}

const Footnote = (props: Props) => {
  const { attributes, children, editor, element } = props;

  const [editMode, setEditMode] = useState(!element.data.title);
  const selected = useSelected();
  const focused = useFocused();

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  return (
    <>
      <a
        style={{ boxShadow: selected && focused ? `0 0 0 1px ${colors.brand.tertiary}` : 'none' }}
        contentEditable={false}
        {...attributes}
        role="link"
        tabIndex={0}
        onClick={toggleEditMode}>
        <sup contentEditable={false} style={{ userSelect: 'none' }}>
          [#]
        </sup>
        {children}
      </a>
      {editMode && (
        <EditFootnote
          editor={editor}
          node={element}
          existingFootnote={element.data}
          closeDialog={toggleEditMode}
          onChange={editor.onChange}
        />
      )}
    </>
  );
};

export default Footnote;
