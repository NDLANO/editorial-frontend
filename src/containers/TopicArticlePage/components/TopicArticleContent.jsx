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
import headingPlugin from '../../../components/SlateEditor/plugins/heading';
import { TextField } from '../../../components/Fields';
import LearningResourceIngress from '../../LearningResourcePage/components/LearningResourceIngress';
import { RichTextField } from '../../../components/RichTextField';
import createNoEmbedsPlugin from '../../../components/SlateEditor/plugins/noEmbed';
import TopicArticleVisualElement from './TopicArticleVisualElement';
import { schema as slateSchema } from '../../../components/SlateEditor/editorSchema';
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
import { TYPE as link } from '../../../components/SlateEditor/plugins/link ';
import FormikField from '../../../components/FormikField';
import RichTextEditor from '../../../components/SlateEditor/RichTextEditor';

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
  values: { creators, updated, visualElement },
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
    <LearningResourceIngress />
    <TopicArticleVisualElement visualElement={visualElement} />
    <FormikField name="content" label={t('form.content.label')} noBorder>
      {({ field: { onChange, name, value } }) => (
        <RichTextEditor
          placeholder={t('form.content.placeholder')}
          id={name}
          name={name}
          onChange={change =>
            onChange({ target: { name, value: change.value } })
          }
          value={value}
          renderNode={renderNode}
          renderMark={renderMark}
          plugins={plugins}
          supportedToolbarElements={supportedToolbarElements}
          schema={slateSchema}
        />
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
