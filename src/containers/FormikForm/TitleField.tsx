/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isKeyHotkey } from "is-hotkey";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createPlugin } from "@ndla/editor";
import { FieldErrorMessage, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ContentEditableFieldLabel } from "../../components/Form/ContentEditableFieldLabel";
import { FieldWarning } from "../../components/Form/FieldWarning";
import { FormField } from "../../components/FormField";

import { SlatePlugin } from "../../components/SlateEditor/interfaces";
import { markPlugin } from "../../components/SlateEditor/plugins/mark";
import { markRenderer } from "../../components/SlateEditor/plugins/mark/render";
import { noopPlugin } from "../../components/SlateEditor/plugins/noop";
import { noopRenderer } from "../../components/SlateEditor/plugins/noop/render";
import { paragraphPlugin } from "../../components/SlateEditor/plugins/paragraph";
import { paragraphRenderer } from "../../components/SlateEditor/plugins/paragraph/render";
import { pastePlugin } from "../../components/SlateEditor/plugins/paste";
import saveHotkeyPlugin from "../../components/SlateEditor/plugins/saveHotkey";
import { sectionRenderer } from "../../components/SlateEditor/plugins/section/render";
import { spanPlugin } from "../../components/SlateEditor/plugins/span";
import { spanRenderer } from "../../components/SlateEditor/plugins/span/render";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../components/SlateEditor/plugins/toolbar";
import { createToolbarDefaultValues } from "../../components/SlateEditor/plugins/toolbar/toolbarState";
import { UnsupportedElement } from "../../components/SlateEditor/plugins/unsupported/UnsupportedElement";
import { unsupportedElementRenderer } from "../../components/SlateEditor/plugins/unsupported/unsupportedElementRenderer";
import { unsupportedPlugin } from "../../components/SlateEditor/plugins/unsupported/unsupportedPlugin";
import RichTextEditor from "../../components/SlateEditor/RichTextEditor";

interface Props {
  maxLength?: number;
  name?: string;
  type?: string;
  hideToolbar?: boolean;
}

const StyledRichTextEditor = styled(RichTextEditor, {
  base: {
    marginBlockStart: "medium",
    textStyle: "heading.medium",
  },
});

const noEnterPlugin = createPlugin({
  name: "no-enter",
  shortcuts: {
    enter: {
      keyCondition: isKeyHotkey("Enter"),
      handler: (_, event, logger) => {
        event.preventDefault();
        logger.log("Enter key pressed in title field, preventing default behavior");
        return true;
      },
    },
  },
});

const titlePlugins: SlatePlugin[] = [
  noEnterPlugin,
  spanPlugin,
  paragraphPlugin,
  textTransformPlugin,
  saveHotkeyPlugin,
  markPlugin.configure({
    options: { supportedMarks: { value: ["italic", "sup", "sub"], override: true } },
  }),
  noopPlugin,
  unsupportedPlugin,
  pastePlugin,
];

const titleRenderers: SlatePlugin[] = [
  sectionRenderer,
  paragraphRenderer,
  markRenderer,
  noopRenderer,
  spanRenderer,
  unsupportedElementRenderer,
];

const basePlugins = titlePlugins.concat(titleRenderers);

const toolbarOptions = createToolbarDefaultValues({
  text: {
    hidden: true,
  },
  block: { hidden: true },
  inline: { hidden: true },
});

const configuredToolbarPlugin = toolbarPlugin.configure({
  options: { options: toolbarOptions },
});

const TitleField = ({ maxLength = 256, name = "title", hideToolbar }: Props) => {
  const { t } = useTranslation();
  const plugins = useMemo(() => {
    if (hideToolbar) return basePlugins;
    return basePlugins.concat(configuredToolbarPlugin);
  }, [hideToolbar]);

  return (
    <FormField name={name}>
      {({ field, meta, helpers }) => (
        <FieldRoot required invalid={!!meta.error}>
          <ContentEditableFieldLabel srOnly>{t("form.title.label")}</ContentEditableFieldLabel>
          <StyledRichTextEditor
            {...field}
            id="title-editor"
            testId="title-editor"
            hideBlockPicker
            submitted={false}
            placeholder={t("form.title.label")}
            data-title=""
            data-testid="learning-resource-title"
            plugins={plugins}
            onChange={helpers.setValue}
            maxLength={maxLength}
            hideToolbar={hideToolbar}
            renderInvalidElement={(props) => <UnsupportedElement {...props} />}
          />
          <FieldWarning name={field.name} />
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        </FieldRoot>
      )}
    </FormField>
  );
};

export default memo(TitleField);
