/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { connect } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { fonts } from "@ndla/core";
import { AudioFormikType } from "./AudioForm";
import FormikField from "../../../components/FormikField";
import { SlatePlugin } from "../../../components/SlateEditor/interfaces";
import { breakPlugin } from "../../../components/SlateEditor/plugins/break";
import { breakRenderer } from "../../../components/SlateEditor/plugins/break/render";
import { markPlugin } from "../../../components/SlateEditor/plugins/mark";
import { markRenderer } from "../../../components/SlateEditor/plugins/mark/render";
import { noopPlugin } from "../../../components/SlateEditor/plugins/noop";
import { noopRenderer } from "../../../components/SlateEditor/plugins/noop/render";
import { paragraphPlugin } from "../../../components/SlateEditor/plugins/paragraph";
import { paragraphRenderer } from "../../../components/SlateEditor/plugins/paragraph/render";
import saveHotkeyPlugin from "../../../components/SlateEditor/plugins/saveHotkey";
import { spanPlugin } from "../../../components/SlateEditor/plugins/span";
import { spanRenderer } from "../../../components/SlateEditor/plugins/span/render";
import { textTransformPlugin } from "../../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../../components/SlateEditor/plugins/toolbar";
import {
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../../components/SlateEditor/plugins/toolbar/toolbarState";
import RichTextEditor from "../../../components/SlateEditor/RichTextEditor";

const StyledFormikField = styled(FormikField)`
  label {
    font-weight: ${fonts.weight.semibold};
    ${fonts.sizes("30px", "38px")};
  }
`;

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

const manuscriptPlugins: SlatePlugin[] = [
  spanPlugin,
  ...paragraphPlugin,
  toolbarPlugin(toolbarOptions, toolbarAreaFilters),
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  markPlugin,
  noopPlugin,
];

const manuscriptRenderers: SlatePlugin[] = [noopRenderer, paragraphRenderer, markRenderer, breakRenderer, spanRenderer];

const plugins = manuscriptPlugins.concat(manuscriptRenderers);

const StyledRichTextEditor = styled(RichTextEditor)`
  white-space: pre-wrap;
  ${fonts.sizes("16px", "30px")};
  font-family: ${fonts.sans};
`;

const AudioManuscript = () => {
  const { t } = useTranslation();

  return (
    <StyledFormikField label={t("podcastForm.fields.manuscript")} name="manuscript">
      {({ field, form: { isSubmitting } }) => (
        <StyledRichTextEditor
          {...field}
          hideBlockPicker
          placeholder={t("podcastForm.fields.manuscript")}
          submitted={isSubmitting}
          plugins={plugins}
          onChange={(val) => field.onChange({ target: { value: val, name: field.name } })}
          toolbarOptions={toolbarOptions}
          toolbarAreaFilters={toolbarAreaFilters}
        />
      )}
    </StyledFormikField>
  );
};

export default connect<{}, AudioFormikType>(AudioManuscript);
