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
import { FormikAlertModalWrapper, formClasses } from '../../FormikForm';
import ConceptCopyright from './ConceptCopyright';
import validateFormik from '../../../components/formikValidationSchema';
import { ConceptShape, LicensesArrayOf, SubjectShape } from '../../../shapes';
import { toEditConcept } from '../../../util/routeHelpers.js';
import { nullOrUndefined } from '../../../util/articleUtil';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import * as articleStatuses from '../../../util/constants/ArticleStatus';

const getInitialValues = (concept = {}, subjects = []) => {
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
    articleId: concept.articleId,
    status: concept.status || {},
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
      articleId: values.articleId,
      metaImage,
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
      t,
      licenses,
      history,
      concept,
      onUpdate,
      onClose,
      inModal,
      subjects,
      createMessage,
      fetchStateStatuses,
      fetchConceptTags,
      ...rest
    } = this.props;
    const { savedToServer } = this.state;
    const panels = ({ errors, touched }) => [
      {
        id: 'concept-content',
        title: t('form.contentSection'),
        className: 'u-4/6@desktop u-push-1/6@desktop',
        hasError: ['title', 'conceptContent'].some(
          field => !!errors[field] && touched[field],
        ),

        component: props => <ConceptContent classes={formClasses} {...props} />,
      },
      {
        id: 'concept-copyright',
        title: t('form.copyrightSection'),
        className: 'u-6/6',
        hasError: ['creators', 'license'].some(
          field => !!errors[field] && touched[field],
        ),
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
        hasError: ['tags', 'metaImageAlt'].some(
          field => !!errors[field] && touched[field],
        ),

        component: props => (
          <ConceptMetaData
            classes={formClasses}
            concept={concept}
            fetchTags={fetchConceptTags}
            {...props}
          />
        ),
      },
    ];

    const initialValues = getInitialValues(concept, subjects);

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={() => ({})}
        ref={this.formik}
        enableReinitialize
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
                values={values}
                type="concept"
                content={concept}
                getConcept={() => this.getConcept(values)}
                editUrl={lang => toEditConcept(values.id, lang)}
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
              {
                <EditorFooter
                  t={t}
                  isSubmitting={isSubmitting}
                  formIsDirty={formIsDirty}
                  savedToServer={savedToServer}
                  values={values}
                  error={error}
                  errors={errors}
                  getEntity={this.getConcept}
                  entityStatus={concept.status}
                  createMessage={createMessage}
                  showSimpleFooter={!concept.id}
                  setFieldValue={setFieldValue}
                  onSaveClick={() => {
                    this.handleSubmit(formikProps);
                  }}
                  getStateStatuses={fetchStateStatuses}
                  hideSecondaryButton
                />
              }
              {!inModal && (
                <FormikAlertModalWrapper
                  isSubmitting={isSubmitting}
                  formIsDirty={formIsDirty}
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
  concept: ConceptShape,
  inModal: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  applicationError: PropTypes.func.isRequired,
  licenses: LicensesArrayOf,
  subjects: PropTypes.arrayOf(SubjectShape),
  createMessage: PropTypes.func.isRequired,
  updateConceptAndStatus: PropTypes.func,
  fetchStateStatuses: PropTypes.func,
  fetchConceptTags: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  applicationError: messageActions.applicationError,
};

export default compose(
  injectT,
  withRouter,
  connect(undefined, mapDispatchToProps),
)(ConceptForm);
