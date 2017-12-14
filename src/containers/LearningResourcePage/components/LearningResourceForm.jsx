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
import {
  learningResourceContentToHTML,
  learningResourceContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../util/articleContentConverter';
import { isUserProvidedEmbedDataValid } from '../../../util/embedTagHelpers';
import { findNodesByType } from '../../../util/slateHelpers';
import { SchemaShape } from '../../../shapes';

import LearningResourceMetadata from './LearningResourceMetadata';
import LearningResourceContent from './LearningResourceContent';
import LearningResourceCopyright from './LearningResourceCopyright';
import LearningResourceTaxonomy from './LearningResourceTaxonomy';
import LearningResourceWorkflow from './LearningResourceWorkflow';
import LearningResourceFootnotes from './LearningResourceFootnotes';
import ArticleHeader from '../../Article/ArticleHeader';
import { TYPE as footnoteType } from '../../../components/SlateEditor/plugins/footnote';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
} from '../../../util/formHelper';

const findFootnotes = content =>
  content
    .reduce(
      (all, item) => [
        ...all,
        ...findNodesByType(item.value.document, footnoteType),
      ],
      [],
    )
    .map(footnoteNode => footnoteNode.data.toJS());

const parseImageUrl = url => {
  if (!url) {
    return '';
  }
  const splittedUrl = url.split('/');
  return splittedUrl[splittedUrl.length - 1];
};

export const getInitialModel = (article = {}) => {
  const metaImageId = parseImageUrl(article.metaImage);

  return {
    id: article.id,
    revision: article.revision,
    title: article.title || '',
    introduction: plainTextToEditorValue(article.introduction, true),
    content: learningResourceContentToEditorValue(article.content),
    tags: article.tags || [],
    resourceTypes: [],
    filter: [],
    topics: [],
    creators: parseCopyrightContributors(article, 'creators'),
    processors: parseCopyrightContributors(article, 'processors'),
    rightsholders: parseCopyrightContributors(article, 'rightsholders'),
    origin:
      article.copyright && article.copyright.origin
        ? article.copyright.origin
        : '',
    license: article.copyright
      ? article.copyright.license.license
      : DEFAULT_LICENSE.license,
    metaDescription: plainTextToEditorValue(article.metaDescription, true),
    metaImageId,
    language: article.language,
    articleType: 'standard',
    status: article.status || [],
  };
};

export const classes = new BEMHelper({
  name: 'learning-resource-form',
  prefix: 'c-',
});

class LearningResourceForm extends Component {
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

    const { model, schema, revision, setSubmitted, licenses } = this.props;
    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

    const content = learningResourceContentToHTML(model.content);
    const emptyContent = model.id ? '' : undefined;

    this.props.onUpdate({
      id: model.id,
      revision,
      title: model.title,
      introduction: editorValueToPlainText(model.introduction),
      tags: model.tags,
      resourceTypes: model.resourceTypes,
      filter: model.filter,
      topics: model.topics,
      content: content && content.length > 0 ? content : emptyContent,
      metaImageId: model.metaImageId,
      metaDescription: editorValueToPlainText(model.metaDescription),
      articleType: 'standard',
      copyright: {
        license: licenses.find(license => license.license === model.license),
        origin: model.origin,
        creators: model.creators,
        processors: model.processors,
        rightsholders: model.rightsholders,
      },
      language: model.language,
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
      licenses,
      isSaving,
      resourceTypes,
      filter,
      topics,
      articleStatus,
    } = this.props;

    const commonFieldProps = { bindInput, schema, submitted };
    return (
      <form
        onSubmit={this.handleSubmit}
        {...classes(undefined, undefined, 'c-article')}>
        <ArticleHeader model={model} />
        <LearningResourceMetadata
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
          model={model}
        />
        <LearningResourceContent
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}>
          <LearningResourceFootnotes
            t={t}
            footnotes={findFootnotes(model.content)}
          />
        </LearningResourceContent>
        <LearningResourceTaxonomy
          commonFieldProps={commonFieldProps}
          resourceTypes={resourceTypes}
          filter={filter}
          topics={topics}
        />
        <LearningResourceCopyright
          commonFieldProps={commonFieldProps}
          licenses={licenses}
        />
        <LearningResourceWorkflow
          articleStatus={articleStatus}
          model={model}
          saveDraft={this.handleSubmit}
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

LearningResourceForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    language: PropTypes.string,
  }),
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
  }),
  schema: SchemaShape,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  resourceTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  topics: PropTypes.arrayOf(PropTypes.object).isRequired,
  filter: PropTypes.arrayOf(PropTypes.object).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  setModel: PropTypes.func.isRequired,
  revision: PropTypes.number,
  setSubmitted: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  articleStatus: PropTypes.arrayOf(PropTypes.string),
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
    content: {
      required: true,
      test: (value, model, setError) => {
        const embedsHasErrors = value.find(block => {
          const embeds = findNodesByType(block.value.document, 'embed').map(
            node => node.get('data').toJS(),
          );
          const notValidEmbeds = embeds.filter(
            embed => !isUserProvidedEmbedDataValid(embed),
          );
          return notValidEmbeds.length > 0;
        });

        if (embedsHasErrors) {
          setError('learningResourceForm.validation.missingEmbedData');
        }
      },
    },
    metaDescription: {
      maxLength: 155,
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
)(LearningResourceForm);
