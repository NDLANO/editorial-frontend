/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component, ReactNode } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Formik, Form, FormikHelpers } from 'formik';
import { Accordions, AccordionSection } from '@ndla/accordion';
import Field from '../../../components/Field';
import SaveButton from '../../../components/SaveButton';
import { isFormikFormDirty, parseCopyrightContributors } from '../../../util/formHelper';
import validateFormik from '../../../components/formikValidationSchema';
import ImageMetaData from './ImageMetaData';
import ImageContent from './ImageContent';
import {
  ActionButton,
  AbortButton,
  formClasses as classes,
  AlertModalWrapper,
} from '../../FormikForm';
import { toCreateImage, toEditImage } from '../../../util/routeHelpers';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import { NewImageMetadata, UpdatedImageMetadata } from '../../../modules/image/imageApiInterfaces';
import { Author, Copyright } from '../../../interfaces';

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

interface ImageFormikType {
  id?: number;
  language?: string;
  supportedLanguages?: string[];
  title?: string;
  alttext?: string;
  caption?: string;
  imageFile?: string;
  tags: string[];
  creators?: Author[];
  processors?: Author[];
  rightsholders?: Author[];
  origin?: string;
  license?: string;
}

export const getInitialValues = (image: ImagePropType = {}): ImageFormikType => {
  return {
    id: Number(image.id),
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
    origin: image?.copyright?.origin || '',
    license: image?.copyright?.license?.license,
  };
};

const FormWrapper = ({ inModal, children }: { inModal?: boolean; children: ReactNode }) => {
  if (inModal) {
    return <div {...classes()}>{children}</div>;
  }
  return <Form>{children}</Form>;
};

interface ImagePropType {
  alttext?: string;
  caption?: string;
  contentType?: string;
  copyright?: Copyright;
  id?: number | string;
  imageUrl?: string;
  language?: string;
  metaUrl?: string;
  size?: number;
  supportedLanguages?: string[];
  tags?: string[];
  title?: string;
}

type OnUpdateFunc = (imageMetadata: UpdatedImageMetadata, image: string | Blob) => void;
type OnCreateFunc = (imageMetadata: NewImageMetadata, image: string | Blob) => void;

interface Props {
  image?: ImagePropType;
  licenses: {
    license: string;
    description: string;
    url?: string;
  }[];
  onUpdate: OnCreateFunc | OnUpdateFunc;
  inModal?: boolean;
  isNewlyCreated?: boolean;
  closeModal?: () => void;
}

interface State {
  savedToServer: boolean;
}

class ImageForm extends Component<Props & tType, State> {
  state = {
    savedToServer: false,
  };

  handleSubmit = async (values: ImageFormikType, actions: FormikHelpers<ImageFormikType>) => {
    const { licenses, onUpdate } = this.props;

    const license = licenses.find(license => license.license === values.license);

    if (
      license === undefined ||
      values.title === undefined ||
      values.alttext === undefined ||
      values.caption === undefined ||
      values.language === undefined ||
      values.tags === undefined ||
      values.origin === undefined ||
      values.creators === undefined ||
      values.processors === undefined ||
      values.rightsholders === undefined ||
      values.imageFile === undefined
    ) {
      actions.setSubmitting(false);
      this.setState({ savedToServer: false });
      return;
    }

    actions.setSubmitting(true);
    const imageMetaData: NewImageMetadata = {
      id: values.id,
      title: values.title,
      alttext: values.alttext,
      caption: values.caption,
      language: values.language,
      tags: values.tags,
      copyright: {
        license,
        origin: values.origin,
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
      },
    };
    await onUpdate(imageMetaData, values.imageFile);
    this.setState({ savedToServer: true });
  };

  render() {
    const { t, image, licenses, inModal, closeModal, isNewlyCreated } = this.props;
    const { savedToServer } = this.state;
    type ErrorFields =
      | 'alttext'
      | 'caption'
      | 'creators'
      | 'imageFile'
      | 'license'
      | 'processors'
      | 'rightsholders'
      | 'tags'
      | 'title';

    const initialValues = getInitialValues(image);
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        validateOnMount
        enableReinitialize
        validate={values => validateFormik(values, imageRules, t)}>
        {({ values, dirty, errors, isSubmitting, submitForm }) => {
          const formIsDirty = isFormikFormDirty({
            values,
            initialValues,
            dirty,
          });
          const hasError = (errorFields: ErrorFields[]): boolean =>
            errorFields.some(field => !!errors[field]);
          return (
            <FormWrapper inModal={inModal}>
              <HeaderWithLanguage
                noStatus
                values={values}
                type="image"
                content={image}
                editUrl={(lang: string) => {
                  if (values.id) return toEditImage(values.id, lang);
                  else return toCreateImage();
                }}
              />
              <Accordions>
                <AccordionSection
                  id="image-upload-content"
                  title={t('form.contentSection')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={hasError(['title', 'imageFile', 'caption', 'alttext'])}
                  startOpen>
                  <ImageContent />
                </AccordionSection>
                <AccordionSection
                  id="image-upload-metadataSection"
                  title={t('form.metadataSection')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={hasError([
                    'tags',
                    'rightsholders',
                    'creators',
                    'processors',
                    'license',
                  ])}>
                  <ImageMetaData
                    licenses={licenses}
                    imageLanguage={image?.language}
                    imageTags={values.tags}
                  />
                </AccordionSection>
              </Accordions>

              <Field right>
                {inModal ? (
                  <ActionButton outline onClick={closeModal}>
                    {t('form.abort')}
                  </ActionButton>
                ) : (
                  <AbortButton outline disabled={isSubmitting}>
                    {t('form.abort')}
                  </AbortButton>
                )}
                <SaveButton
                  isSaving={isSubmitting}
                  showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
                  formIsDirty={formIsDirty}
                  submit={!inModal}
                  onClick={(evt: Event) => {
                    if (inModal) {
                      evt.preventDefault();
                      submitForm();
                    }
                  }}>
                  {t('form.save')} - {inModal}
                </SaveButton>
              </Field>
              <AlertModalWrapper
                isSubmitting={isSubmitting}
                severity="danger"
                formIsDirty={formIsDirty}
                text={t('alertModal.notSaved')}
              />
            </FormWrapper>
          );
        }}
      </Formik>
    );
  }
}

export default injectT(ImageForm);
