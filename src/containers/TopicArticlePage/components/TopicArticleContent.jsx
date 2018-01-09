/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import BEMHelper from 'react-bem-helper';
import headingPlugin from '../../../components/SlateEditor/plugins/heading';
import {
  TextField,
  PlainTextField,
  RemainingCharacters,
  classes as fieldClasses,
} from '../../../components/Fields';
import { RichTextField } from '../../../components/RichTextField';
import createNoEmbedsPlugin from '../../../components/SlateEditor/plugins/noEmbed';
import Accordion from '../../../components/Accordion';
import TopicArticleVisualElement from './TopicArticleVisualElement';
import {
  schema,
  renderNode,
  renderMark,
  validateNode,
} from '../../../components/SlateEditor/schema';
import createLinkPlugin from '../../../components/SlateEditor/plugins/link';
import pasteContentPlugin from '../../../components/SlateEditor/plugins/pasteContent';
import {
  editListPlugin,
  blockquotePlugin,
} from '../../../components/SlateEditor/plugins/externalPlugins';
import { CommonFieldPropsShape } from '../../../shapes';

const classes = new BEMHelper({
  name: 'topic-article-content',
  prefix: 'c-',
});

const plugins = [
  createNoEmbedsPlugin(),
  createLinkPlugin(),
  headingPlugin(),
  blockquotePlugin,
  editListPlugin,
  pasteContentPlugin(),
];

class TopicArticleContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenContent: false,
    };
    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent() {
    this.setState(prevState => ({
      hiddenContent: !prevState.hiddenContent,
    }));
  }

  render() {
    const { t, bindInput, commonFieldProps, model } = this.props;

    const creators = model.creators;
    const updated = model.updated;

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('form.contentSection')}
        hidden={this.state.hiddenContent}>
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

        <PlainTextField
          label={t('form.introduction.label')}
          placeholder={t('form.introduction.label')}
          name="introduction"
          className="article_introduction"
          fieldClassName={fieldClasses(undefined, 'introduction').className}
          noBorder
          maxLength={300}
          {...commonFieldProps}>
          <RemainingCharacters
            maxLength={300}
            getRemainingLabel={(maxLength, remaining) =>
              t('form.remainingCharacters', { maxLength, remaining })
            }
            value={bindInput('introduction').value.document.text}
          />
        </PlainTextField>
        <TopicArticleVisualElement
          visualElement={model.visualElement}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
        />
        <RichTextField
          noBorder
          label={t('form.content.label')}
          placeholder={t('form.content.placeholder')}
          name="content"
          slateSchema={schema}
          renderNode={renderNode}
          renderMark={renderMark}
          validateNode={validateNode}
          plugins={plugins}
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

TopicArticleContent.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
};

export default injectT(TopicArticleContent);
