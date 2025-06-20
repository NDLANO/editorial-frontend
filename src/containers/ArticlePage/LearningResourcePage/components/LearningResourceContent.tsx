/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField, useFormikContext } from "formik";
import { useState, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { Button, FieldErrorMessage, FieldRoot } from "@ndla/primitives";
import { IAuthorDTO } from "@ndla/types-backend/draft-api";
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
import { AUDIO_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/audio/audioTypes";
import { learningResourceActions } from "../../../../components/SlateEditor/plugins/blockPicker/actions";
import { CODE_BLOCK_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/codeBlock/types";
import { COMMENT_BLOCK_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/comment/block/types";
import { EXTERNAL_ELEMENT_TYPE, IFRAME_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/external/types";
import { FILE_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/file/types";
import { FOOTNOTE_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/footnote/types";
import { GRID_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/grid/types";
import { H5P_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/h5p/types";
import { IMAGE_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/image/types";
import { TABLE_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/table/types";
import { UNSUPPORTED_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/unsupported/types";
import { UnsupportedElement } from "../../../../components/SlateEditor/plugins/unsupported/UnsupportedElement";
import { BRIGHTCOVE_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/video/types";
import RichTextEditor from "../../../../components/SlateEditor/RichTextEditor";
import { DRAFT_HTML_SCOPE, SAVE_DEBOUNCE_MS } from "../../../../constants";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { toCreateLearningResource, toEditMarkup } from "../../../../util/routeHelpers";
import { findNodesByType } from "../../../../util/slateHelpers";
import { useDebouncedCallback } from "../../../../util/useDebouncedCallback";
import { IngressField, TitleField } from "../../../FormikForm";
import { HandleSubmitFunc, LearningResourceFormType } from "../../../FormikForm/articleFormHooks";
import { useSession } from "../../../Session/SessionProvider";

const findFootnotes = (content: Descendant[]): FootnoteType[] =>
  findNodesByType(content, FOOTNOTE_ELEMENT_TYPE)
    .filter((footnote) => Object.keys(footnote.data).length > 0)
    .map((footnoteElement) => footnoteElement.data);

const visualElements = [
  H5P_ELEMENT_TYPE,
  BRIGHTCOVE_ELEMENT_TYPE,
  AUDIO_ELEMENT_TYPE,
  EXTERNAL_ELEMENT_TYPE,
  IFRAME_ELEMENT_TYPE,
  IMAGE_ELEMENT_TYPE,
];

const actions = [
  TABLE_ELEMENT_TYPE,
  CODE_BLOCK_ELEMENT_TYPE,
  FILE_ELEMENT_TYPE,
  GRID_ELEMENT_TYPE,
  COMMENT_BLOCK_ELEMENT_TYPE,
].concat(visualElements);
const actionsToShowInAreas = {
  details: actions,
  aside: actions,
  framedContent: actions,
  "table-cell": [IMAGE_ELEMENT_TYPE],
  "grid-cell": [IMAGE_ELEMENT_TYPE],
};

// Plugins are checked from last to first
interface Props {
  articleLanguage: string;
  articleId?: number;
  handleSubmit: HandleSubmitFunc<LearningResourceFormType>;
}

const LearningResourceContent = ({ articleLanguage, articleId, handleSubmit: _handleSubmit }: Props) => {
  const [creatorsField] = useField<IAuthorDTO[]>("creators");

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
      <ContentField articleLanguage={articleLanguage} articleId={articleId} />
    </FormContent>
  );
};

interface ContentFieldProps {
  articleId?: number;
  articleLanguage: string;
}

const editorPlugins = learningResourcePlugins.concat(learningResourceRenderers);

const blockPickerOptions = { actionsToShowInAreas };

const ContentField = ({ articleId, articleLanguage }: ContentFieldProps) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { values, isSubmitting, initialValues } = useFormikContext<LearningResourceFormType>();
  const [field, meta, helpers] = useField("content");
  const [showAlert, setShowAlert] = useState(false);

  const isCreatePage = toCreateLearningResource() === window.location.pathname;

  const onInitialNormalized = useCallback(
    (value: Descendant[]) => {
      if (
        isFormikFormDirty({ values: { ...values, content: value }, initialValues, dirty: true }) ||
        findNodesByType(value, UNSUPPORTED_ELEMENT_TYPE).length
      ) {
        setShowAlert(true);
      }
    },
    [initialValues, values],
  );

  const debouncedOnChange = useDebouncedCallback(helpers.setValue, SAVE_DEBOUNCE_MS);

  const onCancel = useCallback(() => {
    setShowAlert(false);
  }, []);

  return (
    <>
      <AlertDialog
        title={t("editorFooter.changeHeader")}
        label={t("editorFooter.changeHeader")}
        show={!!showAlert && !isCreatePage}
        text={t("form.content.normalizedOnLoad")}
        onCancel={onCancel}
        severity="warning"
      >
        <FormActionsContainer>
          <Button variant="danger" onClick={onCancel}>
            {t("alertDialog.continue")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
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
          onChange={debouncedOnChange}
          onInitialNormalized={onInitialNormalized}
          renderInvalidElement={(props) => <UnsupportedElement {...props} />}
        />
        {!isSubmitting && <LearningResourceFootnotes footnotes={findFootnotes(field.value)} />}
        <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        <FieldWarning name={field.name} />
      </FieldRoot>
    </>
  );
};

export default memo(LearningResourceContent);
