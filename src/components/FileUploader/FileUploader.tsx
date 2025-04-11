/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik } from "formik";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine, FileTextLine, UploadCloudLine } from "@ndla/icons";
import {
  Button,
  FieldErrorMessage,
  FieldRoot,
  FileUploadContext,
  FileUploadDropzone,
  FileUploadHiddenInput,
  FileUploadItem,
  FileUploadItemDeleteTrigger,
  FileUploadItemGroup,
  FileUploadItemName,
  FileUploadItemPreview,
  FileUploadItemSizeText,
  FileUploadLabel,
  FileUploadRoot,
  FileUploadTrigger,
  IconButton,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { DRAFT_ADMIN_SCOPE } from "../../constants";
import { useSession } from "../../containers/Session/SessionProvider";
import { UnsavedFile } from "../../interfaces";
import { uploadFile } from "../../modules/draft/draftApi";
import { createFormData } from "../../util/formDataHelper";
import handleError from "../../util/handleError";
import { isNdlaErrorPayload } from "../../util/resolveJsonOrRejectWithError";
import { FormField } from "../FormField";
import { FormActionsContainer, FormikForm } from "../FormikForm";
import validateFormik, { RulesType } from "../formikValidationSchema";

const StyledErrorText = styled(Text, {
  base: {
    color: "surface.danger",
    marginInlineStart: "auto",
  },
});

interface FileUploadFormValues {
  files: File[];
}

const rules: RulesType<FileUploadFormValues> = {
  files: {
    required: true,
  },
};

interface Props {
  onFileSave: (files: UnsavedFile[]) => void;
  close: () => void;
}

const FileUploader = ({ onFileSave, close }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const allowedFiles = useMemo(
    () =>
      userPermissions?.includes(DRAFT_ADMIN_SCOPE) ? allowedFiletypes.concat(adminAllowedFiletypes) : allowedFiletypes,
    [userPermissions],
  );
  const [errorMessage, setErrorMessage] = useState<string>();

  const saveFile = async (file: string | Blob | undefined) => {
    const formData = createFormData(file);
    return uploadFile(formData);
  };

  const onSave = async (values: FileUploadFormValues) => {
    try {
      const newFiles = await Promise.all(values.files.map((file) => saveFile(file)));
      onFileSave(
        newFiles.map((file, i) => ({
          path: file.path,
          type: file.extension.substring(1),
          title: values.files[i].name.replace(/\..*/, ""),
        })),
      );
    } catch (err) {
      if (isNdlaErrorPayload(err) && err.json && err.json.messages) {
        setErrorMessage(err.json.messages.map((message: { message: string }) => message.message).join(", "));
      }
      handleError(err);
    }
  };

  return (
    <Formik
      onSubmit={onSave}
      validate={(values) => validateFormik(values, rules, t)}
      initialValues={{ files: [] } as FileUploadFormValues}
      initialErrors={validateFormik({ files: [] }, rules, t)}
    >
      {({ dirty, isSubmitting }) => (
        <FormikForm>
          <FormField name="files">
            {({ helpers, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <FileUploadRoot
                  accept={allowedFiles}
                  onFileChange={(details) => helpers.setValue(details.acceptedFiles)}
                  onFileReject={(details) => {
                    const fileErrors = details.files?.[0]?.errors;
                    if (!fileErrors) return;
                    // Bug in formik's setError function requiring setTimeout to make it work,
                    // as discussed here: https://github.com/jaredpalmer/formik/discussions/3870
                    if (fileErrors.includes("FILE_INVALID_TYPE")) {
                      const errorMessage = `${t("form.file.fileUpload.genericError")}: ${t("form.file.fileUpload.fileTypeInvalidError")}`;
                      setTimeout(() => {
                        helpers.setError(errorMessage);
                      }, 0);
                      return;
                    }
                    if (fileErrors.includes("TOO_MANY_FILES")) {
                      const errorMessage = `${t("form.file.fileUpload.genericError")}: ${t("form.file.fileUpload.tooManyError")}`;
                      setTimeout(() => {
                        helpers.setError(errorMessage);
                      }, 0);
                      return;
                    }
                    setTimeout(() => {
                      helpers.setError(t("form.file.fileUpload.genericError"));
                    }, 0);
                  }}
                  maxFiles={5}
                >
                  <FileUploadDropzone>
                    <FileUploadLabel>{t("form.file.fileUpload.description")}</FileUploadLabel>
                    <FileUploadTrigger asChild>
                      <Button>
                        <UploadCloudLine />
                        {t("form.file.fileUpload.button")}
                      </Button>
                    </FileUploadTrigger>
                  </FileUploadDropzone>
                  <FileUploadItemGroup>
                    <FileUploadContext>
                      {({ acceptedFiles }) =>
                        acceptedFiles.map((file, index) => (
                          <FileUploadItem key={`${file.name}_${index}`} file={file}>
                            <FileUploadItemPreview>
                              <FileTextLine />
                            </FileUploadItemPreview>
                            <FileUploadItemName />
                            <FileUploadItemSizeText />
                            <FileUploadItemDeleteTrigger asChild>
                              <IconButton variant="danger">
                                <DeleteBinLine />
                              </IconButton>
                            </FileUploadItemDeleteTrigger>
                          </FileUploadItem>
                        ))
                      }
                    </FileUploadContext>
                  </FileUploadItemGroup>
                  <FileUploadHiddenInput />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FileUploadRoot>
              </FieldRoot>
            )}
          </FormField>
          <FormActionsContainer>
            <Button onClick={close} variant="secondary">
              {t("form.abort")}
            </Button>
            <Button type="submit" disabled={!dirty || isSubmitting}>
              {t("form.save")}
            </Button>
          </FormActionsContainer>
          {!!errorMessage && <StyledErrorText>{errorMessage}</StyledErrorText>}
        </FormikForm>
      )}
    </Formik>
  );
};

const allowedFiletypes = [
  ".3mf",
  ".csv",
  ".doc",
  ".docx",
  ".dwg",
  ".dxf",
  ".ggb",
  ".ipynb",
  ".json",
  ".odp",
  ".ods",
  ".odt",
  ".pdf",
  ".pln",
  ".pro",
  ".ppt",
  ".pptx",
  ".pub",
  ".rtf",
  ".skp",
  ".stl",
  ".tex",
  ".tsv",
  ".txt",
  ".xls",
  ".xlsx",
  ".xml",
  ".f3d",
  ".ino",
  ".stp",
  ".step",
];

const adminAllowedFiletypes = [".mp4"];

export default FileUploader;
