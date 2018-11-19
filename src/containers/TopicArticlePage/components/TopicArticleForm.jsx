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
import { injectT } from '@ndla/i18n';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import Button from '@ndla/button';
import { withRouter } from 'react-router-dom';
import reformed from '../../../components/reformed';
import validateSchema, {
  checkTouchedInvalidField,
} from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';
import SaveButton from '../../../components/SaveButton';
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
  isFormDirty,
} from '../../../util/formHelper';
import {
  FormWorkflow,
  FormCopyright,
  FormHeader,
  formClasses,
  WarningModalWrapper,
} from '../../Form';
import { toEditArticle } from '../../../util/routeHelpers';
import { getArticle } from '../../../modules/article/articleApi';
import { articleConverter } from '../../../modules/draft/draft';
import WarningModal from '../../../components/WarningModal';

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
    processors: parseCopyrightContributors(article, 'creators'),
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
    this.getArticle = this.getArticle.bind(this);
    this.onReset = this.onReset.bind(this);
    this.state = {
      showResetModal: false,
    };
  }

  componentDidUpdate({ initialModel: prevModel }) {
    const { initialModel, setModel } = this.props;
    if (
      initialModel.id !== prevModel.id ||
      initialModel.language !== prevModel.language
    ) {
      setModel(initialModel);
    }
  }

  async onReset() {
    const { articleId, setModel, taxonomy, selectedLanguage, t } = this.props;
    try {
      if (this.state.error) {
        this.setState({ error: undefined });
      }
      const articleFromProd = await getArticle(articleId);
      const convertedArticle = articleConverter(
        articleFromProd,
        selectedLanguage,
      );
      setModel(getInitialModel(convertedArticle, taxonomy, selectedLanguage));
      this.setState({ showResetModal: false });
    } catch (e) {
      if (e.status === 404) {
        this.setState({
          showResetModal: false,
          error: t('errorMessage.noArticleInProd'),
        });
      }
    }
  }

  getArticle() {
    const { model } = this.props;
    const emptyField = model.id ? '' : undefined;
    const visualElement = createEmbedTag(model.visualElement);
    const content = topicArticleContentToHTML(model.content);

    return {
      id: model.id,
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
      language: model.language,
      supportedLanguages: model.supportedLanguages,
    };
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const { schema, revision, setSubmitted, onUpdate } = this.props;
    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }
    if (!isFormDirty(this.props)) {
      return;
    }

    onUpdate({
      ...this.getArticle(),
      revision,
    });
  }

  render() {
    const {
      t,
      bindInput,
      schema,
      initialModel,
      model,
      submitted,
      tags,
      isSaving,
      articleStatus,
      fields,
      licenses,
      showSaved,
      history,
    } = this.props;
    const commonFieldProps = { bindInput, schema, submitted };
    const panels = [
      {
        id: 'topic-article-content',
        title: t('form.contentSection'),
        className: 'u-4/6@desktop u-push-1/6@desktop',
        hasError: [
          schema.fields.title,
          schema.fields.introduction,
          schema.fields.content,
        ].some(field => checkTouchedInvalidField(field, submitted)),
        component: (
          <TopicArticleContent
            commonFieldProps={commonFieldProps}
            bindInput={bindInput}
            tags={tags}
            model={model}
          />
        ),
      },
      {
        id: 'topic-article-copyright',
        title: t('form.copyrightSection'),
        className: 'u-6/6',
        hasError: [
          schema.fields.creators,
          schema.fields.rightsholders,
          schema.fields.processors,
          schema.fields.license,
        ].some(field => checkTouchedInvalidField(field, submitted)),
        component: (
          <FormCopyright
            model={model}
            commonFieldProps={commonFieldProps}
            licenses={licenses}
          />
        ),
      },
      {
        id: 'topic-article-metadata',
        title: t('form.metadataSection'),
        className: 'u-6/6',
        hasError: [schema.fields.metaDescription, schema.fields.tags].some(
          field => checkTouchedInvalidField(field, submitted),
        ),
        component: (
          <TopicArticleMetadata
            commonFieldProps={commonFieldProps}
            bindInput={bindInput}
            tags={tags}
          />
        ),
      },
      {
        id: 'topic-article-workflow',
        title: t('form.workflowSection'),
        className: 'u-6/6',
        hasError: [schema.fields.notes].some(field =>
          checkTouchedInvalidField(field, submitted),
        ),
        component: (
          <FormWorkflow
            commonFieldProps={commonFieldProps}
            articleStatus={articleStatus}
            model={model}
            getArticle={this.getArticle}
          />
        ),
      },
    ];
    const { error, showResetModal } = this.state;
    return (
      <form onSubmit={this.handleSubmit} {...formClasses()}>
        <FormHeader
          model={model}
          type={model.articleType}
          editUrl={lang => toEditArticle(model.id, model.articleType, lang)}
        />
        <Accordion openIndexes={['topic-article-content']}>
          {({ openIndexes, handleItemClick }) => (
            <AccordionWrapper>
              {panels.map(panel => (
                <React.Fragment key={panel.id}>
                  <AccordionBar
                    panelId={panel.id}
                    ariaLabel={panel.title}
                    onClick={() => handleItemClick(panel.id)}
                    hasError={panel.hasError}
                    isOpen={openIndexes.includes(panel.id)}>
                    {panel.title}
                  </AccordionBar>
                  {openIndexes.includes(panel.id) && (
                    <AccordionPanel
                      id={panel.id}
                      hasError={panel.hasError}
                      isOpen={openIndexes.includes(panel.id)}>
                      <div className={panel.className}>{panel.component}</div>
                    </AccordionPanel>
                  )}
                </React.Fragment>
              ))}
            </AccordionWrapper>
          )}
        </Accordion>
        <Field right {...formClasses('form-actions')}>
          {error && <span className="c-errorMessage">{error}</span>}
          {model.id && (
            <Button onClick={() => this.setState({ showResetModal: true })}>
              {t('form.resetToProd.button')}
            </Button>
          )}

          <WarningModal
            show={showResetModal}
            text={t('form.resetToProd.modal')}
            actions={[
              {
                text: t('form.abort'),
                onClick: () => this.setState({ showResetModal: false }),
              },
              {
                text: 'Reset',
                onClick: this.onReset,
              },
            ]}
            onCancel={() => this.setState({ showResetModal: false })}
          />
          <Button outline onClick={history.goBack} disabled={isSaving}>
            {t('form.abort')}
          </Button>
          <SaveButton
            {...formClasses}
            isSaving={isSaving}
            showSaved={showSaved}>
            {t('form.save')}
          </SaveButton>
        </Field>
        <WarningModalWrapper
          initialModel={initialModel}
          model={model}
          showSaved={showSaved}
          fields={fields}
          text={t('warningModal.notSaved')}
        />
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
  fields: PropTypes.objectOf(PropTypes.object).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  revision: PropTypes.number,
  setSubmitted: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  showSaved: PropTypes.bool.isRequired,
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  licenses: LicensesArrayOf,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};

export default compose(
  injectT,
  withRouter,
  reformed,
  validateSchema({
    title: {
      required: true,
    },
    introduction: {
      maxLength: 300,
    },
    content: {
      // TODO: Write test to validate content (see learning resource)
      required: false,
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
    tags: {
      required: false,
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
    license: {
      required: false,
    },
    notes: {
      required: false,
    },
  }),
)(TopicArticleForm);
