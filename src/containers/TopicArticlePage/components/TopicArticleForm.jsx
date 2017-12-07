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
import { Link } from 'react-router-dom';

import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';
import ArticleHeader from '../../Article/ArticleHeader';

import {
  topicArticleContentToHTML,
  topicArticleContentToEditorState,
  editorStateToPlainText,
  plainTextToEditorState,
} from '../../../util/articleContentConverter';

import { parseEmbedTag, createEmbedTag } from '../../../util/embedTagHelpers';

import TopicArticleMetadata from './TopicArticleMetadata';
import TopicArticleContent from './TopicArticleContent';
import { SchemaShape } from '../../../shapes';

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
    introduction: plainTextToEditorState(article.introduction, true),
    content: topicArticleContentToEditorState(article.content),
    tags: article.tags || [],
    creators: article.copyright
      ? article.copyright.creators.map(creator => creator.name)
      : [],
    copyright: article.copyright
      ? article.copyright
      : { license: DEFAULT_LICENSE, origin: '' },
    metaDescription: plainTextToEditorState(article.metaDescription, true),
    visualElement: visualElement || {},
    language: article.language,
    articleType: 'topic-article',
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

  componentWillReceiveProps(nextProps) {
    const { initialModel, setModel } = nextProps;
    if (
      initialModel.id !== this.props.initialModel.id ||
      initialModel.language !== this.props.initialModel.language
    ) {
      setModel(initialModel);
    }
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
      title: model.title,
      introduction: editorStateToPlainText(model.introduction),
      tags: model.tags,
      content: topicArticleContentToHTML(model.content),
      visualElement: createEmbedTag(model.visualElement),
      metaDescription: editorStateToPlainText(model.metaDescription),
      articleType: 'topic-article',
      copyright: {
        ...model.copyright,
        creators: model.creators.map(name => ({ type: 'writer', name })),
      },
      language,
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
      <form
        onSubmit={this.handleSubmit}
        {...classes(undefined, undefined, 'c-article')}>
        <ArticleHeader model={model} />
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
          <Link
            to={'/'}
            {...classes('abort-button', '', 'c-button c-button--outline')}
            disabled={isSaving}>
            {t('form.abort')}
          </Link>
          <Button
            submit
            outline
            disabled={isSaving}
            {...classes('save-button')}>
            {t('form.save')}
          </Button>
        </Field>
      </form>
    );
  }
}

TopicArticleForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
  }),
  setModel: PropTypes.func.isRequired,
  schema: SchemaShape,
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
      maxLength: 155,
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
    creators: {
      minItems: 1,
    },
  }),
)(TopicArticleForm);
