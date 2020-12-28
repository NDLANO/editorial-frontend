/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import { Formik, Form } from 'formik';
import { injectT } from '@ndla/i18n';
import isEmpty from 'lodash/fp/isEmpty';
import Field from '../../../components/Field';
import * as messageActions from '../../Messages/messagesActions';
import {
  plainTextToEditorValue,
  editorValueToPlainText,
} from '../../../util/articleContentConverter';
import ConceptContent from './ConceptContent';
import ConceptMetaData from './ConceptMetaData';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import {
  isFormikFormDirty,
  parseCopyrightContributors,
  parseImageUrl,
} from '../../../util/formHelper';
import { FormikActionButton } from '../../FormikForm';
import { FormikAlertModalWrapper, formClasses } from '../../FormikForm';
import ConceptCopyright from './ConceptCopyright';
import validateFormik from '../../../components/formikValidationSchema';
import { ConceptShape, LicensesArrayOf, SubjectShape } from '../../../shapes';
import SaveButton from '../../../components/SaveButton';
import { toEditConcept } from '../../../util/routeHelpers.js';
import { nullOrUndefined } from '../../../util/articleUtil';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import * as articleStatuses from '../../../util/constants/ArticleStatus';
import { createEmbedTag, parseEmbedTag } from '../../../util/embedTagHelpers';
import FormikField from '../../../components/FormikField';
import ConceptArticles from './ConceptArticles';

const getInitialValues = (concept = {}, subjects = []) => {
  const visualElement = parseEmbedTag(concept.visualElement?.visualElement);
  const metaImageId = parseImageUrl(concept.metaImage);
  return {
    id: concept.id,
    title: concept.title || '',
    language: concept.language,
    updated: concept.updated,
    updateCreated: false,
    subjects:
      concept.subjectIds?.map(subjectId =>
        subjects.find(subject => subject.id === subjectId),
      ) || [],
    created: concept.created,
    conceptContent: plainTextToEditorValue(concept.content || '', true),
    supportedLanguages: concept.supportedLanguages || [],
    creators: parseCopyrightContributors(concept, 'creators'),
    rightsholders: parseCopyrightContributors(concept, 'rightsholders'),
    processors: parseCopyrightContributors(concept, 'processors'),
    source: concept && concept.source ? concept.source : '',
    license: concept.copyright?.license?.license,
    metaImageId,
    metaImageAlt: concept.metaImage?.alt || '',
    tags: concept.tags || [],
    articleIds: concept.articleIds || [],
    status: concept.status || {},
    visualElement: visualElement || {},
  };
};

const rules = {
  title: {
    required: true,
  },
  conceptContent: {
    required: true,
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: values => !!values.metaImageId,
  },
};

const FormWrapper = ({ inModal, children }) => {
  if (inModal) {
    return <div {...formClasses()}>{children}</div>;
  }
  return <Form>{children}</Form>;
};

FormWrapper.propTypes = {
  inModal: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

class ConceptForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedToServer: false,
      translateOnContinue: false,
    };
    this.formik = React.createRef();
  }

  componentDidUpdate({ concept: prevConcept }) {
    const { concept } = this.props;
    if (
      concept.language !== prevConcept.language ||
      concept.id !== prevConcept.id
    ) {
      this.setState({ savedToServer: false });
      if (this.formik.current) {
        this.formik.current.resetForm();
      }
    }
    this.formik = React.createRef();
  }

  setTranslateOnContinue = translateOnContinue => {
    this.setState({ translateOnContinue: translateOnContinue });
  };

  getCreatedDate = values => {
    if (isEmpty(values.created)) {
      return undefined;
    }
    const { concept } = this.props;

    const hasCreatedDateChanged = concept.created !== values.created;
    if (hasCreatedDateChanged) {
      return values.created;
    }
    return undefined;
  };

  getConcept = values => {
    const { licenses } = this.props;
    const metaImage = values?.metaImageId
      ? {
          id: values.metaImageId,
          alt: values.metaImageAlt,
        }
      : nullOrUndefined(values?.metaImageId);
    const visualElement = createEmbedTag(
      isEmpty(values.visualElement) ? {} : values.visualElement,
    );

    return {
      id: values.id,
      title: values.title,
      content: editorValueToPlainText(values.conceptContent),
      language: values.language,
      supportedLanguages: values.supportedLanguages,
      copyright: {
        license: licenses.find(license => license.license === values.license),
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
        agreementId: values.agreementId,
      },
      source: values.source,
      subjectIds: values.subjects.map(subject => subject.id),
      tags: values.tags,
      created: this.getCreatedDate(values),
      articleIds: values.articleIds,
      metaImage,
      visualElement,
    };
  };

  handleSubmit = async formik => {
    formik.setSubmitting(true);
    const {
      onUpdate,
      concept,
      applicationError,
      updateConceptAndStatus,
    } = this.props;
    const { revision } = concept;
    const values = formik.values;
    const initialValues = formik.initialValues;
    const initialStatus = concept.status?.current;
    const newStatus = formik.values.status?.current;
    const statusChange = initialStatus !== newStatus;

    try {
      if (statusChange) {
        // if editor is not dirty, OR we are unpublishing, we don't save before changing status
        const skipSaving =
          newStatus === articleStatuses.UNPUBLISHED ||
          !isFormikFormDirty({
            values,
            initialValues,
            dirty: true,
          });
        await updateConceptAndStatus(
          this.getConcept(values),
          newStatus,
          !skipSaving,
        );
      } else {
        await onUpdate({
          ...this.getConcept(values),
          revision,
        });
      }
      formik.resetForm();
      formik.setSubmitting(false);
      this.setState({ savedToServer: true });
    } catch (err) {
      applicationError(err);
      formik.setSubmitting(false);
      this.setState({ savedToServer: false });
    }
  };

  render() {
    const {
      concept,
      createMessage,
      fetchConceptTags,
      fetchStateStatuses,
      history,
      inModal,
      isNewlyCreated,
      licenses,
      locale,
      onClose,
      onUpdate,
      subjects,
      t,
      translateConcept,
      ...rest
    } = this.props;
    const { savedToServer, translateOnContinue } = this.state;
    const panels = ({ errors, touched }) => [
      {
        id: 'concept-content',
        title: t('form.contentSection'),
        className: 'u-4/6@desktop u-push-1/6@desktop',
        hasError: ['title', 'conceptContent'].some(field => !!errors[field]),

        component: props => <ConceptContent classes={formClasses} {...props} />,
      },
      {
        id: 'concept-copyright',
        title: t('form.copyrightSection'),
        className: 'u-6/6',
        hasError: ['creators', 'license'].some(field => !!errors[field]),
        component: ({ values }) => (
          <ConceptCopyright
            licenses={licenses}
            disableAgreements
            label={t('form.concept.source')}
            values={values}
          />
        ),
      },
      {
        id: 'concept-metadataSection',
        title: t('form.metadataSection'),
        className: 'u-6/6',
        hasError: ['tags', 'metaImageAlt'].some(field => !!errors[field]),

        component: props => (
          <ConceptMetaData
            classes={formClasses}
            concept={concept}
            fetchTags={fetchConceptTags}
            subjects={subjects}
            locale={locale}
          />
        ),
      },
      {
        id: 'concept-articles',
        title: t('form.articles'),
        className: 'u-6/6',
        hasError: ['articleIds'].some(field => !!errors[field]),
        component: ({ values }) => (
          <FormikField name={'articleIds'}>
            {({ field, form }) => (
              <ConceptArticles
                articleIds={values.articleIds}
                field={field}
                form={form}
              />
            )}
          </FormikField>
        ),
      },
    ];

    const initialValues = getInitialValues(concept, subjects);

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={() => ({})}
        innerRef={this.formik}
        enableReinitialize
        validateOnMount
        validate={values => validateFormik(values, rules, t)}>
        {formikProps => {
          const {
            values,
            dirty,
            isSubmitting,
            error,
            errors,
            setFieldValue,
          } = formikProps;
          const formIsDirty = isFormikFormDirty({
            values,
            initialValues,
            dirty,
          });
          return (
            <FormWrapper inModal={inModal} {...formClasses()}>
              <HeaderWithLanguage
                content={concept}
                editUrl={lang => toEditConcept(values.id, lang)}
                getEntity={() => this.getConcept(values)}
                translateArticle={translateConcept}
                type="concept"
                setTranslateOnContinue={this.setTranslateOnContinue}
                values={values}
              />
              <Accordion openIndexes={['concept-content']}>
                {({ openIndexes, handleItemClick }) => (
                  <AccordionWrapper>
                    {panels(formikProps).map(panel => (
                      <Fragment key={panel.id}>
                        <AccordionBar
                          panelId={panel.id}
                          hasError={panel.hasError}
                          ariaLabel={panel.title}
                          title={panel.title}
                          onClick={() => handleItemClick(panel.id)}
                          isOpen={openIndexes.includes(panel.id)}
                        />
                        {openIndexes.includes(panel.id) && (
                          <AccordionPanel
                            id={panel.id}
                            updateNotes={this.onUpdate}
                            hasError={panel.hasError}
                            getConcept={() => this.getConcept(values)}
                            isOpen={openIndexes.includes(panel.id)}>
                            <div className={panel.className}>
                              {panel.component({
                                values,
                                subjects,
                                closePanel: () => handleItemClick(panel.id),
                                ...rest,
                              })}
                            </div>
                          </AccordionPanel>
                        )}
                      </Fragment>
                    ))}
                  </AccordionWrapper>
                )}
              </Accordion>
              {inModal ? (
                <Field right>
                  <FormikActionButton outline onClick={onClose}>
                    {t('form.abort')}
                  </FormikActionButton>
                  <SaveButton
                    {...formClasses}
                    isSaving={isSubmitting}
                    formIsDirty={formIsDirty}
                    showSaved={savedToServer && !formIsDirty}
                    submit={!inModal}
                    onClick={evt => {
                      evt.preventDefault();
                      this.handleSubmit(formikProps);
                    }}>
                    {t('form.save')}
                  </SaveButton>
                </Field>
              ) : (
                <EditorFooter
                  isSubmitting={isSubmitting}
                  formIsDirty={formIsDirty}
                  savedToServer={savedToServer}
                  values={values}
                  error={error}
                  errors={errors}
                  getEntity={() => this.getConcept(values)}
                  entityStatus={concept.status}
                  createMessage={createMessage}
                  showSimpleFooter={!concept.id}
                  setFieldValue={setFieldValue}
                  onSaveClick={() => {
                    this.handleSubmit(formikProps);
                  }}
                  getStateStatuses={fetchStateStatuses}
                  hideSecondaryButton
                  isConcept
                  isNewlyCreated={isNewlyCreated}
                />
              )}
              {!inModal && (
                <FormikAlertModalWrapper
                  formIsDirty={formIsDirty}
                  isSubmitting={isSubmitting}
                  onContinue={translateOnContinue ? translateConcept : () => {}}
                  severity="danger"
                  text={t('alertModal.notSaved')}
                />
              )}
            </FormWrapper>
          );
        }}
      </Formik>
    );
  }
}

ConceptForm.propTypes = {
  applicationError: PropTypes.func.isRequired,
  concept: ConceptShape,
  createMessage: PropTypes.func.isRequired,
  fetchConceptTags: PropTypes.func.isRequired,
  fetchStateStatuses: PropTypes.func,
  history: PropTypes.shape({
    goBack: PropTypes.func,
    push: PropTypes.func.isRequired,
  }).isRequired,
  inModal: PropTypes.bool,
  isNewlyCreated: PropTypes.bool,
  licenses: LicensesArrayOf,
  locale: PropTypes.string,
  onClose: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape),
  translateConcept: PropTypes.func,
  updateConceptAndStatus: PropTypes.func,
};

const mapDispatchToProps = {
  applicationError: messageActions.applicationError,
};

export default compose(
  injectT,
  withRouter,
  connect(undefined, mapDispatchToProps),
)(ConceptForm);
