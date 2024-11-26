/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { KeyboardEvent, memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FieldErrorMessage, FieldHelper, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FormField } from "../../components/FormField";

import { SlatePlugin } from "../../components/SlateEditor/interfaces";
import { markPlugin } from "../../components/SlateEditor/plugins/mark";
import { markRenderer } from "../../components/SlateEditor/plugins/mark/render";
import { noopPlugin } from "../../components/SlateEditor/plugins/noop";
import { noopRenderer } from "../../components/SlateEditor/plugins/noop/render";
import { paragraphPlugin } from "../../components/SlateEditor/plugins/paragraph";
import { paragraphRenderer } from "../../components/SlateEditor/plugins/paragraph/render";
import saveHotkeyPlugin from "../../components/SlateEditor/plugins/saveHotkey";
import { sectionRenderer } from "../../components/SlateEditor/plugins/section/render";
import { spanPlugin } from "../../components/SlateEditor/plugins/span";
import { spanRenderer } from "../../components/SlateEditor/plugins/span/render";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../components/SlateEditor/plugins/toolbar";
import {
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../components/SlateEditor/plugins/toolbar/toolbarState";
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

const StyledFieldHelper = styled(FieldHelper, {
  base: {
    // TODO: Replace this
    color: "#8c8c00",
  },
});

const titlePlugins: SlatePlugin[] = [
  spanPlugin,
  paragraphPlugin,
  textTransformPlugin,
  saveHotkeyPlugin,
  markPlugin,
  noopPlugin,
];

const titleRenderers: SlatePlugin[] = [sectionRenderer, paragraphRenderer, markRenderer, noopRenderer, spanRenderer];

const basePlugins = titlePlugins.concat(titleRenderers);

const toolbarOptions = createToolbarDefaultValues({
  text: {
    hidden: true,
  },
  mark: {
    bold: {
      hidden: true,
    },
    code: {
      hidden: true,
    },
  },
  block: { hidden: true },
  inline: { hidden: true },
});

const toolbarAreaFilters = createToolbarAreaOptions();

const TitleField = ({ maxLength = 256, name = "title", hideToolbar }: Props) => {
  const { status } = useFormikContext();
  const { t } = useTranslation();
  const plugins = useMemo(() => {
    if (hideToolbar) return basePlugins;
    return basePlugins.concat(toolbarPlugin(toolbarOptions, toolbarAreaFilters));
  }, [hideToolbar]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return false;
    } else return true;
  }, []);

  return (
    <FormField name={name}>
      {({ field, meta }) => (
        <FieldRoot required invalid={!!meta.error}>
          <FieldLabel srOnly>{t("form.title.label")}</FieldLabel>
          <StyledRichTextEditor
            {...field}
            id="title-editor"
            testId="title-editor"
            additionalOnKeyDown={onKeyDown}
            hideBlockPicker
            submitted={false}
            placeholder={t("form.title.label")}
            data-title=""
            data-testid="learning-resource-title"
            plugins={plugins}
            onChange={(val) => field.onChange({ target: { value: val, name: field.name } })}
            toolbarOptions={toolbarOptions}
            toolbarAreaFilters={toolbarAreaFilters}
            maxLength={maxLength}
            hideToolbar={hideToolbar}
          />
          {!!status?.warnings?.[name] && <StyledFieldHelper>{status.warnings[name]}</StyledFieldHelper>}
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        </FieldRoot>
      )}
    </FormField>
  );
};

export default memo(TitleField);
