/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { Span } from "./Span";
import { TYPE_SPAN } from "./types";
import { InlineBugfix } from "../../utils/InlineBugFix";

export const spanRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ element, attributes, children }: RenderElementProps) => {
    if (element.type === TYPE_SPAN) {
      return (
        <Span {...attributes} lang={element.data.lang} dir={element.data.dir}>
          <InlineBugfix />
          {children}
          <InlineBugfix />
        </Span>
      );
    } else return renderElement?.({ element, attributes, children });
  };
  return editor;
};
