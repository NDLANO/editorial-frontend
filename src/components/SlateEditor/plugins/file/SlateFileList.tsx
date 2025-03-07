/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
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
import { FileElement } from ".";
import DndFileList from "./DndFileList";
import { TYPE_FILE } from "./types";
import config from "../../../../config";
import { File, UnsavedFile } from "../../../../interfaces";
import { headFileAtRemote } from "../../../../modules/draft/draftApi";
import { DialogCloseButton } from "../../../DialogCloseButton";
import FileUploader from "../../../FileUploader";

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

const SlateFileList = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [missingFilePaths, setMissingFilePaths] = useState<string[]>([]);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const { data: files } = element;

  useEffect(() => {
    getMissingFiles(files).then(setMissingFilePaths);
    // We only need to check this once, as adding further files guarantees them to "exist"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEditFileList = useCallback(
    (data: File[]) => {
      Transforms.setNodes(editor, { data }, { at: ReactEditor.findPath(editor, element) });
    },
    [editor, element],
  );

  const removeFileList = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_FILE,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onDeleteFile = (indexToDelete: number) => {
    if (files.length === 1) {
      removeFileList();
      return;
    }
    const data = files.filter((_, i) => i !== indexToDelete);
    onEditFileList(data);
  };

  const onAddFileToList = (newFiles: UnsavedFile[]) => {
    setShowFileUploader(false);
    const data = files.concat(
      newFiles.map((file) => {
        return formatFile({ ...file, url: config.ndlaApiUrl + file.path, resource: "file" }, t);
      }),
    );
    onEditFileList(data);
  };

  if (files.length === 0) {
    return null;
  }
  return (
    <FileListWrapper {...attributes} contentEditable={false}>
      <StyledHeaderWrapper>
        <DialogRoot open={showFileUploader} onOpenChange={(details) => setShowFileUploader(details.open)}>
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
                <FileUploader onFileSave={onAddFileToList} close={() => setShowFileUploader(false)} />
              </DialogBody>
            </DialogContent>
          </Portal>
        </DialogRoot>
        <IconButton
          variant="danger"
          title={t("form.file.removeList")}
          aria-label={t("form.file.removeList")}
          onClick={removeFileList}
          size="small"
        >
          <CloseLine />
        </IconButton>
      </StyledHeaderWrapper>
      <ul>
        <DndFileList
          files={files}
          onEditFileList={onEditFileList}
          onDeleteFile={onDeleteFile}
          missingFilePaths={missingFilePaths}
        />
      </ul>
      {children}
    </FileListWrapper>
  );
};

export default SlateFileList;
