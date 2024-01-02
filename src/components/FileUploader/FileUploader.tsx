/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { UploadDropZone } from "@ndla/forms";
import { DRAFT_ADMIN_SCOPE } from "../../constants";
import { useSession } from "../../containers/Session/SessionProvider";
import { UnsavedFile } from "../../interfaces";
import { uploadFile } from "../../modules/draft/draftApi";
import { createFormData } from "../../util/formDataHelper";
import handleError from "../../util/handleError";
import { isNdlaErrorPayload } from "../../util/resolveJsonOrRejectWithError";

const FileUploaderWrapper = styled.div`
  padding: 0 ${spacing.large};
`;

interface Props {
  onFileSave: (files: UnsavedFile[]) => void;
}

const FileUploader = ({ onFileSave }: Props) => {
  const { userPermissions } = useSession();
  const allowedFiles = allowedFiletypes;
  if (userPermissions?.includes(DRAFT_ADMIN_SCOPE)) {
    allowedFiles.push(...adminAllowedFiletypes);
  }
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const saveFile = async (file: string | Blob | undefined) => {
    const formData = await createFormData(file);
    return uploadFile(formData);
  };

  const onSave = async (filesList: File[]) => {
    try {
      const files = Array.from(filesList);
      setSaving(true);
      const newFiles = await Promise.all(files.map((file) => saveFile(file)));
      onFileSave(
        newFiles.map((file, i) => ({
          path: file.path,
          type: file.extension.substring(1),
          title: files[i].name.replace(/\..*/, ""),
        })),
      );
    } catch (err) {
      if (isNdlaErrorPayload(err) && err.json && err.json.messages) {
        setErrorMessage(err.json.messages.map((message: { message: string }) => message.message).join(", "));
      }
      handleError(err);
    }
    setSaving(false);
  };

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <FileUploaderWrapper>
      <UploadDropZone
        name="file"
        allowedFiles={allowedFiles}
        onAddedFiles={onSave}
        multiple
        loading={saving}
        ariaLabel={t("form.file.dragdrop.ariaLabel")}
      >
        <strong>{t("form.file.dragdrop.main")}</strong> {t("form.file.dragdrop.sub")}
      </UploadDropZone>
    </FileUploaderWrapper>
  );
};

const allowedFiletypes = [
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
];

const adminAllowedFiletypes = [".mp4"];

export default FileUploader;
