/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
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
import { getLocale } from '../../../modules/locale/locale';
import FormikField, {
  classes as formikFieldClasses,
} from '../../../components/FormikField';
import RichBlockTextEditor from '../../../components/SlateEditor/RichBlockTextEditor';
import LearningResourceFootnotes from './LearningResourceFootnotes';
import { schema } from '../../../components/SlateEditor/editorSchema';
import LastUpdatedLine from './../../../components/LastUpdatedLine';
import {
  renderBlock,
  renderMark,
  renderInline,
} from '../../../components/SlateEditor/slateRendering';
import ToggleButton from '../../../components/ToggleButton';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import { findNodesByType } from '../../../util/slateHelpers';
import footnotePlugin from '../../../components/SlateEditor/plugins/footnote';
import createEmbedPlugin from '../../../components/SlateEditor/plugins/embed';
import createBodyBoxPlugin from '../../../components/SlateEditor/plugins/bodybox';
import createAsidePlugin from '../../../components/SlateEditor/plugins/aside';
import createDetailsPlugin from '../../../components/SlateEditor/plugins/details';
import createLinkPlugin from '../../../components/SlateEditor/plugins/link';
import headingPlugin from '../../../components/SlateEditor/plugins/heading';
import blockPickerPlugin from '../../../components/SlateEditor/plugins/blockPicker';
import relatedPlugin from '../../../components/SlateEditor/plugins/related';
import filePlugin from '../../../components/SlateEditor/plugins/file';
import conceptPlugin from '../../../components/SlateEditor/plugins/concept';
import blockquotePlugin from '../../../components/SlateEditor/plugins/blockquotePlugin';
import paragraphPlugin from '../../../components/SlateEditor/plugins/paragraph';
import mathmlPlugin from '../../../components/SlateEditor/plugins/mathml';
import dndPlugin from '../../../components/SlateEditor/plugins/DND';
import { TYPE as footnoteType } from '../../../components/SlateEditor/plugins/footnote';
import {
  editListPlugin,
  editTablePlugin,
} from '../../../components/SlateEditor/plugins/externalPlugins';
import createTablePlugin from '../../../components/SlateEditor/plugins/table';
import { EditMarkupLink } from './EditMarkupLink';
import { FormikIngress } from '../../FormikForm';
import { ArticleShape } from '../../../shapes';
import { DRAFT_HTML_SCOPE } from '../../../constants';
import { toEditMarkup } from '../../../util/routeHelpers';
import toolbarPlugin from '../../../components/SlateEditor/plugins/SlateToolbar';

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

const findFootnotes = content =>
  content
    .reduce(
      (all, value) => [
        ...all,
        ...findNodesByType(value.document, footnoteType),
      ],
      [],
    )
    .filter(footnote => footnote.data.size > 0)
    .map(footnoteNode => footnoteNode.data.toJS());

class LearningResourceContent extends Component {
  constructor(props) {
    super(props);
    const {
      article: { language },
    } = props;
    this.state = {
      preview: false,
    };
    this.plugins = [
      footnotePlugin(),
      createEmbedPlugin(language),
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
      paragraphPlugin(),
      createTablePlugin(),
      editTablePlugin,
      relatedPlugin(),
      filePlugin(),
      mathmlPlugin(),
      blockPickerPlugin({
        articleLanguage: language,
        actionsToShowInAreas: {
          solutionbox: ['table'],
        },
      }),
      dndPlugin,
      toolbarPlugin(),
    ];
  }

  componentDidUpdate({ article: { id: prevId, language: prevLanguage } }) {
    const {
      article: { id, language },
    } = this.props;
    if (prevLanguage !== language || prevId !== id) {
      this.plugins = [
        createEmbedPlugin(language),
        conceptPlugin(language),
        blockPickerPlugin({
          articleLanguage: language,
          actionsToShowInAreas: {
            solutionbox: ['table'],
          },
          ...this.plugins,
        }),
      ];
    }
  }

  render() {
    const {
      t,
      userAccess,
      formik: {
        setFieldValue,
        handleBlur,
        values: { id, language, creators, published },
      },
    } = this.props;

    return (
      <Fragment>
        <FormikField
          data-cy="learning-resource-title"
          label={t('form.title.label')}
          name="title"
          title
          noBorder
          placeholder={t('form.title.label')}
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
                <HowToHelper
                  pageId="Markdown"
                  tooltip={t('form.markdown.helpLabel')}
                />
              </IconContainer>
            </>
          )}
        </FormikField>
        <FormikIngress preview={this.state.preview} />
        <FormikField
          name="content"
          label={t('form.content.label')}
          noBorder
          className={formikFieldClasses('', 'position-static').className}>
          {({ field: { value, name, onChange }, form: { isSubmitting } }) => (
            <Fragment>
              <FieldHeader title={t('form.content.label')}>
                {id && userAccess && userAccess.includes(DRAFT_HTML_SCOPE) && (
                  <EditMarkupLink
                    to={toEditMarkup(id, language)}
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
                onBlur={(event, editor, next) => {
                  next();
                  // this is a hack since formik onBlur-handler interferes with slates
                  // related to: https://github.com/ianstormtaylor/slate/issues/2434
                  // formik handleBlur needs to be called for validation to work (and touched to be set)
                  setTimeout(
                    () => handleBlur({ target: { name: 'content' } }),
                    0,
                  );
                }}
              />
              <LearningResourceFootnotes
                t={t}
                footnotes={findFootnotes(value)}
              />
            </Fragment>
          )}
        </FormikField>
      </Fragment>
    );
  }
}

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
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default compose(
  injectT,
  reduxConnect(mapStateToProps),
  formikConnect,
)(LearningResourceContent);
