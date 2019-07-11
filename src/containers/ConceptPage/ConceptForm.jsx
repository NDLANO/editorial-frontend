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
import validateFormik from '../../components/formikValidationSchema';
import { ConceptShape } from '../../shapes';
import SaveButton from '../../components/SaveButton';

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
  };

  handleSubmit = (values, actions) => {
    console.log('Inni handleSubmit', values.title, values.description);
    const createConcept = {
      title: values.title,
      content: values.description,
      language: 'nb',
    };

    try {
      console.log(createConcept);
      actions.resetForm();
      this.setState({ savedToServer: true });
    } catch (err) {
      actions.setSubmitting(false);
      this.setState({ savedToServer: false });
    }
  };

  onAddConcept = newConcept => {
    console.log('Inni addConcept:', newConcept.title, newConcept.content);
    //conceptApi.addConcept(newConcept);
  };

  render() {
    const { t, licenses, history, concept } = this.props;
    const { savedToServer } = this.state;
    const panels = [
      {
        id: 'concept-upload-content',
        title: t('form.contentSection'),
        errorFields: ['title', 'description'],
        component: <ConceptContent />,
      },
      {
        id: 'concept-upload-metadataSection',
        title: t('form.metadataSection'),
        errorFields: [
          'origin',
          'rightsholders',
          'creators',
          'processors',
          'license',
        ],
        component: <ConceptMetaData licenses={licenses} />,
      },
    ];

    const initialValues = getInitialValues(concept);

    return (
      <Fragment>
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
          validate={values => validateFormik(values, rules, t)}>
          {({ values, dirty, isSubmitting }) => {
            const formIsDirty = isFormikFormDirty({
              values,
              initialValues,
              dirty,
            });

            console.log(
              'conceptFormLog',
              'formisDirty: ',
              formIsDirty,
              'isSubmitting: ',
              isSubmitting,
            );

            return (
              <Form {...formClasses()}>
                <HeaderWithLanguage
                  noStatus
                  values={values}
                  type="concept"
                  editUrl={lang => console.log('hmm')}
                />

                <Accordion>
                  {({ openIndexes, handleItemClick }) => (
                    <AccordionWrapper>
                      {panels.map(panel => (
                        <Fragment key={panel.id}>
                          <AccordionBar
                            panelId={panel.id}
                            ariaLabel={panel.title}
                            onClick={() => handleItemClick(panel.id)}
                            isOpen={openIndexes.includes(panel.id)}>
                            {panel.title}
                          </AccordionBar>
                          {openIndexes.includes(panel.id) && (
                            <AccordionPanel
                              id={panel.id}
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
                  <FormikActionButton
                    onClick={history.goBack}
                    outline
                    disabled={isSubmitting}>
                    {t('form.abort')}
                  </FormikActionButton>
                  <SaveButton
                    isSaving={isSubmitting}
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
      </Fragment>
    );
  }
}

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
};

export default compose(
  injectT,
  withRouter,
)(ConceptForm);
