/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Draggable } from "@ndla/icons";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { File as FileType } from "../../../../interfaces";
import DndList from "../../../DndList";
import { DragHandle } from "../../../DraggableItem";
import { SlateFile } from "./SlateFile";

interface Props {
  files: FileType[];
  onEditFileList: (data: FileType[]) => void;
  onDeleteFile: (indexToDelete: number) => void;
  missingFilePaths: string[];
}

const DndFileList = ({ files, onEditFileList, onDeleteFile, missingFilePaths = [] }: Props) => {
  const { t } = useTranslation();
  const [editIndex, setEditIndex] = useState<number | undefined>();

  const onEditFile = useCallback(
    (newFile: FileType, index: number) => {
      const newFiles = files.map((file, i) => (index === i ? newFile : file));
      onEditFileList(newFiles);
    },
    [files, onEditFileList],
  );

  return (
    <DndList
      items={files.map((file, index) => ({ ...file, id: index + 1 }))}
      disabled={files.length < 2}
      onDragEnd={(_, newArray) => {
        setEditIndex(undefined);
        onEditFileList(newArray);
      }}
      dragHandle={
        <DragHandle aria-label={t("form.file.changeOrder")} title={t("form.file.changeOrder")}>
          <Draggable />
        </DragHandle>
      }
      renderItem={({ id: _, ...rest }, index) => (
        <SlateFile
          file={rest}
          index={index}
          onEditFile={onEditFile}
          missingFilePaths={missingFilePaths}
          onDeleteFile={onDeleteFile}
          editIndex={editIndex}
          setEditIndex={setEditIndex}
        />
      )}
    />
  );
};

export default DndFileList;
