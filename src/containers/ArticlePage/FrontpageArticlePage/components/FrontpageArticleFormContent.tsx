/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField, useFormikContext } from "formik";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { LinkMedium } from "@ndla/icons";
import { Button, FieldErrorMessage, FieldRoot, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { frontpagePlugins } from "./frontpagePlugins";
import { frontpageRenderers } from "./frontpageRenderers";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import { ContentTypeProvider } from "../../../../components/ContentTypeProvider";
import { EditMarkupLink } from "../../../../components/EditMarkupLink";
import { ContentEditableFieldLabel } from "../../../../components/Form/ContentEditableFieldLabel";
import { FieldWarning } from "../../../../components/Form/FieldWarning";
import { SegmentHeader } from "../../../../components/Form/SegmentHeader";
import { FormField } from "../../../../components/FormField";
import { FormActionsContainer, FormContent } from "../../../../components/FormikForm";
import LastUpdatedLine from "../../../../components/LastUpdatedLine/LastUpdatedLine";
import { AUDIO_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/audio/audioTypes";
import { frontpageActions } from "../../../../components/SlateEditor/plugins/blockPicker/actions";
import { CAMPAIGN_BLOCK_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/campaignBlock/types";
import { CODE_BLOCK_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/codeBlock/types";
import { COMMENT_BLOCK_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/comment/block/types";
import { CONTACT_BLOCK_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/contactBlock/types";
import { EXTERNAL_ELEMENT_TYPE, IFRAME_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/external/types";
import { FILE_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/file/types";
import { GRID_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/grid/types";
import { H5P_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/h5p/types";
import { IMAGE_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/image/types";
import { KEY_FIGURE_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/keyFigure/types";
import { LINK_BLOCK_LIST_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/linkBlockList/types";
import { PITCH_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/pitch/types";
import { TABLE_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/table/types";
import {
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../../../components/SlateEditor/plugins/toolbar/toolbarState";
import { DISCLAIMER_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/uuDisclaimer/types";
import { BRIGHTCOVE_ELEMENT_TYPE } from "../../../../components/SlateEditor/plugins/video/types";
import RichTextEditor from "../../../../components/SlateEditor/RichTextEditor";
import { DRAFT_HTML_SCOPE, SAVE_DEBOUNCE_MS } from "../../../../constants";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { toCreateFrontPageArticle, toEditMarkup } from "../../../../util/routeHelpers";
import { useDebouncedCallback } from "../../../../util/useDebouncedCallback";
import { IngressField, TitleField, SlugField } from "../../../FormikForm";
import { FrontpageArticleFormType } from "../../../FormikForm/articleFormHooks";
import { useSession } from "../../../Session/SessionProvider";

const StyledDiv = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
});

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
  CONTACT_BLOCK_ELEMENT_TYPE,
  GRID_ELEMENT_TYPE,
  KEY_FIGURE_ELEMENT_TYPE,
  CAMPAIGN_BLOCK_ELEMENT_TYPE,
  LINK_BLOCK_LIST_ELEMENT_TYPE,
  DISCLAIMER_ELEMENT_TYPE,
  COMMENT_BLOCK_ELEMENT_TYPE,
].concat(visualElements);

const actionsToShowInAreas = {
  "table-cell": [IMAGE_ELEMENT_TYPE],
  section: actions,
  "grid-cell": [IMAGE_ELEMENT_TYPE, KEY_FIGURE_ELEMENT_TYPE, PITCH_ELEMENT_TYPE],
};

const toolbarOptions = createToolbarDefaultValues();
const toolbarAreaFilters = createToolbarAreaOptions();

interface Props {
  articleLanguage: string;
}

const editorPlugins = frontpagePlugins.concat(frontpageRenderers);

const FrontpageArticleFormContent = ({ articleLanguage }: Props) => {
  const { userPermissions } = useSession();
  const { t } = useTranslation();
  const [field, meta, helpers] = useField("content");

  const { initialValues, values, isSubmitting } = useFormikContext<FrontpageArticleFormType>();
  const { slug, id, creators, language } = values;

  const [showAlert, setShowAlert] = useState(false);
  const isCreatePage = toCreateFrontPageArticle() === window.location.pathname;

  const onInitialNormalized = useCallback(
    (value: Descendant[]) => {
      if (isFormikFormDirty({ values: { ...values, content: value }, initialValues, dirty: true })) {
        setShowAlert(true);
      }
    },
    [initialValues, values],
  );

  const debouncedOnChange = useDebouncedCallback(helpers.setValue, SAVE_DEBOUNCE_MS);

  const [editSlug, setEditSlug] = useState(false);

  return (
    <FormContent>
      <div>
        {editSlug && slug !== undefined ? <SlugField /> : <TitleField />}
        <StyledDiv>
          <FormField name="published">
            {({ field, helpers }) => (
              <LastUpdatedLine
                creators={creators}
                published={field.value}
                allowEdit={true}
                onChange={helpers.setValue}
              />
            )}
          </FormField>
          {!!slug && (
            <IconButton
              aria-label={t("form.slug.edit")}
              title={t("form.slug.edit")}
              variant={editSlug ? "secondary" : "clear"}
              onClick={() => setEditSlug(!editSlug)}
            >
              <LinkMedium />
            </IconButton>
          )}
        </StyledDiv>
      </div>
      <IngressField />
      <AlertDialog
        title={t("editorFooter.changeHeader")}
        label={t("editorFooter.changeHeader")}
        show={!!showAlert && !isCreatePage}
        text={t("form.content.normalizedOnLoad")}
        onCancel={() => setShowAlert(false)}
        severity="warning"
      >
        <FormActionsContainer>
          <Button variant="secondary" onClick={() => setShowAlert(false)}>
            {t("alertDialog.continue")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
      <FieldRoot invalid={!!meta.error}>
        <ContentTypeProvider value="frontpage-article">
          <SegmentHeader>
            <ContentEditableFieldLabel>{t("form.content.label")}</ContentEditableFieldLabel>
            {!!id && !!userPermissions?.includes(DRAFT_HTML_SCOPE) && (
              <EditMarkupLink to={toEditMarkup(id, language ?? "")} title={t("editMarkup.linkTitle")} />
            )}
          </SegmentHeader>
          <RichTextEditor
            language={articleLanguage}
            actions={frontpageActions}
            toolbarOptions={toolbarOptions}
            toolbarAreaFilters={toolbarAreaFilters}
            blockpickerOptions={{
              actionsToShowInAreas,
            }}
            placeholder={t("form.content.placeholder")}
            value={field.value}
            submitted={isSubmitting}
            plugins={editorPlugins}
            data-testid="frontpage-article-content"
            onChange={debouncedOnChange}
            onInitialNormalized={onInitialNormalized}
          />
        </ContentTypeProvider>
        <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        <FieldWarning name={field.name} />
      </FieldRoot>
    </FormContent>
  );
};

export default FrontpageArticleFormContent;
