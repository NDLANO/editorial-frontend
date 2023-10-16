/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { FormikContextType } from 'formik';
import { FieldHeader } from '@ndla/forms';
import Tooltip from '@ndla/tooltip';
import { Eye, Link } from '@ndla/icons/editor';
import { IconButtonV2 } from '@ndla/button';
import { colors } from '@ndla/core';
import FormikField from '../../../../components/FormikField';
import LastUpdatedLine from '../../../../components/LastUpdatedLine/LastUpdatedLine';
import HowToHelper from '../../../../components/HowTo/HowToHelper';
import { codeblockPlugin } from '../../../../components/SlateEditor/plugins/codeBlock';
import { footnotePlugin } from '../../../../components/SlateEditor/plugins/footnote';
import { embedPlugin } from '../../../../components/SlateEditor/plugins/embed';
import { bodyboxPlugin } from '../../../../components/SlateEditor/plugins/bodybox';
import { asidePlugin } from '../../../../components/SlateEditor/plugins/aside';
import { detailsPlugin } from '../../../../components/SlateEditor/plugins/details';
import { linkPlugin } from '../../../../components/SlateEditor/plugins/link';
import { headingPlugin } from '../../../../components/SlateEditor/plugins/heading';
import { blockPickerPlugin } from '../../../../components/SlateEditor/plugins/blockPicker';
import { relatedPlugin } from '../../../../components/SlateEditor/plugins/related';
import { filePlugin } from '../../../../components/SlateEditor/plugins/file';
import { blockQuotePlugin } from '../../../../components/SlateEditor/plugins/blockquote';
import { paragraphPlugin } from '../../../../components/SlateEditor/plugins/paragraph';
import { mathmlPlugin } from '../../../../components/SlateEditor/plugins/mathml';
import { textTransformPlugin } from '../../../../components/SlateEditor/plugins/textTransform';
import { tablePlugin } from '../../../../components/SlateEditor/plugins/table';
import { EditMarkupLink } from '../../../../components/EditMarkupLink';
import { IngressField, TitleField, SlugField } from '../../../FormikForm';
import { DRAFT_HTML_SCOPE } from '../../../../constants';
import { toEditMarkup } from '../../../../util/routeHelpers';
import { toolbarPlugin } from '../../../../components/SlateEditor/plugins/toolbar';
import saveHotkeyPlugin from '../../../../components/SlateEditor/plugins/saveHotkey';
import { sectionPlugin } from '../../../../components/SlateEditor/plugins/section';
import { breakPlugin } from '../../../../components/SlateEditor/plugins/break';
import { markPlugin } from '../../../../components/SlateEditor/plugins/mark';
import { listPlugin } from '../../../../components/SlateEditor/plugins/list';
import { divPlugin } from '../../../../components/SlateEditor/plugins/div';
import { FrontpageArticleFormType } from '../../../FormikForm/articleFormHooks';
import { dndPlugin } from '../../../../components/SlateEditor/plugins/DND';
import { SlatePlugin } from '../../../../components/SlateEditor/interfaces';
import { useSession } from '../../../Session/SessionProvider';
import RichTextEditor from '../../../../components/SlateEditor/RichTextEditor';
import { spanPlugin } from '../../../../components/SlateEditor/plugins/span';
import { conceptListPlugin } from '../../../../components/SlateEditor/plugins/conceptList';
import { inlineConceptPlugin } from '../../../../components/SlateEditor/plugins/concept/inline';
import { blockConceptPlugin } from '../../../../components/SlateEditor/plugins/concept/block';
import { definitionListPlugin } from '../../../../components/SlateEditor/plugins/definitionList';
import { TYPE_TABLE } from '../../../../components/SlateEditor/plugins/table/types';
import { TYPE_CODEBLOCK } from '../../../../components/SlateEditor/plugins/codeBlock/types';
import {
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_IMAGE,
} from '../../../../components/SlateEditor/plugins/embed/types';
import { TYPE_FILE } from '../../../../components/SlateEditor/plugins/file/types';
import { contactBlockPlugin } from '../../../../components/SlateEditor/plugins/contactBlock';
import { TYPE_CONTACT_BLOCK } from '../../../../components/SlateEditor/plugins/contactBlock/types';
import { blogPostPlugin } from '../../../../components/SlateEditor/plugins/blogPost';
import { TYPE_BLOGPOST } from '../../../../components/SlateEditor/plugins/blogPost/types';
import { frontpageActions } from '../../../../components/SlateEditor/plugins/blockPicker/actions';
import { gridPlugin } from '../../../../components/SlateEditor/plugins/grid';
import { TYPE_GRID } from '../../../../components/SlateEditor/plugins/grid/types';
import { TYPE_KEY_FIGURE } from '../../../../components/SlateEditor/plugins/keyFigure/types';
import { keyFigurePlugin } from '../../../../components/SlateEditor/plugins/keyFigure';
import { campaignBlockPlugin } from '../../../../components/SlateEditor/plugins/campaignBlock';
import { TYPE_CAMPAIGN_BLOCK } from '../../../../components/SlateEditor/plugins/campaignBlock/types';
import { useWideArticle } from '../../../../components/WideArticleEditorProvider';
import { linkBlockListPlugin } from '../../../../components/SlateEditor/plugins/linkBlockList';
import { TYPE_LINK_BLOCK_LIST } from '../../../../components/SlateEditor/plugins/linkBlockList/types';
import { audioPlugin } from '../../../../components/SlateEditor/plugins/audio';
import { TYPE_AUDIO } from '../../../../components/SlateEditor/plugins/audio/types';
import { TYPE_H5P } from '../../../../components/SlateEditor/plugins/h5p/types';
import { h5pPlugin } from '../../../../components/SlateEditor/plugins/h5p';

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

  &[data-wide='true'] {
    max-width: 1100px;
  }

  max-width: 773px;
`;

const StyledIconButton = styled(IconButtonV2)`
  color: ${colors.brand.light};

  &[data-active='true'] {
    color: ${colors.brand.primary};
  }
`;

const visualElements = [
  TYPE_H5P,
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_AUDIO,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_IMAGE,
];

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
  'table-cell': [TYPE_EMBED_IMAGE],
  section: actions,
  'grid-cell': [TYPE_EMBED_IMAGE, TYPE_KEY_FIGURE, TYPE_BLOGPOST],
};

// Plugins are checked from last to first
export const plugins = (articleLanguage: string): SlatePlugin[] => {
  return [
    sectionPlugin,
    spanPlugin,
    divPlugin,
    paragraphPlugin(articleLanguage),
    footnotePlugin,
    embedPlugin(articleLanguage),
    audioPlugin(articleLanguage),
    h5pPlugin(articleLanguage),
    bodyboxPlugin,
    asidePlugin,
    detailsPlugin,
    blockQuotePlugin,
    linkPlugin(articleLanguage),
    conceptListPlugin(articleLanguage),
    inlineConceptPlugin(articleLanguage),
    blockConceptPlugin(articleLanguage),
    headingPlugin,
    // // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
    // // Blockquote and editList actions need to be triggered before paragraph action, else
    // // unwrapping (jumping out of block) will not work.
    tablePlugin,
    relatedPlugin,
    filePlugin,
    mathmlPlugin,
    contactBlockPlugin,
    codeblockPlugin,
    keyFigurePlugin,
    blockPickerPlugin,
    dndPlugin,
    toolbarPlugin,
    textTransformPlugin,
    breakPlugin,
    saveHotkeyPlugin,
    markPlugin,
    definitionListPlugin,
    listPlugin,
    gridPlugin,
    blogPostPlugin,
    campaignBlockPlugin,
    linkBlockListPlugin,
  ];
};
interface Props {
  articleLanguage: string;
  handleBlur: (evt: { target: { name: string } }) => void;
  values: FrontpageArticleFormType;
  formik: FormikContextType<FrontpageArticleFormType>;
}

const FrontpageArticleFormContent = ({
  articleLanguage,
  values: { id, language, creators, published, slug },
}: Props) => {
  const { userPermissions } = useSession();
  const { t } = useTranslation();
  const { isWideArticle } = useWideArticle();

  const [preview, setPreview] = useState(false);
  const [editSlug, setEditSlug] = useState(false);

  const editorPlugins = useMemo(() => plugins(articleLanguage ?? ''), [articleLanguage]);

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
                <Tooltip tooltip={t('form.slug.edit')}>
                  <StyledIconButton
                    aria-label={t('form.slug.edit')}
                    variant="stripped"
                    colorTheme="light"
                    data-active={editSlug}
                    onClick={() => setEditSlug(!editSlug)}
                  >
                    <Link />
                  </StyledIconButton>
                </Tooltip>
              )}
              <Tooltip tooltip={t('form.markdown.button')}>
                <StyledIconButton
                  aria-label={t('form.markdown.button')}
                  variant="stripped"
                  colorTheme="light"
                  data-active={preview}
                  onClick={() => setPreview(!preview)}
                >
                  <Eye />
                </StyledIconButton>
              </Tooltip>
              <HowToHelper pageId="Markdown" tooltip={t('form.markdown.helpLabel')} />
            </IconContainer>
          </StyledDiv>
        )}
      </StyledFormikField>

      <IngressField preview={preview} />
      <StyledContentDiv name="content" label={t('form.content.label')} noBorder>
        {({ field: { value, name, onChange }, form: { isSubmitting } }) => (
          <>
            <FieldHeader title={t('form.content.label')}>
              {id && userPermissions?.includes(DRAFT_HTML_SCOPE) && (
                <EditMarkupLink
                  to={toEditMarkup(id, language ?? '')}
                  title={t('editMarkup.linkTitle')}
                />
              )}
            </FieldHeader>
            <RichTextEditor
              language={articleLanguage}
              actions={frontpageActions}
              blockpickerOptions={{
                actionsToShowInAreas,
              }}
              placeholder={t('form.content.placeholder')}
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
