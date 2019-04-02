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
import { Formik, Form } from 'formik';
import { withRouter } from 'react-router-dom';
import { Field } from '../../../components/Fields';
import SaveButton from '../../../components/SaveButton';
import {
  topicArticleContentToHTML,
  topicArticleContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../util/articleContentConverter';
import { parseEmbedTag, createEmbedTag } from '../../../util/embedTagHelpers';
import { SchemaShape, LicensesArrayOf, ArticleShape } from '../../../shapes';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  isFormikFormDirty,
  topicArticleRules,
  parseImageUrl,
} from '../../../util/formHelper';
import {
  FormikAlertModalWrapper,
  formClasses,
  FormikActionButton,
  FormikHeader,
} from '../../FormikForm';
import { formatErrorMessage } from '../../Form/FormWorkflow';
import { toEditArticle } from '../../../util/routeHelpers';
import { getArticle } from '../../../modules/article/articleApi';
import { validateDraft } from '../../../modules/draft/draftApi';
import { transformArticleFromApiVersion } from '../../../util/articleUtil';
import * as articleStatuses from '../../../util/constants/ArticleStatus';
import AlertModal from '../../../components/AlertModal';
import validateFormik from '../../../components/formikValidationSchema';
import TopicArticleAccordionPanels from './TopicArticleAccordionPanels';

export const getInitialValues = (article = {}) => {
  const visualElement = parseEmbedTag(article.visualElement);
  const metaImageId = parseImageUrl(article.metaImage);
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
    license:
      article.copyright && article.copyright.license
        ? article.copyright.license.license
        : DEFAULT_LICENSE.license,
    metaDescription: plainTextToEditorValue(article.metaDescription, true),
    metaImageId,
    metaImageAlt: article.metaImage ? article.metaImage.alt : '',
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
    this.onResetFormToProd = this.onResetFormToProd.bind(this);
    this.getArticle = this.getArticle.bind(this);
    this.state = {
      showResetModal: false,
      savedToServer: false,
    };
  }

  async onResetFormToProd({ setValues }) {
    const { articleId, selectedLanguage, t } = this.props;
    try {
      if (this.state.error) {
        this.setState({ error: undefined });
      }
      const articleFromProd = await getArticle(articleId);
      const convertedArticle = transformArticleFromApiVersion(
        articleFromProd,
        selectedLanguage,
      );
      const initialValues = getInitialValues(convertedArticle);
      this.setState({ showResetModal: false }, () => setValues(initialValues));
    } catch (err) {
      if (err.status === 404) {
        this.setState({
          showResetModal: false,
          error: t('errorMessage.noArticleInProd'),
        });
      }
    }
  }

  getArticle(values) {
    const { licenses } = this.props;
    const emptyField = values.id ? '' : undefined;
    const visualElement = createEmbedTag(values.visualElement);
    const content = topicArticleContentToHTML(values.content);

    const article = {
      id: values.id,
      title: values.title,
      introduction: editorValueToPlainText(values.introduction),
      tags: values.tags,
      content: content || emptyField,
      visualElement: visualElement || emptyField,
      metaDescription: editorValueToPlainText(values.metaDescription),
      articleType: 'topic-article',
      copyright: {
        license: licenses.find(license => license.license === values.license),
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
        agreementId: values.agreementId,
      },
      notes: values.notes || [],
      metaImage: {
        id: values.metaImageId,
        alt: values.metaImageAlt,
      },
      language: values.language,
      updated: values.updated,
      supportedLanguages: values.supportedLanguages,
    };

    return article;
  }

  async handleSubmit(values, actions) {
    const { revision, createMessage, articleStatus, onUpdate } = this.props;
    const status = articleStatus ? articleStatus.current : undefined;

    if (status === articleStatuses.QUEUED_FOR_PUBLISHING) {
      try {
        await validateDraft(values.id, {
          ...this.getArticle(values),
          revision,
        });
      } catch (error) {
        if (error && error.json && error.json.messages) {
          createMessage(formatErrorMessage(error));
        }
        return;
      }
    }
    await onUpdate({
      ...this.getArticle(values),
      revision,
    });
    actions.setSubmitting(false);
    actions.setFieldValue('notes', [], false);
    this.setState({ savedToServer: true });
  }

  render() {
    const { t, history, article, ...rest } = this.props;

    const { error, showResetModal, savedToServer } = this.state;
    const initVal = getInitialValues(article);
    return (
      <Formik
        initialValues={initVal}
        validateOnBlur={false}
        onSubmit={this.handleSubmit}
        enableReinitialize
        validate={values => validateFormik(values, topicArticleRules, t)}>
        {({
          values,
          initialValues,
          dirty,
          isSubmitting,
          setValues,
          errors,
          touched,
        }) => (
          <Form {...formClasses()}>
            <FormikHeader
              values={values}
              type={values.articleType}
              editUrl={lang =>
                toEditArticle(values.id, values.articleType, lang)
              }
            />

            <TopicArticleAccordionPanels
              values={values}
              errors={errors}
              article={article}
              touched={touched}
              getArticle={() => this.getArticle(values)}
              {...rest}
            />

            <Field right>
              {error && <span className="c-errorMessage">{error}</span>}
              {values.id && (
                <FormikActionButton
                  onClick={() => this.setState({ showResetModal: true })}>
                  {t('form.resetToProd.button')}
                </FormikActionButton>
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
                    onClick: () => this.onResetFormToProd({ setValues }),
                  },
                ]}
                onCancel={() => this.setState({ showResetModal: false })}
              />
              <FormikActionButton
                outline
                onClick={history.goBack}
                disabled={isSubmitting}>
                {t('form.abort')}
              </FormikActionButton>
              <SaveButton
                {...formClasses}
                isSaving={isSubmitting}
                showSaved={
                  savedToServer &&
                  !isFormikFormDirty({
                    values,
                    initialValues,
                    showSaved: false,
                    dirty,
                  })
                }>
                {t('form.save')}
              </SaveButton>
            </Field>
            <FormikAlertModalWrapper
              isSubmitting={isSubmitting}
              severity="danger"
              text={t('alertModal.notSaved')}
            />
          </Form>
        )}
      </Formik>
    );
  }
}

TopicArticleForm.propTypes = {
  validationErrors: SchemaShape,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  revision: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  updateArticleStatus: PropTypes.func,
  licenses: LicensesArrayOf,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  article: ArticleShape,
};

export default compose(
  injectT,
  withRouter,
)(TopicArticleForm);
