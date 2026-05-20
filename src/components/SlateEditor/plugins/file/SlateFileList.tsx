/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { CloseLine, AddLine } from "@ndla/icons";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FileListWrapper } from "@ndla/ui";
import { TFunction } from "i18next";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { FileElement } from ".";
import config from "../../../../config";
import { File, UnsavedFile } from "../../../../interfaces";
import { headFileAtRemote } from "../../../../modules/draft/draftApi";
import { DialogCloseButton } from "../../../DialogCloseButton";
import FileUploader from "../../../FileUploader";
import { SelectableSlateElement } from "../../common/SelectableSlateEmbed";
import { useEditableElement } from "../../utils/useEditableElement";
import DndFileList from "./DndFileList";

const StyledHeaderWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    justifyContent: "flex-end",
  },
});

const formatFile = (file: File, t: TFunction): File => ({
  ...file,
  formats: [{ url: file.url, fileType: file.type, tooltip: `${t(`form.file.download`)} ${file.title}` }],
});

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: FileElement;
  children: ReactNode;
}

const getMissingFiles = async (files: File[]) => {
  const missingFiles = files.map(async (file) => {
    const exists = await headFileAtRemote(file.url);
    return { ...file, exists: !!exists };
  });
  const resolvedFiles = await Promise.all(missingFiles);
  return resolvedFiles.filter((f) => !f.exists).map((f) => f.path);
};

// TODO: Maybe this freak?

const SlateFileList = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [missingFilePaths, setMissingFilePaths] = useState<string[]>([]);
  const { data: files } = element;
  const { handleEditingChange, handleRemove, handleSave, dialogProps } = useEditableElement(element, editor);

  useEffect(() => {
    getMissingFiles(files).then(setMissingFilePaths);
    // We only need to check this once, as adding further files guarantees them to "exist"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteFile = (indexToDelete: number) => {
    if (files.length === 1) {
      handleRemove();
    } else {
      handleSave({ data: files.filter((_, i) => i !== indexToDelete) });
    }
  };

  const onAddFileToList = (unsaved: UnsavedFile[]) => {
    const newFiles = unsaved.map((f) => formatFile({ ...f, url: config.ndlaApiUrl + f.path, resource: "file" }, t));
    handleSave({ data: files.concat(newFiles) });
  };

  if (files.length === 0) {
    return null;
  }
  return (
    <SelectableSlateElement asChild>
      <FileListWrapper {...attributes} contentEditable={false} asChild consumeCss>
        <div>
          <StyledHeaderWrapper>
            <DialogRoot {...dialogProps}>
              <DialogTrigger asChild>
                <IconButton
                  variant="tertiary"
                  title={t("form.file.addFile")}
                  aria-label={t("form.file.addFile")}
                  size="small"
                >
                  <AddLine />
                </IconButton>
              </DialogTrigger>
              <Portal>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("fileUpload.title")}</DialogTitle>
                    <DialogCloseButton />
                  </DialogHeader>
                  <DialogBody>
                    <FileUploader onFileSave={onAddFileToList} close={() => handleEditingChange(false)} />
                  </DialogBody>
                </DialogContent>
              </Portal>
            </DialogRoot>
            <IconButton
              variant="danger"
              title={t("form.file.removeList")}
              aria-label={t("form.file.removeList")}
              onClick={handleRemove}
              size="small"
            >
              <CloseLine />
            </IconButton>
          </StyledHeaderWrapper>
          <ul>
            <DndFileList
              files={files}
              onEditFileList={(data) => handleSave({ data })}
              onDeleteFile={onDeleteFile}
              missingFilePaths={missingFilePaths}
            />
          </ul>
          {children}
        </div>
      </FileListWrapper>
    </SelectableSlateElement>
  );
};

export default SlateFileList;
