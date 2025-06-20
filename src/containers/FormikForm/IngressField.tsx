/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { inlineNavigationPlugin } from "@ndla/editor";
import { FieldErrorMessage, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

import { ContentEditableFieldLabel } from "../../components/Form/ContentEditableFieldLabel";
import { FieldWarning } from "../../components/Form/FieldWarning";
import { FormRemainingCharacters } from "../../components/Form/FormRemainingCharacters";
import { SlatePlugin } from "../../components/SlateEditor/interfaces";

import { breakPlugin } from "../../components/SlateEditor/plugins/break";
import { breakRenderer } from "../../components/SlateEditor/plugins/break/render";
import { commentInlinePlugin } from "../../components/SlateEditor/plugins/comment/inline";
import { commentInlineRenderer } from "../../components/SlateEditor/plugins/comment/inline/render";
import { markPlugin } from "../../components/SlateEditor/plugins/mark";
import { markRenderer } from "../../components/SlateEditor/plugins/mark/render";
import { noopPlugin } from "../../components/SlateEditor/plugins/noop";
import { noopRenderer } from "../../components/SlateEditor/plugins/noop/render";
import { paragraphPlugin } from "../../components/SlateEditor/plugins/paragraph";
import { paragraphRenderer } from "../../components/SlateEditor/plugins/paragraph/render";
import { pastePlugin } from "../../components/SlateEditor/plugins/paste";
import saveHotkeyPlugin from "../../components/SlateEditor/plugins/saveHotkey";
import { spanPlugin } from "../../components/SlateEditor/plugins/span";
import { spanRenderer } from "../../components/SlateEditor/plugins/span/render";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../components/SlateEditor/plugins/toolbar";
import { createToolbarDefaultValues } from "../../components/SlateEditor/plugins/toolbar/toolbarState";
import { UnsupportedElement } from "../../components/SlateEditor/plugins/unsupported/UnsupportedElement";
import { unsupportedElementRenderer } from "../../components/SlateEditor/plugins/unsupported/unsupportedElementRenderer";
import { unsupportedPlugin } from "../../components/SlateEditor/plugins/unsupported/unsupportedPlugin";
import RichTextEditor from "../../components/SlateEditor/RichTextEditor";
import { SAVE_DEBOUNCE_MS } from "../../constants";
import { useDebouncedCallback } from "../../util/useDebouncedCallback";

interface Props {
  name?: string;
  maxLength?: number;
  type?: string;
  placeholder?: string;
}

const toolbarOptions = createToolbarDefaultValues({
  text: {
    hidden: true,
  },
  block: { hidden: true },
  inline: {
    hidden: true,
    "comment-inline": { hidden: false },
  },
});

// Forces panda to generate css to be used in preview
const StyledRichTextEditor = styled(RichTextEditor, {
  base: {
    textStyle: "body.xlarge",
  },
});

const StyledFormRemainingCharacters = styled(FormRemainingCharacters, {
  base: {
    marginInlineStart: "auto",
  },
});

const MetaWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "baseline",
  },
});

const ingressPlugins: SlatePlugin[] = [
  inlineNavigationPlugin,
  spanPlugin,
  paragraphPlugin,
  toolbarPlugin.configure({ options: { options: toolbarOptions } }),
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  markPlugin.configure({
    options: {
      supportedMarks: { value: ["bold", "italic", "sup", "sub"], override: true },
    },
  }),
  noopPlugin,
  commentInlinePlugin,
  unsupportedPlugin,
  pastePlugin,
];

const ingressRenderers: SlatePlugin[] = [
  noopRenderer,
  paragraphRenderer,
  markRenderer,
  breakRenderer,
  spanRenderer,
  commentInlineRenderer,
  unsupportedElementRenderer,
];

const plugins = ingressPlugins.concat(ingressRenderers);

const IngressField = ({ name = "introduction", maxLength = 300, placeholder }: Props) => {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext();
  const [field, meta, helpers] = useField(name);

  const debouncedOnChange = useDebouncedCallback(helpers.setValue, SAVE_DEBOUNCE_MS);

  return (
    <FieldRoot invalid={!!meta.error}>
      <ContentEditableFieldLabel srOnly>{t("form.introduction.label")}</ContentEditableFieldLabel>
      <StyledRichTextEditor
        {...field}
        id="ingress-editor"
        testId="ingress-editor"
        hideBlockPicker
        placeholder={placeholder || t("form.introduction.label")}
        data-testid="learning-resource-ingress"
        submitted={isSubmitting}
        plugins={plugins}
        onChange={debouncedOnChange}
        renderInvalidElement={(props) => <UnsupportedElement {...props} />}
      />
      <MetaWrapper>
        <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        <StyledFormRemainingCharacters maxLength={maxLength} value={field.value} />
      </MetaWrapper>
      <FieldWarning name={field.name} />
    </FieldRoot>
  );
};

export default IngressField;
