/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import BEMHelper from 'react-bem-helper';
import { spacing } from '@ndla/core';
import { FieldHeader, FieldSection } from '@ndla/forms';
import { css } from '@emotion/core';
import { connect } from 'formik';
import headingPlugin from '../../../components/SlateEditor/plugins/heading';
import createNoEmbedsPlugin from '../../../components/SlateEditor/plugins/noEmbed';
import TopicArticleVisualElement from './TopicArticleVisualElement';
import { schema as slateSchema } from '../../../components/SlateEditor/editorSchema';
import {
  renderNode,
  renderMark,
} from '../../../components/SlateEditor/renderNode';
import blockquotePlugin from '../../../components/SlateEditor/plugins/blockquotePlugin';
import {
  editListPlugin,
  listTypes,
} from '../../../components/SlateEditor/plugins/externalPlugins';
import paragraphPlugin from '../../../components/SlateEditor/plugins/paragraph';
import createLinkPlugin, {
  TYPE as link,
} from '../../../components/SlateEditor/plugins/link';
import FormikField from '../../../components/FormikField';
import RichTextEditor from '../../../components/SlateEditor/RichTextEditor';
import { FormikIngress, FormikDatePicker } from '../../FormikForm';

const classes = new BEMHelper({
  name: 'topic-article-content',
  prefix: 'c-',
});

const supportedToolbarElements = {
  mark: ['bold', 'italic', 'underlined'],
  block: ['quote', ...listTypes, 'heading-two', 'heading-three'],
  inline: [link],
};

const plugins = [
  createNoEmbedsPlugin(),
  headingPlugin(),

  // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
  // Blockquote and editList actions need to be triggered before paragraph action, else
  // unwrapping (jumping out of block) will not work.
  blockquotePlugin,
  editListPlugin,
  createLinkPlugin(),
  paragraphPlugin(),
];

const TopicArticleContent = props => {
  const {
    t,
    formik: {
      values: { creators, published, visualElement },
      initialValues,
    },
  } = props;
  const hasPublishedDateChaned = initialValues.published !== published;
  return (
    <Fragment>
      <FormikField
        label={t('form.title.label')}
        name="title"
        title
        noBorder
        placeholder={t('form.title.label')}
      />
      {/* TODO: Change to c-article-byline */}
      <div {...classes('info')}>
        {creators.map(creator => creator.name).join(',')}
        {published
          ? ` - ${t('topicArticleForm.info.lastUpdated', {
              updated: published,
            })}`
          : ''}
      </div>

      <FormikField name="published">
        {({ field, form }) => (
          <FieldSection>
            <FormikDatePicker
              enableTime
              onReset={() =>
                form.setFieldValue(field.name, initialValues.published || '')
              }
              dateFormat="d/m/Y - H:i"
              {...field}
            />
          </FieldSection>
        )}
      </FormikField>
      {!hasPublishedDateChaned && (
        <FormikField name="doNotUpdatePublished">
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
              <span>{t('form.doNotUpdatePublished')}</span>
            </Fragment>
          )}
        </FormikField>
      )}
      <FormikIngress />
      <TopicArticleVisualElement visualElement={visualElement} />
      <FormikField name="content" label={t('form.content.label')} noBorder>
        {({ field, form: { isSubmitting } }) => (
          <Fragment>
            <FieldHeader title={t('form.content.label')} />
            <RichTextEditor
              placeholder={t('form.content.placeholder')}
              id={field.name}
              {...field}
              submitted={isSubmitting}
              renderNode={renderNode}
              renderMark={renderMark}
              plugins={plugins}
              supportedToolbarElements={supportedToolbarElements}
              schema={slateSchema}
            />
          </Fragment>
        )}
      </FormikField>
    </Fragment>
  );
};

TopicArticleContent.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      id: PropTypes.number,
      published: PropTypes.string,
      title: PropTypes.string,
    }),
    initialValues: PropTypes.shape({
      id: PropTypes.number,
      published: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
};

export default connect(injectT(TopicArticleContent));
