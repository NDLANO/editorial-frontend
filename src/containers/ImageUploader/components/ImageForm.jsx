/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { injectT } from '@ndla/i18n';
import { Formik, Form } from 'formik';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Field } from '../../../components/Fields';
import SaveButton from '../../../components/SaveButton';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
} from '../../../util/formHelper';
import validateFormik from '../../../components/formikValidationSchema';
import ImageMetaData from './ImageMetaData';
import ImageContent from './ImageContent';
import { ImageShape } from '../../../shapes';
import {
  FormikHeader,
  FormikActionButton,
  formClasses as classes,
  FormikAlertModalWrapper,
} from '../../FormikForm';
import { toEditImage } from '../../../util/routeHelpers';

const imageRules = {
  title: {
    required: true,
  },
  alttext: {
    required: true,
  },
  caption: {
    required: true,
  },
  tags: {
    minItems: 3,
  },
  creators: {
    test: (value, values, label) => {
      if (value.length === 0 && values.rightsholders.length === 0) {
        return {
          translationKey: 'validation.minItems',
          variables: {
            minItems: 1,
            label,
            labelLowerCase: label.toLowerCase(),
          },
        };
      }
      return undefined;
    },
    allObjectFieldsRequired: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
  imageFile: {
    required: true,
  },
  license: {
    required: true,
  },
};

export const getInitialValues = (image = {}) => ({
  id: image.id,
  revision: image.revision,
  language: image.language,
  supportedLanguages: image.supportedLanguages || [],
  title: image.title || '',
  alttext: image.alttext || '',
  caption: image.caption || '',
  imageFile: image.imageUrl,
  tags: image.tags || [],
  creators: parseCopyrightContributors(image, 'creators'),
  processors: parseCopyrightContributors(image, 'processors'),
  rightsholders: parseCopyrightContributors(image, 'rightsholders'),
  origin:
    image.copyright && image.copyright.origin ? image.copyright.origin : '',
  license:
    image.copyright && image.copyright.license
      ? image.copyright.license.license
      : DEFAULT_LICENSE.license,
});

const FormWrapper = ({ inModal, children }) => {
  if (inModal) {
    return <div {...classes()}>{children}</div>;
  }
  return <Form>{children}</Form>;
};

FormWrapper.propTypes = {
  inModal: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

class ImageForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      savedToServer: false,
    };
  }

  async onSubmit(values, actions) {
    const { licenses, onUpdate, revision } = this.props;
    actions.setSubmitting(true);
    const imageMetaData = {
      id: values.id,
      revision,
      title: values.title,
      alttext: values.alttext,
      caption: values.caption,
      language: values.language,
      tags: values.tags,
      copyright: {
        license: licenses.find(license => license.license === values.license),
        origin: values.origin,
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
      },
    };

    await onUpdate(imageMetaData, values.imageFile);
    actions.setSubmitting(false);
  }

  handleSubmit(event, values, actions) {
    event.preventDefault();
    this.onSubmit(values, actions);
  }

  render() {
    const {
      t,
      tags,
      image,
      licenses,
      showSaved,
      inModal,
      closeModal,
      history,
    } = this.props;

    const panels = [
      {
        id: 'image-upload-content',
        title: t('form.contentSection'),
        errorFields: ['title', 'imageFile', 'caption', 'alttext'],
        component: <ImageContent />,
      },
      {
        id: 'image-upload-metadataSection',
        title: t('form.metadataSection'),
        errorFields: [
          'tags',
          'rightsholders',
          'creators',
          'processors',
          'license',
        ],
        component: <ImageMetaData tags={tags} licenses={licenses} />,
      },
    ];

    return (
      <Formik
        initialValues={getInitialValues(image)}
        onSubmit={this.onSubmit}
        enableReinitialize
        validate={values => validateFormik(values, imageRules, t)}>
        {({ values, errors, touched, isSubmitting, ...rest }) => (
          <FormWrapper inModal={inModal}>
            <FormikHeader
              values={values}
              type="image"
              editUrl={lang => toEditImage(values.id, lang)}
            />
            <Accordion openIndexes={['image-upload-content']}>
              {({ openIndexes, handleItemClick }) => (
                <AccordionWrapper>
                  {panels.map(panel => {
                    const hasError = panel.errorFields.some(
                      field => !!errors[field] && touched[field],
                    );
                    return (
                      <React.Fragment key={panel.id}>
                        <AccordionBar
                          panelId={panel.id}
                          ariaLabel={panel.title}
                          onClick={() => handleItemClick(panel.id)}
                          hasError={hasError}
                          isOpen={openIndexes.includes(panel.id)}>
                          {panel.title}
                        </AccordionBar>
                        {openIndexes.includes(panel.id) && (
                          <AccordionPanel
                            id={panel.id}
                            hasError={hasError}
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
              {inModal ? (
                <FormikActionButton outline onClick={closeModal}>
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
                isSaving={isSubmitting}
                showSaved={showSaved}
                submit={!inModal}
                onClick={e => {
                  if (inModal) {
                    this.handleSubmit(e, values, rest);
                  }
                }}>
                {t('form.save')} - {inModal}
              </SaveButton>
            </Field>
            <FormikAlertModalWrapper
              isSubmitting={isSubmitting}
              severity="danger"
              text={t('alertModal.notSaved')}
            />
          </FormWrapper>
        )}
      </Formik>
    );
  }
}

ImageForm.propTypes = {
  image: ImageShape,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdate: PropTypes.func.isRequired,
  showSaved: PropTypes.bool.isRequired,
  revision: PropTypes.number,
  inModal: PropTypes.bool,
  closeModal: PropTypes.func,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};

export default compose(
  injectT,
  withRouter,
)(ImageForm);
