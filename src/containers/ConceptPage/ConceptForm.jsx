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
import {
  FormikAlertModalWrapper,
  FormikActionButton,
  formClasses,
} from '../FormikForm';
import AlertModal from '../../components/AlertModal';
import validateFormik from '../../components/formikValidationSchema';
import { ConceptShape } from '../../shapes';
import SaveButton from '../../components/SaveButton';
import { addConcept } from '../../modules/concept/conceptApi.js';
import * as messageActions from '../Messages/messagesActions';
import { transformConceptFromApiVersion } from '../../../src/util/conceptUtil.js';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { toEditConcept } from '../../../src/util/routeHelpers.js';

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
  constructor(props) {
    super(props);
    this.state = {
      savedToServer: false,
    };
  }

  /*componentDidUpdate({ concept: prevConcept }) {
    const { concept } = this.props;
    if (
      //article.language !== prevArticle.language ||
      concept.id !== prevConcept.id
    ) {
      this.setState({ savedToServer: false });
      if (this.formik.current) {
        this.formik.current.resetForm();
      }
    }
  }*/
  getConcept(values) {
    const { licenses } = this.props;
    const emptyField = values.id ? '' : undefined;

    const concept = {
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
    return concept;
  }

  onUpdate = async createdConcept => {
    const { history } = this.props;
    const savedConcept = await useFetchConceptData.createConcept(
      createdConcept,
    );
    history.push(toEditConcept(savedConcept.id, createdConcept.language));
  };

  async handleSubmit(values, actions) {
    const concept = await this.getConcept(values);
    const { applicationError } = this.props;
    const { revision } = concept;
    //console.log('getConecpt', getConcept(values));
    try {
      await this.onUpdate({
        ...this.getConcept(values),
        revision,
      });
      console.log(concept);
      this.onAddConcept(concept);
      actions.resetForm();
      this.setState({ savedToServer: true });
    } catch (err) {
      applicationError(err);
      actions.setSubmitting(false);
      this.setState({ savedToServer: false });
    }
  }

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
        hasError: ['title', 'description'].some(
          //description istedet for content????
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
          console.log('saved to server:', savedToServer);
          console.log('formIsDirty', formIsDirty);

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
                            updateNotes={this.onUpdate}
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
                  onClick={history.goBack}
                  outline
                  disabled={isSubmitting}>
                  {t('form.abort')}
                </FormikActionButton>

                <SaveButton
                  {...formClasses}
                  isSaving={isSubmitting}
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
    push: PropTypes.func.isRequired,
  }).isRequired,
  applicationError: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default compose(
  injectT,
  withRouter,
)(ConceptForm);
