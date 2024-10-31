/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactNode } from "react";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { ParagraphElement } from ".";

interface Props {
  attributes: RenderElementProps["attributes"];
  element: ParagraphElement;
  children: ReactNode;
  editor: Editor;
}

const Paragraph = ({ attributes, children, element }: Props) => {
  return (
    <p data-align={element.data?.align ?? ""} {...attributes}>
      {children}
    </p>
  );
};

export default Paragraph;
