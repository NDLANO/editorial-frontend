/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useEffect, RefObject, useState } from 'react';
import { withTranslation, CustomWithTranslation, useTranslation } from 'react-i18next';
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
import { LocaleType } from '../../../../interfaces';
import { FrontpageArticleFormType } from '../../../FormikForm/articleFormHooks';
import { dndPlugin } from '../../../../components/SlateEditor/plugins/DND';
import { SlatePlugin } from '../../../../components/SlateEditor/interfaces';
import { useSession } from '../../../Session/SessionProvider';
import withSession from '../../../Session/withSession';
import RichTextEditor from '../../../../components/SlateEditor/RichTextEditor';
import { spanPlugin } from '../../../../components/SlateEditor/plugins/span';
import { conceptListPlugin } from '../../../../components/SlateEditor/plugins/conceptList';
import { inlineConceptPlugin } from '../../../../components/SlateEditor/plugins/concept/inline';
import { blockConceptPlugin } from '../../../../components/SlateEditor/plugins/concept/block';

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
  color: ${p => (p.active ? colors.brand.primary : colors.brand.light)};
`;

const SlugButton = styled(IconButtonV2)<{ active: boolean }>`
  color: ${p => (p.active ? colors.brand.primary : colors.brand.light)};
`;

const actions = ['table', 'ndlaembed', 'code-block', 'file'];
const actionsToShowInAreas = {
  details: actions,
  aside: actions,
  bodybox: actions,
  summary: actions,
  list: actions,
  'list-item': actions,
  table: ['image'],
  paragraph: actions,
};

// Plugins are checked from last to first
export const plugins = (
  articleLanguage: string,
  locale: LocaleType,
  handleSubmitRef: RefObject<() => void>,
): SlatePlugin[] => {
  return [
    sectionPlugin,
    spanPlugin,
    divPlugin,
    paragraphPlugin(articleLanguage),
    footnotePlugin,
    embedPlugin(articleLanguage, locale),
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
    toolbarPlugin,
    textTransformPlugin,
    breakPlugin,
    saveHotkeyPlugin(() => handleSubmitRef.current && handleSubmitRef.current()),
    markPlugin,
    listPlugin,
  ];
};
type Props = {
  articleLanguage: string;
  handleBlur: (evt: { target: { name: string } }) => void;
  values: FrontpageArticleFormType;
  handleSubmit: () => Promise<void>;
} & {
  formik: FormikContextType<FrontpageArticleFormType>;
};

const FrontPageFormContent = ({
  articleLanguage,
  values: { id, language, creators, published, slug },
  handleSubmit,
}: Props) => {
  const handleSubmitRef = useRef(handleSubmit);
  const { userPermissions } = useSession();
  const { t, i18n } = useTranslation();

  const [preview, setPreview] = useState(false);
  const [editSlug, setEditSlug] = useState(false);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  return (
    <>
      {editSlug && slug !== undefined ? (
        <SlugField handleSubmit={handleSubmit} />
      ) : (
        <TitleField handleSubmit={handleSubmit} />
      )}
      <StyledFormikField name="published">
        {({ field, form }) => (
          <StyledDiv>
            <LastUpdatedLine
              name={field.name}
              creators={creators}
              published={published}
              allowEdit={true}
              onChange={date => {
                form.setFieldValue(field.name, date);
              }}
            />
            <IconContainer>
              {slug && (
                <Tooltip tooltip={t('form.slug.edit')}>
                  <SlugButton
                    aria-label={t('form.slug.edit')}
                    variant="stripped"
                    colorTheme="light"
                    active={editSlug}
                    onClick={() => setEditSlug(!editSlug)}>
                    <Link />
                  </SlugButton>
                </Tooltip>
              )}
              <Tooltip tooltip={t('form.markdown.button')}>
                <MarkdownButton
                  aria-label={t('form.markdown.button')}
                  variant="stripped"
                  colorTheme="light"
                  active={preview}
                  onClick={() => setPreview(!preview)}>
                  <Eye />
                </MarkdownButton>
              </Tooltip>
              <HowToHelper pageId="Markdown" tooltip={t('form.markdown.helpLabel')} />
            </IconContainer>
          </StyledDiv>
        )}
      </StyledFormikField>

      <IngressField preview={preview} handleSubmit={handleSubmit} />
      <StyledContentDiv name="content" label={t('form.content.label')} noBorder>
        {({ field: { value, name, onChange }, form: { isSubmitting, setFieldValue } }) => (
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
              blockpickerOptions={{
                actionsToShowInAreas,
              }}
              placeholder={t('form.content.placeholder')}
              value={value}
              submitted={isSubmitting}
              plugins={plugins(articleLanguage ?? '', i18n.language, handleSubmitRef)}
              data-cy="frontpage-article-content"
              onChange={value => {
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
    </>
  );
};

export default FrontPageFormContent;
