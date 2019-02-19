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
import { withRouter } from 'react-router-dom';
import reformed from '../../../components/reformed';
import validateSchema, {
  checkTouchedInvalidField,
} from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';
import SaveButton from '../../../components/SaveButton';
import { topicArticleSchema } from '../../../articleSchema';
import {
  topicArticleContentToHTML,
  topicArticleContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../util/articleContentConverter';
import { parseEmbedTag, createEmbedTag } from '../../../util/embedTagHelpers';
import TopicArticleMetadata from './TopicArticleMetadata';
import TopicArticleContent from './TopicArticleContent';
import { SchemaShape, LicensesArrayOf, ArticleShape } from '../../../shapes';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  isFormDirty,
} from '../../../util/formHelper';
import {
  FormWorkflow,
  FormAddNotes,
  FormCopyright,
  FormHeader,
  FormActionButton,
  formClasses,
  AlertModalWrapper,
} from '../../Form';
import { formatErrorMessage } from '../../Form/FormWorkflow';
import { toEditArticle } from '../../../util/routeHelpers';
import { getArticle } from '../../../modules/article/articleApi';
import { validateDraft } from '../../../modules/draft/draftApi';
import { articleConverter } from '../../../modules/draft/draft';
import * as articleStatuses from '../../../util/constants/ArticleStatus';
import AlertModal from '../../../components/AlertModal';

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
    processors: parseCopyrightContributors(article, 'processors'),
    rightsholders: parseCopyrightContributors(article, 'rightsholders'),
    agreementId: article.copyright ? article.copyright.agreementId : undefined,
    copyright: article.copyright
      ? article.copyright
      : { license: DEFAULT_LICENSE, origin: '' },
    metaDescription: plainTextToEditorValue(article.metaDescription, true),
    notes: [],
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

    const article = {
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
      notes: model.notes || [],
      language: model.language,
      supportedLanguages: model.supportedLanguages,
    };

    return article;
  }

  async handleSubmit(evt) {
    evt.preventDefault();

    const {
      model: { id },
      validationErrors,
      revision,
      setSubmitted,
      createMessage,
      articleStatus,
      onUpdate,
      setModelField,
    } = this.props;

    const status = articleStatus ? articleStatus.current : undefined;
    if (!validationErrors.isValid) {
      setSubmitted(true);
      return;
    }
    if (!isFormDirty(this.props)) {
      return;
    }

    if (status === articleStatuses.QUEUED_FOR_PUBLISHING) {
      try {
        await validateDraft(id, {
          ...this.getArticle(),
          revision,
        });
      } catch (error) {
        if (error && error.json && error.json.messages) {
          createMessage(formatErrorMessage(error));
        }
        return;
      }
    }
    onUpdate({
      ...this.getArticle(),
      revision,
    });
    setModelField('notes', []);
  }

  render() {
    const {
      t,
      bindInput,
      validationErrors: schema,
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
      revision,
      article,
      createMessage,
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
          schema.fields.visualElement,
          schema.fields.visualElement.alt,
          schema.fields.visualElement.caption,
        ].some(field => checkTouchedInvalidField(field, submitted)),
        component: (
          <TopicArticleContent
            commonFieldProps={commonFieldProps}
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
            articleStatus={articleStatus}
            model={model}
            getArticle={this.getArticle}
            createMessage={createMessage}
            revision={revision}>
            <FormAddNotes
              showError={submitted}
              name="notes"
              labelHeading={t('form.notes.heading')}
              labelAddNote={t('form.notes.add')}
              article={article}
              labelRemoveNote={t('form.notes.remove')}
              labelWarningNote={t('form.notes.warning')}
              {...commonFieldProps.bindInput('notes')}
            />
          </FormWorkflow>
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
        <Field right>
          {error && <span className="c-errorMessage">{error}</span>}
          {model.id && (
            <FormActionButton
              onClick={() => this.setState({ showResetModal: true })}>
              {t('form.resetToProd.button')}
            </FormActionButton>
          )}

          <AlertModal
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
          <FormActionButton
            outline
            onClick={history.goBack}
            disabled={isSaving}>
            {t('form.abort')}
          </FormActionButton>
          <SaveButton
            {...formClasses}
            isSaving={isSaving}
            showSaved={showSaved}>
            {t('form.save')}
          </SaveButton>
        </Field>
        <AlertModalWrapper
          initialModel={initialModel}
          model={model}
          severity="danger"
          showSaved={showSaved}
          fields={fields}
          text={t('alertModal.notSaved')}
        />
      </form>
    );
  }
}

TopicArticleForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }).isRequired,
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
  }),
  setModel: PropTypes.func.isRequired,
  validationErrors: SchemaShape,
  setModelField: PropTypes.func.isRequired,
  schema: SchemaShape,
  fields: PropTypes.objectOf(PropTypes.object).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  revision: PropTypes.number,
  setSubmitted: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
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
  article: ArticleShape,
};

export default compose(
  injectT,
  withRouter,
  reformed,
  validateSchema(topicArticleSchema),
)(TopicArticleForm);
