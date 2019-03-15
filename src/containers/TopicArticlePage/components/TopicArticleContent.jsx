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
import { TextField } from '../../../components/Fields';
import LearningResourceIngress from '../../LearningResourcePage/components/LearningResourceIngress';
import { RichTextField } from '../../../components/RichTextField';
import createNoEmbedsPlugin from '../../../components/SlateEditor/plugins/noEmbed';
import TopicArticleVisualElement from './TopicArticleVisualElement';
import { schema } from '../../../components/SlateEditor/editorSchema';
import {
  renderNode,
  renderMark,
} from '../../../components/SlateEditor/renderNode';
import createLinkPlugin from '../../../components/SlateEditor/plugins/link';
import blockquotePlugin from '../../../components/SlateEditor/plugins/blockquotePlugin';
import {
  editListPlugin,
  listTypes,
} from '../../../components/SlateEditor/plugins/externalPlugins';
import paragraphPlugin from '../../../components/SlateEditor/plugins/paragraph';
import { CommonFieldPropsShape } from '../../../shapes';
import { TYPE as link } from '../../../components/SlateEditor/plugins/link';
import { FormDatePicker } from '../../Form'

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
  createLinkPlugin(),
  headingPlugin(),

  // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
  // Blockquote and editList actions need to be triggered before paragraph action, else
  // unwrapping (jumping out of block) will not work.
  blockquotePlugin,
  editListPlugin,
  paragraphPlugin(),
];

const TopicArticleContent = ({
  t,
  commonFieldProps,
  model: { id, creators, updated, visualElement },
}) => (
  <Fragment>
    <TextField
      label={t('form.title.label')}
      name="title"
      title
      noBorder
      placeholder={t('form.title.label')}
      {...commonFieldProps}
    />
    {/* TODO: Change to c-article-byline */}
    <div {...classes('info')}>
      {creators.map(creator => creator.name).join(',')}
      {updated
        ? ` - ${t('topicArticleForm.info.lastUpdated', { updated })}`
        : ''}
    </div>
    <LearningResourceIngress t={t} commonFieldProps={commonFieldProps} />
    { id && <FormDatePicker
      name="updated"
      {...commonFieldProps.bindInput('published')}
    />}
    <TopicArticleVisualElement
      visualElement={visualElement}
      commonFieldProps={commonFieldProps}
      bindInput={commonFieldProps.bindInput}
    />
    <FieldHeader title={t('form.content.label')} />
    <RichTextField
      noBorder
      label={t('form.content.label')}
      placeholder={t('form.content.placeholder')}
      name="content"
      slateSchema={schema}
      renderNode={renderNode}
      renderMark={renderMark}
      plugins={plugins}
      supportedToolbarElements={supportedToolbarElements}
      commonFieldProps={commonFieldProps}
    />
  </Fragment>
);

TopicArticleContent.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  commonFieldProps: CommonFieldPropsShape.isRequired,
};

export default injectT(TopicArticleContent);
