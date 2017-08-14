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
  RichTextSlateField,
  PlainTextField,
  RemainingCharacters,
} from '../../../components/Fields';
import Accordion from '../../../components/Accordion';
import TopicArticleVisualElement from './TopicArticleVisualElement';

const classes = new BEMHelper({
  name: 'topic-article-content',
  prefix: 'c-',
});

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

    const visualElementTag = {
      resource: model.visualElementType,
      id: model.visualElementId,
      caption: model.visualElementCaption,
      alt: model.visualElementAlt,
    };

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
          bigText
          title
          noBorder
          placeholder={t('topicArticleForm.fields.title.label')}
          {...commonFieldProps}
        />
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
          noBorder
          bigText
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
          visualElementTag={visualElementTag}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
        />
        <RichTextSlateField
          noBorder
          label={t('topicArticleForm.fields.content.label')}
          placeholder={t('topicArticleForm.fields.content.placeholder')}
          name="content"
          {...commonFieldProps}
        />
        {/* <Editor
          schema={schema}
          state={this.state.state}
          onChange={this.onChange}
        /> */}
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
  commonFieldProps: PropTypes.shape({
    schema: PropTypes.shape({
      fields: PropTypes.object.isRequired,
      isValid: PropTypes.bool.isRequired,
    }),
    submitted: PropTypes.bool.isRequired,
    bindInput: PropTypes.func.isRequired,
  }),
  classes: PropTypes.func.isRequired,
};

export default injectT(TopicArticleContent);
