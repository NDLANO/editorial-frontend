/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState, useRef } from 'react';
import { RenderElementProps } from 'slate-react';
import { Editor, Node } from 'slate';
import he from 'he';
import { Portal } from '../../../Portal';
import EditMath from './EditMath';
import MathML from './MathML';
import { getSchemaEmbed } from '../../editorSchema';
import BlockMenu from './BlockMenu';
import { MathmlElement } from '.';

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

  const mathMLRef = useRef<HTMLSpanElement>(null);

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
    if (isFirstEdit) {
      handleRemove();
    }
    editor
      .moveToRangeOfNode(element)
      .moveToEnd()
      .focus()
      .moveForward(1);
  };

  const handleSave = mathML => {
    const { element, editor } = props;
    const properties = {
      data: { ...getSchemaEmbed(element), innerHTML: mathML },
    };
    editor.setNodeByKey(element.key, properties);
    setIsFirstEdit(false);
    setEditMode(false);
    editor
      .moveToRangeOfNode(element)
      .moveToEnd()
      .focus()
      .moveForward(1);
  };

  const handleRemove = () => {
    const { editor, element } = props;
    editor
      .moveToRangeOfNode(element)
      .moveToEnd()
      .focus()
      .moveForward(1);
    editor.unwrapInlineByKey(element.key, 'mathml');
  };

  const { element, children } = props;
  const { model } = getInfoFromNode(element);
  const { top, left } = getMenuPosition();

  return (
    <Fragment>
      <span ref={mathMLRef} role="button" tabIndex={0} onKeyPress={toggleMenu} onClick={toggleMenu}>
        <MathML node={element} model={model} {...props} />
        <Portal isOpened={showMenu}>
          <BlockMenu
            top={top}
            left={left}
            toggleMenu={toggleMenu}
            handleRemove={handleRemove}
            toggleEdit={toggleEdit}
          />
        </Portal>
        {children}
      </span>
      {editMode && (
        <EditMath
          onExit={onExit}
          model={model}
          handleSave={handleSave}
          isEditMode={editMode}
          handleRemove={handleRemove}
        />
      )}
    </Fragment>
  );
};

export default MathEditor;
