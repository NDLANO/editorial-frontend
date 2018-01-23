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
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { Link } from 'react-router-dom';
import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';
import {
  topicArticleContentToHTML,
  topicArticleContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../util/articleContentConverter';
import { parseEmbedTag, createEmbedTag } from '../../../util/embedTagHelpers';
import TopicArticleMetadata from './TopicArticleMetadata';
import TopicArticleContent from './TopicArticleContent';
import { SchemaShape, LicensesArrayOf } from '../../../shapes';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  processorsWithDefault,
} from '../../../util/formHelper';
import { FormWorkflow, FormCopyright, FormHeader, formClasses } from '../../Form';

export const getInitialModel = (article = {}) => {
  const visualElement = parseEmbedTag(article.visualElement);
  return {
    id: article.id,
    revision: article.revision,
    updated: article.updated,
    title: article.title || '',
    introduction: plainTextToEditorValue(article.introduction, true),
    content: topicArticleContentToEditorValue(article.content),
    tags: article.tags || [],
    creators: parseCopyrightContributors(article, 'creators'),
    processors: processorsWithDefault(article),
    rightsholders: parseCopyrightContributors(article, 'rightsholders'),
    agreementId: article.copyright ? article.copyright.agreementId : undefined,
    copyright: article.copyright
      ? article.copyright
      : { license: DEFAULT_LICENSE, origin: '' },
    metaDescription: plainTextToEditorValue(article.metaDescription, true),
    notes: article.notes || [],
    visualElement: visualElement || {},
    language: article.language,
    supportedLanguages: article.supportedLanguages || [],
    articleType: 'topic-article',
  };
};

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
    const emptyField = model.id ? '' : undefined;
    const visualElement = createEmbedTag(model.visualElement);
    const content = topicArticleContentToHTML(model.content);

    this.props.onUpdate({
      id: model.id,
      revision,
      title: model.title,
      introduction: editorValueToPlainText(model.introduction),
      tags: model.tags,
      content: content || emptyField,
      visualElement: visualElement || emptyField,
      metaDescription: editorValueToPlainText(model.metaDescription),
      articleType: 'topic-article',
      copyright: {
        ...model.copyright,
        creators: model.creators,
        processors: model.processors,
        rightsholders: model.rightsholders,
        agreementId: model.agreementId,
      },
      notes: model.notes,
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
      articleStatus,
      licenses,
    } = this.props;
    const commonFieldProps = { bindInput, schema, submitted };

    return (
      <form onSubmit={this.handleSubmit} {...formClasses()}>
        <FormHeader model={model} type={model.articleType}/>
        <TopicArticleMetadata
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
        />
        <TopicArticleContent
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
          model={model}
        />
        <FormCopyright
          model={model}
          commonFieldProps={commonFieldProps}
          licenses={licenses}
        />
        <FormWorkflow
          commonFieldProps={commonFieldProps}
          articleStatus={articleStatus}
          model={model}
          saveDraft={this.handleSubmit}
        />
        <Field right>
          <Link
            to={'/'}
            className="c-button c-button--outline c-abort-button"
            disabled={isSaving}>
            {t('form.abort')}
          </Link>
          <Button submit outline disabled={isSaving} className="c-save-button">
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
  articleStatus: PropTypes.arrayOf(PropTypes.string),
  licenses: LicensesArrayOf,
};

export default compose(
  injectT,
  reformed,
  validateSchema({
    title: {
      required: true,
    },
    introduction: {
      maxLength: 300,
    },
    metaDescription: {
      maxLength: 155,
    },
    visualElement: {
      required: false,
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
    creators: {
      allObjectFieldsRequired: true,
    },
    processors: {
      allObjectFieldsRequired: true,
    },
    rightsholders: {
      allObjectFieldsRequired: true,
    },
  }),
)(TopicArticleForm);
