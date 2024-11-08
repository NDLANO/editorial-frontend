/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { Link } from "@ndla/icons/editor";
import { Button, IconButton } from "@ndla/primitives";
import { frontpagePlugins } from "./frontpagePlugins";
import { frontpageRenderers } from "./frontpageRenderers";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import { ContentTypeProvider } from "../../../../components/ContentTypeProvider";
import { EditMarkupLink } from "../../../../components/EditMarkupLink";
import FieldHeader from "../../../../components/Field/FieldHeader";
import { FormField } from "../../../../components/FormField";
import FormikField from "../../../../components/FormikField";
import { FormActionsContainer } from "../../../../components/FormikForm";
import LastUpdatedLine from "../../../../components/LastUpdatedLine/LastUpdatedLine";
import { TYPE_AUDIO } from "../../../../components/SlateEditor/plugins/audio/types";
import { frontpageActions } from "../../../../components/SlateEditor/plugins/blockPicker/actions";
import { TYPE_CAMPAIGN_BLOCK } from "../../../../components/SlateEditor/plugins/campaignBlock/types";
import { TYPE_CODEBLOCK } from "../../../../components/SlateEditor/plugins/codeBlock/types";
import { TYPE_COMMENT_BLOCK } from "../../../../components/SlateEditor/plugins/comment/block/types";
import { TYPE_CONTACT_BLOCK } from "../../../../components/SlateEditor/plugins/contactBlock/types";
import { TYPE_EXTERNAL } from "../../../../components/SlateEditor/plugins/external/types";
import { TYPE_FILE } from "../../../../components/SlateEditor/plugins/file/types";
import { TYPE_GRID } from "../../../../components/SlateEditor/plugins/grid/types";
import { TYPE_H5P } from "../../../../components/SlateEditor/plugins/h5p/types";
import { TYPE_IMAGE } from "../../../../components/SlateEditor/plugins/image/types";
import { TYPE_KEY_FIGURE } from "../../../../components/SlateEditor/plugins/keyFigure/types";
import { TYPE_LINK_BLOCK_LIST } from "../../../../components/SlateEditor/plugins/linkBlockList/types";
import { TYPE_PITCH } from "../../../../components/SlateEditor/plugins/pitch/types";
import { TYPE_TABLE } from "../../../../components/SlateEditor/plugins/table/types";
import {
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../../../components/SlateEditor/plugins/toolbar/toolbarState";
import { TYPE_DISCLAIMER } from "../../../../components/SlateEditor/plugins/uuDisclaimer/types";
import { TYPE_EMBED_BRIGHTCOVE } from "../../../../components/SlateEditor/plugins/video/types";
import RichTextEditor from "../../../../components/SlateEditor/RichTextEditor";
import { DRAFT_HTML_SCOPE } from "../../../../constants";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { toCreateFrontPageArticle, toEditMarkup } from "../../../../util/routeHelpers";
import { IngressField, TitleField, SlugField } from "../../../FormikForm";
import { FrontpageArticleFormType } from "../../../FormikForm/articleFormHooks";
import { useSession } from "../../../Session/SessionProvider";

const StyledDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const StyledContentDiv = styled(FormikField)`
  position: static;
`;

const visualElements = [TYPE_H5P, TYPE_EMBED_BRIGHTCOVE, TYPE_AUDIO, TYPE_EXTERNAL, TYPE_IMAGE];

const actions = [
  TYPE_TABLE,
  TYPE_CODEBLOCK,
  TYPE_FILE,
  TYPE_CONTACT_BLOCK,
  TYPE_GRID,
  TYPE_KEY_FIGURE,
  TYPE_CAMPAIGN_BLOCK,
  TYPE_LINK_BLOCK_LIST,
  TYPE_DISCLAIMER,
  TYPE_COMMENT_BLOCK,
].concat(visualElements);

const actionsToShowInAreas = {
  "table-cell": [TYPE_IMAGE],
  section: actions,
  "grid-cell": [TYPE_IMAGE, TYPE_KEY_FIGURE, TYPE_PITCH],
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

  const { dirty, initialValues, values } = useFormikContext<FrontpageArticleFormType>();
  const { slug, id, creators, language } = values;

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
  const isCreatePage = toCreateFrontPageArticle() === window.location.pathname;

  useEffect(() => {
    setTimeout(() => {
      if (!isTouched) {
        setIsNormalizedOnLoad(isFormikDirty);
        setIsTouched(true);
      }
    }, 100);
  }, [isFormikDirty, isTouched]);

  const [editSlug, setEditSlug] = useState(false);

  return (
    <>
      {editSlug && slug !== undefined ? <SlugField /> : <TitleField />}
      <StyledDiv>
        <FormField name="published">
          {({ field, helpers }) => (
            <LastUpdatedLine creators={creators} published={field.value} allowEdit={true} onChange={helpers.setValue} />
          )}
        </FormField>
        {slug && (
          <IconButton
            aria-label={t("form.slug.edit")}
            title={t("form.slug.edit")}
            variant={editSlug ? "secondary" : "clear"}
            onClick={() => setEditSlug(!editSlug)}
          >
            <Link />
          </IconButton>
        )}
      </StyledDiv>
      <IngressField />
      <AlertDialog
        title={t("editorFooter.changeHeader")}
        label={t("editorFooter.changeHeader")}
        show={isNormalizedOnLoad && !isCreatePage}
        text={t("form.content.normalizedOnLoad")}
        onCancel={() => setIsNormalizedOnLoad(false)}
        severity="warning"
      >
        <FormActionsContainer>
          <Button variant="secondary" onClick={() => setIsNormalizedOnLoad(false)}>
            {t("alertModal.continue")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
      <StyledContentDiv name="content" label={t("form.content.label")} noBorder>
        {({ field: { value, name, onChange }, form: { isSubmitting } }) => (
          <ContentTypeProvider value="subject-material">
            <FieldHeader title={t("form.content.label")}>
              {id && userPermissions?.includes(DRAFT_HTML_SCOPE) && (
                <EditMarkupLink to={toEditMarkup(id, language ?? "")} title={t("editMarkup.linkTitle")} />
              )}
            </FieldHeader>
            <RichTextEditor
              language={articleLanguage}
              actions={frontpageActions}
              toolbarOptions={toolbarOptions}
              toolbarAreaFilters={toolbarAreaFilters}
              blockpickerOptions={{
                actionsToShowInAreas,
              }}
              placeholder={t("form.content.placeholder")}
              value={value}
              submitted={isSubmitting}
              plugins={editorPlugins}
              data-testid="frontpage-article-content"
              onChange={(value) => {
                onChange({
                  target: {
                    value,
                    name,
                  },
                });
              }}
            />
          </ContentTypeProvider>
        )}
      </StyledContentDiv>
    </>
  );
};

export default FrontpageArticleFormContent;
