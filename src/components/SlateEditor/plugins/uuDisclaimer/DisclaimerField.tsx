/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TextArea, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { SlatePlugin } from "../../interfaces";
import RichTextEditor, { RichTextEditorProps } from "../../RichTextEditor";
import { breakPlugin } from "../break";
import { breakRenderer } from "../break/render";
import { linkPlugin } from "../link";
import { linkRenderer } from "../link/render";
import { markPlugin } from "../mark";
import { markRenderer } from "../mark/render";
import { noopPlugin } from "../noop";
import { noopRenderer } from "../noop/render";
import { paragraphPlugin } from "../paragraph";
import { paragraphRenderer } from "../paragraph/render";
import saveHotkeyPlugin from "../saveHotkey";
import { spanPlugin } from "../span";
import { spanRenderer } from "../span/render";
import { textTransformPlugin } from "../textTransform";
import { toolbarPlugin } from "../toolbar";
import { createToolbarAreaOptions, createToolbarDefaultValues } from "../toolbar/toolbarState";

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
    "content-link": { hidden: false },
  },
});

export const toolbarAreaFilters = createToolbarAreaOptions();

export const disclaimerPlugins: SlatePlugin[] = [
  spanPlugin,
  paragraphPlugin,
  toolbarPlugin(toolbarOptions, toolbarAreaFilters),
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  markPlugin,
  noopPlugin,
  linkPlugin,
];

const renderers: SlatePlugin[] = [
  noopRenderer,
  paragraphRenderer,
  markRenderer,
  breakRenderer,
  spanRenderer,
  linkRenderer,
];

const plugins = disclaimerPlugins.concat(renderers);

const StyledTextArea = styled(TextArea, {
  base: {
    minHeight: "surface.3xsmall",
    height: "unset",
  },
});

const StyledText = styled(Text, {
  base: {
    width: "unset!",
    top: "xsmall!",
  },
});

export const DisclaimerField = ({ ...rest }: Props) => {
  return (
    <StyledTextArea asChild>
      <RichTextEditor
        {...rest}
        hideBlockPicker
        plugins={plugins}
        toolbarOptions={toolbarOptions}
        toolbarAreaFilters={toolbarAreaFilters}
        noArticleStyling
        renderPlaceholder={(placeholder) => (
          <StyledText {...placeholder.attributes} textStyle="body.article" asChild consumeCss>
            <span>{placeholder.children}</span>
          </StyledText>
        )}
      />
    </StyledTextArea>
  );
};
