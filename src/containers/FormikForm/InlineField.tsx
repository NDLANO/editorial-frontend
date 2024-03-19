/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { colors, misc, spacing } from "@ndla/core";
import { SlatePlugin } from "../../components/SlateEditor/interfaces";
import { breakPlugin } from "../../components/SlateEditor/plugins/break";
import { breakRenderer } from "../../components/SlateEditor/plugins/break/render";
import { markPlugin } from "../../components/SlateEditor/plugins/mark";
import { markRenderer } from "../../components/SlateEditor/plugins/mark/render";
import { noopPlugin } from "../../components/SlateEditor/plugins/noop";
import { noopRenderer } from "../../components/SlateEditor/plugins/noop/render";
import { paragraphPlugin } from "../../components/SlateEditor/plugins/paragraph";
import { paragraphRenderer } from "../../components/SlateEditor/plugins/paragraph/render";
import saveHotkeyPlugin from "../../components/SlateEditor/plugins/saveHotkey";
import { spanPlugin } from "../../components/SlateEditor/plugins/span";
import { spanRenderer } from "../../components/SlateEditor/plugins/span/render";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../components/SlateEditor/plugins/toolbar";
import {
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../components/SlateEditor/plugins/toolbar/toolbarState";
import RichTextEditor, { RichTextEditorProps } from "../../components/SlateEditor/RichTextEditor";

interface Props extends Omit<RichTextEditorProps, "toolbarOptions" | "toolbarAreaFilters"> {}

const toolbarOptions = createToolbarDefaultValues({
  text: {
    hidden: true,
  },
  mark: {
    code: {
      hidden: true,
    },
  },
  block: { hidden: true },
  inline: {
    hidden: true,
  },
});

const toolbarAreaFilters = createToolbarAreaOptions();

const inlinePlugins: SlatePlugin[] = [
  spanPlugin,
  paragraphPlugin,
  toolbarPlugin(toolbarOptions, toolbarAreaFilters),
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  markPlugin,
  noopPlugin,
];

const StyledInlineField = styled(RichTextEditor)`
  border: 1px solid ${colors.brand.grey};
  border-radius: ${misc.borderRadius};
  background-color: ${colors.brand.greyLightest};
  min-height: ${spacing.large} !important;
  padding: 10px;
  p {
    margin: 0px;
  }
  &:focus-within {
    border-color: ${colors.brand.primary};
    border-width: 2px;
  }
`;

const renderers: SlatePlugin[] = [noopRenderer, paragraphRenderer, markRenderer, breakRenderer, spanRenderer];

const plugins = inlinePlugins.concat(renderers);

export const InlineField = ({ ...rest }: Props) => {
  return (
    <StyledInlineField
      testId="caption-editor"
      data-testid={"caption-field"}
      {...rest}
      hideBlockPicker
      plugins={plugins}
      toolbarOptions={toolbarOptions}
      toolbarAreaFilters={toolbarAreaFilters}
    />
  );
};
