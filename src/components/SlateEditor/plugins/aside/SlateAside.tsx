/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { Editor, Element, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { AsideElement } from ".";
import SlateFactAside from "./SlateFactAside";
import { TYPE_ASIDE } from "./types";

interface Props {
  element: AsideElement;
  editor: Editor;
  children: ReactNode;
  attributes: RenderElementProps["attributes"];
}

const SlateAside = (props: Props) => {
  const { element, editor } = props;

  const onRemoveClick = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_ASIDE,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onMoveContent = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_ASIDE,
      voids: true,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor, { edge: "start" });
    }, 0);
  };

  return <SlateFactAside onRemoveClick={onRemoveClick} onMoveContent={onMoveContent} {...props} />;
};

export default SlateAside;
