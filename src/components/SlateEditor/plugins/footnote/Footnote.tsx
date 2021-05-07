/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode, useState } from 'react';
import { Descendant, Editor } from 'new-slate';
import { useFocused, useSelected } from 'new-slate-react';
import { injectT } from '@ndla/i18n';
import { colors } from '@ndla/core';
import EditFootnote from './EditFootnote';
import { FootnoteElement } from '.';

// Todo: a -> button
/* eslint jsx-a11y/no-static-element-interactions: 1 */

interface Props {
  attributes: {
    'data-key': string;
  };
  editor: Editor;
  value: Descendant[];
  element: FootnoteElement;
  children: ReactNode;
}

const Footnote = (props: Props) => {
  const { attributes, children, editor, element } = props;

  const existingFootnote: { [key: string]: string } = element.data ? element.data : {};

  const [editMode, setEditMode] = useState(!existingFootnote.title);
  const selected = useSelected();
  const focused = useFocused();

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  return (
    <React.Fragment>
      <a
        style={{ boxShadow: selected && focused ? `0 0 0 2px ${colors.brand.tertiary}` : 'none' }}
        contentEditable={false}
        {...attributes}
        role="link"
        tabIndex={0}
        onClick={toggleEditMode}>
        <sup>#</sup>
        {children}
      </a>
      {editMode && (
        <EditFootnote
          editor={editor}
          node={element}
          existingFootnote={existingFootnote}
          closeDialog={toggleEditMode}
          onChange={editor.onChange}
        />
      )}
    </React.Fragment>
  );
};

export default injectT(Footnote);
