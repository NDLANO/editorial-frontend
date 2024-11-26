/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons/action";
import { UploadCloudLine } from "@ndla/icons/editor";
import { ImageMeta } from "@ndla/image-search";
import {
  Button,
  FieldLabel,
  FieldRoot,
  FileUploadDropzone,
  FileUploadHiddenInput,
  FileUploadLabel,
  FileUploadRoot,
  FileUploadTrigger,
  IconButton,
  FieldErrorMessage,
  FieldTextArea,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import { MAX_IMAGE_UPLOAD_SIZE } from "../../../constants";
import { TitleField } from "../../FormikForm";
import { ImageFormikType } from "../imageTransformers";

const StyledImg = styled("img", {
  base: {
    borderRadius: "xsmall",
  },
});

const StyledIconButton = styled(IconButton, {
  base: {
    position: "absolute",
    right: "-large",
  },
});

const ImageContentWrapper = styled("div", {
  base: {
    position: "relative",
  },
});

const ImageContent = () => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ImageFormikType>();
  const { values, setFieldValue } = formikContext;

  // We use the timestamp to avoid caching of the `imageFile` url in the browser
  const timestamp = new Date().getTime();
  const imgSrc = values.filepath || `${values.imageFile}?width=800&ts=${timestamp}`;

  return (
    <FormContent>
      <TitleField hideToolbar />
      <ImageContentWrapper>
        {!values.imageFile && (
          <FormField name="imageFile">
            {({ helpers, meta }) => (
              <FieldRoot required invalid={!!meta.error}>
                <FileUploadRoot
                  accept={["image/gif", "image/png", "image/jpeg", "image/jpg", "image/svg+xml"]}
                  onFileAccept={(details) => {
                    const file = details.files?.[0];
                    if (!file) return;
                    setFieldValue("filepath", URL.createObjectURL(file));
                    Promise.resolve(
                      createImageBitmap(file as Blob).then((image) => {
                        setFieldValue("imageDimensions", image);
                      }),
                    );
                    setFieldValue("imageFile", file);
                    setFieldValue("contentType", file.type);
                    setFieldValue("fileSize", file.size);
                  }}
                  maxFileSize={MAX_IMAGE_UPLOAD_SIZE}
                  onFileReject={(details) => {
                    // Bug in formik's setError function requiring setTimeout to make it work,
                    // as discussed here: https://github.com/jaredpalmer/formik/discussions/3870
                    const fileErrors = details.files?.[0]?.errors;
                    if (!fileErrors) return;
                    if (fileErrors.includes("FILE_TOO_LARGE")) {
                      const errorMessage = `${t("form.image.fileUpload.genericError")}: ${t("form.image.fileUpload.tooLargeError")}`;
                      setTimeout(() => {
                        helpers.setError(errorMessage);
                      }, 0);
                      return;
                    }
                    if (fileErrors.includes("FILE_INVALID_TYPE")) {
                      const errorMessage = `${t("form.image.fileUpload.genericError")}: ${t("form.image.fileUpload.fileTypeInvalidError")}`;
                      setTimeout(() => {
                        helpers.setError(errorMessage);
                      }, 0);
                      return;
                    }
                    setTimeout(() => {
                      helpers.setError(t("form.image.fileUpload.genericError"));
                    }, 0);
                  }}
                >
                  <FileUploadDropzone>
                    <FileUploadLabel>{t("form.image.fileUpload.description")}</FileUploadLabel>
                    <FileUploadTrigger asChild>
                      <Button>
                        <UploadCloudLine />
                        {t("form.image.fileUpload.button")}
                      </Button>
                    </FileUploadTrigger>
                  </FileUploadDropzone>
                  <FileUploadHiddenInput />
                </FileUploadRoot>
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
        )}
        {!!values.imageFile && (
          <StyledIconButton
            aria-label={t("form.image.removeImage")}
            title={t("form.image.removeImage")}
            variant="danger"
            onClick={() => setFieldValue("imageFile", undefined)}
            size="small"
          >
            <DeleteBinLine />
          </StyledIconButton>
        )}
        {!!values.imageFile && (
          <>
            {typeof values.imageFile === "string" ? (
              <SafeLink target="_blank" to={values.imageFile}>
                <StyledImg src={imgSrc} alt="" srcSet="" />
              </SafeLink>
            ) : (
              <StyledImg src={imgSrc} alt="" srcSet="" />
            )}
            <ImageMeta
              contentType={values.contentType ?? ""}
              fileSize={values.fileSize ?? 0}
              imageDimensions={values.imageDimensions}
            />
          </>
        )}
      </ImageContentWrapper>
      <FormField name="caption">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <FieldLabel>{t("form.image.caption.label")}</FieldLabel>
            <FieldTextArea placeholder={t("form.image.caption.placeholder")} {...field} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
      <FormField name="alttext">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <FieldLabel>{t("form.image.alt.label")}</FieldLabel>
            <FieldTextArea placeholder={t("form.image.alt.placeholder")} {...field} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
    </FormContent>
  );
};

export default ImageContent;
