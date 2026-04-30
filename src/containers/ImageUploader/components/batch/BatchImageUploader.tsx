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
  FileUploadContext,
  FileUploadDropzone,
  FileUploadHiddenInput,
  FileUploadLabel,
  FileUploadRoot,
  FileUploadTrigger,
  ListItemHeading,
  ListItemRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { uniq } from "@ndla/util";
import { useTranslation } from "react-i18next";
import { MAX_IMAGE_UPLOAD_SIZE } from "../../../../constants";
import { translateFileError } from "../imageUtils";

interface Props {
  onFileAccept: (files: File[]) => void;
  acceptedFiles: File[];
}

const StyledRejectFilesContainer = styled("div", {
  base: {
    marginBlockStart: "medium",
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

export const BatchImageUploader = ({ onFileAccept, acceptedFiles }: Props) => {
  const { t } = useTranslation();
  return (
    <FileUploadRoot
      accept={["image/gif", "image/png", "image/jpeg", "image/svg+xml"]}
      maxFileSize={MAX_IMAGE_UPLOAD_SIZE}
      maxFiles={1000}
      acceptedFiles={acceptedFiles}
      onFileAccept={async (details) => onFileAccept(details.files)}
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
      <FileUploadContext>
        {({ rejectedFiles }) =>
          rejectedFiles.length ? (
            <StyledRejectFilesContainer>
              <Text textStyle="label.medium">{t("batchImageUploadPage.rejectedFiles")}</Text>
              <StyledList>
                {rejectedFiles.map((file) => (
                  <ListItemRoot key={file.file.name} nonInteractive asChild consumeCss>
                    <li>
                      <ListItemHeading>{file.file.name}</ListItemHeading>
                      <Text>{uniq(file.errors.map((err) => translateFileError(err, t))).join(", ")}</Text>
                    </li>
                  </ListItemRoot>
                ))}
              </StyledList>
            </StyledRejectFilesContainer>
          ) : null
        }
      </FileUploadContext>
    </FileUploadRoot>
  );
};
