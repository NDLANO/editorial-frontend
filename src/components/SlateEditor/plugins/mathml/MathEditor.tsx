/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from 'react';
import { Editor, Node, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps, useFocused, useSelected } from 'slate-react';
import { colors } from '@ndla/core';
import he from 'he';
import { Content, Root, Trigger } from '@radix-ui/react-popover';
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

const MathEditor = ({ element, children, attributes, editor }: Props & RenderElementProps) => {
  const [nodeInfo, setNodeInfo] = useState(() => getInfoFromNode(element));
  const [isFirstEdit, setIsFirstEdit] = useState(nodeInfo.isFirstEdit);
  const [editMode, setEditMode] = useState(isFirstEdit);
  const [showMenu, setShowMenu] = useState(false);
  const selected = useSelected();
  const focused = useFocused();

  useEffect(() => {
    setNodeInfo(getInfoFromNode(element));
  }, [element]);

  const toggleEdit = useCallback(() => setEditMode((prev) => !prev), []);

  const handleSave = useCallback(
    (mathML: string) => {
      const properties = {
        data: { innerHTML: mathML },
      };
      const path = ReactEditor.findPath(editor, element);

      const nextPath = Path.next(path);

      setIsFirstEdit(false);
      setEditMode(false);
      setShowMenu(false);

      setTimeout(() => {
        ReactEditor.focus(editor);
        if (isFirstEdit) {
          Transforms.setNodes(editor, properties, {
            at: path,
            voids: true,
            match: (node) => node === element,
          });

          const mathAsString = new DOMParser().parseFromString(mathML, 'text/xml').firstChild
            ?.textContent;

          Transforms.insertText(editor, mathAsString || '', {
            at: path,
            voids: true,
          });

          // Insertion of concept consists of insert an empty mathml and then updating it with content. By merging the events we can consider them as one action and undo both with ctrl+z.
          mergeLastUndos(editor);
        } else {
          Transforms.setNodes(editor, properties, {
            at: path,
            voids: true,
            match: (node) => node === element,
          });
        }
        Transforms.select(editor, {
          anchor: { path: nextPath, offset: 0 },
          focus: { path: nextPath, offset: 0 },
        });
      }, 0);
    },
    [editor, element, isFirstEdit],
  );

  const handleRemove = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    ReactEditor.focus(editor);
    Transforms.select(editor, Editor.start(editor, Path.next(path)));

    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => node === element,
      voids: true,
    });
  }, [editor, element]);

  const onExit = useCallback(() => {
    const elementPath = ReactEditor.findPath(editor, element);

    if (isFirstEdit) {
      handleRemove();
    } else {
      const nextPath = Path.next(elementPath);
      setTimeout(() => {
        ReactEditor.focus(editor);
        Transforms.select(editor, {
          anchor: { path: nextPath, offset: 0 },
          focus: { path: nextPath, offset: 0 },
        });
      }, 0);
      setEditMode(false);
      setShowMenu(false);
    }
  }, [editor, element, handleRemove, isFirstEdit]);

  return (
    <Root open={showMenu} onOpenChange={setShowMenu}>
      <Trigger asChild>
        <span
          role="button"
          tabIndex={0}
          contentEditable={false}
          style={{
            boxShadow: selected && focused ? `0 0 0 1px ${colors.brand.tertiary}` : 'none',
          }}
          {...attributes}
        >
          <MathML
            model={nodeInfo.model}
            editor={editor}
            element={element}
            onDoubleClick={toggleEdit}
          />
          <Content>
            <BlockMenu handleRemove={handleRemove} toggleEdit={toggleEdit} />
          </Content>
          {editMode && (
            <EditMath
              onExit={onExit}
              model={nodeInfo.model}
              handleSave={handleSave}
              isEditMode={editMode}
              handleRemove={handleRemove}
            />
          )}
          {children}
        </span>
      </Trigger>
    </Root>
  );
};

export default MathEditor;
