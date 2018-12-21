/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { injectT } from '@ndla/i18n';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { withRouter } from 'react-router-dom';
import reformed from '../../../components/reformed';
import validateSchema, {
  checkTouchedInvalidField,
} from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';
import SaveButton from '../../../components/SaveButton';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
} from '../../../util/formHelper';

import ImageMetaData from './ImageMetaData';
import ImageContent from './ImageContent';
import { SchemaShape } from '../../../shapes';
import {
  FormHeader,
  formClasses as classes,
  WarningModalWrapper,
} from '../../Form';
import { toEditImage } from '../../../util/routeHelpers';

export const getInitialModel = (image = {}) => ({
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

const FormWrapper = ({ inModal, children, onSubmit }) => {
  if (inModal) {
    return <div {...classes()}>{children}</div>;
  }
  return (
    <form onSubmit={onSubmit} {...classes()}>
      {children}
    </form>
  );
};

FormWrapper.propTypes = {
  inModal: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func,
};

class ImageForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate({ initialModel: prevModel }) {
    const { initialModel, setModel } = this.props;

    if (
      initialModel.id !== prevModel.id ||
      initialModel.language !== prevModel.language
    ) {
      setModel(initialModel);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      model,
      validationErrors,
      licenses,
      setSubmitted,
      onUpdate,
      revision,
    } = this.props;

    if (!validationErrors.isValid) {
      setSubmitted(true);
      return;
    }

    const imageMetaData = {
      id: model.id,
      revision,
      title: model.title,
      alttext: model.alttext,
      caption: model.caption,
      language: model.language,
      tags: model.tags,
      copyright: {
        license: licenses.find(license => license.license === model.license),
        origin: model.origin,
        creators: model.creators,
        processors: model.processors,
        rightsholders: model.rightsholders,
      },
    };
    onUpdate(imageMetaData, model.imageFile);
  }

  render() {
    const {
      t,
      bindInput,
      validationErrors: schema,
      model,
      initialModel,
      submitted,
      tags,
      licenses,
      isSaving,
      fields,
      showSaved,
      inModal,
      closeModal,
      history,
    } = this.props;
    const commonFieldProps = { bindInput, schema, submitted };

    const panels = [
      {
        id: 'image-upload-content',
        title: t('form.contentSection'),
        hasError: [
          schema.fields.title,
          schema.fields.imageFile,
          schema.fields.alttext,
          schema.fields.caption,
        ].some(field => checkTouchedInvalidField(field, submitted)),
        component: (
          <ImageContent
            commonFieldProps={commonFieldProps}
            tags={tags}
            model={model}
          />
        ),
      },
      {
        id: 'image-upload-metadataSection',
        title: t('form.metadataSection'),
        hasError: [
          schema.fields.tags,
          schema.fields.creators,
          schema.fields.rightsholders,
          schema.fields.processors,
          schema.fields.license,
        ].some(field => checkTouchedInvalidField(field, submitted)),
        component: (
          <ImageMetaData
            commonFieldProps={commonFieldProps}
            tags={tags}
            licenses={licenses}
          />
        ),
      },
    ];

    return (
      <FormWrapper inModal={inModal} onSubmit={this.handleSubmit}>
        <FormHeader
          model={model}
          type="image"
          editUrl={lang => toEditImage(model.id, lang)}
        />
        <Accordion openIndexes={['image-upload-content']}>
          {({ openIndexes, handleItemClick }) => (
            <AccordionWrapper>
              {panels.map(panel => (
                <React.Fragment key={panel.id}>
                  <AccordionBar
                    panelId={panel.id}
                    ariaLabel={panel.title}
                    onClick={() => handleItemClick(panel.id)}
                    hasError={panel.hasError}
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
                </React.Fragment>
              ))}
            </AccordionWrapper>
          )}
        </Accordion>
        <Field right {...classes('form-actions')}>
          {inModal ? (
            <Button outline onClick={closeModal}>
              Avbryt
            </Button>
          ) : (
            <Button onClick={history.goBack} outline disabled={isSaving}>
              {t('form.abort')}
            </Button>
          )}
          <SaveButton
            isSaving={isSaving}
            showSaved={showSaved}
            submit={!inModal}
            onClick={e => {
              if (inModal) {
                this.handleSubmit(e);
              }
            }}>
            {t('form.save')}
          </SaveButton>
        </Field>
        <WarningModalWrapper
          model={model}
          initialModel={initialModel}
          showSaved={showSaved}
          fields={fields}
          text={t('warningModal.notSaved')}
        />
      </FormWrapper>
    );
  }
}

ImageForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
  }),
  setModel: PropTypes.func.isRequired,
  validationErrors: SchemaShape,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  fields: PropTypes.objectOf(PropTypes.object).isRequired,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  setSubmitted: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
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
  reformed,
  validateSchema({
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
      minItems: 1,
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
  }),
)(ImageForm);
