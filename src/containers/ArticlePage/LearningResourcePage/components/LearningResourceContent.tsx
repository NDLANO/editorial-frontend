/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField, useFormikContext } from "formik";
import { useState, useMemo, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { Button, FieldErrorMessage, FieldRoot } from "@ndla/primitives";
import { IAuthor } from "@ndla/types-backend/draft-api";
import LearningResourceFootnotes, { FootnoteType } from "./LearningResourceFootnotes";
import { learningResourcePlugins } from "./learningResourcePlugins";
import { learningResourceRenderers } from "./learningResourceRenderers";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import { EditMarkupLink } from "../../../../components/EditMarkupLink";
import { ContentEditableFieldLabel } from "../../../../components/Form/ContentEditableFieldLabel";
import { FieldWarning } from "../../../../components/Form/FieldWarning";
import { SegmentHeader } from "../../../../components/Form/SegmentHeader";
import { FormField } from "../../../../components/FormField";
import { FormActionsContainer, FormContent } from "../../../../components/FormikForm";
import LastUpdatedLine from "../../../../components/LastUpdatedLine/LastUpdatedLine";
import { TYPE_AUDIO } from "../../../../components/SlateEditor/plugins/audio/types";
import { learningResourceActions } from "../../../../components/SlateEditor/plugins/blockPicker/actions";
import { TYPE_CODEBLOCK } from "../../../../components/SlateEditor/plugins/codeBlock/types";
import { TYPE_COMMENT_BLOCK } from "../../../../components/SlateEditor/plugins/comment/block/types";
import { TYPE_EXTERNAL } from "../../../../components/SlateEditor/plugins/external/types";
import { TYPE_FILE } from "../../../../components/SlateEditor/plugins/file/types";
import { FootnoteElement } from "../../../../components/SlateEditor/plugins/footnote";
import { TYPE_FOOTNOTE } from "../../../../components/SlateEditor/plugins/footnote/types";
import { TYPE_GRID } from "../../../../components/SlateEditor/plugins/grid/types";
import { TYPE_H5P } from "../../../../components/SlateEditor/plugins/h5p/types";
import { TYPE_IMAGE } from "../../../../components/SlateEditor/plugins/image/types";
import { TYPE_TABLE } from "../../../../components/SlateEditor/plugins/table/types";
import {
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../../../components/SlateEditor/plugins/toolbar/toolbarState";
import { TYPE_EMBED_BRIGHTCOVE } from "../../../../components/SlateEditor/plugins/video/types";
import RichTextEditor from "../../../../components/SlateEditor/RichTextEditor";
import { DRAFT_HTML_SCOPE } from "../../../../constants";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { toCreateLearningResource, toEditMarkup } from "../../../../util/routeHelpers";
import { findNodesByType } from "../../../../util/slateHelpers";
import { IngressField, TitleField } from "../../../FormikForm";
import { HandleSubmitFunc, LearningResourceFormType } from "../../../FormikForm/articleFormHooks";
import { useSession } from "../../../Session/SessionProvider";

const findFootnotes = (content: Descendant[]): FootnoteType[] =>
  findNodesByType(content, TYPE_FOOTNOTE)
    .map((e) => e as FootnoteElement)
    .filter((footnote) => Object.keys(footnote.data).length > 0)
    .map((footnoteElement) => footnoteElement.data);

const visualElements = [TYPE_H5P, TYPE_EMBED_BRIGHTCOVE, TYPE_AUDIO, TYPE_EXTERNAL, TYPE_IMAGE];

const actions = [TYPE_TABLE, TYPE_CODEBLOCK, TYPE_FILE, TYPE_GRID, TYPE_COMMENT_BLOCK].concat(visualElements);
const actionsToShowInAreas = {
  details: actions,
  aside: actions,
  framedContent: actions,
  "table-cell": [TYPE_IMAGE],
  "grid-cell": [TYPE_IMAGE],
};

const toolbarOptions = createToolbarDefaultValues();
const toolbarAreaFilters = createToolbarAreaOptions();

// Plugins are checked from last to first
interface Props {
  articleLanguage: string;
  articleId?: number;
  handleSubmit: HandleSubmitFunc<LearningResourceFormType>;
}

const LearningResourceContent = ({ articleLanguage, articleId, handleSubmit: _handleSubmit }: Props) => {
  const { t } = useTranslation();
  const [creatorsField] = useField<IAuthor[]>("creators");

  const { dirty, initialValues, values, status, setStatus } = useFormikContext<LearningResourceFormType>();

  const isFormikDirty = useMemo(
    () =>
      isFormikFormDirty({
        values,
        initialValues,
        dirty,
      }),
    [values, initialValues, dirty],
  );

  const [isNormalizedOnLoad, setIsNormalizedOnLoad] = useState(isFormikDirty);
  const [isTouched, setIsTouched] = useState(false);
  const isCreatePage = toCreateLearningResource() === window.location.pathname;

  useEffect(() => {
    setTimeout(() => {
      if (status.status === "revertVersion") {
        setIsNormalizedOnLoad(false);
        setIsTouched(true);
        setStatus({ ...status, status: undefined });
      } else if (!isTouched) {
        setIsNormalizedOnLoad(isFormikDirty);
        setIsTouched(true);
      }
    }, 100);
  }, [isFormikDirty, isTouched, setStatus, status, status.status]);

  return (
    <FormContent>
      <div>
        <TitleField />
        <FormField name="published">
          {({ field, helpers }) => (
            <LastUpdatedLine
              creators={creatorsField.value}
              published={field.value}
              allowEdit={true}
              onChange={helpers.setValue}
            />
          )}
        </FormField>
      </div>
      <IngressField />
      <AlertDialog
        title={t("editorFooter.changeHeader")}
        label={t("editorFooter.changeHeader")}
        show={!!isNormalizedOnLoad && !isCreatePage}
        text={t("form.content.normalizedOnLoad")}
        onCancel={() => setIsNormalizedOnLoad(false)}
        severity="warning"
      >
        <FormActionsContainer>
          <Button variant="danger" onClick={() => setIsNormalizedOnLoad(false)}>
            {t("alertModal.continue")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
      <ContentField articleLanguage={articleLanguage} articleId={articleId} />
    </FormContent>
  );
};

interface ContentFieldProps {
  articleId?: number;
  articleLanguage: string;
}

const editorPlugins = learningResourcePlugins.concat(learningResourceRenderers);

const ContentField = ({ articleId, articleLanguage }: ContentFieldProps) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { isSubmitting } = useFormikContext<LearningResourceFormType>();

  const blockPickerOptions = useMemo(() => ({ actionsToShowInAreas }), []);

  return (
    <FormField name="content">
      {({ field, meta, helpers }) => (
        <FieldRoot invalid={!!meta.error}>
          <SegmentHeader>
            <ContentEditableFieldLabel>{t("form.content.label")}</ContentEditableFieldLabel>
            {!!articleId && !!userPermissions?.includes(DRAFT_HTML_SCOPE) && (
              <EditMarkupLink to={toEditMarkup(articleId, articleLanguage ?? "")} title={t("editMarkup.linkTitle")} />
            )}
          </SegmentHeader>
          <RichTextEditor
            actions={learningResourceActions}
            language={articleLanguage}
            blockpickerOptions={blockPickerOptions}
            placeholder={t("form.content.placeholder")}
            value={field.value}
            submitted={isSubmitting}
            plugins={editorPlugins}
            data-testid="learning-resource-content"
            onChange={(value) => helpers.setValue(value)}
            toolbarOptions={toolbarOptions}
            toolbarAreaFilters={toolbarAreaFilters}
          />
          {!isSubmitting && <LearningResourceFootnotes footnotes={findFootnotes(field.value)} />}
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          <FieldWarning name={field.name} />
        </FieldRoot>
      )}
    </FormField>
  );
};

export default memo(LearningResourceContent);
