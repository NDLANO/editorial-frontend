/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { merge } from "lodash-es";
import { useMemo } from "react";
import { Text, TextArea } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { SlatePlugin } from "../../components/SlateEditor/interfaces";
import { breakPlugin } from "../../components/SlateEditor/plugins/break";
import { breakRenderer } from "../../components/SlateEditor/plugins/break/render";
import { contentLinkPlugin, linkPlugin } from "../../components/SlateEditor/plugins/link";
import { linkRenderer } from "../../components/SlateEditor/plugins/link/render";
import { markPlugin } from "../../components/SlateEditor/plugins/mark";
import { markRenderer } from "../../components/SlateEditor/plugins/mark/render";
import { inlineNoopPlugin } from "../../components/SlateEditor/plugins/noop";
import { noopRenderer } from "../../components/SlateEditor/plugins/noop/render";
import { paragraphPlugin } from "../../components/SlateEditor/plugins/paragraph";
import { paragraphRenderer } from "../../components/SlateEditor/plugins/paragraph/render";
import { pastePlugin } from "../../components/SlateEditor/plugins/paste";
import saveHotkeyPlugin from "../../components/SlateEditor/plugins/saveHotkey";
import { spanPlugin } from "../../components/SlateEditor/plugins/span";
import { spanRenderer } from "../../components/SlateEditor/plugins/span/render";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../components/SlateEditor/plugins/toolbar";
import {
  AreaFilters,
  CategoryFilters,
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../components/SlateEditor/plugins/toolbar/toolbarState";
import { UnsupportedElement } from "../../components/SlateEditor/plugins/unsupported/UnsupportedElement";
import { unsupportedElementRenderer } from "../../components/SlateEditor/plugins/unsupported/unsupportedElementRenderer";
import { unsupportedPlugin } from "../../components/SlateEditor/plugins/unsupported/unsupportedPlugin";
import RichTextEditor, { RichTextEditorProps } from "../../components/SlateEditor/RichTextEditor";

interface Props
  extends Omit<
    RichTextEditorProps,
    "hideBlockPicker" | "plugins" | "toolbarOptions" | "toolbarAreaFilters" | "renderPlaceholder"
  > {
  toolbarOptions?: CategoryFilters;
  toolbarAreaFilters?: AreaFilters;
}

const StyledText = styled(Text, {
  base: {
    width: "unset!",
    top: "xsmall!",
  },
});

const StyledTextArea = styled(TextArea, {
  base: {
    minHeight: "unset",
    height: "unset",
  },
});

const defaultToolbarOptions = createToolbarDefaultValues({
  text: {
    hidden: true,
  },
  block: { hidden: true },
  inline: {
    hidden: true,
  },
});

const renderers: SlatePlugin[] = [
  noopRenderer,
  paragraphRenderer,
  markRenderer,
  breakRenderer,
  spanRenderer,
  linkRenderer,
  unsupportedElementRenderer,
];

export const InlineField = ({
  toolbarOptions: toolbarOptionsProp,
  toolbarAreaFilters: toolbarAreaFiltersProp,
  ...rest
}: Props) => {
  const plugins = useMemo(() => {
    const toolbarOptions = merge({}, defaultToolbarOptions, toolbarOptionsProp);
    const toolbarAreaFilters = createToolbarAreaOptions(toolbarAreaFiltersProp);

    const inlinePlugins: SlatePlugin[] = [
      spanPlugin,
      paragraphPlugin,
      toolbarPlugin.configure({ options: { options: toolbarOptions, areaOptions: toolbarAreaFilters } }),
      textTransformPlugin,
      breakPlugin,
      saveHotkeyPlugin,
      markPlugin.configure({
        options: {
          supportedMarks: { value: ["bold", "italic", "sup", "sub"], override: true },
        },
      }),
      inlineNoopPlugin,
      linkPlugin,
      contentLinkPlugin,
      unsupportedPlugin,
      pastePlugin,
    ];

    return inlinePlugins.concat(renderers);
  }, [toolbarOptionsProp, toolbarAreaFiltersProp]);

  return (
    <StyledTextArea asChild>
      <RichTextEditor
        testId="caption-editor"
        data-testid={"caption-field"}
        {...rest}
        hideBlockPicker
        plugins={plugins}
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
