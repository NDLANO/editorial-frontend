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
import { ToolbarCategoryProps } from "./SlateToolbar";
import { RephraseType } from "./toolbarState";
import { ToolbarToggleButton, ToolbarToggleGroupRoot } from "./ToolbarToggle";

interface RephraseProps {
  selectors: { [key: string]: Dispatch<SetStateAction<BaseRange | null>> };
}

export const ToolbarRephraseOptions = ({ options, selectors }: ToolbarCategoryProps<RephraseType> & RephraseProps) => {
  const editor = useSlate();

  const onClick = useCallback(
    (type: RephraseType) => {
      selectors[type](editor.selection);
    },
    [editor, selectors],
  );

  const visibleOptions = options.filter((option) => !option.hidden);
  if (!visibleOptions.length) return null;

  return (
    <ToolbarToggleGroupRoot multiple value={[]}>
      {visibleOptions.map((type) => (
        <ToolbarToggleButton
          onClick={(e) => {
            e.preventDefault();
            onClick(type.value);
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
