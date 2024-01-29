/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import FormikField from "../../components/FormikField";
import { SlatePlugin } from "../../components/SlateEditor/interfaces";

import { blockQuotePlugin } from "../../components/SlateEditor/plugins/blockquote";
import { breakPlugin } from "../../components/SlateEditor/plugins/break";
import { definitionListPlugin } from "../../components/SlateEditor/plugins/definitionList";
import { divPlugin } from "../../components/SlateEditor/plugins/div";
import { headingPlugin } from "../../components/SlateEditor/plugins/heading";
import { linkPlugin } from "../../components/SlateEditor/plugins/link";
import { listPlugin } from "../../components/SlateEditor/plugins/list";
import { markPlugin } from "../../components/SlateEditor/plugins/mark";
import { mathmlPlugin } from "../../components/SlateEditor/plugins/mathml";
import { paragraphPlugin } from "../../components/SlateEditor/plugins/paragraph";
import saveHotkeyPlugin from "../../components/SlateEditor/plugins/saveHotkey";
import { spanPlugin } from "../../components/SlateEditor/plugins/span";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../components/SlateEditor/plugins/toolbar";
import {
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../components/SlateEditor/plugins/toolbar/toolbarState";
import RichTextEditor from "../../components/SlateEditor/RichTextEditor";
import { learningResourceRenderers } from "../ArticlePage/LearningResourcePage/components/learningResourceRenderers";

interface Props {
  name?: string;
  maxLength?: number;
  type?: string;
  placeholder?: string;
  articleLanguage: string;
}

const ingressPlugins: SlatePlugin[] = [
  spanPlugin,
  divPlugin,
  paragraphPlugin,
  blockQuotePlugin,
  linkPlugin,
  headingPlugin,
  mathmlPlugin,
  toolbarPlugin,
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  markPlugin,
  definitionListPlugin,
  listPlugin,
];

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
  const plugins = useMemo(() => ingressPlugins.concat(learningResourceRenderers(articleLanguage)), [articleLanguage]);
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
