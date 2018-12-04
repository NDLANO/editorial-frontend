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
import Button from '@ndla/button';
import reformed from '../../../components/reformed';
import validateSchema, {
  checkTouchedInvalidField,
} from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';
import SaveButton from '../../../components/SaveButton';
import WarningModal from '../../../components/WarningModal';
import {
  learningResourceContentToHTML,
  learningResourceContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../util/articleContentConverter';
import { isUserProvidedEmbedDataValid } from '../../../util/embedTagHelpers';
import { findNodesByType } from '../../../util/slateHelpers';
import { SchemaShape, LicensesArrayOf } from '../../../shapes';

import LearningResourceMetadata from './LearningResourceMetadata';
import LearningResourceContent from './LearningResourceContent';
import {
  FormWorkflow,
  FormCopyright,
  FormHeader,
  formClasses,
  WarningModalWrapper,
} from '../../Form';
import { formatErrorMessage } from '../../Form/FormWorkflow';
import LearningResourceFootnotes from './LearningResourceFootnotes';
import { TYPE as footnoteType } from '../../../components/SlateEditor/plugins/footnote';
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
import config from '../../../config';

const findFootnotes = content =>
  content
    .reduce(
      (all, item) => [
        ...all,
        ...findNodesByType(item.value.document, footnoteType),
      ],
      [],
    )
    .filter(footnote => footnote.data.size > 0)
    .map(footnoteNode => footnoteNode.data.toJS());

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
    notes: article.notes || [],
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
    };
  }

  componentDidUpdate({ taxonomy: prevTaxonomy, initialModel: prevModel }) {
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
    return {
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
        agreementId: model.agreementId,
      },
      notes: model.notes,
      language: model.language,
      updated: model.updated,
      supportedLanguages: model.supportedLanguages,
    };
  }

  checkTouchedInvalidField = field => {
    if (field.touched || this.props.submitted) {
      return !field.valid;
    }
    return false;
  };

  async handleSubmit(evt) {
    evt.preventDefault();

    const {
      model,
      schema,
      revision,
      setSubmitted,
      createMessage,
      articleStatus,
    } = this.props;

    let status;
    if (articleStatus) {
      status = articleStatus.current;
    }

    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

    if (!isFormDirty(this.props)) {
      return;
    }

    if (status === 'PUBLISHED' || status === 'QUEUED_FOR_PUBLISHING') {
      try {
        await validateDraft(model.id, {
          ...this.getArticleFromModel(),
          revision,
        });
      } catch (error) {
        createMessage(formatErrorMessage(error));
        return;
      }
    }

    this.props.onUpdate({
      ...this.getArticleFromModel(),
      revision,
      updated: undefined,
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
      licenses,
      isSaving,
      articleStatus,
      fields,
      showSaved,
      history,
      articleId,
      userAccess,
      createMessage,
      revision,
    } = this.props;

    const { error } = this.state;
    const commonFieldProps = { bindInput, schema, submitted };
    const panels = [
      {
        id: 'learning-resource-content',
        title: t('form.contentSection'),
        className: 'u-4/6@desktop u-push-1/6@desktop',
        hasError: [
          schema.fields.title,
          schema.fields.introduction,
          schema.fields.content,
        ].some(field => checkTouchedInvalidField(field, submitted)),
        component: () => (
          <LearningResourceContent
            commonFieldProps={commonFieldProps}
            bindInput={bindInput}>
            <LearningResourceFootnotes
              t={t}
              footnotes={findFootnotes(model.content)}
            />
          </LearningResourceContent>
        ),
      },
      {
        id: 'learning-resource-copyright',
        title: t('form.copyrightSection'),
        className: 'u-6/6',
        hasError: [
          schema.fields.creators,
          schema.fields.rightsholders,
          schema.fields.processors,
          schema.fields.license,
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
          schema.fields.metaDescription,
          schema.fields.tags,
          schema.fields.metaImageAlt,
        ].some(field => checkTouchedInvalidField(field, submitted)),
        component: () => (
          <LearningResourceMetadata
            commonFieldProps={commonFieldProps}
            bindInput={bindInput}
            tags={tags}
            model={model}
          />
        ),
      },
      {
        id: 'learning-resource-workflow',
        title: t('form.workflowSection'),
        className: 'u-6/6',
        hasError: [schema.fields.notes].some(field =>
          checkTouchedInvalidField(field, submitted),
        ),
        component: () => (
          <FormWorkflow
            commonFieldProps={commonFieldProps}
            articleStatus={articleStatus}
            model={model}
            getArticle={this.getArticleFromModel}
            createMessage={createMessage}
            getArticleFromModel={this.getArticleFromModel}
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
        <Field right {...formClasses('form-actions')}>
          {error && <span className="c-errorMessage">{error}</span>}
          {model.id && (
            <Button onClick={() => this.setState({ showResetModal: true })}>
              {t('form.resetToProd.button')}
            </Button>
          )}

          <WarningModal
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
          <Button outline onClick={history.goBack} disabled={isSaving}>
            {t('form.abort')}
          </Button>
          <SaveButton
            data-testid="saveLearningResourceButton"
            isSaving={isSaving}
            showSaved={showSaved}
            defaultText="saveDraft"
          />
        </Field>
        <WarningModalWrapper
          showSaved={showSaved}
          fields={fields}
          model={model}
          initialModel={initialModel}
          text={t('warningModal.notSaved')}
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
  }),
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
  }),
  articleId: PropTypes.string,
  setModel: PropTypes.func.isRequired,
  setModelField: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.object).isRequired,
  schema: SchemaShape,
  licenses: LicensesArrayOf,
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
    metaImageAlt: {
      required: true,
      onlyValidateIf: model => model.metaImageId,
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
)(LearningResourceForm);
