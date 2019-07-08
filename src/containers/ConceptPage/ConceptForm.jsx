import React, { Component } from 'react';
import { Input } from '@ndla/forms';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import FormikActionButton from '../FormikForm/components/FormikActionButton.jsx';
import { formClasses } from '../FormikForm';
import validateFormik from '../../components/formikValidationSchema';
import * as conceptApi from '../../../src/modules/concept/conceptApi';
import PropTypes from 'prop-types';

class ConceptForm extends Component {
  state = {
    title: '',
    content: '',
  };

  titleChanged = event => {
    this.setState({ title: event.target.value });
  };

  contentChanged = event => {
    this.setState({ content: event.target.value });
  };

  handleSubmit = (values, actions) => {
    console.log('Inni handle submit', values.title, values.content);
    const createConcept = {
      title: values.title,
      content: values.content,
      language: 'nb',
    };
    onAddConcept(createConcept);
    //this.setState({ title: undefined, content: undefined });
    console.log(this.state.title);
  };

  handleSubmit1 = async (values, actions) => {
    const { licenses, onUpdate } = this.props;
    actions.setSubmitting(true);
    const agreementMetaData = {
      id: values.id,
      title: values.title,
      content: values.content,
      copyright: {
        license: licenses.find(license => license.license === values.license),
        origin: values.origin,
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
        validFrom: values.validFrom,
        validTo: values.validTo,
      },
    };
    await onUpdate(agreementMetaData);
    actions.setSubmitting(false);
  };

  onAddConcept = newConcept => {
    const newConcept = {
      title: conceptTitle,
      content: conceptContent,
      language: language,
    };

    this.setState(prevState => ({
      concepts: [...prevState.concepts, newConcept],
    }));
    conceptApi.addConcept(newConcept);
  };

  render() {
    return (
      <Formik
        onSubmit={this.handleSubmit}
        initialValues={{ title: '', content: '' }}
        validate={values => {
          let errors = {};
          if (!values.title) {
            errors.title = 'Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.title)
          ) {
            errors.title = 'Invalid title';
          }
          return errors;
        }}>
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="title" />
            <ErrorMessage name="title" component="div" />
            <Field type="content" name="content" />
            <ErrorMessage name="content" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    );
  }
}

export default ConceptForm;
