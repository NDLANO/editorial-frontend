/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { Editor, Element, Node, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps, useFocused, useSelected } from 'slate-react';
import { colors } from '@ndla/core';
import he from 'he';
import { Portal } from '../../../Portal';
import EditMath from './EditMath';
import MathML from './MathML';
import BlockMenu from './BlockMenu';
import { MathmlElement } from '.';
import mergeLastUndos from '../../utils/mergeLastUndos';

const getInfoFromNode = (node: MathmlElement) => {
  const data = node.data ? node.data : {};
  const innerHTML = data.innerHTML || `<mn>${he.encode(Node.string(node))}</mn>`;
  return {
    model: {
      innerHTML: innerHTML.startsWith('<math')
        ? innerHTML
        : `<math xmlns="http://www.w3.org/1998/Math/MathML">${innerHTML}</math>`,
      xlmns: data.xlmns || 'xmlns="http://www.w3.org/1998/Math/MathML',
    },
    isFirstEdit: data.innerHTML === undefined,
  };
};

interface Props {
  editor: Editor;
  element: MathmlElement;
}

const MathEditor = (props: Props & RenderElementProps) => {
  const { isFirstEdit: isFirstEditStatus } = getInfoFromNode(props.element);
  const [isFirstEdit, setIsFirstEdit] = useState(isFirstEditStatus);
  const [editMode, setEditMode] = useState(isFirstEditStatus);
  const [showMenu, setShowMenu] = useState(false);
  const selected = useSelected();
  const focused = useFocused();

  const mathMLRef = props.attributes.ref;

  const getMenuPosition = () => {
    if (mathMLRef.current) {
      const rect = mathMLRef.current.getBoundingClientRect();
      return {
        top: window.scrollY + rect.top + rect.height,
        left: rect.left,
      };
    }
    return {
      top: 0,
      left: 0,
    };
  };

  const toggleMenu = () => {
    setShowMenu(prev => !prev);
    if (window.MathJax) window.MathJax.typesetPromise();
  };

  const toggleEdit = () => {
    setEditMode(prev => !prev);
  };

  const onExit = () => {
    const { element, editor } = props;
    setEditMode(false);
    const elementPath = ReactEditor.findPath(editor, element);
    let leafPath: Path;

    if (isFirstEdit) {
      leafPath = Path.previous(elementPath);
      const oldLeafLength = Editor.string(editor, leafPath, { voids: true }).length;
      const mathLength = Node.string(element).length;
      handleRemove();
      setTimeout(() => {
        Transforms.select(editor, {
          anchor: { path: leafPath, offset: oldLeafLength + mathLength },
          focus: { path: leafPath, offset: oldLeafLength + mathLength },
        });
      }, 0);
    } else {
      leafPath = Path.next(elementPath);
      ReactEditor.focus(editor);
      Transforms.select(editor, {
        anchor: { path: leafPath, offset: 0 },
        focus: { path: leafPath, offset: 0 },
      });
    }
  };

  const handleSave = (mathML: string) => {
    const { element, editor } = props;
    const properties = {
      data: { innerHTML: mathML },
    };
    const path = ReactEditor.findPath(editor, element);
    const leafPath = Path.next(path);

    if (isFirstEdit) {
      Transforms.setNodes(editor, properties, {
        at: path,
        voids: true,
        match: node => Element.isElement(node) && node.type === 'mathml',
      });

      const mathAsString = new DOMParser().parseFromString(mathML, 'text/xml').firstChild
        ?.textContent;

      Transforms.insertText(editor, mathAsString || '', {
        at: path,
        voids: true,
      });

      mergeLastUndos(editor);
    } else {
      Transforms.setNodes(editor, properties, {
        at: path,
        voids: true,
        match: node => Element.isElement(node) && node.type === 'mathml',
      });
    }

    setIsFirstEdit(false);
    setEditMode(false);

    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, {
        anchor: { path: leafPath, offset: 0 },
        focus: { path: leafPath, offset: 0 },
      });
    }, 0);
  };

  const handleRemove = () => {
    const { editor, element } = props;

    const path = ReactEditor.findPath(editor, element);

    Transforms.unwrapNodes(editor, {
      at: path,
      match: node => Element.isElement(node) && node.type === 'mathml',
      voids: true,
    });
  };

  const { element, children, attributes } = props;
  const { model } = getInfoFromNode(element);
  const { top, left } = getMenuPosition();

  return (
    <span
      contentEditable={false}
      role="button"
      tabIndex={0}
      onKeyPress={toggleMenu}
      onClick={toggleMenu}
      style={{ boxShadow: selected && focused ? `0 0 0 1px ${colors.brand.tertiary}` : 'none' }}
      {...attributes}>
      <MathML attributes={attributes} model={model} />
      <Portal isOpened={showMenu}>
        <BlockMenu
          top={top}
          left={left}
          toggleMenu={toggleMenu}
          handleRemove={handleRemove}
          toggleEdit={toggleEdit}
        />
      </Portal>
      {editMode && (
        <EditMath
          onExit={onExit}
          model={model}
          handleSave={handleSave}
          isEditMode={editMode}
          handleRemove={handleRemove}
        />
      )}
      {children}
    </span>
  );
};

export default MathEditor;
