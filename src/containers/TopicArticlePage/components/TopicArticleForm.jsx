/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';

import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';

import converter from '../../../util/articleContentConverter';

import { parseEmbedTag, createEmbedTag } from '../../../util/embedTagHelpers';

import TopicArticleMetadata from './TopicArticleMetadata';
import TopicArticleContent from './TopicArticleContent';

const DEFAULT_LICENSE = {
  description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
  license: 'by-sa',
  url: 'https://creativecommons.org/licenses/by-sa/2.0/',
};

export const getInitialModel = (article = {}) => {
  const visualElement = parseEmbedTag(article.visualElement);
  return {
    id: article.id,
    revision: article.revision,
    updated: article.updated,
    title: article.title || '',
    introduction: converter.toPlainSlateEditorState(article.introduction, true),
    content: converter.toSlateEditorState(article.content),
    tags: article.tags || [],
    authors: article.copyright
      ? article.copyright.authors.map(author => author.name)
      : [],
    copyright: article.copyright
      ? article.copyright
      : { license: DEFAULT_LICENSE, origin: '' },
    metaDescription: converter.toPlainSlateEditorState(
      article.metaDescription,
      true,
    ),
    visualElement: visualElement || {},
  };
};

const classes = new BEMHelper({
  name: 'topic-article-form',
  prefix: 'c-',
});

class TopicArticleForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const {
      model,
      schema,
      revision,
      locale: language,
      setSubmitted,
    } = this.props;
    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

    this.props.onUpdate({
      id: model.id,
      revision,
      title: [{ title: model.title, language }],
      introduction: [
        {
          introduction: converter.slateToText(model.introduction),
          language,
        },
      ],
      tags: [{ tags: model.tags, language }],
      content: [{ content: converter.slateToHtml(model.content), language }],
      visualElement: [
        {
          content: createEmbedTag(model.visualElement),
          language,
        },
      ],
      metaDescription: [
        {
          metaDescription: converter.slateToText(model.metaDescription),
          language,
        },
      ],
      articleType: 'topic-article',
      copyright: {
        ...model.copyright,
        authors: model.authors.map(name => ({ type: 'Forfatter', name })),
      },
    });
  }

  render() {
    const {
      t,
      bindInput,
      schema,
      model,
      submitted,
      tags,
      isSaving,
    } = this.props;

    const commonFieldProps = { bindInput, schema, submitted };

    return (
      <form onSubmit={this.handleSubmit} {...classes()}>
        <div {...classes('title')}>
          {model.id
            ? t('topicArticleForm.title.update')
            : t('topicArticleForm.title.create')}
        </div>
        <TopicArticleMetadata
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
        />
        <TopicArticleContent
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
          model={model}
        />
        <Field right>
          <Button
            submit
            outline
            disabled={isSaving}
            {...classes('save-button')}>
            {t('topicArticleForm.save')}
          </Button>
        </Field>
      </form>
    );
  }
}

TopicArticleForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
    isValid: PropTypes.bool.isRequired,
  }),
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  revision: PropTypes.number,
  setSubmitted: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

export default compose(
  injectT,
  reformed,
  validateSchema({
    title: {
      required: true,
    },
    introduction: {
      required: true,
      maxLength: 300,
    },
    content: {
      required: true,
    },
    metaDescription: {
      required: true,
      maxLength: 150,
    },
    visualElement: {
      required: true,
    },
    'visualElement.alt': {
      required: true,
      onlyValidateIf: model =>
        model.visualElement && model.visualElement.resource === 'image',
    },
    'visualElement.caption': {
      required: true,
      onlyValidateIf: model =>
        model.visualElement &&
        (model.visualElement.resource === 'image' ||
          model.visualElement.resource === 'brightcove'),
    },
    tags: {
      minItems: 3,
    },
    authors: {
      minItems: 1,
    },
  }),
)(TopicArticleForm);
