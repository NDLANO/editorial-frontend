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
import { FieldHeader } from '@ndla/forms';
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

const TopicArticleContent = ({
  t,
  values: { id, creators, updated, visualElement },
}) => (
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
      {updated
        ? ` - ${t('topicArticleForm.info.lastUpdated', { updated })}`
        : ''}
    </div>
    {id && (
      <FormikField name="published">
        {({ field }) => (
          <FormikDatePicker enableTime dateFormat="d/m/Y - H:i" {...field} />
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

TopicArticleContent.propTypes = {
  values: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
};

export default injectT(TopicArticleContent);
