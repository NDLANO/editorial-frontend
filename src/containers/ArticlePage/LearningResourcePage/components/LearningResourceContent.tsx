/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useMemo, useCallback, memo } from 'react';
import { Descendant } from 'slate';
import { useTranslation } from 'react-i18next';
import { FieldProps, useField, useFormikContext } from 'formik';
import styled from '@emotion/styled';
import { FieldHeader } from '@ndla/forms';
import { Eye } from '@ndla/icons/editor';
import { IconButtonV2 } from '@ndla/button';
import { colors } from '@ndla/core';
import { IAuthor } from '@ndla/types-backend/draft-api';
import FormikField from '../../../../components/FormikField';
import LearningResourceFootnotes, { FootnoteType } from './LearningResourceFootnotes';
import LastUpdatedLine from '../../../../components/LastUpdatedLine/LastUpdatedLine';
import HowToHelper from '../../../../components/HowTo/HowToHelper';
import { findNodesByType } from '../../../../util/slateHelpers';
import { codeblockPlugin } from '../../../../components/SlateEditor/plugins/codeBlock';
import {
  FootnoteElement,
  footnotePlugin,
} from '../../../../components/SlateEditor/plugins/footnote';
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
import { IngressField, TitleField } from '../../../FormikForm';
import { DRAFT_HTML_SCOPE } from '../../../../constants';
import { toEditMarkup } from '../../../../util/routeHelpers';
import { toolbarPlugin } from '../../../../components/SlateEditor/plugins/toolbar';
import saveHotkeyPlugin from '../../../../components/SlateEditor/plugins/saveHotkey';
import { sectionPlugin } from '../../../../components/SlateEditor/plugins/section';
import { breakPlugin } from '../../../../components/SlateEditor/plugins/break';
import { markPlugin } from '../../../../components/SlateEditor/plugins/mark';
import { listPlugin } from '../../../../components/SlateEditor/plugins/list';
import { divPlugin } from '../../../../components/SlateEditor/plugins/div';
import { dndPlugin } from '../../../../components/SlateEditor/plugins/DND';
import { SlatePlugin } from '../../../../components/SlateEditor/interfaces';
import { useSession } from '../../../Session/SessionProvider';
import RichTextEditor from '../../../../components/SlateEditor/RichTextEditor';
import { spanPlugin } from '../../../../components/SlateEditor/plugins/span';
import { TYPE_FOOTNOTE } from '../../../../components/SlateEditor/plugins/footnote/types';
import { conceptListPlugin } from '../../../../components/SlateEditor/plugins/conceptList';
import { inlineConceptPlugin } from '../../../../components/SlateEditor/plugins/concept/inline';
import { blockConceptPlugin } from '../../../../components/SlateEditor/plugins/concept/block';
import { definitionListPlugin } from '../../../../components/SlateEditor/plugins/definitionList';
import { gridPlugin } from '../../../../components/SlateEditor/plugins/grid';
import {
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_H5P,
  TYPE_EMBED_IMAGE,
} from '../../../../components/SlateEditor/plugins/embed/types';
import { TYPE_TABLE } from '../../../../components/SlateEditor/plugins/table/types';
import { TYPE_CODEBLOCK } from '../../../../components/SlateEditor/plugins/codeBlock/types';
import { TYPE_FILE } from '../../../../components/SlateEditor/plugins/file/types';
import { TYPE_GRID } from '../../../../components/SlateEditor/plugins/grid/types';
import { HandleSubmitFunc, LearningResourceFormType } from '../../../FormikForm/articleFormHooks';
import { audioPlugin } from '../../../../components/SlateEditor/plugins/audio';
import { TYPE_AUDIO } from '../../../../components/SlateEditor/plugins/audio/types';

const StyledFormikField = styled(FormikField)`
  display: flex;
  margin-top: 0;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 64px;
`;

const StyledDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const StyledContentDiv = styled(FormikField)`
  position: static;
`;

const MarkdownButton = styled(IconButtonV2)<{ active: boolean }>`
  color: ${(p) => (p.active ? colors.brand.primary : colors.brand.light)};
`;

const findFootnotes = (content: Descendant[]): FootnoteType[] =>
  findNodesByType(content, TYPE_FOOTNOTE)
    .map((e) => e as FootnoteElement)
    .filter((footnote) => Object.keys(footnote.data).length > 0)
    .map((footnoteElement) => footnoteElement.data);

const visualElements = [
  TYPE_EMBED_H5P,
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_AUDIO,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_IMAGE,
];

const actions = [TYPE_TABLE, TYPE_CODEBLOCK, TYPE_FILE, TYPE_GRID].concat(visualElements);
const actionsToShowInAreas = {
  details: actions,
  aside: actions,
  bodybox: actions,
  'table-cell': [TYPE_EMBED_IMAGE],
  'grid-cell': [TYPE_EMBED_IMAGE],
};

// Plugins are checked from last to first
export const plugins = (articleLanguage: string): SlatePlugin[] => {
  return [
    sectionPlugin,
    spanPlugin,
    divPlugin,
    paragraphPlugin(articleLanguage),
    footnotePlugin,
    audioPlugin(articleLanguage),
    embedPlugin(articleLanguage),
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
    codeblockPlugin,
    blockPickerPlugin,
    dndPlugin,
    // pasteHandler(),
    toolbarPlugin,
    textTransformPlugin,
    breakPlugin,
    saveHotkeyPlugin,
    markPlugin,
    definitionListPlugin,
    listPlugin,
    gridPlugin,
  ];
};
interface Props {
  articleLanguage: string;
  articleId?: number;
  handleSubmit: HandleSubmitFunc<LearningResourceFormType>;
}

const LearningResourceContent = ({
  articleLanguage,
  articleId,
  handleSubmit: _handleSubmit,
}: Props) => {
  const { t } = useTranslation();

  const [creatorsField] = useField<IAuthor[]>('creators');

  const [preview, setPreview] = useState(false);

  return (
    <>
      <TitleField />
      <StyledFormikField name="published">
        {({ field, form }) => (
          <StyledDiv>
            <LastUpdatedLine
              creators={creatorsField.value}
              published={field.value}
              allowEdit={true}
              onChange={(date) => {
                form.setFieldValue(field.name, date);
              }}
            />
            <IconContainer>
              <MarkdownButton
                aria-label={t('form.markdown.button')}
                title={t('form.markdown.button')}
                variant="stripped"
                colorTheme="light"
                active={preview}
                onClick={() => setPreview(!preview)}
              >
                <Eye />
              </MarkdownButton>
              <HowToHelper pageId="Markdown" tooltip={t('form.markdown.helpLabel')} />
            </IconContainer>
          </StyledDiv>
        )}
      </StyledFormikField>
      <IngressField preview={preview} />
      <StyledContentDiv name="content" label={t('form.content.label')} noBorder>
        {(fieldProps) => (
          <ContentField articleLanguage={articleLanguage} articleId={articleId} {...fieldProps} />
        )}
      </StyledContentDiv>
    </>
  );
};

interface ContentFieldProps extends FieldProps<Descendant[]> {
  articleId?: number;
  articleLanguage: string;
  handleSubmit: () => void;
}

const ContentField = ({
  articleId,
  field: { name, onChange, value },
  articleLanguage,
}: ContentFieldProps) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { isSubmitting } = useFormikContext<LearningResourceFormType>();

  const blockPickerOptions = useMemo(() => ({ actionsToShowInAreas }), []);

  const onSlateChange = useCallback(
    (val: Descendant[]) => {
      onChange({
        target: {
          value: val,
          name,
        },
      });
    },
    [onChange, name],
  );

  const editorPlugins = useMemo(() => plugins(articleLanguage ?? ''), [articleLanguage]);

  return (
    <>
      <FieldHeader title={t('form.content.label')}>
        {articleId && userPermissions?.includes(DRAFT_HTML_SCOPE) && (
          <EditMarkupLink
            to={toEditMarkup(articleId, articleLanguage ?? '')}
            title={t('editMarkup.linkTitle')}
          />
        )}
      </FieldHeader>
      <RichTextEditor
        language={articleLanguage}
        blockpickerOptions={blockPickerOptions}
        placeholder={t('form.content.placeholder')}
        value={value}
        submitted={isSubmitting}
        plugins={editorPlugins}
        data-testid="learning-resource-content"
        onChange={onSlateChange}
      />
      {!isSubmitting && <LearningResourceFootnotes footnotes={findFootnotes(value)} />}
    </>
  );
};

export default memo(LearningResourceContent);
