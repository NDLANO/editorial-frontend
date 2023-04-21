/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useEffect, RefObject, useMemo, useState } from 'react';
import { FieldHeader } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
import { connect } from 'formik';
import styled from '@emotion/styled';
import Tooltip from '@ndla/tooltip';
import { Eye } from '@ndla/icons/editor';
import { IconButtonV2 } from '@ndla/button';
import { colors } from '@ndla/core';
import { headingPlugin } from '../../../../components/SlateEditor/plugins/heading';
import { noEmbedPlugin } from '../../../../components/SlateEditor/plugins/noEmbed';
import VisualElementField from '../../../FormikForm/components/VisualElementField';
import LastUpdatedLine from './../../../../components/LastUpdatedLine/LastUpdatedLine';
import HowToHelper from '../../../../components/HowTo/HowToHelper';

import { blockQuotePlugin } from '../../../../components/SlateEditor/plugins/blockquote';
import { listPlugin } from '../../../../components/SlateEditor/plugins/list';
import { inlineConceptPlugin } from '../../../../components/SlateEditor/plugins/concept/inline';
import { paragraphPlugin } from '../../../../components/SlateEditor/plugins/paragraph';
import { linkPlugin } from '../../../../components/SlateEditor/plugins/link';
import { mathmlPlugin } from '../../../../components/SlateEditor/plugins/mathml';
import FormikField from '../../../../components/FormikField';
import RichTextEditor from '../../../../components/SlateEditor/RichTextEditor';
import { EditMarkupLink } from '../../../../components/EditMarkupLink';
import { IngressField, TitleField } from '../../../FormikForm';
import { DRAFT_HTML_SCOPE } from '../../../../constants';
import { toEditMarkup } from '../../../../util/routeHelpers';
import { textTransformPlugin } from '../../../../components/SlateEditor/plugins/textTransform';
import { toolbarPlugin } from '../../../../components/SlateEditor/plugins/toolbar';
import saveHotkeyPlugin from '../../../../components/SlateEditor/plugins/saveHotkey';
import { markPlugin } from '../../../../components/SlateEditor/plugins/mark';
import { sectionPlugin } from '../../../../components/SlateEditor/plugins/section';
import { divPlugin } from '../../../../components/SlateEditor/plugins/div';
import { breakPlugin } from '../../../../components/SlateEditor/plugins/break';
import { TopicArticleFormType } from '../../../FormikForm/articleFormHooks';
import { dndPlugin } from '../../../../components/SlateEditor/plugins/DND';
import { SlatePlugin } from '../../../../components/SlateEditor/interfaces';
import { useSession } from '../../../Session/SessionProvider';
import { spanPlugin } from '../../../../components/SlateEditor/plugins/span';
import { blogPostPlugin } from '../../../../components/SlateEditor/plugins/blogPost';

const StyledByLineFormikField = styled(FormikField)`
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
  align-items: center;
  justify-content: space-between;
`;

const MarkdownButton = styled(IconButtonV2)<{ active: boolean }>`
  color: ${(p) => (p.active ? colors.brand.primary : colors.brand.light)};
`;

const createPlugins = (language: string, handleSubmitRef: RefObject<() => void>): SlatePlugin[] => {
  // Plugins are checked from last to first
  return [
    sectionPlugin,
    spanPlugin,
    divPlugin,
    paragraphPlugin(language),
    noEmbedPlugin,
    linkPlugin(language),
    headingPlugin,
    // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
    // Blockquote and editList actions need to be triggered before paragraph action, else
    // unwrapping (jumping out of block) will not work.
    blockQuotePlugin,
    listPlugin,
    inlineConceptPlugin(language),
    mathmlPlugin,
    markPlugin,
    dndPlugin,
    toolbarPlugin,
    textTransformPlugin,
    breakPlugin,
    saveHotkeyPlugin(() => handleSubmitRef.current && handleSubmitRef.current()),
  ];
};

interface Props {
  values: TopicArticleFormType;
  handleSubmit: () => Promise<void>;
}

const TopicArticleContent = (props: Props) => {
  const { t } = useTranslation();
  const {
    values: { id, language, creators, published },
    handleSubmit,
  } = props;
  const { userPermissions } = useSession();
  const [preview, setPreview] = useState(false);
  const handleSubmitRef = useRef(handleSubmit);
  const plugins = useMemo(() => {
    return createPlugins(language ?? '', handleSubmitRef);
  }, [language]);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  return (
    <>
      <TitleField handleSubmit={handleSubmit} />
      <StyledByLineFormikField name="published">
        {({ field, form }) => (
          <StyledDiv>
            <LastUpdatedLine
              name={field.name}
              creators={creators}
              published={published}
              allowEdit={true}
              onChange={(date) => {
                form.setFieldValue(field.name, date);
              }}
            />
            <IconContainer>
              <Tooltip tooltip={t('form.markdown.button')}>
                <MarkdownButton
                  aria-label={'form.markdown.button'}
                  variant="stripped"
                  colorTheme="light"
                  active={preview}
                  onClick={() => setPreview(!preview)}
                >
                  <Eye />
                </MarkdownButton>
              </Tooltip>
              <HowToHelper pageId="Markdown" tooltip={t('form.markdown.helpLabel')} />
            </IconContainer>
          </StyledDiv>
        )}
      </StyledByLineFormikField>
      <IngressField preview={preview} handleSubmit={handleSubmit} />
      <VisualElementField />
      <FormikField name="content" label={t('form.content.label')} noBorder>
        {({ field: { value, name, onChange }, form: { isSubmitting } }) => (
          <>
            <FieldHeader title={t('form.content.label')}>
              {id && userPermissions?.includes(DRAFT_HTML_SCOPE) && language && (
                <EditMarkupLink to={toEditMarkup(id, language)} title={t('editMarkup.linkTitle')} />
              )}
            </FieldHeader>
            <RichTextEditor
              language={language}
              placeholder={t('form.content.placeholder')}
              value={value}
              submitted={isSubmitting}
              plugins={plugins}
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
      </FormikField>
    </>
  );
};

export default connect(TopicArticleContent);
