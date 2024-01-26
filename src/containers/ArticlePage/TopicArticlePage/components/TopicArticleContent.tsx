/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { colors } from "@ndla/core";
import { FieldHeader } from "@ndla/forms";
import { Eye } from "@ndla/icons/editor";
import Tooltip from "@ndla/tooltip";
import LastUpdatedLine from "./../../../../components/LastUpdatedLine/LastUpdatedLine";

import { topicArticlePlugins } from "./topicArticlePlugins";
import { topicArticleRenderers } from "./topicArticleRenderers";
import { EditMarkupLink } from "../../../../components/EditMarkupLink";
import FormikField from "../../../../components/FormikField";
import HowToHelper from "../../../../components/HowTo/HowToHelper";
import { SlatePlugin } from "../../../../components/SlateEditor/interfaces";
import {
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../../../components/SlateEditor/plugins/toolbar/toolbarState";
import RichTextEditor from "../../../../components/SlateEditor/RichTextEditor";
import { DRAFT_HTML_SCOPE } from "../../../../constants";
import { toEditMarkup } from "../../../../util/routeHelpers";
import { IngressField, TitleField } from "../../../FormikForm";
import { TopicArticleFormType } from "../../../FormikForm/articleFormHooks";
import VisualElementField from "../../../FormikForm/components/VisualElementField";
import { useSession } from "../../../Session/SessionProvider";

const StyledByLineFormikField = styled(FormikField)`
  display: flex;
  margin-top: 0;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 64px;
`;

const StyledDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const MarkdownButton = styled(IconButtonV2)`
  color: ${colors.brand.light};

  &[data-active="true"] {
    color: ${colors.brand.primary};
  }
`;

const createPlugins = (language: string): SlatePlugin[] => {
  // Plugins are checked from last to first
  return topicArticlePlugins.concat(topicArticleRenderers(language));
};

const toolbarOptions = createToolbarDefaultValues();
const toolbarAreaFilters = createToolbarAreaOptions();

interface Props {
  values: TopicArticleFormType;
}

const TopicArticleContent = (props: Props) => {
  const { t } = useTranslation();
  const {
    values: { id, language, creators, published },
  } = props;
  const { userPermissions } = useSession();
  const [preview, setPreview] = useState(false);
  const plugins = useMemo(() => {
    return createPlugins(language ?? "");
  }, [language]);

  return (
    <>
      <TitleField />
      <StyledByLineFormikField name="published">
        {({ field, form }) => (
          <StyledDiv>
            <LastUpdatedLine
              creators={creators}
              published={published}
              allowEdit={true}
              onChange={(date) => {
                form.setFieldValue(field.name, date);
              }}
            />
            <IconContainer>
              <Tooltip tooltip={t("form.markdown.button")}>
                <MarkdownButton
                  aria-label={"form.markdown.button"}
                  variant="stripped"
                  colorTheme="light"
                  data-active={preview}
                  onClick={() => setPreview(!preview)}
                >
                  <Eye />
                </MarkdownButton>
              </Tooltip>
              <HowToHelper pageId="Markdown" tooltip={t("form.markdown.helpLabel")} />
            </IconContainer>
          </StyledDiv>
        )}
      </StyledByLineFormikField>
      <IngressField preview={preview} />
      <VisualElementField />
      <FormikField name="content" label={t("form.content.label")} noBorder>
        {({ field: { value, name, onChange }, form: { isSubmitting } }) => (
          <>
            <FieldHeader title={t("form.content.label")}>
              {id && userPermissions?.includes(DRAFT_HTML_SCOPE) && language && (
                <EditMarkupLink to={toEditMarkup(id, language)} title={t("editMarkup.linkTitle")} />
              )}
            </FieldHeader>
            <RichTextEditor
              language={language}
              placeholder={t("form.content.placeholder")}
              value={value}
              submitted={isSubmitting}
              plugins={plugins}
              toolbarOptions={toolbarOptions}
              toolbarAreaFilters={toolbarAreaFilters}
              onChange={(value) => {
                onChange({
                  target: {
                    value,
                    name,
                  },
                });
              }}
            />
          </>
        )}
      </FormikField>
    </>
  );
};

export default TopicArticleContent;
