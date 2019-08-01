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
import { withRouter } from 'react-router-dom';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import { Formik, Form } from 'formik';
import { injectT } from '@ndla/i18n';
import isEmpty from 'lodash/fp/isEmpty';
import Field from '../../../src/components/Field';
import {
  plainTextToEditorValue,
  editorValueToPlainText,
} from '../../util/articleContentConverter';
import ConceptContent from './ConceptContent';
import ConceptMetaData from './ConceptMetaData';
import HeaderWithLanguage from '../../components/HeaderWithLanguage';
import {
  DEFAULT_LICENSE,
  isFormikFormDirty,
  parseCopyrightContributors,
} from '../../util/formHelper';
import {
  FormikAlertModalWrapper,
  FormikActionButton,
  formClasses,
} from '../FormikForm';
import AlertModal from '../../components/AlertModal';
import validateFormik from '../../components/formikValidationSchema';
import { ConceptShape, LicensesArrayOf } from '../../shapes';
import SaveButton from '../../components/SaveButton';
import { addConcept } from '../../modules/concept/conceptApi.js';
import { toEditConcept } from '../../../src/util/routeHelpers.js';

const getInitialValues = (concept = {}) => ({
  id: concept.id,
  title: concept.title || '',
  language: concept.language,
  updated: concept.updated,
  updateCreated: false,
  created: concept.created,
  conceptContent: plainTextToEditorValue(concept.content || '', true),
  supportedLanguages: concept.supportedLanguages || [],
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
});

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
  processors: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
};

class ConceptForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getConcept = this.getConcept.bind(this);
    this.getCreatedDate = this.getCreatedDate.bind(this);
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

  getCreatedDate(values) {
    if (isEmpty(values.created)) {
      return undefined;
    }
    const { concept } = this.props;
    const initialValues = getInitialValues(concept);

    const hasCreatedDateChanged = initialValues.created !== values.created;
    if (hasCreatedDateChanged || values.updateCreated) {
      return values.created;
    }
    return undefined;
  }

  getConcept(values) {
    const { licenses } = this.props;

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
      created: this.getCreatedDate(values),
    };
  }

  async handleSubmit(values, actions) {
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
  }

  onAddConcept = newConcept => {
    addConcept(newConcept);
  };

  render() {
    const { t, licenses, history, concept, onUpdate, ...rest } = this.props;
    const { savedToServer, showResetModal } = this.state;
    const panels = ({ errors, touched }) => [
      {
        id: 'concept-content',
        title: t('form.contentSection'),
        className: 'u-4/6@desktop u-push-1/6@desktop',
        hasError: ['title', 'conceptContent'].some(
          field => !!errors[field] && touched[field],
        ),

        component: props => (
          <ConceptContent
            classes={formClasses}
            creators={concept.creators}
            created={concept.created}
            {...props}
          />
        ),
      },
      {
        id: 'concept-metadataSection',
        title: t('form.metadataSection'),
        className: 'u-6/6',
        hasError: [
          'tags',
          'creators',
          'rightsholders',
          'processors',
          'license',
        ].some(field => !!errors[field] && touched[field]),

        component: props => (
          <ConceptMetaData
            classes={formClasses}
            licenses={licenses}
            {...props}
          />
        ),
      },
    ];

    const initialValues = getInitialValues(concept);

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
            errors,
            touched,
            submitCount,
          } = formikProps;
          const formIsDirty = isFormikFormDirty({
            values,
            initialValues,
            dirty,
          });

          return (
            <Form {...formClasses()}>
              <HeaderWithLanguage
                noStatus
                values={values}
                type="concept"
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
                          onClick={() => handleItemClick(panel.id)}
                          isOpen={openIndexes.includes(panel.id)}>
                          {panel.title}
                        </AccordionBar>
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

                <FormikActionButton
                  onClick={history.goBack}
                  outline
                  disabled={isSubmitting}>
                  {t('form.abort')}
                </FormikActionButton>

                <SaveButton
                  {...formClasses}
                  isSaving={isSubmitting}
                  formIsDirty={formIsDirty}
                  showSaved={savedToServer && !formIsDirty}
                  errors={errors}
                  touched={touched}
                  submitCount={submitCount}>
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
          );
        }}
      </Formik>
    );
  }
}

ConceptForm.propTypes = {
  concept: ConceptShape,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  applicationError: PropTypes.func.isRequired,
  licenses: LicensesArrayOf,
};

export default compose(
  injectT,
  withRouter,
)(ConceptForm);
