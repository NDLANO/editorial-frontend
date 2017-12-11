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
  learningResourceContentToEditorState,
  editorStateToPlainText,
  plainTextToEditorState,
} from '../../../util/articleContentConverter';
import { isUserProvidedEmbedDataValid } from '../../../util/embedTagHelpers';
import { findNodesByType } from '../../../util/slateHelpers';
import { SchemaShape } from '../../../shapes';

import LearningResourceContent from './LearningResourceContent';
import LearningResourceMetadata from './LearningResourceMetadata';
import LearningResourceAffiliation from './LearningResourceAffiliation';
import LearningResourceFootnotes from './LearningResourceFootnotes';
import ArticleHeader from '../../Article/ArticleHeader';
import { TYPE as footnoteType } from '../../../components/SlateEditor/plugins/footnote';

const DEFAULT_LICENSE = {
  description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
  license: 'by-sa',
  url: 'https://creativecommons.org/licenses/by-sa/2.0/',
};

const findFootnotes = content =>
  content
    .reduce(
      (all, item) => [
        ...all,
        ...findNodesByType(item.state.document, footnoteType),
      ],
      [],
    )
    .map(footnoteNode => footnoteNode.data.toJS());

const parseCopyrightContributors = (article, contributorType, subType) =>
  article.copyright
    ? article.copyright[contributorType]
        .filter(contributor => contributor.type === subType)
        .map(contributor => contributor.name)
    : [];

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
    introduction: plainTextToEditorState(article.introduction, true),
    content: learningResourceContentToEditorState(article.content),
    tags: article.tags || [],
    creators: parseCopyrightContributors(article, 'creators', 'writer'),
    processors: parseCopyrightContributors(article, 'processors', 'processor'),
    rightsholders: parseCopyrightContributors(
      article,
      'rightsholders',
      'rightsholder',
    ),
    origin:
      article.copyright && article.copyright.origin
        ? article.copyright.origin
        : '',
    license: article.copyright
      ? article.copyright.license.license
      : DEFAULT_LICENSE.license,
    metaDescription: plainTextToEditorState(article.metaDescription, true),
    metaImageId,
    language: article.language,
    articleType: 'standard',
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

    const creators = model.creators.map(name => ({ type: 'writer', name }));
    const processors = model.processors.map(name => ({
      type: 'processor',
      name,
    }));

    const rightsholders = model.rightsholders.map(name => ({
      type: 'rightsholder',
      name,
    }));

    const copyright = {
      license: licenses.find(license => license.license === model.license),
      origin: model.origin,
      creators,
      processors,
      rightsholders,
    };

    this.props.onUpdate({
      id: model.id,
      revision,
      title: model.title,
      introduction: editorStateToPlainText(model.introduction),
      tags: model.tags,
      content: learningResourceContentToHTML(model.content),
      metaImageId: model.metaImageId,
      metaDescription: editorStateToPlainText(model.metaDescription),
      articleType: 'standard',
      copyright,
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
      resourceType,
      topics,
      filter,
    } = this.props;

    const commonFieldProps = { bindInput, schema, submitted };
    return (
      <form
        onSubmit={this.handleSubmit}
        {...classes(undefined, undefined, 'c-article')}>
        <ArticleHeader model={model} />
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
        <LearningResourceMetadata
          classes={classes}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
          tags={tags}
          model={model}
          resourceType={resourceType}
          topics={topics}
          filter={filter}
        />
        <LearningResourceAffiliation
          commonFieldProps={commonFieldProps}
          licenses={licenses}
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
  resourceType: PropTypes.arrayOf(PropTypes.string).isRequired,
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
  filter: PropTypes.arrayOf(PropTypes.string).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  setModel: PropTypes.func.isRequired,
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
      maxLength: 300,
    },
    content: {
      required: true,
      test: (value, model, setError) => {
        const embedsHasErrors = value.find(block => {
          const embeds = findNodesByType(
            block.state.document,
            'embed',
          ).map(node => node.get('data').toJS());
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
      required: true,
      maxLength: 155,
    },
    metaImageId: {
      required: true,
    },
    tags: {
      minItems: 3,
    },
    creators: {
      minItems: 1,
    },
  }),
)(LearningResourceForm);
