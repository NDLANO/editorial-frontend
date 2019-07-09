import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@ndla/forms';
import { Formik, Form, ErrorMessage } from 'formik';
import { FieldHeader } from '@ndla/forms';
import FormikActionButton from '../FormikForm/components/FormikActionButton.jsx';
import SaveButton from '../../components/SaveButton.jsx';
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
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import ConceptContent from './ConceptContent';
import ConceptMetaData from './ConceptMetaData';
import HeaderWithLanguage from '../../components/HeaderWithLanguage';
import {
  DEFAULT_LICENSE,
  isFormikFormDirty,
  parseCopyrightContributors,
} from '../../util/formHelper';

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
  content: {
    required: true,
  },
};

class ConceptForm extends Component {
  handleSubmit = (values, actions) => {
    console.log('Inni handleSubmit', values.title, values.content);
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
    console.log('Inni addConcept:', newConcept.title, newConcept.content);
    //conceptApi.addConcept(newConcept);
  };

  render() {
    const { t, licenses } = this.props;
    const panels = [
      {
        id: '',
        title: t('form.contentSection'),
        // content: 'innhold',
        errorFields: ['title', 'content'],
        component: <ConceptContent />,
      },
      {
        id: '',
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
        {({ isSubmitting, values, submitForm }) => (
          <>
            <HeaderWithLanguage
              noStatus
              values={values}
              type="concept"
              editUrl={lang => console.log('hmm')}
            />

            <Accordion openIndexes={['image-upload-content']}>
              {({ openIndexes, handleItemClick }) => (
                <AccordionWrapper>
                  {panels.map(panel => {
                    return (
                      <React.Fragment key={panel.id}>
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
                      </React.Fragment>
                    );
                  })}
                </AccordionWrapper>
              )}
            </Accordion>
            <Field right>
              <FormikActionButton
                outline
                //onClick={history.goBack}
                disabled="legge til isSubmitting etterhvert">
                {t('form.abort')}
              </FormikActionButton>{' '}
              <SaveButton
                submit
                onClick={evt => {
                  if (true) {
                    evt.preventDefault();
                    console.log('clicked!');
                    submitForm();
                  }
                }}>
                {t('form.save')}
              </SaveButton>
            </Field>

            {/*  <Accordion openIndexes={[0]}>
              {({ getPanelProps, getBarProps }) => (
                <AccordionWrapper>
                  
                  {['Innhold 1', 'Innhold 2'].map((item, index) => (
                    <React.Fragment key={item}>
                      <AccordionBar
                        {...getBarProps(index)}
                        ariaLabel={`Panel ${index + 1}`}>
                        Panel {index + 1}
                      </AccordionBar>
                      <AccordionPanel {...getPanelProps(index)}>
                        <div>
                          <p>{item}</p>
                          {panel.component}
                        </div>
                      </AccordionPanel>
                    </React.Fragment>
                  ))}
                </AccordionWrapper>
              )}
            </Accordion> */}
          </>
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
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(ConceptForm);
