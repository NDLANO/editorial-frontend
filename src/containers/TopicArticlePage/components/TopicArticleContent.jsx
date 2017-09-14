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
import schema from '../../../components/SlateEditor/schema';
import { CommonFieldPropsShape } from '../../../shapes';

const classes = new BEMHelper({
  name: 'topic-article-content',
  prefix: 'c-',
});

const plugins = [createNoEmbedsPlugin()];

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

    const authors = model.authors;
    const updated = model.updated;

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('topicArticleForm.content')}
        hidden={this.state.hiddenContent}>
        <TextField
          label={t('topicArticleForm.fields.title.label')}
          name="title"
          title
          noBorder
          placeholder={t('topicArticleForm.fields.title.label')}
          {...commonFieldProps}
        />
        {/* TODO: Change to c-article-byline */}
        <div {...classes('info')}>
          {authors.map((author, i) => {
            if (authors.length === i + 1 || authors.length === 1) {
              return `${author}`;
            }
            return `${author}, `;
          })}
          {updated
            ? ` - ${t('topicArticleForm.info.lastUpdated', { updated })}`
            : ''}
        </div>

        <PlainTextField
          label={t('topicArticleForm.fields.introduction.label')}
          placeholder={t('topicArticleForm.fields.introduction.label')}
          name="introduction"
          className="article_introduction"
          fieldClassName={fieldClasses(undefined, 'introduction').className}
          noBorder
          maxLength={300}
          {...commonFieldProps}>
          <RemainingCharacters
            maxLength={300}
            getRemainingLabel={(maxLength, remaining) =>
              t('form.remainingCharacters', { maxLength, remaining })}
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
          label={t('topicArticleForm.fields.content.label')}
          placeholder={t('topicArticleForm.fields.content.placeholder')}
          name="content"
          slateSchema={schema}
          plugins={plugins}
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

TopicArticleContent.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  classes: PropTypes.func.isRequired,
};

export default injectT(TopicArticleContent);
