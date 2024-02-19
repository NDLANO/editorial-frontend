/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { FieldHeader } from "@ndla/forms";
import LastUpdatedLine from "./../../../../components/LastUpdatedLine/LastUpdatedLine";

import { topicArticlePlugins } from "./topicArticlePlugins";
import { topicArticleRenderers } from "./topicArticleRenderers";
import { EditMarkupLink } from "../../../../components/EditMarkupLink";
import FormikField from "../../../../components/FormikField";
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

const plugins = topicArticlePlugins.concat(topicArticleRenderers);

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

  return (
    <>
      <TitleField />
      <StyledByLineFormikField name="published">
        {({ field, form }) => (
          <LastUpdatedLine
            creators={creators}
            published={published}
            allowEdit={true}
            onChange={(date) => {
              form.setFieldValue(field.name, date);
            }}
          />
        )}
      </StyledByLineFormikField>
      <IngressField />
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
