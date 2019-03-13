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
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
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
import TopicArticleMetadata from './TopicArticleMetadata';
import TopicArticleContent from './TopicArticleContent';
import { SchemaShape, LicensesArrayOf, ArticleShape } from '../../../shapes';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  isFormikFormDirty,
  topicArticleRules,
} from '../../../util/formHelper';
import { FormActionButton, AlertModalWrapper } from '../../Form';
import FormikField from '../../../components/FormikField';
import {
  FormikCopyright,
  FormikWorkflow,
  FormikAddNotes,
  formClasses,
  FormikHeader,
} from '../../FormikForm';
import { formatErrorMessage } from '../../Form/FormWorkflow';
import { toEditArticle } from '../../../util/routeHelpers';
import { getArticle } from '../../../modules/article/articleApi';
import { validateDraft } from '../../../modules/draft/draftApi';
import { articleConverter } from '../../../modules/draft/draft';
import * as articleStatuses from '../../../util/constants/ArticleStatus';
import AlertModal from '../../../components/AlertModal';
import validateFormik from '../../../components/formikValidationSchema';

export const getInitialValues = (article = {}) => {
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
      const convertedArticle = articleConverter(
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
        ...values.copyright,
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
        agreementId: values.agreementId,
      },
      notes: values.notes || [],
      language: values.language,
      supportedLanguages: values.supportedLanguages,
    };

    return article;
  }

  async handleSubmit(values, actions, initialValues) {
    console.log('HKKHGKHGKKHKGKKG');
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
    onUpdate({
      ...this.getArticle(values),
      revision,
    });
    actions.setFieldValue('notes', [], false);
    this.setState({ savedToServer: true });
  }

  render() {
    const {
      t,
      tags,
      isSaving,
      articleStatus,
      licenses,
      history,
      revision,
      article,
      createMessage,
    } = this.props;
    const panels = ({ values, errors, touched, setFieldValue }) => [
      {
        id: 'topic-article-content',
        title: t('form.contentSection'),
        className: 'u-4/6@desktop u-push-1/6@desktop',
        hasError: [
          'title',
          'introduction',
          'content',
          'visualElement',
          'visualElement.alt',
          'visualElement.caption',
        ].some(field => !!errors[field] && touched[field]),
        component: <TopicArticleContent tags={tags} values={values} />,
      },
      {
        id: 'topic-article-copyright',
        title: t('form.copyrightSection'),
        className: 'u-6/6',
        hasError: ['creators', 'rightsholders', 'processors', 'license'].some(
          field => !!errors[field] && touched[field],
        ),
        component: <FormikCopyright values={values} licenses={licenses} />,
      },
      {
        id: 'topic-article-metadata',
        title: t('form.metadataSection'),
        className: 'u-6/6',
        hasError: ['metaDescription', 'tags'].some(
          field => !!errors[field] && touched[field],
        ),
        component: <TopicArticleMetadata tags={tags} />,
      },
      {
        id: 'topic-article-workflow',
        title: t('form.workflowSection'),
        className: 'u-6/6',
        hasError: ['notes'].some(field => !!errors[field] && touched[field]),
        component: (
          <FormikWorkflow
            articleStatus={articleStatus}
            values={values}
            getArticle={() => this.getArticle(values)}
            createMessage={createMessage}
            revision={revision}>
            <FormikField name="notes" showError={false}>
              {({ field }) => (
                <FormikAddNotes
                  showError={touched[field.name] && !!errors[field.name]}
                  labelHeading={t('form.notes.heading')}
                  labelAddNote={t('form.notes.add')}
                  article={article}
                  labelRemoveNote={t('form.notes.remove')}
                  labelWarningNote={errors[field.name]}
                  {...field}
                />
              )}
            </FormikField>
          </FormikWorkflow>
        ),
      },
    ];
    const { error, showResetModal, savedToServer } = this.state;
    const initVal = getInitialValues(article);
    return (
      <Formik
        initialValues={initVal}
        validateOnBlur={false}
        onSubmit={(values, actions) =>
          this.handleSubmit(values, actions, initVal)
        }
        validate={values => validateFormik(values, topicArticleRules, t)}
        enableReinitialize>
        {formikProps => {
          const { values, initialValues, touched, dirty } = formikProps;
          return (
            <Form {...formClasses()}>
              <FormikHeader
                values={values}
                type={values.articleType}
                editUrl={lang =>
                  toEditArticle(values.id, values.articleType, lang)
                }
              />
              <Accordion openIndexes={['topic-article-content']}>
                {({ openIndexes, handleItemClick }) => (
                  <AccordionWrapper>
                    {panels(formikProps).map(panel => (
                      <Fragment key={panel.id}>
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
                              {panel.component}
                            </div>
                          </AccordionPanel>
                        )}
                      </Fragment>
                    ))}
                  </AccordionWrapper>
                )}
              </Accordion>
              <Field right>
                {error && <span className="c-errorMessage">{error}</span>}
                {values.id && (
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
                      onClick: () => this.onResetFormToProd(formikProps),
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
                  showSaved={
                    savedToServer &&
                    !isFormikFormDirty({
                      values,
                      initialValues,
                      showSaved: false,
                      touched,
                      dirty,
                    })
                  }>
                  {t('form.save')}
                </SaveButton>
              </Field>
              <AlertModalWrapper
                isFormik
                model={values}
                {...formikProps}
                severity="danger"
                text={t('alertModal.notSaved')}
              />
            </Form>
          );
        }}
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
  isSaving: PropTypes.bool.isRequired,
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
)(TopicArticleForm);
