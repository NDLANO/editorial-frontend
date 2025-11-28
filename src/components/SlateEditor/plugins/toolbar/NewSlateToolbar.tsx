/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Children, isValidElement, ReactNode, useMemo } from "react";
import { useSlate, useSlateSelection, useSlateSelector } from "slate-react";
import { styled } from "@ndla/styled-system/jsx";
import { ToolbarBlockOptions } from "./ToolbarBlockOptions";
import { ToolbarInlineOptions } from "./ToolbarInlineOptions";
import { ToolbarLanguageOptions } from "./ToolbarLanguageOptions";
import { ToolbarMarkOptions } from "./ToolbarMarkOptions";
import { ToolbarValues } from "./toolbarState";
import { ToolbarTableOptions } from "./ToolbarTableOptions";
import { ToolbarTextOptions } from "./ToolbarTextOptions";
import { ToolbarCategoryProps } from "./types";
import { AI_ACCESS_SCOPE } from "../../../../constants";
import { useSession } from "../../../../containers/Session/SessionProvider";
import { usePrevious } from "@ndla/util";

const StyledToolbar = styled("div", {
  base: {
    position: "sticky",
    width: "100%",
    top: "0",
    zIndex: "sticky",
    border: "1px solid",
    borderRadius: "xsmall",
    borderColor: "stroke.subtle",
    padding: "3xsmall",
    display: "flex",
    flexWrap: "wrap",
    background: "background.default",
  },
});

const ToolbarRow = ({ children }: { children: ReactNode }) => {
  // Do not render categories with only disabled and hidden options
  const validChildren = Children.toArray(children).filter(
    (child) =>
      isValidElement<ToolbarCategoryProps<ToolbarValues>>(child) &&
      !child.props.options?.every((el) => el.hidden === true),
  );

  return validChildren;
};

export const NewSlateToolbar = () => {
  const editor = useSlate();
  const selection = useSlateSelection();
  // const prevState = usePrevious(state);
  const { userPermissions } = useSession();
  const options = useMemo(() => {
    return editor.toolbarState?.({
      // TODO: This is not really scalable if we're going to introduce more constraints later-on.
      options: userPermissions?.includes(AI_ACCESS_SCOPE)
        ? undefined
        : { inline: { rephrase: { hidden: true, disabled: true } } },
    });
  }, [editor, selection, userPermissions]);

  return (
    <StyledToolbar>
      <ToolbarRow>
        <ToolbarTextOptions options={options?.text ?? []} />
        <ToolbarLanguageOptions options={options?.languages ?? []} />
        <ToolbarMarkOptions options={options?.mark ?? []} />
        <ToolbarBlockOptions options={options?.block ?? []} />
        <ToolbarInlineOptions options={options?.inline ?? []} />
        <ToolbarTableOptions options={options?.table ?? []} />
      </ToolbarRow>
    </StyledToolbar>
  );
};
