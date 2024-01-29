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
import { IconButtonV2 } from "@ndla/button";
import { colors } from "@ndla/core";
import { FieldHeader } from "@ndla/forms";
import { Eye, Link } from "@ndla/icons/editor";
import Tooltip from "@ndla/tooltip";
import { frontpagePlugins } from "./frontpagePlugins";
import { frontpageRenderers } from "./frontpageRenderers";
import AlertModal from "../../../../components/AlertModal";
import { EditMarkupLink } from "../../../../components/EditMarkupLink";
import FormikField from "../../../../components/FormikField";
import HowToHelper from "../../../../components/HowTo/HowToHelper";
import LastUpdatedLine from "../../../../components/LastUpdatedLine/LastUpdatedLine";
import { TYPE_AUDIO } from "../../../../components/SlateEditor/plugins/audio/types";
import { frontpageActions } from "../../../../components/SlateEditor/plugins/blockPicker/actions";
import { TYPE_BLOGPOST } from "../../../../components/SlateEditor/plugins/blogPost/types";
import { TYPE_CAMPAIGN_BLOCK } from "../../../../components/SlateEditor/plugins/campaignBlock/types";
import { TYPE_CODEBLOCK } from "../../../../components/SlateEditor/plugins/codeBlock/types";
import { TYPE_CONTACT_BLOCK } from "../../../../components/SlateEditor/plugins/contactBlock/types";
import {
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_IMAGE,
} from "../../../../components/SlateEditor/plugins/embed/types";
import { TYPE_FILE } from "../../../../components/SlateEditor/plugins/file/types";
import { TYPE_GRID } from "../../../../components/SlateEditor/plugins/grid/types";
import { TYPE_H5P } from "../../../../components/SlateEditor/plugins/h5p/types";
import { TYPE_KEY_FIGURE } from "../../../../components/SlateEditor/plugins/keyFigure/types";
import { TYPE_LINK_BLOCK_LIST } from "../../../../components/SlateEditor/plugins/linkBlockList/types";
import { TYPE_TABLE } from "../../../../components/SlateEditor/plugins/table/types";
import {
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../../../components/SlateEditor/plugins/toolbar/toolbarState";
import RichTextEditor from "../../../../components/SlateEditor/RichTextEditor";
import { useWideArticle } from "../../../../components/WideArticleEditorProvider";
import { DRAFT_HTML_SCOPE } from "../../../../constants";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { toCreateFrontPageArticle, toEditMarkup } from "../../../../util/routeHelpers";
import { IngressField, TitleField, SlugField } from "../../../FormikForm";
import { FrontpageArticleFormType } from "../../../FormikForm/articleFormHooks";
import { useSession } from "../../../Session/SessionProvider";

const StyledFormikField = styled(FormikField)`
  display: flex;
  margin-top: 0;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const StyledContentDiv = styled(FormikField)`
  position: static;
`;

const StyledContentWrapper = styled.div`
  width: 100%;

  &[data-wide="true"] {
    max-width: 1100px;
  }

  max-width: 773px;
`;

const StyledIconButton = styled(IconButtonV2)`
  color: ${colors.brand.light};

  &[data-active="true"] {
    color: ${colors.brand.primary};
  }
`;

const visualElements = [TYPE_H5P, TYPE_EMBED_BRIGHTCOVE, TYPE_AUDIO, TYPE_EMBED_EXTERNAL, TYPE_EMBED_IMAGE];

const actions = [
  TYPE_TABLE,
  TYPE_CODEBLOCK,
  TYPE_FILE,
  TYPE_CONTACT_BLOCK,
  TYPE_GRID,
  TYPE_BLOGPOST,
  TYPE_KEY_FIGURE,
  TYPE_CAMPAIGN_BLOCK,
  TYPE_LINK_BLOCK_LIST,
].concat(visualElements);

const actionsToShowInAreas = {
  "table-cell": [TYPE_EMBED_IMAGE],
  section: actions,
  "grid-cell": [TYPE_EMBED_IMAGE, TYPE_KEY_FIGURE, TYPE_BLOGPOST],
};

const toolbarOptions = createToolbarDefaultValues();
const toolbarAreaFilters = createToolbarAreaOptions();

interface Props {
  articleLanguage: string;
  initialHTML: string;
}

const FrontpageArticleFormContent = ({ articleLanguage, initialHTML }: Props) => {
  const { userPermissions } = useSession();
  const { t } = useTranslation();
  const { isWideArticle } = useWideArticle();

  const editorPlugins = useMemo(
    () => frontpagePlugins.concat(frontpageRenderers(articleLanguage ?? "")),
    [articleLanguage],
  );

  const { dirty, initialValues, values } = useFormikContext<FrontpageArticleFormType>();
  const { slug, id, creators, published, language } = values;

  const isFormikDirty = useMemo(
    () =>
      isFormikFormDirty({
        values,
        initialValues,
        dirty,
        initialHTML,
      }),
    [values, initialValues, dirty, initialHTML],
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

  const [preview, setPreview] = useState(false);
  const [editSlug, setEditSlug] = useState(false);

  return (
    <StyledContentWrapper data-wide={isWideArticle}>
      {editSlug && slug !== undefined ? <SlugField /> : <TitleField />}
      <StyledFormikField name="published">
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
              {slug && (
                <Tooltip tooltip={t("form.slug.edit")}>
                  <StyledIconButton
                    aria-label={t("form.slug.edit")}
                    variant="stripped"
                    colorTheme="light"
                    data-active={editSlug}
                    onClick={() => setEditSlug(!editSlug)}
                  >
                    <Link />
                  </StyledIconButton>
                </Tooltip>
              )}
              <Tooltip tooltip={t("form.markdown.button")}>
                <StyledIconButton
                  aria-label={t("form.markdown.button")}
                  variant="stripped"
                  colorTheme="light"
                  data-active={preview}
                  onClick={() => setPreview(!preview)}
                >
                  <Eye />
                </StyledIconButton>
              </Tooltip>
              <HowToHelper pageId="Markdown" tooltip={t("form.markdown.helpLabel")} />
            </IconContainer>
          </StyledDiv>
        )}
      </StyledFormikField>
      <IngressField preview={preview} />
      <AlertModal
        title={t("editorFooter.changeHeader")}
        label={t("editorFooter.changeHeader")}
        show={isNormalizedOnLoad && !isCreatePage}
        text={t("form.content.normalizedOnLoad")}
        actions={[
          {
            text: t("alertModal.continue"),
            onClick: () => setIsNormalizedOnLoad(false),
          },
        ]}
        onCancel={() => setIsNormalizedOnLoad(false)}
        severity="warning"
      />
      <StyledContentDiv name="content" label={t("form.content.label")} noBorder>
        {({ field: { value, name, onChange }, form: { isSubmitting } }) => (
          <>
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
          </>
        )}
      </StyledContentDiv>
    </StyledContentWrapper>
  );
};

export default FrontpageArticleFormContent;
