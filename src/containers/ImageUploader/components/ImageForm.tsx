/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import {
  IImageMetaInformationV3DTO,
  INewImageMetaInformationV2DTO,
  ILicenseDTO,
  IUpdateImageMetaInformationDTO,
} from "@ndla/types-backend/image-api";
import ImageContent from "./ImageContent";
import ImageCopyright from "./ImageCopyright";
import ImageMetaData from "./ImageMetaData";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../components/Accordion/FormAccordions";
import { FormActionsContainer } from "../../../components/FormikForm";
import validateFormik, { RulesType, getWarnings } from "../../../components/formikValidationSchema";
import FormWrapper from "../../../components/FormWrapper";
import HeaderWithLanguage from "../../../components/HeaderWithLanguage/HeaderWithLanguage";
import SaveButton from "../../../components/SaveButton";
import { SAVE_BUTTON_ID } from "../../../constants";
import { editorValueToPlainText } from "../../../util/articleContentConverter";
import { isFormikFormDirty } from "../../../util/formHelper";
import { AlertDialogWrapper } from "../../FormikForm";
import SimpleVersionPanel from "../../FormikForm/SimpleVersionPanel";
import { imageApiTypeToFormType, ImageFormikType } from "../imageTransformers";

const StyledFormActionsContainer = styled(FormActionsContainer, {
  base: {
    marginBlockStart: "xsmall",
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    position: "relative",
  },
});

const imageRules: RulesType<ImageFormikType, IImageMetaInformationV3DTO> = {
  title: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  caption: {
    warnings: {
      languageMatch: true,
    },
  },
  alttext: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  tags: {
    minItems: 3,
    warnings: {
      languageMatch: true,
    },
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
    test: (values) => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (!values.license || authors.length > 0) return undefined;
      return { translationKey: "validation.noLicenseWithoutCopyrightHolder" };
    },
  },
};

interface Props {
  image?: IImageMetaInformationV3DTO;
  licenses: ILicenseDTO[];
  onSubmitFunc: (
    imageMetadata: INewImageMetaInformationV2DTO & IUpdateImageMetaInformationDTO,
    image: string | Blob,
  ) => void;
  inDialog?: boolean;
  isNewlyCreated?: boolean;
  closeDialog?: () => void;
  isSaving?: boolean;
  isNewLanguage?: boolean;
  language: string;
  supportedLanguages: string[];
}

export type ImageFormErrorFields =
  | "alttext"
  | "caption"
  | "creators"
  | "imageFile"
  | "license"
  | "processors"
  | "rightsholders"
  | "tags"
  | "title";

const ImageForm = ({
  licenses,
  onSubmitFunc,
  image,
  inDialog,
  language,
  closeDialog,
  isNewlyCreated,
  isSaving,
  isNewLanguage,
  supportedLanguages,
}: Props) => {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: ImageFormikType, actions: FormikHelpers<ImageFormikType>) => {
    const license = licenses.find((license) => license.license === values.license);

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
    const imageMetaData: INewImageMetaInformationV2DTO & IUpdateImageMetaInformationDTO = {
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
        processed: values.processed,
      },
      modelReleased: values.modelReleased,
    };
    await onSubmitFunc(imageMetaData, values.imageFile);
    setSavedToServer(true);
    actions.resetForm();
  };

  const initialValues = imageApiTypeToFormType(image, language);
  const initialErrors = validateFormik(initialValues, imageRules, t);
  const initialWarnings = getWarnings(initialValues, imageRules, t, image);

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={handleSubmit}
      validateOnMount
      enableReinitialize
      validate={(values) => validateFormik(values, imageRules, t)}
      initialStatus={{ warnings: initialWarnings }}
    >
      {({ values, dirty, errors, isSubmitting, submitForm, isValid, handleSubmit }) => {
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
          changed: isNewLanguage,
        });
        const hasError = (errorFields: ImageFormErrorFields[]): boolean => errorFields.some((field) => !!errors[field]);
        return (
          <FormWrapper inDialog={inDialog} onSubmit={handleSubmit}>
            <HeaderWithLanguage
              id={image?.id ? parseInt(image.id) : undefined}
              language={language}
              noStatus
              supportedLanguages={supportedLanguages}
              type="image"
              title={image?.title.title}
            />
            <FormAccordions defaultOpen={["content"]}>
              <FormAccordion
                id="content"
                title={t("form.contentSection")}
                hasError={hasError(["title", "imageFile", "caption", "alttext"])}
              >
                <StyledPageContent variant="content">
                  <ImageContent language={language} />
                </StyledPageContent>
              </FormAccordion>
              <FormAccordion
                id="copyright"
                title={t("form.copyrightSection")}
                hasError={hasError(["rightsholders", "creators", "processors", "license"])}
              >
                <ImageCopyright />
              </FormAccordion>
              <FormAccordion id="metadata" title={t("form.metadataSection")} hasError={hasError(["tags"])}>
                <ImageMetaData imageLanguage={language} />
              </FormAccordion>
              <FormAccordion id="image-upload-version-history" title={t("form.workflowSection")} hasError={false}>
                <SimpleVersionPanel editorNotes={image?.editorNotes} />
              </FormAccordion>
            </FormAccordions>
            <StyledFormActionsContainer>
              {inDialog ? (
                <Button variant="secondary" onClick={closeDialog}>
                  {t("form.abort")}
                </Button>
              ) : (
                <Button variant="secondary" disabled={isSubmitting || isSaving} onClick={() => navigate(-1)}>
                  {t("form.abort")}
                </Button>
              )}
              <SaveButton
                id={SAVE_BUTTON_ID}
                type={!inDialog ? "submit" : "button"}
                loading={isSubmitting || isSaving}
                disabled={!isValid}
                showSaved={!dirty && (isNewlyCreated || savedToServer)}
                formIsDirty={formIsDirty}
                onClick={(evt) => {
                  if (inDialog) {
                    evt.preventDefault();
                    submitForm();
                  }
                }}
              />
            </StyledFormActionsContainer>
            <AlertDialogWrapper
              isSubmitting={isSubmitting}
              severity="danger"
              formIsDirty={formIsDirty}
              text={t("alertDialog.notSaved")}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

export default ImageForm;
