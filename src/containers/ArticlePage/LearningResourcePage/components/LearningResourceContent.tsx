/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { FormikContextType } from 'formik';
import { FieldHeader } from '@ndla/forms';
import Tooltip from '@ndla/tooltip';
import { Eye } from '@ndla/icons/editor';
import { Value, Plugin } from 'slate';
import FormikField, { classes as formikFieldClasses } from '../../../../components/FormikField';
import RichBlockTextEditor from '../../../../components/SlateEditor/RichBlockTextEditor';
import LearningResourceFootnotes, { FootnoteType } from './LearningResourceFootnotes';
import { schema } from '../../../../components/SlateEditor/editorSchema';
import LastUpdatedLine from '../../../../components/LastUpdatedLine/LastUpdatedLine';
import {
  renderBlock,
  renderMark,
  renderInline,
} from '../../../../components/SlateEditor/slateRendering';
import ToggleButton from '../../../../components/ToggleButton';
import HowToHelper from '../../../../components/HowTo/HowToHelper';
import { findNodesByType } from '../../../../util/slateHelpers';
import codeBlockPlugin from '../../../../components/SlateEditor/plugins/codeBlock';
import footnotePlugin from '../../../../components/SlateEditor/plugins/footnote';
import createEmbedPlugin from '../../../../components/SlateEditor/plugins/embed';
import createBodyBoxPlugin from '../../../../components/SlateEditor/plugins/bodybox';
import createAsidePlugin from '../../../../components/SlateEditor/plugins/aside';
import createDetailsPlugin from '../../../../components/SlateEditor/plugins/details';
import createLinkPlugin from '../../../../components/SlateEditor/plugins/link';
import listTextPlugin from '../../../../components/SlateEditor/plugins/listText';
import headingPlugin from '../../../../components/SlateEditor/plugins/heading';
import blockPickerPlugin from '../../../../components/SlateEditor/plugins/blockPicker';
import relatedPlugin from '../../../../components/SlateEditor/plugins/related';
import filePlugin from '../../../../components/SlateEditor/plugins/file';
import conceptPlugin from '../../../../components/SlateEditor/plugins/concept';
import blockquotePlugin from '../../../../components/SlateEditor/plugins/blockquotePlugin';
import paragraphPlugin from '../../../../components/SlateEditor/plugins/paragraph';
import mathmlPlugin from '../../../../components/SlateEditor/plugins/mathml';
import dndPlugin from '../../../../components/SlateEditor/plugins/DND';
import pasteHandler from '../../../../components/SlateEditor/plugins/pastehandler';
import textTransformPlugin from '../../../../components/SlateEditor/plugins/textTransform';
import { TYPE as footnoteType } from '../../../../components/SlateEditor/plugins/footnote';

import {
  editListPlugin,
  editTablePlugin,
} from '../../../../components/SlateEditor/plugins/externalPlugins';
import createTablePlugin from '../../../../components/SlateEditor/plugins/table';
import { EditMarkupLink } from '../../../../components/EditMarkupLink';
import { IngressField, TitleField } from '../../../FormikForm';
import { DRAFT_HTML_SCOPE } from '../../../../constants';
import { toEditMarkup } from '../../../../util/routeHelpers';
import toolbarPlugin from '../../../../components/SlateEditor/plugins/SlateToolbar';
import { ConvertedDraftType, LocaleType } from '../../../../interfaces';
import { ArticleFormikType } from '../../../FormikForm/articleFormHooks';

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

const findFootnotes = (content: Value[]): FootnoteType[] =>
  content
    .reduce((all: Value[], value) => [...all, ...findNodesByType(value.document, footnoteType)], [])
    .filter(footnote => footnote.data.size > 0)
    .map(footnoteNode => footnoteNode.data.toJS());

const actions = ['table', 'embed', 'code-block', 'file', 'h5p'];
const actionsToShowInAreas = {
  details: actions,
  aside: actions,
  bodybox: actions,
  summary: actions,
};

type Props = {
  locale: LocaleType;
  article: Partial<ConvertedDraftType>;
  userAccess?: string;
  handleBlur: (evt: { target: { name: string } }) => void;
  values: ArticleFormikType;
  handleSubmit: () => Promise<void>;
} & WithTranslation & { formik: FormikContextType<ArticleFormikType> };

interface State {
  preview: boolean;
}

class LearningResourceContent extends Component<Props, State> {
  plugins: Plugin[] = [];
  constructor(props: Props) {
    super(props);
    const {
      article: { language },
    } = props;
    this.state = {
      preview: false,
    };
    this.plugins = [
      footnotePlugin(),
      createEmbedPlugin(language ?? 'nb', props.locale),
      createBodyBoxPlugin(),
      createAsidePlugin(),
      createDetailsPlugin(),
      createLinkPlugin(language),
      conceptPlugin(language),
      headingPlugin(),
      // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
      // Blockquote and editList actions need to be triggered before paragraph action, else
      // unwrapping (jumping out of block) will not work.
      blockquotePlugin,
      editListPlugin,
      listTextPlugin(),
      paragraphPlugin(),
      createTablePlugin(),
      editTablePlugin,
      relatedPlugin(),
      filePlugin(),
      mathmlPlugin(),
      codeBlockPlugin(),
      blockPickerPlugin({
        articleLanguage: language,
        actionsToShowInAreas,
      }),
      dndPlugin,
      pasteHandler(),
      toolbarPlugin(),
      textTransformPlugin(),
    ];
  }

  componentDidUpdate(prevProps: Props) {
    const {
      article: { id: prevId, language: prevLanguage },
    } = prevProps;

    const {
      article: { id, language },
      locale,
    } = this.props;
    if (!language) return;

    if (prevLanguage !== language || prevId !== id) {
      this.plugins = [
        createEmbedPlugin(language, locale),
        conceptPlugin(language),
        blockPickerPlugin({
          articleLanguage: language,
          actionsToShowInAreas,
          ...this.plugins,
        }),
      ];
    }
  }

  render() {
    const {
      t,
      userAccess,
      handleBlur,
      values: { id, language, creators, published },
      handleSubmit,
    } = this.props;

    return (
      <Fragment>
        <TitleField
          handleSubmit={handleSubmit}
          onBlur={(event, editor, next) => {
            next();
            // this is a hack since formik onBlur-handler interferes with slates
            // related to: https://github.com/ianstormtaylor/slate/issues/2434
            // formik handleBlur needs to be called for validation to work (and touched to be set)
            setTimeout(() => handleBlur({ target: { name: 'slatetitle' } }), 0);
          }}
        />
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
                  <ToggleButton
                    active={this.state.preview}
                    onClick={() =>
                      this.setState(prevState => ({
                        preview: !prevState.preview,
                      }))
                    }>
                    <Eye />
                  </ToggleButton>
                </Tooltip>
                <HowToHelper pageId="Markdown" tooltip={t('form.markdown.helpLabel')} />
              </IconContainer>
            </>
          )}
        </FormikField>
        <IngressField
          preview={this.state.preview}
          handleSubmit={handleSubmit}
          onBlur={(event: Event, editor: unknown, next: () => void) => {
            next();
            // this is a hack since formik onBlur-handler interferes with slates
            // related to: https://github.com/ianstormtaylor/slate/issues/2434
            // formik handleBlur needs to be called for validation to work (and touched to be set)
            setTimeout(() => handleBlur({ target: { name: 'introduction' } }), 0);
          }}
        />
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
                schema={schema}
                renderBlock={renderBlock}
                renderInline={renderInline}
                submitted={isSubmitting}
                renderMark={renderMark}
                placeholder={t('form.content.placeholder')}
                data-cy="learning-resource-content"
                plugins={this.plugins}
                setFieldValue={setFieldValue}
                value={value}
                name={name}
                onChange={onChange}
                onBlur={(event: Event, editor: unknown, next: () => void) => {
                  next();
                  // this is a hack since formik onBlur-handler interferes with slates
                  // related to: https://github.com/ianstormtaylor/slate/issues/2434
                  // formik handleBlur needs to be called for validation to work (and touched to be set)
                  setTimeout(() => handleBlur({ target: { name: 'content' } }), 0);
                }}
                handleSubmit={handleSubmit}
              />
              <LearningResourceFootnotes footnotes={findFootnotes(value)} />
            </Fragment>
          )}
        </FormikField>
      </Fragment>
    );
  }
}

export default withTranslation()(LearningResourceContent);
