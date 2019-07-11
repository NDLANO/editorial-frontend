import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Formik, Form } from 'formik';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import { injectT } from '@ndla/i18n';
import Field from '../../../src/components/Field';
import { plainTextToEditorValue } from '../../util/articleContentConverter';
import ConceptContent from './ConceptContent';
import ConceptMetaData from './ConceptMetaData';
import HeaderWithLanguage from '../../components/HeaderWithLanguage';
import {
  DEFAULT_LICENSE,
  isFormikFormDirty,
  parseCopyrightContributors,
} from '../../util/formHelper';
import { FormikAlertModalWrapper, FormikActionButton } from '../FormikForm';
import AlertModal from '../../components/AlertModal';
import validateFormik from '../../components/formikValidationSchema';
import { ConceptShape } from '../../shapes';
import SaveButton from '../../components/SaveButton';
import { addConcept } from '../../modules/concept/conceptApi.js';
import * as messageActions from '../Messages/messagesActions';

const getInitialValues = (concept = {}) => ({
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
});

const rules = {
  title: {
    required: true,
  },
  description: {
    required: true,
  },
};

class ConceptForm extends Component {
  state = {
    savedToServer: false,
    showResetModal: false,
  };

  handleSubmit = (values, actions, applicationError) => {
    //console.log('Inni handleSubmit', values.title, values.description);
    //console.log('metadata', values.creator);
    const { licenses } = this.props;
    const createConcept = {
      title: values.title,
      content: values.description,
      language: 'nb',
      copyright: {
        license: licenses.find(license => license.license === values.license),
        origin: values.origin,
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
      },
    };

    try {
      console.log(createConcept);
      this.onAddConcept(createConcept);
      actions.resetForm();
      //actions.setFieldValue('title', [], false);
      //actions.setFieldValue('content', [], false);
      this.setState({ savedToServer: true });
    } catch (err) {
      applicationError(err);
      actions.setSubmitting(false);
      this.setState({ savedToServer: false });
    }
  };

  onAddConcept = newConcept => {
    console.log('Inni addConcept:', newConcept);
    //addConcept(newConcept);
  };

  render() {
    const { t, licenses, history, concept } = this.props;
    const savedToServer = this.state;
    const panels = ({ errors, touched }) => [
      {
        id: 'concept-upload-content',
        title: t('form.contentSection'),
        hasError: ['title', 'content'].some(
          field => !!errors[field] && touched[field],
        ),
        component: <ConceptContent />,
      },
      {
        id: 'concept-upload-metadataSection',
        title: t('form.metadataSection'),
        hasError: [
          'tags',
          'creators',
          'rightsholders',
          'processors',
          'license',
        ].some(field => !!errors[field] && touched[field]),

        component: <ConceptMetaData licenses={licenses} />,
      },
    ];

    const initialValues = getInitialValues(concept);

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        validate={values => validateFormik(values, rules, t)}>
        {formikProps => {
          const { values, dirty, isSubmitting, setValues, error } = formikProps;
          const formIsDirty = isFormikFormDirty({
            values,
            initialValues,
            dirty,
          });

          return (
            <Form>
              <HeaderWithLanguage
                noStatus
                values={values}
                type="concept"
                editUrl={lang => console.log('hmm')}
              />

              <Accordion>
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
                            hasError={panel.hasError}
                            isOpen={openIndexes.includes(panel.id)}>
                            <div className="u-4/6@desktop u-push-1/6@desktop">
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
                  //onClick={history.goBack}
                  onClick={console.log('Going back!')}
                  outline
                  disabled={isSubmitting}>
                  {t('form.abort')}
                </FormikActionButton>

                <SaveButton isSaving={isSubmitting} showSaved={false}>
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

const mapDispatchToProps = {
  applicationError: messageActions.applicationError,
};

ConceptForm.propTypes = {
  concept: ConceptShape,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  applicationError: PropTypes.func.isRequired,
};

export default compose(
  injectT,
  withRouter,
)(ConceptForm);
