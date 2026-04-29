/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UploadCloudLine } from "@ndla/icons";
import {
  Button,
  FileUploadDropzone,
  FileUploadHiddenInput,
  FileUploadLabel,
  FileUploadRoot,
  FileUploadTrigger,
} from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { MAX_IMAGE_UPLOAD_SIZE } from "../../../../constants";

interface ImageFile {
  file: string | Blob;
  contentType: string;
  fileSize: number;
  filePath: string;
  dimensions: ImageBitmap;
}

interface Props {
  onFileAccept: (files: File[]) => void;
  acceptedFiles: File[];
}

export const BatchImageUploader = ({ onFileAccept, acceptedFiles }: Props) => {
  const { t } = useTranslation();
  return (
    <FileUploadRoot
      accept={["image/gif", "image/png", "image/jpeg", "image/svg+xml"]}
      maxFileSize={MAX_IMAGE_UPLOAD_SIZE}
      maxFiles={1000}
      acceptedFiles={acceptedFiles}
      onFileAccept={async (details) => {
        onFileAccept(details.files);
        const transformedFiles: Promise<ImageFile>[] = details.files.map(async (file) => {
          const dimensions = await createImageBitmap(file);
          return {
            file,
            contentType: file.type,
            fileSize: file.size,
            filePath: URL.createObjectURL(file),
            dimensions,
          };
        });
        await Promise.all(transformedFiles);
      }}
      onFileReject={(details) => {
        console.log(details);
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
  );
};
