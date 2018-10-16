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
import { injectT } from 'ndla-i18n';
import { withRouter } from 'react-router-dom';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from 'ndla-accordion';
import Button from 'ndla-button';
import config from '../../../config';
import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
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
import { articleConverter } from '../../../modules/draft/draft';

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

const parseImageUrl = metaImage => {
  if (!metaImage || !metaImage.url || metaImage.url.length === 0) {
    return '';
  }

  const splittedUrl = metaImage.url.split('/');
  return splittedUrl[splittedUrl.length - 1];
};

export const getInitialModel = (
  article = {},
  taxonomy = { resourceTypes: [], filter: [], topics: [] },
  language,
) => {
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
    resourceTypes: taxonomy.resourceTypes || [],
    filter: taxonomy.filter || [],
    topics: taxonomy.topics || [],
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
    };
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const {
      model,
      schema,
      revision,
      setSubmitted,
      fields,
      initialModel,
      showSaved,
    } = this.props;

    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }
    if (!isFormDirty(fields, initialModel, model, showSaved)) {
      return;
    }
    this.props.onUpdate(
      {
        ...this.getArticleFromModel(),
        revision,
        updated: undefined,
      },
      {
        articleId: model.id,
        articleName: model.title,
        resourceTypes: model.resourceTypes,
        filter: model.filter,
        topics: model.topics,
        language: model.language,
      },
    );
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
      taxonomyIsLoading,
      history,
    } = this.props;

    const { error } = this.state;
    const commonFieldProps = { bindInput, schema, submitted };
    const panels = [
      {
        id: 'learning-resource-content',
        title: t('form.contentSection'),
        component: (
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
        component: (
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
        component: (
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
        component: (
          <FormWorkflow
            commonFieldProps={commonFieldProps}
            articleStatus={articleStatus}
            model={model}
            getArticle={this.getArticleFromModel}
          />
        ),
      },
    ];
    if (model.id && config.taxonomyEnabled) {
      panels.splice(1, 0, {
        id: 'learning-resource-taxonomy',
        title: t('form.taxonomytSection'),
        component: (
          <LearningResourceTaxonomy
            commonFieldProps={commonFieldProps}
            model={model}
            taxonomyIsLoading={taxonomyIsLoading}
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
                    isOpen={openIndexes.includes(panel.id)}>
                    {panel.title}
                  </AccordionBar>
                  <AccordionPanel
                    id={panel.id}
                    isOpen={openIndexes.includes(panel.id)}>
                    <div className="u-4/6@desktop u-push-1/6@desktop">
                      {panel.component}
                    </div>
                  </AccordionPanel>
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
          />
        </Field>
        <WarningModalWrapper
          schema={schema}
          showSaved={showSaved}
          fields={fields}
          model={model}
          initialModel={initialModel}
          handleSubmit={this.handleSubmit}
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
  taxonomyIsLoading: PropTypes.bool,
  selectedLanguage: PropTypes.string,
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
