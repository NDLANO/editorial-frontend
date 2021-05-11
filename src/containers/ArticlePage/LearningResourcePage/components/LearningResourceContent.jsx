/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState } from 'react';
import { ReactEditor } from 'new-slate-react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { compose } from 'redux';
import { connect as reduxConnect } from 'react-redux';
import { connect as formikConnect } from 'formik';
import { FieldHeader } from '@ndla/forms';
import Tooltip from '@ndla/tooltip';
import { Eye } from '@ndla/icons/editor';
import { getLocale } from '../../../../modules/locale/locale';
import FormikField, { classes as formikFieldClasses } from '../../../../components/FormikField';
import RichBlockTextEditor from '../../../../components/SlateEditor/RichBlockTextEditor';
import LearningResourceFootnotes from './LearningResourceFootnotes';
import LastUpdatedLine from '../../../../components/LastUpdatedLine';
import ToggleButton from '../../../../components/ToggleButton';
import HowToHelper from '../../../../components/HowTo/HowToHelper';
import { findNodesByType } from '../../../../util/slateHelpers';
import codeBlockPlugin from '../../../../components/SlateEditor/plugins/codeBlock';
import footnotePlugin from '../../../../components/SlateEditor/plugins/footnote';
import createEmbedPlugin from '../../../../components/SlateEditor/plugins/embed';
import createBodyBoxPlugin from '../../../../components/SlateEditor/plugins/bodybox';
import createAsidePlugin from '../../../../components/SlateEditor/plugins/aside';
import createDetailsPlugin from '../../../../components/SlateEditor/plugins/details';
import { linkPlugin } from '../../../../components/SlateEditor/plugins/link';
import listTextPlugin from '../../../../components/SlateEditor/plugins/listText';
import { headingPlugin } from '../../../../components/SlateEditor/plugins/heading';
import blockPickerPlugin from '../../../../components/SlateEditor/plugins/blockPicker';
import relatedPlugin from '../../../../components/SlateEditor/plugins/related';
import filePlugin from '../../../../components/SlateEditor/plugins/file';
import conceptPlugin from '../../../../components/SlateEditor/plugins/concept';
import { blockQuotePlugin } from '../../../../components/SlateEditor/plugins/blockquote';
import { paragraphPlugin } from '../../../../components/SlateEditor/plugins/paragraph';
import mathmlPlugin from '../../../../components/SlateEditor/plugins/mathml';
import dndPlugin from '../../../../components/SlateEditor/plugins/DND';
import pasteHandler from '../../../../components/SlateEditor/plugins/pastehandler';
import { textTransformPlugin } from '../../../../components/SlateEditor/plugins/textTransform';
import { TYPE as footnoteType } from '../../../../components/SlateEditor/plugins/footnote';

import {
  editListPlugin,
  editTablePlugin,
} from '../../../../components/SlateEditor/plugins/externalPlugins';
import createTablePlugin from '../../../../components/SlateEditor/plugins/table';
import { EditMarkupLink } from '../../../../components/EditMarkupLink';
import { IngressField, TitleField } from '../../../FormikForm';
import { ArticleShape } from '../../../../shapes';
import { DRAFT_HTML_SCOPE } from '../../../../constants';
import { toEditMarkup } from '../../../../util/routeHelpers';
import { toolbarPlugin } from '../../../../components/SlateEditor/plugins/toolbar';
import saveHotkeyPlugin from '../../../../components/SlateEditor/plugins/saveHotkey';
import { sectionPlugin } from '../../../../components/SlateEditor/plugins/section';
import { breakPlugin } from '../../../../components/SlateEditor/plugins/break';
import { markPlugin } from '../../../../components/SlateEditor/plugins/mark';

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

// TODO: Rewrite to new slate
const findFootnotes = content =>
  content
    .reduce((all, value) => [...all, ...findNodesByType(value.document, footnoteType)], [])
    .filter(footnote => footnote.data.size > 0)
    .map(footnoteNode => footnoteNode.data.toJS());

// TODO: Rewrite to new slate
const actions = ['table', 'embed', 'code-block', 'file', 'h5p'];
// TODO: Rewrite to new slate
const actionsToShowInAreas = {
  details: actions,
  aside: actions,
  bodybox: actions,
  summary: actions,
};

const LearningResourceContent = ({
  article: { language: articleLanguage },
  t,
  userAccess,
  formik: {
    setFieldValue,
    handleBlur,
    values: { id, language, creators, published },
  },
  handleSubmit,
}) => {
  const handleSubmitRef = React.useRef(handleSubmit);

  const [preview, setPreview] = useState(false);
  // TODO: Implement all plugins
  // Plugins are checked from last to first
  const plugins = [
    sectionPlugin,
    paragraphPlugin,
    // footnotePlugin(),
    // createEmbedPlugin(articleLanguage, props.locale),
    // createBodyBoxPlugin(),
    // createAsidePlugin(),
    // createDetailsPlugin(),
    blockQuotePlugin,
    linkPlugin(articleLanguage),
    // conceptPlugin(articleLanguage),
    headingPlugin,
    // // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
    // // Blockquote and editList actions need to be triggered before paragraph action, else
    // // unwrapping (jumping out of block) will not work.
    // editListPlugin,
    // listTextPlugin(),
    // createTablePlugin(),
    // editTablePlugin,
    // relatedPlugin(),
    // filePlugin(),
    // mathmlPlugin(),
    // codeBlockPlugin(),
    // blockPickerPlugin({
    //   articleLanguage,
    //   actionsToShowInAreas,
    // }),
    // dndPlugin,
    // pasteHandler(),
    toolbarPlugin,
    textTransformPlugin,
    breakPlugin,
    saveHotkeyPlugin(() => handleSubmitRef.current()),
    markPlugin,
  ];

  React.useEffect(() => {
    handleSubmitRef.current = handleSubmit;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSubmit]);

  // Todo: Rewrite the following plugins. For language support, consider using React.useRef().
  // componentDidUpdate({ article: { id: prevId, language: prevArticleLanguage } }) {
  //   const {
  //     article: { id, language: articleLanguage },
  //   } = this.props;
  //   if (prevArticleLanguage !== articleLanguage || prevId !== id) {
  //     this.plugins = [
  //       createEmbedPlugin(articleLanguage),
  //       conceptPlugin(articleLanguage),
  //       blockPickerPlugin({
  //         articleLanguage,
  //         actionsToShowInAreas,
  //         ...this.plugins,
  //       }),
  //     ];
  //   }
  // }

  return (
    <Fragment>
      <TitleField
        handleSubmit={handleSubmit}
        onBlur={(event, editor) => {
          // Forcing slate field to be deselected before selecting new field.
          // Fixes a problem where slate field is not properly focused on click.
          ReactEditor.deselect(editor);

          // TODO: Can possibly be removed
          // this is a hack since formik onBlur-handler interferes with slates
          // related to: https://github.com/ianstormtaylor/slate/issues/2434
          // formik handleBlur needs to be called for validation to work (and touched to be set)
          setTimeout(() => handleBlur({ target: { name: 'slateTitle' } }), 0);
        }}
      />
      <FormikField name="published" css={byLineStyle}>
        {({ field, form }) => (
          <>
            <LastUpdatedLine
              name={field.name}
              creators={creators}
              published={published}
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
      <IngressField
        preview={preview}
        handleSubmit={handleSubmit}
        onBlur={(event, editor) => {
          // Forcing slate field to be deselected before selecting new field.
          // Fixes a problem where slate field is not properly focused on click.
          ReactEditor.deselect(editor);

          // TODO: Can possibly be removed
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
        {({ field: { value, name, onChange }, form: { isSubmitting } }) => (
          <Fragment>
            <FieldHeader title={t('form.content.label')}>
              {id && userAccess && userAccess.includes(DRAFT_HTML_SCOPE) && (
                <EditMarkupLink to={toEditMarkup(id, language)} title={t('editMarkup.linkTitle')} />
              )}
            </FieldHeader>
            <RichBlockTextEditor
              submitted={isSubmitting}
              placeholder={t('form.content.placeholder')}
              data-cy="learning-resource-content"
              plugins={plugins}
              setFieldValue={setFieldValue}
              value={value}
              name={name}
              onChange={onChange}
              onBlur={(event, editor) => {
                // TODO: Can possibly be removed
                // this is a hack since formik onBlur-handler interferes with slates
                // related to: https://github.com/ianstormtaylor/slate/issues/2434
                // formik handleBlur needs to be called for validation to work (and touched to be set)
                setTimeout(() => handleBlur({ target: { name: 'content' } }), 0);
              }}
              handleSubmit={handleSubmit}
            />
            {/* TODO: Rewrite to new slate */}
            {/* <LearningResourceFootnotes footnotes={findFootnotes(value)} /> */}
          </Fragment>
        )}
      </FormikField>
    </Fragment>
  );
};

LearningResourceContent.propTypes = {
  locale: PropTypes.string.isRequired,
  userAccess: PropTypes.string,
  formik: PropTypes.shape({
    validateField: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    values: PropTypes.shape({
      id: PropTypes.number,
      published: PropTypes.string,
      title: PropTypes.string,
      updatePublished: PropTypes.bool,
      content: PropTypes.array,
      language: PropTypes.string,
      creators: PropTypes.array,
    }),
    initialValues: PropTypes.shape({
      id: PropTypes.number,
      published: PropTypes.string,
      title: PropTypes.string,
      updatePublished: PropTypes.bool,
    }),
    setFieldValue: PropTypes.func.isRequired,
  }),
  article: ArticleShape,
  handleSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default compose(
  injectT,
  reduxConnect(mapStateToProps),
  formikConnect,
)(LearningResourceContent);
