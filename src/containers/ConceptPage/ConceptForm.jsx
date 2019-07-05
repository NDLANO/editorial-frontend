import React, { Component } from 'react';
import { Input } from '@ndla/forms';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import FormikActionButton from '../FormikForm/components/FormikActionButton.jsx';
import { formClasses } from '../FormikForm';
import validateFormik from '../../components/formikValidationSchema';

class ConceptForm extends Component {
  state = {
    title: undefined,
    content: undefined,
  };

  titleChanged = event => {
    this.setState({ title: event.target.value });
  };

  contentChanged = event => {
    this.setState({ content: event.target.value });
  };

  handleSubmit = event => {
    console.log('Handle submit');

    //this.props.onAddConcept(this.state.title, this.state.content, 'nb');
    //this.setState({ title: undefined, content: undefined });
    console.log(this.state.title);
    event.preventDefault();
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
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
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
