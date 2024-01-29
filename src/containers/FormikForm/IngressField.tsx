/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";

import FormikField from "../../components/FormikField";
import { SlatePlugin } from "../../components/SlateEditor/interfaces";

import { breakPlugin } from "../../components/SlateEditor/plugins/break";
import { breakRenderer } from "../../components/SlateEditor/plugins/break/render";
import { markPlugin } from "../../components/SlateEditor/plugins/mark";
import { markRenderer } from "../../components/SlateEditor/plugins/mark/render";
import { paragraphPlugin } from "../../components/SlateEditor/plugins/paragraph";
import { paragraphRenderer } from "../../components/SlateEditor/plugins/paragraph/render";
import saveHotkeyPlugin from "../../components/SlateEditor/plugins/saveHotkey";
import { sectionRenderer } from "../../components/SlateEditor/plugins/section/render";
import { spanPlugin } from "../../components/SlateEditor/plugins/span";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../components/SlateEditor/plugins/toolbar";
import {
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../components/SlateEditor/plugins/toolbar/toolbarState";
import RichTextEditor from "../../components/SlateEditor/RichTextEditor";

interface Props {
  name?: string;
  maxLength?: number;
  type?: string;
  placeholder?: string;
  articleLanguage: string;
}

const ingressPlugins: SlatePlugin[] = [
  spanPlugin,
  paragraphPlugin,
  toolbarPlugin,
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  markPlugin,
];

const ingressRenderers: SlatePlugin[] = [sectionRenderer, paragraphRenderer, markRenderer, breakRenderer];

const plugins = ingressPlugins.concat(ingressRenderers);

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

const IngressField = ({ name = "introduction", maxLength = 300, placeholder, articleLanguage }: Props) => {
  const { t } = useTranslation();
  return (
    <FormikField noBorder label={t("form.introduction.label")} name={name} showMaxLength maxLength={maxLength}>
      {({ field, form: { isSubmitting } }) => (
        <RichTextEditor
          {...field}
          language={articleLanguage}
          hideBlockPicker
          placeholder={placeholder || t("form.introduction.label")}
          data-testid="learning-resource-ingress"
          submitted={isSubmitting}
          plugins={plugins}
          onChange={(val) => field.onChange({ target: { value: val, name: field.name } })}
          toolbarOptions={toolbarOptions}
          toolbarAreaFilters={toolbarAreaFilters}
        />
      )}
    </FormikField>
  );
};

export default IngressField;
