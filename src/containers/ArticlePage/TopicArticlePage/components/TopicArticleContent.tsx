/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import LastUpdatedLine from "./../../../../components/LastUpdatedLine/LastUpdatedLine";

import { topicArticlePlugins } from "./topicArticlePlugins";
import { topicArticleRenderers } from "./topicArticleRenderers";
import { ContentTypeProvider } from "../../../../components/ContentTypeProvider";
import { EditMarkupLink } from "../../../../components/EditMarkupLink";
import FieldHeader from "../../../../components/Field/FieldHeader";
import { FormField } from "../../../../components/FormField";
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

const plugins = topicArticlePlugins.concat(topicArticleRenderers);

const toolbarOptions = createToolbarDefaultValues();
const toolbarAreaFilters = createToolbarAreaOptions();

interface Props {
  values: TopicArticleFormType;
}

const TopicArticleContent = (props: Props) => {
  const { t } = useTranslation();
  const {
    values: { id, language, creators },
  } = props;
  const { userPermissions } = useSession();

  return (
    <ContentTypeProvider value="topic">
      <TitleField />
      <FormField name="published">
        {({ field, helpers }) => (
          <LastUpdatedLine creators={creators} published={field.value} allowEdit={true} onChange={helpers.setValue} />
        )}
      </FormField>
      <IngressField />
      <VisualElementField types={["image"]} />
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
              hideBlockPicker
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
    </ContentTypeProvider>
  );
};

export default TopicArticleContent;
