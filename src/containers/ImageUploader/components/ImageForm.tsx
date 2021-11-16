/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, FormikHelpers } from 'formik';
import { Accordions, AccordionSection } from '@ndla/accordion';
import Field from '../../../components/Field';
import SaveButton from '../../../components/SaveButton';
import { isFormikFormDirty } from '../../../util/formHelper';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import ImageMetaData from './ImageMetaData';
import ImageContent from './ImageContent';
import {
  ActionButton,
  AbortButton,
  formClasses as classes,
  AlertModalWrapper,
} from '../../FormikForm';
import { toCreateImage, toEditImage } from '../../../util/routeHelpers';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage/HeaderWithLanguage';
import {
  ImageApiType,
  NewImageMetadata,
  UpdatedImageMetadata,
} from '../../../modules/image/imageApiInterfaces';
import ImageVersionNotes from './ImageVersionNotes';
import { MAX_IMAGE_UPLOAD_SIZE } from '../../../constants';
import { imageApiTypeToFormType, ImageFormikType } from '../imageTransformers';
import { License } from '../../../interfaces';

const imageRules: RulesType<ImageFormikType> = {
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
  'imageFile.size': {
    maxSize: MAX_IMAGE_UPLOAD_SIZE,
  },
  license: {
    required: true,
  },
};

const FormWrapper = ({ inModal, children }: { inModal?: boolean; children: ReactNode }) => {
  if (inModal) {
    return <div {...classes()}>{children}</div>;
  }
  return <Form>{children}</Form>;
};

type OnUpdateFunc = (imageMetadata: UpdatedImageMetadata, image: string | Blob) => void;
type OnCreateFunc = (imageMetadata: NewImageMetadata, image: string | Blob) => void;

interface Props {
  image?: ImageApiType;
  licenses: License[];
  onUpdate: OnCreateFunc | OnUpdateFunc;
  inModal?: boolean;
  isNewlyCreated?: boolean;
  closeModal?: () => void;
  isSaving?: boolean;
  language: string;
}

export type ImageFormErrorFields =
  | 'alttext'
  | 'caption'
  | 'creators'
  | 'imageFile'
  | 'license'
  | 'processors'
  | 'rightsholders'
  | 'tags'
  | 'title';

const ImageForm = ({
  licenses,
  onUpdate,
  image,
  inModal,
  language,
  closeModal,
  isNewlyCreated,
  isSaving,
}: Props) => {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);

  const handleSubmit = async (values: ImageFormikType, actions: FormikHelpers<ImageFormikType>) => {
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
      values.imageFile === undefined ||
      values.modelReleased === undefined
    ) {
      actions.setSubmitting(false);
      setSavedToServer(false);
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
      modelReleased: values.modelReleased,
    };
    await onUpdate(imageMetaData, values.imageFile);
    setSavedToServer(true);
    actions.resetForm();
  };

  const initialValues = imageApiTypeToFormType(image, language);
  const initialErrors = validateFormik(initialValues, imageRules, t);

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={handleSubmit}
      validateOnMount
      enableReinitialize
      validate={values => validateFormik(values, imageRules, t)}>
      {({ values, dirty, errors, isSubmitting, submitForm, isValid }) => {
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });
        const hasError = (errorFields: ImageFormErrorFields[]): boolean =>
          errorFields.some(field => !!errors[field]);
        return (
          <FormWrapper inModal={inModal}>
            <HeaderWithLanguage
              noStatus
              values={values}
              type="image"
              content={{
                ...image,
                language,
                title: image?.title.title,
                id: image?.id ? parseInt(image.id) : undefined,
              }}
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
                hasError={hasError(['tags', 'rightsholders', 'creators', 'processors', 'license'])}>
                <ImageMetaData
                  licenses={licenses}
                  imageLanguage={language}
                  imageTags={values.tags}
                />
              </AccordionSection>
              <AccordionSection
                id="image-upload-version-history"
                title={t('form.workflowSection')}
                className="u-4/6@desktop u-push-1/6@desktop">
                <ImageVersionNotes image={image} />
              </AccordionSection>
            </Accordions>
            <Field right>
              {inModal ? (
                <ActionButton outline onClick={closeModal}>
                  {t('form.abort')}
                </ActionButton>
              ) : (
                <AbortButton outline disabled={isSubmitting || isSaving}>
                  {t('form.abort')}
                </AbortButton>
              )}
              <SaveButton
                isSaving={isSubmitting || isSaving}
                disabled={!isValid}
                showSaved={!dirty && (isNewlyCreated || savedToServer)}
                formIsDirty={formIsDirty}
                submit={!inModal}
                onClick={evt => {
                  if (inModal) {
                    evt.preventDefault();
                    submitForm();
                  }
                }}
              />
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
};

export default ImageForm;
