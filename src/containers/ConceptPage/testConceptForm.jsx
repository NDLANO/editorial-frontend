import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Input } from '@ndla/forms';
import { Formik, Form, ErrorMessage } from 'formik';
import { FieldHeader } from '@ndla/forms';
import FormikActionButton from '../FormikForm/components/FormikActionButton.jsx';
import SaveButton from '../../components/SaveButton.jsx';
import { formClasses } from '../FormikForm';
import * as conceptApi from '../../../src/modules/concept/conceptApi';
import HeaderWithLanguageConcept from '../../components/HeaderWithLanguage/HeaderWithLanguageConcept';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import { colors, fonts, spacing } from '@ndla/core';
import Field from '../../../src/components/Field';
import { Concept } from '@ndla/icons/editor';
import FormikField from '../../components/FormikField/FormikField';
import { FormikIngress } from '../FormikForm';
import RichTextEditor from '../../components/SlateEditor/RichTextEditor';
import { listTypes } from '../../components/SlateEditor/plugins/externalPlugins';
import createNoEmbedsPlugin from '../../components/SlateEditor/plugins/noEmbed';
import headingPlugin from '../../components/SlateEditor/plugins/heading';
import createLinkPlugin, {
  TYPE as link,
} from '../../components/SlateEditor/plugins/link';
import paragraphPlugin from '../../components/SlateEditor/plugins/paragraph';
import blockquotePlugin from '../../components/SlateEditor/plugins/blockquotePlugin';
import { schema } from '../../components/SlateEditor/editorSchema';
import {
  topicArticleContentToHTML,
  topicArticleContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../util/articleContentConverter';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import ConceptContent from './ConceptContent';
import ConceptMetaData from './ConceptMetaData';
import HeaderWithLanguage from '../../components/HeaderWithLanguage';
import {
  DEFAULT_LICENSE,
  isFormikFormDirty,
  parseCopyrightContributors,
} from '../../util/formHelper';
import { formClasses as classes, FormikAlertModalWrapper } from '../FormikForm';
import validateFormik from '../../components/formikValidationSchema';
import { ConceptShape } from '../../shapes';
import AlertModal from '../../components/AlertModal';
import { fetchConcept } from '../../modules/concept/conceptApi';
import { transformConceptFromApiVersion } from '../../util/articleUtil';

export const getInitialValues = (concept = {}) => {
  return {
    id: concept.id,
    title: concept.title || '',
    language: 'nb',
    description: plainTextToEditorValue(concept.content || '', true),
    supportedLanguages: [],
    creators: parseCopyrightContributors(concept, 'creators'),
    processors: parseCopyrightContributors(concept, 'processors'),
    rightsholders: parseCopyrightContributors(concept, 'rightsholders'),
    origin:
      concept.copyright && concept.copyright.origin
        ? concept.copyright.origin
        : '',
    license:
      concept.copyright && concept.copyright.license
        ? concept.copyright.license.license
        : DEFAULT_LICENSE.license,
  };
};

class testConceptForm extends Component {
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

  componentDidUpdate({ concept: { id: prevId, language: prevLanguage } }) {
    const { concept } = this.props;
    const { id, language } = concept;
    if (id !== prevId) {
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
      concept: { id },
      t,
    } = this.props;
    try {
      if (this.state.error) {
        this.setState({ error: undefined });
      }
      const conceptFromProd = await fetchConcept(id, language);
      const convertedConcept = transformConceptFromApiVersion({
        ...conceptFromProd,
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
                    onClick={history.goBack}
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

testConceptForm.propTypes = {
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
  concept: ConceptShape,
  applicationError: PropTypes.func.isRequired,
};

export default compose(
  injectT,
  withRouter,
)(testConceptForm);
