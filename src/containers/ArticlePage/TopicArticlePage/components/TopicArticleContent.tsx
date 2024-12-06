/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FieldErrorMessage, FieldRoot } from "@ndla/primitives";
import LastUpdatedLine from "./../../../../components/LastUpdatedLine/LastUpdatedLine";
import { topicArticlePlugins } from "./topicArticlePlugins";
import { topicArticleRenderers } from "./topicArticleRenderers";
import { ContentTypeProvider } from "../../../../components/ContentTypeProvider";
import { EditMarkupLink } from "../../../../components/EditMarkupLink";
import { ContentEditableFieldLabel } from "../../../../components/Form/ContentEditableFieldLabel";
import { FieldWarning } from "../../../../components/Form/FieldWarning";
import { SegmentHeader } from "../../../../components/Form/SegmentHeader";
import { FormField } from "../../../../components/FormField";
import { FormContent } from "../../../../components/FormikForm";
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
  isSubmitting: boolean;
}

const TopicArticleContent = ({ values, isSubmitting }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();

  return (
    <ContentTypeProvider value="topic">
      <FormContent>
        <div>
          <TitleField />
          <FormField name="published">
            {({ field, helpers }) => (
              <LastUpdatedLine
                creators={values.creators}
                published={field.value}
                allowEdit={true}
                onChange={helpers.setValue}
              />
            )}
          </FormField>
        </div>
        <IngressField />
        <VisualElementField types={["image"]} />
        <FormField name="content">
          {({ field, meta, helpers }) => (
            <FieldRoot invalid={!!meta.error}>
              <SegmentHeader>
                <ContentEditableFieldLabel>{t("form.content.label")}</ContentEditableFieldLabel>
                {!!values.id && !!userPermissions?.includes(DRAFT_HTML_SCOPE) && !!values.language && (
                  <EditMarkupLink to={toEditMarkup(values.id, values.language)} title={t("editMarkup.linkTitle")} />
                )}
              </SegmentHeader>
              <RichTextEditor
                language={values.language}
                placeholder={t("form.content.placeholder")}
                value={field.value}
                submitted={isSubmitting}
                plugins={plugins}
                hideBlockPicker
                toolbarOptions={toolbarOptions}
                toolbarAreaFilters={toolbarAreaFilters}
                onChange={(value) => helpers.setValue(value)}
              />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldWarning name={field.name} />
            </FieldRoot>
          )}
        </FormField>
      </FormContent>
    </ContentTypeProvider>
  );
};

export default TopicArticleContent;
