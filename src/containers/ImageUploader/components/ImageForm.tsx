/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { Accordions, AccordionSection } from '@ndla/accordion';
import Field from '../../../components/Field';
import SaveButton from '../../../components/SaveButton';
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
import { imageApiTypeToFormType, ImageFormType } from '../imageTransformers';
import { editorValueToPlainText } from '../../../util/articleContentConverter';
import { useLicenses } from '../../../modules/draft/draftQueries';
import withFormEventsProvider from '../../../components/Form/withFormEvents';

const imageRules: RulesType<ImageFormType> = {
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

const FormWrapper = ({ inModal, children }: { inModal?: boolean; children: ReactNode }) => {
  if (inModal) {
    return <div {...classes()}>{children}</div>;
  }
  return <>{children}</>;
};

type OnUpdateFunc = (
  imageMetadata: UpdatedImageMetadata,
  image: string | Blob,
) => Promise<ImageApiType>;
type OnCreateFunc = (
  imageMetadata: NewImageMetadata,
  image: string | Blob,
) => Promise<ImageApiType>;

interface Props {
  image?: ImageApiType;
  onUpdate: OnCreateFunc | OnUpdateFunc;
  inModal?: boolean;
  isNewlyCreated?: boolean;
  closeModal?: () => void;
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

const imageContentErrorFields: ImageFormErrorFields[] = [
  'title',
  'imageFile',
  'caption',
  'alttext',
];

const imageMetaErrorFields: ImageFormErrorFields[] = [
  'tags',
  'rightsholders',
  'creators',
  'processors',
  'license',
];

const ImageForm = ({ onUpdate, image, inModal, language, closeModal, isNewlyCreated }: Props) => {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const licensesQuery = useLicenses({ placeholderData: [] });

  const handleSubmit = async (values: ImageFormType) => {
    const license = licensesQuery.data?.find(license => license.license === values.license);
    if (values.imageFile === undefined || license === undefined) {
      setSavedToServer(false);
      return;
    }

    const imageMetaData: NewImageMetadata = {
      id: values.id,
      title: editorValueToPlainText(values.title),
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
    const newImage = await onUpdate(imageMetaData, values.imageFile);
    setSavedToServer(true);
    methods.reset(imageApiTypeToFormType(newImage, values.language));
  };
  const initialValues = imageApiTypeToFormType(image, language);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: initialValues,
    criteriaMode: 'all',
    resolver: (data, _) => {
      const validationResult = validateFormik(data, imageRules, t);
      if (Object.keys(validationResult).length === 0) return { values: data, errors: {} };

      const resolveErrors = Object.entries(validationResult).reduce<
        Record<string, { message: string }>
      >((acc, [key, message]) => {
        acc[key] = { message };
        return acc;
      }, {});
      return { values: {}, errors: resolveErrors };
    },
  });
  const values = methods.getValues();
  const errors = methods.formState.errors;
  const imageContentHasError = imageContentErrorFields.some(f => !!errors[f]);
  const imageMetaHasError = imageMetaErrorFields.some(f => !!errors[f]);

  //validate on initial load.
  useEffect(() => {
    methods.trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toImageUrl = (lang: string) => (image ? toEditImage(image.id, lang) : toCreateImage());

  return (
    <FormProvider {...methods}>
      <FormWrapper inModal={inModal}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <HeaderWithLanguage
            noStatus
            type="image"
            values={values}
            content={{
              ...image,
              language,
              title: image?.title.title,
              id: image?.id ? parseInt(image.id) : undefined,
            }}
            editUrl={toImageUrl}
          />
          <Accordions>
            <AccordionSection
              id="image-upload-content"
              title={t('form.contentSection')}
              className="u-4/6@desktop u-push-1/6@desktop"
              hasError={imageContentHasError}
              startOpen>
              <ImageContent onSubmit={handleSubmit} />
            </AccordionSection>
            <AccordionSection
              id="image-upload-metadataSection"
              title={t('form.metadataSection')}
              className="u-4/6@desktop u-push-1/6@desktop"
              hasError={imageMetaHasError}>
              <ImageMetaData imageLanguage={language} />
            </AccordionSection>
            <AccordionSection
              id="image-upload-version-history"
              title={t('form.workflowSection')}
              className="u-4/6@desktop u-push-1/6@desktop">
              <ImageVersionNotes image={image} />
            </AccordionSection>
          </Accordions>
          <ImageFormButtons
            handleSubmit={methods.handleSubmit(handleSubmit)}
            inModal={inModal}
            closeModal={closeModal}
            savedToServer={savedToServer}
            isNewlyCreated={isNewlyCreated}
          />
          <AlertModal />
        </form>
      </FormWrapper>
    </FormProvider>
  );
};

const AlertModal = () => {
  const { isDirty, isSubmitting } = useFormState();
  const { t } = useTranslation();

  return (
    <AlertModalWrapper
      isSubmitting={isSubmitting}
      severity="danger"
      formIsDirty={isDirty}
      text={t('alertModal.notSaved')}
    />
  );
};
interface ButtonProps {
  inModal?: boolean;
  closeModal?: () => void;
  handleSubmit: () => Promise<void>;
  isNewlyCreated?: boolean;
  savedToServer?: boolean;
}
const ImageFormButtons = ({
  inModal,
  closeModal,
  isNewlyCreated,
  handleSubmit,
  savedToServer,
}: ButtonProps) => {
  const { t } = useTranslation();
  const { isDirty, isValid, isSubmitting } = useFormState();
  return (
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
        disabled={!isValid}
        showSaved={!isDirty && (isNewlyCreated || savedToServer)}
        formIsDirty={isDirty}
        submit={!inModal}
        onClick={evt => {
          if (inModal) {
            evt.preventDefault();
            handleSubmit();
          }
        }}
      />
    </Field>
  );
};

export default withFormEventsProvider(ImageForm);
