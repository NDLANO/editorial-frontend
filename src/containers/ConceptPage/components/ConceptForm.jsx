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
  DEFAULT_LICENSE,
  isFormikFormDirty,
  parseCopyrightContributors,
  parseImageUrl,
} from '../../../util/formHelper';
import {
  FormikAlertModalWrapper,
  FormikActionButton,
  formClasses,
} from '../../FormikForm';
import ConceptCopyright from './ConceptCopyright';
import AlertModal from '../../../components/AlertModal';
import validateFormik from '../../../components/formikValidationSchema';
import { ConceptShape, LicensesArrayOf, SubjectShape } from '../../../shapes';
import SaveButton from '../../../components/SaveButton';
import { toEditConcept } from '../../../util/routeHelpers.js';

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
    source: concept && concept.source ? concept.source : '',
    license: concept.copyright?.license?.license || DEFAULT_LICENSE.license,
    metaImageId,
    metaImageAlt: concept.metaImage?.alt || '',
    tags: concept.tags || [],
    articleId: concept.articleId || '',
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
      : undefined;

    return {
      id: values.id,
      title: values.title,
      content: editorValueToPlainText(values.conceptContent),
      language: values.language,
      supportedLanguages: values.supportedLanguages,
      copyright: {
        license: licenses.find(license => license.license === values.license),
        creators: values.creators,
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

  handleSubmit = async (values, actions) => {
    const { onUpdate, concept, applicationError } = this.props;
    const { revision } = concept;
    actions.setSubmitting(true);

    try {
      await onUpdate({
        ...this.getConcept(values),
        revision,
      });
      actions.resetForm();
      actions.setSubmitting(false);
      this.setState({ savedToServer: true });
    } catch (err) {
      applicationError(err);
      actions.setSubmitting(false);
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
      tags,
      ...rest
    } = this.props;
    const { savedToServer, showResetModal } = this.state;
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
            contributorTypesOverride={['creators']}
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
          <ConceptMetaData classes={formClasses} concept={concept} {...props} />
        ),
      },
    ];

    const initialValues = getInitialValues(concept, subjects);

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        ref={this.formik}
        enableReinitialize
        validate={values => validateFormik(values, rules, t)}>
        {formikProps => {
          const {
            values,
            dirty,
            isSubmitting,
            setValues,
            error,
            submitForm,
          } = formikProps;

          const formIsDirty = isFormikFormDirty({
            values,
            initialValues,
            dirty,
          });

          return (
            <FormWrapper inModal={inModal} {...formClasses()}>
              <HeaderWithLanguage
                noStatus
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
                                tags,
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
              <Field right>
                {error && <span className="c-errorMessage">{error}</span>}
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
                      onClick: () => this.onReset(setValues),
                    },
                  ]}
                  onCancel={() => this.setState({ showResetModal: false })}
                />

                {inModal ? (
                  <FormikActionButton outline onClick={onClose}>
                    {t('form.abort')}
                  </FormikActionButton>
                ) : (
                  <FormikActionButton
                    onClick={history.goBack}
                    outline
                    disabled={isSubmitting}>
                    {t('form.abort')}
                  </FormikActionButton>
                )}

                <SaveButton
                  {...formClasses}
                  isSaving={isSubmitting}
                  formIsDirty={formIsDirty}
                  showSaved={savedToServer && !formIsDirty}
                  submit={!inModal}
                  onClick={evt => {
                    if (inModal) {
                      evt.preventDefault();
                      submitForm();
                    }
                  }}>
                  {t('form.save')}
                </SaveButton>
              </Field>
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
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  subjects: PropTypes.arrayOf(SubjectShape),
};

const mapDispatchToProps = {
  applicationError: messageActions.applicationError,
};

export default compose(
  injectT,
  withRouter,
  connect(
    undefined,
    mapDispatchToProps,
  ),
)(ConceptForm);
