/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldErrorMessage, FieldRoot } from "@ndla/primitives";
import { useField } from "formik";
import { useTranslation } from "react-i18next";
import { EditMarkupLink } from "../../../../components/EditMarkupLink";
import { ContentEditableFieldLabel } from "../../../../components/Form/ContentEditableFieldLabel";
import { FieldWarning } from "../../../../components/Form/FieldWarning";
import { SegmentHeader } from "../../../../components/Form/SegmentHeader";
import { FormField } from "../../../../components/FormField";
import { FormContent } from "../../../../components/FormikForm";
import { UnsupportedElement } from "../../../../components/SlateEditor/plugins/unsupported/UnsupportedElement";
import RichTextEditor from "../../../../components/SlateEditor/RichTextEditor";
import { DRAFT_HTML_SCOPE, SAVE_DEBOUNCE_MS } from "../../../../constants";
import { toEditMarkup } from "../../../../util/routeHelpers";
import { useDebouncedCallback } from "../../../../util/useDebouncedCallback";
import { IngressField, TitleField } from "../../../FormikForm";
import { TopicArticleFormType } from "../../../FormikForm/articleFormHooks";
import VisualElementField from "../../../FormikForm/components/VisualElementField";
import { useSession } from "../../../Session/SessionProvider";
import LastUpdatedLine from "./../../../../components/LastUpdatedLine/LastUpdatedLine";
import { topicArticlePlugins } from "./topicArticlePlugins";
import { topicArticleRenderers } from "./topicArticleRenderers";

const plugins = topicArticlePlugins.concat(topicArticleRenderers);

interface Props {
  values: TopicArticleFormType;
  isSubmitting: boolean;
}

const TopicArticleContent = ({ values, isSubmitting }: Props) => {
  const [field, meta, helpers] = useField("content");
  const { t } = useTranslation();
  const { userPermissions } = useSession();

  const debouncedOnChange = useDebouncedCallback(helpers.setValue, SAVE_DEBOUNCE_MS);

  return (
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
          renderInvalidElement={(props) => <UnsupportedElement {...props} />}
          onChange={debouncedOnChange}
        />
        <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        <FieldWarning name={field.name} />
      </FieldRoot>
    </FormContent>
  );
};

export default TopicArticleContent;
