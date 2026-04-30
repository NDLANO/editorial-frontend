/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DeleteBinLine, UploadCloudLine } from "@ndla/icons";
import { ImageMeta } from "@ndla/image-search";
import {
  Button,
  FieldRoot,
  FileUploadDropzone,
  FileUploadHiddenInput,
  FileUploadLabel,
  FileUploadRoot,
  FileUploadTrigger,
  FieldErrorMessage,
  IconButton,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ImageDimensionsDTO, ImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { uniq } from "@ndla/util";
import { useField } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MAX_IMAGE_UPLOAD_SIZE } from "../../../constants";
import { ImageFormikType } from "../imageTransformers";
import { translateFileError } from "./imageUtils";

const StyledImg = styled("img", {
  base: {
    borderRadius: "xsmall",
  },
});

const StyledIconButton = styled(IconButton, {
  base: {
    position: "absolute",
    top: "xsmall",
    right: "xsmall",
  },
});

const ImageContentWrapper = styled("div", {
  base: {
    position: "relative",
  },
});

interface Props {
  language: string;
  image: ImageMetaInformationV3DTO | undefined;
}

interface ImageMeta {
  contentType: string;
  fileSize: number;
  dimensions?: ImageDimensionsDTO;
  originalDate?: string;
  url: string;
}

const getImageMeta = async (
  image: ImageMetaInformationV3DTO | undefined,
  file: Blob | undefined,
): Promise<ImageMeta | undefined> => {
  if (image) {
    return {
      contentType: image.image.contentType,
      fileSize: image.image.size,
      dimensions: image.image.dimensions,
      originalDate: image.image.originalDate,
      // We use the timestamp to avoid caching of the `imageFile` url in the browser
      url: `${image.image.imageUrl}?width=800&ts=${new Date().getTime()}`,
    };
  } else if (file) {
    const bitmap = await createImageBitmap(file);
    return {
      contentType: file.type,
      fileSize: file.size,
      dimensions: bitmap,
      url: URL.createObjectURL(file),
    };
  }
  return undefined;
};

export const ImageUploadFormElement = ({ language, image }: Props) => {
  const { t } = useTranslation();
  const [imageMeta, setImageMeta] = useState<ImageMeta | undefined>(undefined);
  const [field, meta, helpers] = useField<ImageFormikType["imageFile"]>("imageFile");

  useEffect(() => {
    getImageMeta(image, typeof field.value === "string" ? undefined : field.value).then((meta) => setImageMeta(meta));
  }, [image, field.value]);

  return (
    <ImageContentWrapper>
      {!field.value && (
        <FieldRoot required invalid={!!meta.error}>
          <FileUploadRoot
            accept={["image/gif", "image/png", "image/jpeg", "image/svg+xml"]}
            onFileAccept={(details) => {
              const file = details.files?.[0];
              if (!file) return;
              // TODO: Make consumers handle field values themselves
              //       https://github.com/NDLANO/editorial-frontend/pull/2891#discussion_r1991020617
              helpers.setValue(file);
            }}
            maxFileSize={MAX_IMAGE_UPLOAD_SIZE}
            onFileReject={(details) => {
              // Bug in formik's setError function requiring setTimeout to make it work,
              // as discussed here: https://github.com/jaredpalmer/formik/discussions/3870
              const fileErrors = details.files?.[0]?.errors;
              if (!fileErrors) return;
              const translatedErrors = fileErrors.map((err) => translateFileError(err, t));
              setTimeout(() => {
                helpers.setError(uniq(translatedErrors).join(", "));
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
      {!!field.value && (
        <StyledIconButton
          aria-label={t("form.image.removeImage")}
          title={t("form.image.removeImage")}
          variant="danger"
          onClick={() => helpers.setValue(undefined)}
          size="small"
        >
          <DeleteBinLine />
        </StyledIconButton>
      )}
      {!!imageMeta && (
        <>
          {image ? (
            <SafeLink target="_blank" to={image.image.imageUrl}>
              <StyledImg src={imageMeta.url} alt="" srcSet="" />
            </SafeLink>
          ) : (
            <StyledImg src={imageMeta.url} alt="" srcSet="" />
          )}
          <ImageMeta
            contentType={imageMeta.contentType}
            fileSize={imageMeta.fileSize}
            imageDimensions={imageMeta.dimensions}
            originalDate={imageMeta.originalDate}
            locale={language}
          />
        </>
      )}
    </ImageContentWrapper>
  );
};
