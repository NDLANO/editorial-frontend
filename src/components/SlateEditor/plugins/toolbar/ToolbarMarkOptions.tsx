/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEqual from "lodash/isEqual";
import { Editor } from "slate";
import { useSlate, useSlateSelector } from "slate-react";
import { ToggleItem } from "@radix-ui/react-toolbar";
import { StyledToggleGroup, ToolbarCategoryProps } from "./SlateToolbar";
import ToolbarButton from "./ToolbarButton";
import { MarkType } from "./toolbarState";
import { toggleMark } from "../mark/utils";

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
    <StyledToggleGroup type="multiple" value={marks}>
      {visibleOptions.map((type) => (
        <ToggleItem key={type.value} asChild value={type.value} disabled={type.disabled}>
          <ToolbarButton onClick={(e) => toggleMark(e, editor, type.value)} type={type.value} />
        </ToggleItem>
      ))}
    </StyledToggleGroup>
  );
};
