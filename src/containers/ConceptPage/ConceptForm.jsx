import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@ndla/forms';
import { Formik, Form, ErrorMessage } from 'formik';
import { FieldHeader } from '@ndla/forms';
import FormikActionButton from '../FormikForm/components/FormikActionButton.jsx';
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
import {
  renderNode,
  renderMark,
} from '../../components/SlateEditor/renderNode';
import { editListPlugin } from '../../components/SlateEditor/plugins/externalPlugins';
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

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.small} 0 ${spacing.xsmall};
  margin: ${spacing.normal} 0 ${spacing.small};
  border-bottom: 2px solid ${colors.brand.light};
`;

const supportedToolbarElements = {
  mark: ['bold', 'italic', 'underlined'],
  block: ['quote', ...listTypes, 'heading-two', 'heading-three'],
  inline: [link],
};

const StyledTitleHeaderWrapper = styled.div`
  padding-left: ${spacing.small};
  display: flex;
  align-items: center;
  h1 {
    ${fonts.sizes(26, 1.1)};
    font-weight: ${fonts.weight.semibold};
    margin: ${spacing.small} ${spacing.normal} ${spacing.small} ${spacing.small};
    color: ${colors.text.primary};
  }
`;

const getInitialValues = (concept = {}) => ({
  id: concept.id,
  title: concept.title || '',
  content: plainTextToEditorValue(concept.content || '', true),
  supportedLanguages: [],
});

const rules = {
  title: {
    required: true,
  },
  content: {
    required: true,
  },
};

class ConceptForm extends Component {
  handleSubmit = (values, actions) => {
    console.log('Inni handle submit', values.title, values.content);
    const createConcept = {
      title: values.title,
      content: values.content,
      language: 'nb',
    };

    try {
      console.log(createConcept);
      //this.onAddConcept(createConcept);
      actions.resetForm();
      //actions.setFieldValue('title', [], false);
      //actions.setFieldValue('content', [], false);
      this.setState({ savedToServer: true });
    } catch (err) {
      //applicationError(err);
      actions.setSubmitting(false);
      this.setState({ savedToServer: false });
    }
  };

  onAddConcept = newConcept => {
    conceptApi.addConcept(newConcept);
  };

  render() {
    const { t } = this.props;

    //const initVal = getInitialValues(concept);
    return (
      <Formik
        onSubmit={this.handleSubmit}
        initialValues={getInitialValues()}
        validate={values => {
          let errors = {};
          if (!values.title) {
            errors.title = 'Required';
          } else if (!/^[A-Za-z0-9 ]+$/i.test(values.title)) {
            errors.title = 'Invalid title';
          }

          return errors;
        }}>
        {({ isSubmitting, values }) => (
          <Form {...formClasses('', 'gray-background')}>
            <StyledHeader>
              <StyledTitleHeaderWrapper>
                <h1>{t(`conceptform.title`)}</h1>
              </StyledTitleHeaderWrapper>
            </StyledHeader>

            <FormikField
              label={t('form.title.label')}
              name="title"
              title
              noBorder
              placeholder={t('form.title.label')}
            />
            <FormikIngress name="content" />

            <Field right>
              <FormikActionButton
                outline
                //onClick={history.goBack}
                disabled={isSubmitting}>
                {t('form.abort')}
              </FormikActionButton>
              <FormikActionButton submit>{t('form.save')}</FormikActionButton>
            </Field>
          </Form>
        )}
      </Formik>
    );
  }
}

ConceptForm.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      content: PropTypes.string,
    }),
  }),
};

export default injectT(ConceptForm);
