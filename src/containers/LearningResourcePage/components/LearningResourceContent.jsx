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
import { compose } from 'redux';
import { connect as reduxConnect } from 'react-redux';
import { connect as formikConnect } from 'formik';
import { FieldHeader } from '@ndla/forms';
import { spacing } from '@ndla/core';
import { css } from '@emotion/core';
import { getLocale } from '../../../modules/locale/locale';
import FormikField from '../../../components/FormikField';
import RichBlockTextEditor from '../../../components/SlateEditor/RichBlockTextEditor';
import LearningResourceFootnotes from './LearningResourceFootnotes';
import { schema } from '../../../components/SlateEditor/editorSchema';
import LastUpdatedLine from './../../../components/lastUpdatedLine';
import {
  renderNode,
  renderMark,
} from '../../../components/SlateEditor/renderNode';
import { findNodesByType } from '../../../util/slateHelpers';
import footnotePlugin from '../../../components/SlateEditor/plugins/footnote';
import createEmbedPlugin from '../../../components/SlateEditor/plugins/embed';
import createBodyBoxPlugin from '../../../components/SlateEditor/plugins/bodybox';
import createAsidePlugin from '../../../components/SlateEditor/plugins/aside';
import createDetailsPlugin from '../../../components/SlateEditor/plugins/detailsbox';
import createLinkPlugin from '../../../components/SlateEditor/plugins/link';
import headingPlugin from '../../../components/SlateEditor/plugins/heading';
import blockPickerPlugin from '../../../components/SlateEditor/plugins/blockPicker';
import relatedPlugin from '../../../components/SlateEditor/plugins/related';
import filePlugin from '../../../components/SlateEditor/plugins/file';
import conceptPlugin from '../../../components/SlateEditor/plugins/concept';
import { createEmptyValue } from '../../../util/articleContentConverter';
import pasteHandler from '../../../components/SlateEditor/plugins/pasteHandler';
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
import { FormikIngress, FormikDatePicker } from '../../FormikForm';

const findFootnotes = content =>
  content
    .reduce(
      (all, item) => [
        ...all,
        ...findNodesByType(item.value.document, footnoteType),
      ],
      [],
    )
    .filter(footnote => footnote.data.size > 0)
    .map(footnoteNode => footnoteNode.data.toJS());

class LearningResourceContent extends Component {
  constructor(props) {
    super(props);
    const { locale } = props;
    this.addSection = this.addSection.bind(this);
    this.plugins = [
      footnotePlugin(),
      createEmbedPlugin(locale),
      createBodyBoxPlugin(),
      createAsidePlugin(),
      createDetailsPlugin(),
      createLinkPlugin(),
      conceptPlugin(),
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
      blockPickerPlugin(this.addSection),
      pasteHandler(),
      dndPlugin,
    ];
  }

  addSection() {
    const {
      formik: {
        values: { content },
        setFieldValue,
      },
    } = this.props;
    setFieldValue('content', [
      ...content,
      { value: createEmptyValue(), index: content.length },
    ]);
  }

  render() {
    const {
      t,
      //commonFieldProps,
      userAccess,
      formik: {
        values: { id, language, creators, published, updatePublished = false },
        initialValues,
      },
      //model,
      //initialModel,
      //setModelField,
    } = this.props;
    const hasPublishedDateChanged = initialValues.published !== published;
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
        <LastUpdatedLine creators={creators} published={published} />
        <FormikIngress />
        {!hasPublishedDateChanged && (
          <FormikField name="updatePublished">
            {({ field }) => (
              <Fragment>
                <input
                  css={css`
                    display: inline-block;
                    width: auto;
                    appearance: checkbox !important;
                    margin-right: ${spacing.small};
                  `}
                  type="checkbox"
                  {...field}
                />
                <span>{t('form.updatePublished')}</span>
              </Fragment>
            )}
          </FormikField>
        )}
        {updatePublished && (
          <FormikField name="published">
            {({ field, form }) => (
              <FormikDatePicker
                enableTime
                onReset={() =>
                  form.setFieldValue(field.name, initialValues.published || '')
                }
                dateFormat="d/m/Y - H:i"
                {...field}
              />
            )}
          </FormikField>
        )}

        {id && userAccess && userAccess.includes('drafts:admin') && (
          <FieldHeader title={t('form.content.label')}>
            <EditMarkupLink
              to={`/edit-markup/${id}/${language}`}
              title={t('editMarkup.linkTitle')}
            />
          </FieldHeader>
        )}

        <FormikField name="content" label={t('form.content.label')} noBorder>
          {({ field, form: { isSubmitting } }) => (
            <Fragment>
              <FieldHeader title={t('form.content.label')} />
              <RichBlockTextEditor
                slateSchema={schema}
                renderNode={renderNode}
                submitted={isSubmitting}
                renderMark={renderMark}
                placeholder={t('form.content.placeholder')}
                name="content"
                data-cy="learning-resource-content"
                plugins={this.plugins}
                {...field}
              />
              <LearningResourceFootnotes
                t={t}
                footnotes={findFootnotes(field.value)}
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
    values: PropTypes.shape({
      id: PropTypes.number,
      published: PropTypes.string,
      title: PropTypes.string,
      updatePublished: PropTypes.bool,
    }),
    initialValues: PropTypes.shape({
      id: PropTypes.number,
      published: PropTypes.string,
      title: PropTypes.string,
      updatePublished: PropTypes.bool,
    }),
    setFieldValue: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default compose(
  injectT,
  reduxConnect(mapStateToProps),
  formikConnect,
)(LearningResourceContent);
