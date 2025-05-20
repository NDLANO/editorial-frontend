/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Node, Path } from "slate";
import { ReactEditor } from "slate-react";
import { isTableCaptionElement } from "./queries";
import SlateTable from "./SlateTable";
import TableActions from "./TableActions";
import {
  TABLE_ELEMENT_TYPE,
  TABLE_CAPTION_ELEMENT_TYPE,
  TABLE_ROW_ELEMENT_TYPE,
  TABLE_CELL_ELEMENT_TYPE,
  TABLE_HEAD_ELEMENT_TYPE,
  TABLE_BODY_ELEMENT_TYPE,
  TABLE_CELL_HEADER_ELEMENT_TYPE,
} from "./types";
import WithPlaceHolder from "../../common/WithPlaceHolder";

export const tableRenderer = (editor: Editor) => {
  const { renderElement, renderLeaf } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    switch (element.type) {
      case TABLE_ELEMENT_TYPE:
        return (
          <>
            <TableActions editor={editor} element={element} />
            <SlateTable editor={editor} element={element} attributes={attributes}>
              <colgroup contentEditable={false} dangerouslySetInnerHTML={{ __html: element.colgroups || "" }} />
              {children}
            </SlateTable>
          </>
        );
      case TABLE_CAPTION_ELEMENT_TYPE:
        return <caption {...attributes}>{children}</caption>;
      case TABLE_ROW_ELEMENT_TYPE:
        return <tr {...attributes}>{children}</tr>;
      case TABLE_CELL_ELEMENT_TYPE: {
        const align = element.data?.align || "";
        const parsedAlign = ["left", "center", "right"].includes(align) ? align : undefined;
        return (
          <td
            rowSpan={element.data.rowspan}
            colSpan={element.data.colspan}
            headers={element.data.headers}
            data-align={parsedAlign}
            {...attributes}
          >
            {children}
          </td>
        );
      }
      case TABLE_HEAD_ELEMENT_TYPE:
        return <thead {...attributes}>{children}</thead>;
      case TABLE_BODY_ELEMENT_TYPE:
        return <tbody {...attributes}>{children}</tbody>;
      case TABLE_CELL_HEADER_ELEMENT_TYPE: {
        const align = element.data?.align || "";
        const parsedAlign = ["left", "center", "right"].includes(align) ? align : undefined;
        return (
          <th
            rowSpan={element.data.rowspan}
            colSpan={element.data.colspan}
            headers={element.data.headers}
            id={element.data.id}
            scope={element.data.scope}
            data-align={parsedAlign}
            {...attributes}
          >
            {children}
          </th>
        );
      }
      default:
        return renderElement?.({ attributes, children, element });
    }
  };

  editor.renderLeaf = ({ attributes, children, leaf, text }) => {
    const path = ReactEditor.findPath(editor, text);

    const [parent] = Editor.node(editor, Path.parent(path));
    if (isTableCaptionElement(parent) && Node.string(leaf) === "") {
      return (
        <WithPlaceHolder attributes={attributes} placeholder="form.name.title">
          {children}
        </WithPlaceHolder>
      );
    }
    return renderLeaf?.({ attributes, children, leaf, text });
  };
  return editor;
};
