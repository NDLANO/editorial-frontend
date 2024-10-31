/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Node, Path } from "slate";
import { ReactEditor } from "slate-react";
import SlateTable from "./SlateTable";
import TableActions from "./TableActions";
import {
  TYPE_TABLE,
  TYPE_TABLE_BODY,
  TYPE_TABLE_CAPTION,
  TYPE_TABLE_CELL,
  TYPE_TABLE_CELL_HEADER,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_ROW,
} from "./types";
import WithPlaceHolder from "../../common/WithPlaceHolder";

export const tableRenderer = (editor: Editor) => {
  const { renderElement, renderLeaf } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    switch (element.type) {
      case TYPE_TABLE:
        return (
          <>
            <TableActions editor={editor} element={element} />
            <SlateTable editor={editor} element={element} attributes={attributes}>
              <colgroup contentEditable={false} dangerouslySetInnerHTML={{ __html: element.colgroups || "" }} />
              {children}
            </SlateTable>
          </>
        );
      case TYPE_TABLE_CAPTION:
        return <caption {...attributes}>{children}</caption>;
      case TYPE_TABLE_ROW:
        return <tr {...attributes}>{children}</tr>;
      case TYPE_TABLE_CELL: {
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
      case TYPE_TABLE_HEAD:
        return <thead {...attributes}>{children}</thead>;
      case TYPE_TABLE_BODY:
        return <tbody {...attributes}>{children}</tbody>;
      case TYPE_TABLE_CELL_HEADER:
        return (
          <th
            rowSpan={element.data.rowspan}
            colSpan={element.data.colspan}
            headers={element.data.headers}
            id={element.data.id}
            scope={element.data.scope}
            {...attributes}
          >
            {children}
          </th>
        );
      default:
        return renderElement?.({ attributes, children, element });
    }
  };

  editor.renderLeaf = ({ attributes, children, leaf, text }) => {
    const path = ReactEditor.findPath(editor, text);

    const [parent] = Editor.node(editor, Path.parent(path));
    if (Element.isElement(parent) && parent.type === TYPE_TABLE_CAPTION && Node.string(leaf) === "") {
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
