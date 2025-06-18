/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEqual } from "lodash-es";
import { Editor } from "slate";
import { useSlate, useSlateSelector } from "slate-react";
import { MarkType, toggleMark } from "@ndla/editor";
import { ToolbarCategoryProps } from "./SlateToolbar";
import { ToolbarToggleButton, ToolbarToggleGroupRoot } from "./ToolbarToggle";

const getMarks = (editor: Editor) => {
  return Object.entries(editor.getMarks() ?? {}).reduce<string[]>((acc, [key, value]) => {
    if (value) {
      acc.push(key);
    }
    return acc;
  }, []);
};

export const ToolbarMarkOptions = ({ options }: ToolbarCategoryProps<MarkType>) => {
  const editor = useSlate();
  const marks = useSlateSelector(getMarks, isEqual);
  const visibleOptions = options.filter((option) => !option.hidden);
  if (!visibleOptions.length) return null;
  return (
    <ToolbarToggleGroupRoot multiple value={marks}>
      {visibleOptions.map((type) => (
        <ToolbarToggleButton
          onClick={(e) => {
            e.preventDefault();
            toggleMark(editor, type.value);
          }}
          onMouseDown={(e) => e.preventDefault()}
          type={type.value}
          key={type.value}
          value={type.value}
          disabled={type.disabled}
        />
      ))}
    </ToolbarToggleGroupRoot>
  );
};
