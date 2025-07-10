/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { inlineNavigationPlugin, SlatePlugin, softBreakPlugin } from "@ndla/editor";
import { ContentEditableFieldLabel } from "@ndla/editor-components";
import { FieldErrorMessage, FieldInput, FieldLabel, FieldRoot, TextArea } from "@ndla/primitives";
import { FormRemainingCharacters } from "../../../components/Form/FormRemainingCharacters";
import { FormField } from "../../../components/FormField";
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
import { UnsupportedElement } from "../../../components/SlateEditor/plugins/unsupported/UnsupportedElement";
import { unsupportedElementRenderer } from "../../../components/SlateEditor/plugins/unsupported/unsupportedElementRenderer";
import { unsupportedPlugin } from "../../../components/SlateEditor/plugins/unsupported/unsupportedPlugin";
import RichTextEditor from "../../../components/SlateEditor/RichTextEditor";

const TITLE_MAX_LENGTH = 64;
const INTRODUCTION_MAX_LENGTH = 250;

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
  toolbarPlugin,
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

interface Props {
  language: string | undefined;
}

export const TextStepForm = ({ language }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <FormField name="title">
        {({ field, meta }) => (
          <FieldRoot required invalid={!!meta.error}>
            <FieldLabel>{t("learningpathForm.steps.textForm.titleLabel")}</FieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <FieldInput {...field} />
            <FormRemainingCharacters value={field.value ?? ""} maxLength={TITLE_MAX_LENGTH} />
          </FieldRoot>
        )}
      </FormField>
      <FormField name="introduction">
        {({ field, meta }) => (
          <FieldRoot required invalid={!!meta.error}>
            <FieldLabel>{t("learningpathForm.steps.textForm.introductionLabel")}</FieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <FieldInput {...field} />
            <FormRemainingCharacters value={field.value ?? 0} maxLength={INTRODUCTION_MAX_LENGTH} />
          </FieldRoot>
        )}
      </FormField>
      <FormField name="description">
        {({ field, meta, helpers }) => (
          <FieldRoot required invalid={!!meta.error}>
            <ContentEditableFieldLabel>
              {t("learningpathForm.steps.textForm.descriptionLabel")}
            </ContentEditableFieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <TextArea asChild>
              <RichTextEditor
                language={language}
                placeholder={t("form.content.placeholder")}
                value={field.value}
                hideBlockPicker
                // TODO: Fix
                submitted={false}
                plugins={EDITOR_PLUGINS}
                data-testid="text-step-content"
                onChange={helpers.setValue}
                renderInvalidElement={(props) => <UnsupportedElement {...props} />}
              />
            </TextArea>
          </FieldRoot>
        )}
      </FormField>
    </>
  );
};
