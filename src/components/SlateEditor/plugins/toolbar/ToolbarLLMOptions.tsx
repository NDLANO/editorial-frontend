/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useCallback } from "react";
import { BaseRange } from "slate";
import { useSlate } from "slate-react";
import { ToggleItem } from "@radix-ui/react-toolbar";
import { StyledToggleGroup, ToolbarCategoryProps } from "./SlateToolbar";
import ToolbarButton from "./ToolbarButton";
import { LLMType } from "./toolbarState";

interface LLMProps {
  selectors: { [key: string]: Dispatch<SetStateAction<BaseRange | null>> };
}

export const ToolbarLLMOptions = ({ options, selectors }: ToolbarCategoryProps<LLMType> & LLMProps) => {
  const editor = useSlate();

  const onClick = useCallback(
    (type: LLMType) => {
      selectors[type](editor.selection);
    },
    [editor, selectors],
  );

  const visibleOptions = options.filter((option) => !option.hidden);
  if (!visibleOptions.length) return null;

  return (
    <StyledToggleGroup type="single" value={""}>
      {visibleOptions.map((type) => (
        <ToggleItem key={type.value} value={type.value} asChild disabled={type.disabled}>
          <ToolbarButton type={type.value} onClick={() => onClick(type.value)} disabled={type.disabled} />
        </ToggleItem>
      ))}
    </StyledToggleGroup>
  );
};
