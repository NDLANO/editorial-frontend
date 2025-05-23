/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Text, TextArea } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
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
import { UnsupportedElement } from "../../components/SlateEditor/plugins/unsupported/UnsupportedElement";
import { unsupportedElementRenderer } from "../../components/SlateEditor/plugins/unsupported/unsupportedElementRenderer";
import { unsupportedPlugin } from "../../components/SlateEditor/plugins/unsupported/unsupportedPlugin";
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

const StyledText = styled(Text, {
  base: {
    width: "unset!",
    top: "xsmall!",
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
  unsupportedPlugin,
];

const StyledTextArea = styled(TextArea, {
  base: {
    minHeight: "unset",
    height: "unset",
  },
});

const renderers: SlatePlugin[] = [
  noopRenderer,
  paragraphRenderer,
  markRenderer,
  breakRenderer,
  spanRenderer,
  unsupportedElementRenderer,
];

const plugins = inlinePlugins.concat(renderers);

export const InlineField = ({ ...rest }: Props) => {
  return (
    <StyledTextArea asChild>
      <RichTextEditor
        testId="caption-editor"
        data-testid={"caption-field"}
        {...rest}
        hideBlockPicker
        plugins={plugins}
        toolbarOptions={toolbarOptions}
        toolbarAreaFilters={toolbarAreaFilters}
        renderInvalidElement={(props) => <UnsupportedElement {...props} />}
        renderPlaceholder={(placeholder) => (
          <StyledText {...placeholder.attributes} textStyle="body.article" asChild consumeCss>
            <span>{placeholder.children}</span>
          </StyledText>
        )}
      />
    </StyledTextArea>
  );
};
