/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Node } from "slate";
import { useSlateSelector, useSlateStatic } from "slate-react";
import { handleClickTable } from "./handleMenuClicks";
import { TableType } from "./toolbarState";
import { ToolbarToggleButton, ToolbarToggleGroupRoot } from "./ToolbarToggle";
import { ToolbarCategoryProps } from "./types";

const getCurrentBlockValues = (editor: Editor) => {
  const [currentTableCell] =
    Editor.nodes(editor, {
      match: (n) => Node.isElement(n) && n.type === "table-cell",
      mode: "highest",
    }) ?? [];

  const node = currentTableCell?.[0];
  if (!Node.isElement(node) || node.type !== "table-cell") return "";

  return node.data.align ?? "";
};

export const ToolbarTableOptions = ({ options }: ToolbarCategoryProps<TableType>) => {
  const editor = useSlateStatic();
  const visibleOptions = options?.filter((option) => !option.hidden);
  const value = useSlateSelector(getCurrentBlockValues);

  if (!visibleOptions?.length) return null;

  return (
    <ToolbarToggleGroupRoot value={[value]}>
      {visibleOptions.map((type) => (
        <ToolbarToggleButton
          type={type.value}
          onClick={(e) => {
            e.preventDefault();
            handleClickTable(e, editor, type.value);
          }}
          onMouseDown={(e) => e.preventDefault()}
          key={type.value}
          value={type.value}
          disabled={type.disabled}
        />
      ))}
    </ToolbarToggleGroupRoot>
  );
};
