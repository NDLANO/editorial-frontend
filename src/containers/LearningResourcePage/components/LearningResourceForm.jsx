/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { withRouter } from 'react-router-dom';
import isEmpty from 'lodash/fp/isEmpty';
import { Formik, Form } from 'formik';
import Field from '../../../components/Field';
import SaveButton from '../../../components/SaveButton';
import AlertModal from '../../../components/AlertModal';
import {
  learningResourceContentToHTML,
  learningResourceContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../util/articleContentConverter';
import { LicensesArrayOf, ArticleShape } from '../../../shapes';
import {
  FormikAlertModalWrapper,
  FormikActionButton,
  formClasses,
} from '../../FormikForm';
import validateFormik from '../../../components/formikValidationSchema';
import LearningResourcePanels from './LearningResourcePanels';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  isFormikFormDirty,
  parseImageUrl,
  learningResourceRules,
} from '../../../util/formHelper';
import { toEditArticle } from '../../../util/routeHelpers';
import { getArticle } from '../../../modules/article/articleApi';
import { validateDraft } from '../../../modules/draft/draftApi';
import { transformArticleFromApiVersion } from '../../../util/articleUtil';
import * as articleStatuses from '../../../util/constants/ArticleStatus';
import { formatErrorMessage } from '../../../util/apiHelpers';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';

export const getInitialValues = (article = {}) => {
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
    updated: article.updated,
    published: article.published,
    updatePublished: false,
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
    language: article.language,
    articleType: 'standard',
    status: article.status || [],
    notes: [],
  };
};

class LearningResourceForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getArticleFromSlate = this.getArticleFromSlate.bind(this);
    this.onReset = this.onReset.bind(this);
    this.getPublishedDate = this.getPublishedDate.bind(this);
    this.state = {
      showResetModal: false,
      savedToServer: false,
    };
    this.formik = React.createRef();
  }

  componentDidUpdate({
    article: { language: prevLanguage, id: prevId, status: prevStatus },
  }) {
    const { article } = this.props;
    const { language, id, status } = article;
    if (
      language !== prevLanguage ||
      id !== prevId ||
      (status && prevStatus && status.current !== prevStatus.current)
    ) {
      if (this.formik.current) {
        // Since we removed enableReinitialize we need to manually reset the form for these cases
        this.formik.current.resetForm();
      }
      this.setState({
        savedToServer: false,
      });
    }
  }

  async onReset(setvalues) {
    const {
      article: { language, id },
      t,
    } = this.props;
    try {
      if (this.state.error) {
        this.setState({ error: undefined });
      }
      const articleFromProd = await getArticle(id, language);
      const convertedArticle = transformArticleFromApiVersion({
        ...articleFromProd,
        language,
      });
      const initialValues = getInitialValues(convertedArticle);
      setvalues(initialValues);
      this.setState({ showResetModal: false });
    } catch (err) {
      if (err.status === 404) {
        this.setState({
          showResetModal: false,
          error: t('errorMessage.noArticleInProd'),
        });
      }
    }
  }

  getPublishedDate(values, preview = false) {
    const { article } = this.props;
    if (isEmpty(values.published)) {
      return undefined;
    }
    if (preview) {
      return values.published;
    }

    const hasPublishedDateChanged = article.published !== values.published;
    if (hasPublishedDateChanged || values.updatePublished) {
      return values.published;
    }
    return undefined;
  }

  getArticleFromSlate(values, preview = false) {
    const { licenses } = this.props;
    const content = learningResourceContentToHTML(values.content);
    const emptyContent = values.id ? '' : undefined;
    const article = {
      id: values.id,
      title: values.title,
      introduction: editorValueToPlainText(values.introduction),
      tags: values.tags,
      content: content && content.length > 0 ? content : emptyContent,
      metaImage: {
        id: values.metaImageId,
        alt: values.metaImageAlt,
      },
      metaDescription: editorValueToPlainText(values.metaDescription),
      articleType: 'standard',
      copyright: {
        license: licenses.find(license => license.license === values.license),
        origin: values.origin,
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
      },
      notes: values.notes || [],
      language: values.language,
      published: this.getPublishedDate(values, preview),
      supportedLanguages: values.supportedLanguages,
    };

    return article;
  }

  async handleSubmit(values, actions) {
    actions.setSubmitting(true);
    const {
      revision,
      createMessage,
      articleStatus,
      onUpdate,
      applicationError,
    } = this.props;

    const status = articleStatus ? articleStatus.current : undefined;

    if (status === articleStatuses.QUEUED_FOR_PUBLISHING) {
      try {
        await validateDraft(values.id, {
          ...this.getArticleFromSlate(values),
          revision,
        });
      } catch (error) {
        actions.setSubmitting(false);
        createMessage(formatErrorMessage(error));
        return;
      }
    }
    try {
      await onUpdate({
        ...this.getArticleFromSlate(values),
        revision,
      });
      actions.resetForm();
      actions.setFieldValue('notes', [], false);
      this.setState({ savedToServer: true });
    } catch (err) {
      applicationError(err);
      actions.setSubmitting(false);
      this.setState({ savedToServer: false });
    }
  }

  render() {
    const { t, history, article, onUpdate, ...rest } = this.props;
    const { error, savedToServer } = this.state;
    const initialValues = getInitialValues(article);
    return (
      <Formik
        initialValues={initialValues}
        validateOnBlur={false}
        ref={this.formik}
        onSubmit={this.handleSubmit}
        validate={values => validateFormik(values, learningResourceRules, t)}>
        {({ values, dirty, isSubmitting, setValues, errors, touched }) => {
          const formIsDirty = isFormikFormDirty({
            values,
            initialValues,
            dirty,
            type: 'learningResource',
          });
          return (
            <Fragment>
              <Form {...formClasses()}>
                <HeaderWithLanguage
                  values={values}
                  type="standard"
                  editUrl={lang =>
                    toEditArticle(values.id, values.articleType, lang)
                  }
                  getArticle={() => this.getArticleFromSlate(values)}
                />
                <LearningResourcePanels
                  values={values}
                  errors={errors}
                  article={article}
                  touched={touched}
                  updateNotes={onUpdate}
                  getArticle={() => this.getArticleFromSlate(values)}
                  formIsDirty={formIsDirty}
                  {...rest}
                />
                <Field right>
                  {error && <span className="c-errorMessage">{error}</span>}
                  {values.id && (
                    <FormikActionButton
                      data-testid="resetToProd"
                      onClick={() => this.setState({ showResetModal: true })}>
                      {t('form.resetToProd.button')}
                    </FormikActionButton>
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
                        onClick: () => this.onReset(setValues),
                      },
                    ]}
                    onCancel={() => this.setState({ showResetModal: false })}
                  />
                  <FormikActionButton
                    outline
                    onClick={evt => {
                      evt.stopPropagation();
                      history.goBack();
                    }}
                    disabled={isSubmitting}>
                    {t('form.abort')}
                  </FormikActionButton>
                  <SaveButton
                    data-testid="saveLearningResourceButton"
                    {...formClasses}
                    isSaving={isSubmitting}
                    defaultText="saveDraft"
                    formIsDirty={formIsDirty}
                    showSaved={savedToServer && !formIsDirty}>
                    {t('form.save')}
                  </SaveButton>
                </Field>
                <FormikAlertModalWrapper
                  isSubmitting={isSubmitting}
                  formIsDirty={formIsDirty}
                  severity="danger"
                  text={t('alertModal.notSaved')}
                />
              </Form>
            </Fragment>
          );
        }}
      </Formik>
    );
  }
}

LearningResourceForm.propTypes = {
  licenses: LicensesArrayOf,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  revision: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  updateArticleStatus: PropTypes.func,
  taxonomy: PropTypes.shape({
    resourceTypes: PropTypes.array,
    filter: PropTypes.array,
    topics: PropTypes.array,
    loading: PropTypes.bool,
  }),
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  userAccess: PropTypes.string,
  article: ArticleShape,
  applicationError: PropTypes.func.isRequired,
};

export default compose(
  injectT,
  withRouter,
)(LearningResourceForm);
