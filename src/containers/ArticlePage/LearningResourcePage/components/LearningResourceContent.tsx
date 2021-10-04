/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, RefObject, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { FormikContextType } from 'formik';
import { FieldHeader } from '@ndla/forms';
import Tooltip from '@ndla/tooltip';
import { Eye } from '@ndla/icons/editor';
import FormikField, { classes as formikFieldClasses } from '../../../../components/FormikField';
import RichBlockTextEditor from '../../../../components/SlateEditor/RichBlockTextEditor';
import LearningResourceFootnotes, { FootnoteType } from './LearningResourceFootnotes';
import LastUpdatedLine from '../../../../components/LastUpdatedLine/LastUpdatedLine';
import ToggleButton from '../../../../components/ToggleButton';
import HowToHelper from '../../../../components/HowTo/HowToHelper';
import { findNodesByType } from '../../../../util/slateHelpers';
import { codeblockPlugin } from '../../../../components/SlateEditor/plugins/codeBlock';
import {
  FootnoteElement,
  footnotePlugin,
  TYPE_FOOTNOTE,
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
import { conceptPlugin } from '../../../../components/SlateEditor/plugins/concept';
import { blockQuotePlugin } from '../../../../components/SlateEditor/plugins/blockquote';
import { paragraphPlugin } from '../../../../components/SlateEditor/plugins/paragraph';
import { mathmlPlugin } from '../../../../components/SlateEditor/plugins/mathml';
// import pasteHandler from '../../../../components/SlateEditor/plugins/pastehandler';
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
import { ConvertedDraftType, LocaleType } from '../../../../interfaces';
import { LearningResourceFormikType } from '../../../FormikForm/articleFormHooks';

const byLineStyle = css`
  display: flex;
  margin-top: 0;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 64px;
`;

const findFootnotes = (content: Descendant[][]): FootnoteType[] =>
  content
    .reduce((acc, descendant) => [...acc, ...findNodesByType(descendant, TYPE_FOOTNOTE)], [])
    .map(e => e as FootnoteElement)
    .filter(footnote => Object.keys(footnote.data).length > 0)
    .map(footnoteElement => footnoteElement.data);

const actions = ['table', 'embed', 'code-block', 'file', 'h5p'];
const actionsToShowInAreas = {
  details: actions,
  aside: actions,
  bodybox: actions,
  summary: actions,
  list: actions,
  'list-item': actions,
};

// Plugins are checked from last to first
export const plugins = (
  articleLanguage: string,
  locale: LocaleType,
  handleSubmitRef: RefObject<() => void>,
) => {
  return [
    sectionPlugin,
    divPlugin,
    paragraphPlugin,
    footnotePlugin,
    embedPlugin(articleLanguage, locale),
    bodyboxPlugin,
    asidePlugin,
    detailsPlugin,
    blockQuotePlugin,
    linkPlugin(articleLanguage),
    conceptPlugin(articleLanguage),
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
    // pasteHandler(),
    toolbarPlugin,
    textTransformPlugin,
    breakPlugin,
    saveHotkeyPlugin(() => handleSubmitRef.current && handleSubmitRef.current()),
    markPlugin,
    listPlugin,
  ];
};
type Props = {
  locale: LocaleType;
  article: Partial<ConvertedDraftType>;
  userAccess?: string;
  handleBlur: (evt: { target: { name: string } }) => void;
  values: LearningResourceFormikType;
  handleSubmit: () => Promise<void>;
} & WithTranslation & { formik: FormikContextType<LearningResourceFormikType> };

const LearningResourceContent = ({
  article: { language: articleLanguage },
  t,
  userAccess,
  values: { id, language, creators, published },
  handleSubmit,
  locale,
}: Props) => {
  const handleSubmitRef = React.useRef(handleSubmit);

  const [preview, setPreview] = useState(false);

  React.useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  return (
    <Fragment>
      <TitleField handleSubmit={handleSubmit} />
      <FormikField name="published" css={byLineStyle}>
        {({ field, form }) => (
          <>
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
              <Tooltip tooltip={t('form.markdown.button')}>
                <ToggleButton active={preview} onClick={() => setPreview(!preview)}>
                  <Eye />
                </ToggleButton>
              </Tooltip>
              <HowToHelper pageId="Markdown" tooltip={t('form.markdown.helpLabel')} />
            </IconContainer>
          </>
        )}
      </FormikField>
      <IngressField preview={preview} handleSubmit={handleSubmit} />
      <FormikField
        name="content"
        label={t('form.content.label')}
        noBorder
        className={formikFieldClasses('', 'position-static').className}>
        {({ field: { value, name, onChange }, form: { isSubmitting, setFieldValue } }) => (
          <Fragment>
            <FieldHeader title={t('form.content.label')}>
              {id && userAccess && userAccess.includes(DRAFT_HTML_SCOPE) && (
                <EditMarkupLink
                  to={toEditMarkup(id, language ?? '')}
                  title={t('editMarkup.linkTitle')}
                />
              )}
            </FieldHeader>
            <RichBlockTextEditor
              submitted={isSubmitting}
              placeholder={t('form.content.placeholder')}
              data-cy="learning-resource-content"
              plugins={plugins(articleLanguage ?? '', locale, handleSubmitRef)}
              setFieldValue={setFieldValue}
              value={value}
              name={name}
              onChange={onChange}
              language={articleLanguage}
              actionsToShowInAreas={actionsToShowInAreas}
            />
            <LearningResourceFootnotes footnotes={findFootnotes(value)} />
          </Fragment>
        )}
      </FormikField>
    </Fragment>
  );
};

export default withTranslation()(LearningResourceContent);
