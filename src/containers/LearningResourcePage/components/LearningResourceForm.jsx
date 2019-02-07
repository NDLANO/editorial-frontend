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
import { withRouter } from 'react-router-dom';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import reformed from '../../../components/reformed';
import validateSchema, {
  checkTouchedInvalidField,
} from '../../../components/validateSchema';
import { learningResourceSchema } from '../../../articleSchema';
import { Field } from '../../../components/Fields';
import SaveButton from '../../../components/SaveButton';
import AlertModal from '../../../components/AlertModal';
import {
  learningResourceContentToHTML,
  learningResourceContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../util/articleContentConverter';
import { SchemaShape, LicensesArrayOf, ArticleShape } from '../../../shapes';
import LearningResourceMetadata from './LearningResourceMetadata';
import LearningResourceContent from './LearningResourceContent';
import {
  FormWorkflow,
  FormCopyright,
  FormHeader,
  FormActionButton,
  formClasses,
  AlertModalWrapper,
} from '../../Form';
import { formatErrorMessage } from '../../Form/FormWorkflow';
import LearningResourceTaxonomy from './LearningResourceTaxonomy';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  isFormDirty,
} from '../../../util/formHelper';
import { toEditArticle } from '../../../util/routeHelpers';
import { getArticle } from '../../../modules/article/articleApi';
import { validateDraft } from '../../../modules/draft/draftApi';
import { articleConverter } from '../../../modules/draft/draft';
import * as articleStatuses from '../../../util/constants/ArticleStatus';
import config from '../../../config';

const parseImageUrl = metaImage => {
  if (!metaImage || !metaImage.url || metaImage.url.length === 0) {
    return '';
  }

  const splittedUrl = metaImage.url.split('/');
  return splittedUrl[splittedUrl.length - 1];
};

export const getInitialModel = (article = {}, language) => {
  const metaImageId = parseImageUrl(article.metaImage);
  return {
    id: article.id,
    revision: article.revision,
    title: article.title || '',
    introduction: plainTextToEditorValue(article.introduction, true),
    content: learningResourceContentToEditorValue(article.content),
    tags: article.tags || [],
    creators: parseCopyrightContributors(article, 'creators'),
    processors: parseCopyrightContributors(article, 'processors'),
    rightsholders: parseCopyrightContributors(article, 'rightsholders'),
    updated: article.updated || new Date(),
    origin:
      article.copyright && article.copyright.origin
        ? article.copyright.origin
        : '',
    license:
      article.copyright && article.copyright.license
        ? article.copyright.license.license
        : DEFAULT_LICENSE.license,
    metaDescription: plainTextToEditorValue(article.metaDescription, true),
    metaImageId,
    metaImageAlt: article.metaImage ? article.metaImage.alt : '',
    supportedLanguages: article.supportedLanguages || [],
    agreementId: article.copyright ? article.copyright.agreementId : undefined,
    language: language || article.language,
    articleType: 'standard',
    status: article.status || [],
    notes: [],
  };
};

class LearningResourceForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getArticleFromModel = this.getArticleFromModel.bind(this);
    this.onReset = this.onReset.bind(this);

    this.state = {
      showResetModal: false,
      savedButtonState: 'inital',
    };
  }

  componentDidUpdate(prevProps) {
    const { taxonomy: prevTaxonomy, initialModel: prevModel } = prevProps;
    const { initialModel, setModel, setModelField, taxonomy } = this.props;
    const hasTaxonomyChanged =
      taxonomy && prevTaxonomy && taxonomy.loading !== prevTaxonomy.loading;

    if (hasTaxonomyChanged) {
      const fields = ['resourceTypes', 'filter', 'topics'];
      fields.map(field => setModelField(field, initialModel[field]));
    } else if (
      initialModel.id !== prevModel.id ||
      initialModel.language !== prevModel.language
    ) {
      setModel(initialModel);
    }
  }

  async onReset() {
    const { articleId, setModel, selectedLanguage, t } = this.props;
    try {
      if (this.state.error) {
        this.setState({ error: undefined });
      }
      const articleFromProd = await getArticle(articleId);
      const convertedArticle = articleConverter(
        articleFromProd,
        selectedLanguage,
      );
      setModel(getInitialModel(convertedArticle, selectedLanguage));
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

  getArticleFromModel() {
    const { model, licenses } = this.props;
    const content = learningResourceContentToHTML(model.content);
    const emptyContent = model.id ? '' : undefined;
    const article = {
      id: model.id,
      title: model.title,
      introduction: editorValueToPlainText(model.introduction),
      tags: model.tags,
      content: content && content.length > 0 ? content : emptyContent,
      metaImage: {
        id: model.metaImageId,
        alt: model.metaImageAlt,
      },
      metaDescription: editorValueToPlainText(model.metaDescription),
      articleType: 'standard',
      copyright: {
        license: licenses.find(license => license.license === model.license),
        origin: model.origin,
        creators: model.creators,
        processors: model.processors,
        rightsholders: model.rightsholders,
      },
      notes: model.notes || [],
      language: model.language,
      updated: model.updated,
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
      setModelField,
      onUpdate,
      fields,
      model,
      setInitialModel,
      selectedLanguage,
      setModel,
    } = this.props;

    const status = articleStatus ? articleStatus.current : undefined;
    if (!validationErrors.isValid) {
      setSubmitted(true);
      return;
    }
    if (!isFormDirty({ fields, model })) {
      return;
    }

    if (status === articleStatuses.QUEUED_FOR_PUBLISHING) {
      try {
        await validateDraft(id, {
          ...this.getArticleFromModel(),
          revision,
        });
      } catch (error) {
        createMessage(formatErrorMessage(error));
        return;
      }
    }
    onUpdate({
      ...this.getArticleFromModel(),
      revision,
      updated: undefined,
    });
    this.setState({ savedButtonState: 'saved' });
    setInitialModel(
      getInitialModel(this.getArticleFromModel(), selectedLanguage),
    );
    setModel(getInitialModel(this.getArticleFromModel(), selectedLanguage));
    setModelField('notes', []);
  }

  render() {
    const {
      t,
      bindInput,
      model,
      submitted,
      tags,
      licenses,
      isSaving,
      articleStatus,
      fields,
      history,
      articleId,
      userAccess = '',
      createMessage,
      revision,
      article,
      validationErrors,
    } = this.props;

    const { error } = this.state;
    const commonFieldProps = { bindInput, schema: validationErrors, submitted };
    console.log(isFormDirty({ model, fields }));
    console.log(fields);

    const panels = [
      {
        id: 'learning-resource-content',
        title: t('form.contentSection'),
        className: 'u-4/6@desktop u-push-1/6@desktop',
        hasError: [
          validationErrors.fields.title,
          validationErrors.fields.introduction,
          validationErrors.fields.content,
        ].some(field => checkTouchedInvalidField(field, submitted)),
        component: () => (
          <LearningResourceContent commonFieldProps={commonFieldProps} />
        ),
      },
      {
        id: 'learning-resource-copyright',
        title: t('form.copyrightSection'),
        className: 'u-6/6',
        hasError: [
          validationErrors.fields.creators,
          validationErrors.fields.rightsholders,
          validationErrors.fields.processors,
          validationErrors.fields.license,
        ].some(field => checkTouchedInvalidField(field, submitted)),
        component: () => (
          <FormCopyright
            model={model}
            commonFieldProps={commonFieldProps}
            licenses={licenses}
          />
        ),
      },
      {
        id: 'learning-resource-metadata',
        title: t('form.metadataSection'),
        className: 'u-6/6',
        hasError: [
          validationErrors.fields.metaDescription,
          validationErrors.fields.tags,
          validationErrors.fields.metaImageAlt,
        ].some(field => checkTouchedInvalidField(field, submitted)),
        component: () => (
          <LearningResourceMetadata
            commonFieldProps={commonFieldProps}
            tags={tags}
            model={model}
          />
        ),
      },
      {
        id: 'learning-resource-workflow',
        title: t('form.workflowSection'),
        className: 'u-6/6',
        hasError: [validationErrors.fields.notes].some(field =>
          checkTouchedInvalidField(field, submitted),
        ),
        component: () => (
          <FormWorkflow
            article={article}
            commonFieldProps={commonFieldProps}
            articleStatus={articleStatus}
            model={model}
            getArticle={this.getArticleFromModel}
            createMessage={createMessage}
            revision={revision}
          />
        ),
      },
    ];

    if (
      model.id &&
      (userAccess.includes(`taxonomy-${config.ndlaEnvironment}:write`) ||
        userAccess.includes('taxonomy:write'))
    ) {
      panels.splice(1, 0, {
        id: 'learning-resource-taxonomy',
        title: t('form.taxonomytSection'),
        className: 'u-6/6',
        component: closePanel => (
          <LearningResourceTaxonomy
            language={model.language}
            title={model.title}
            articleId={articleId}
            closePanel={closePanel}
          />
        ),
      });
    }
    return (
      <form onSubmit={this.handleSubmit} {...formClasses()}>
        <FormHeader
          model={model}
          type={model.articleType}
          editUrl={lang => toEditArticle(model.id, model.articleType, lang)}
        />
        <Accordion openIndexes={['learning-resource-content']}>
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
                      <div className={panel.className}>
                        {panel.component(() => handleItemClick(panel.id))}
                      </div>
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
            show={this.state.showResetModal}
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
            data-testid="saveLearningResourceButton"
            isSaving={isSaving}
            showSaved={
              this.state.savedButtonState === 'saved' &&
              !isFormDirty({ model, fields })
            }
            defaultText="saveDraft"
          />
        </Field>
        <AlertModalWrapper
          showSaved={this.state.savedButtonState}
          fields={fields}
          severity="danger"
          model={model}
          text={t('alertModal.notSaved')}
        />
      </form>
    );
  }
}

LearningResourceForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    language: PropTypes.string,
  }).isRequired,
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.arrayOf(PropTypes.object),
    language: PropTypes.string,
  }),
  articleId: PropTypes.string,
  setModel: PropTypes.func.isRequired,
  setModelField: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.object).isRequired,
  validationErrors: SchemaShape,
  licenses: LicensesArrayOf,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  revision: PropTypes.number,
  setSubmitted: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  taxonomy: PropTypes.shape({
    resourceTypes: PropTypes.array,
    filter: PropTypes.array,
    topics: PropTypes.array,
    loading: PropTypes.bool,
  }),
  selectedLanguage: PropTypes.string,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  userAccess: PropTypes.string,
  article: ArticleShape,
};

export default compose(
  injectT,
  withRouter,
  reformed,
  validateSchema(learningResourceSchema),
)(LearningResourceForm);
