/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { inlineNavigationPlugin, SlatePlugin, softBreakPlugin } from "@ndla/editor";
import { TextArea } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { breakPlugin } from "../../../components/SlateEditor/plugins/break";
import { breakRenderer } from "../../../components/SlateEditor/plugins/break/render";
import { headingPlugin } from "../../../components/SlateEditor/plugins/heading";
import { headingRenderer } from "../../../components/SlateEditor/plugins/heading/render";
import { idPlugin } from "../../../components/SlateEditor/plugins/id/idPlugin";
import { linkPlugin } from "../../../components/SlateEditor/plugins/link";
import { linkRenderer } from "../../../components/SlateEditor/plugins/link/render";
import { listPlugin } from "../../../components/SlateEditor/plugins/list";
import { listRenderer } from "../../../components/SlateEditor/plugins/list/render";
import { markPlugin } from "../../../components/SlateEditor/plugins/mark";
import { markRenderer } from "../../../components/SlateEditor/plugins/mark/render";
import { paragraphPlugin } from "../../../components/SlateEditor/plugins/paragraph";
import { paragraphRenderer } from "../../../components/SlateEditor/plugins/paragraph/render";
import { pastePlugin } from "../../../components/SlateEditor/plugins/paste";
import saveHotkeyPlugin from "../../../components/SlateEditor/plugins/saveHotkey";
import { sectionPlugin } from "../../../components/SlateEditor/plugins/section";
import { sectionRenderer } from "../../../components/SlateEditor/plugins/section/render";
import { spanPlugin } from "../../../components/SlateEditor/plugins/span";
import { spanRenderer } from "../../../components/SlateEditor/plugins/span/render";
import { textTransformPlugin } from "../../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../../components/SlateEditor/plugins/toolbar";
import { createToolbarDefaultValues } from "../../../components/SlateEditor/plugins/toolbar/toolbarState";
import { UnsupportedElement } from "../../../components/SlateEditor/plugins/unsupported/UnsupportedElement";
import { unsupportedElementRenderer } from "../../../components/SlateEditor/plugins/unsupported/unsupportedElementRenderer";
import { unsupportedPlugin } from "../../../components/SlateEditor/plugins/unsupported/unsupportedPlugin";
import RichTextEditor, { RichTextEditorProps } from "../../../components/SlateEditor/RichTextEditor";

interface Props extends Partial<RichTextEditorProps> {
  language: string | undefined;
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

const StyledTextArea = styled(TextArea, {
  base: {
    minHeight: "surface.3xsmall",
    height: "unset",
    // Hide section separators. We'll only ever have one section here.
    "& > div:has(section)": {
      _hover: {
        borderColor: "transparent",
      },
    },
  },
});

const toolbarOptions = createToolbarDefaultValues({
  text: {
    "heading-3": { hidden: true },
    "heading-4": { hidden: true },
  },
  block: {
    hidden: true,
    "bulleted-list": { hidden: false },
    "numbered-list": { hidden: false },
  },
  mark: {
    sub: { hidden: true },
    sup: { hidden: true },
    code: { hidden: true },
  },
  inline: {
    hidden: true,
    "content-link": { hidden: false },
  },
});

const PLUGINS: SlatePlugin[] = [
  idPlugin,
  inlineNavigationPlugin,
  sectionPlugin,
  headingPlugin,
  markPlugin,
  listPlugin,
  paragraphPlugin,
  softBreakPlugin,
  breakPlugin,
  linkPlugin,
  spanPlugin,
  toolbarPlugin.configure({ options: { options: toolbarOptions } }),
  textTransformPlugin,
  saveHotkeyPlugin,
  unsupportedPlugin,
  pastePlugin,
];

const RENDERERS: SlatePlugin[] = [
  sectionRenderer,
  paragraphRenderer,
  breakRenderer,
  headingRenderer,
  listRenderer,
  linkRenderer,
  spanRenderer,
  markRenderer,
  unsupportedElementRenderer,
];

const EDITOR_PLUGINS: SlatePlugin[] = PLUGINS.concat(RENDERERS);

export const LearningpathTextEditor = ({ language, value, onChange }: Props) => {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext();
  return (
    <StyledTextArea asChild autoResize={false}>
      <RichTextEditor
        language={language}
        placeholder={t("form.content.placeholder")}
        value={value}
        submitted={isSubmitting}
        plugins={EDITOR_PLUGINS}
        data-testid="description-editor"
        onChange={onChange}
        renderInvalidElement={(props) => <UnsupportedElement {...props} />}
      />
    </StyledTextArea>
  );
};
