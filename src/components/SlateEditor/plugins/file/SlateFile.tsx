/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyboardEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloseLine, PencilFill, DeleteBinLine, CheckboxCircleFill, CheckLine } from "@ndla/icons";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  FieldInput,
  FieldLabel,
  FieldRoot,
  IconButton,
  InputContainer,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { File as FileComponent, FileListItem } from "@ndla/ui";
import { File as FileType } from "../../../../interfaces";

const ButtonWrapper = styled("div", {
  base: {
    whiteSpace: "nowrap",
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    width: "100%",
  },
});

const StyledCheckboxRoot = styled(CheckboxRoot, {
  base: {
    width: "fit-content",
  },
});

const StyledFileListItem = styled(FileListItem, {
  base: {
    width: "100%",
    gap: "xsmall",
  },
});

interface Props {
  index: number;
  file: FileType;
  onEditFile: (file: FileType, index: number) => void;
  missingFilePaths: string[];
  onDeleteFile: (index: number) => void;
  editIndex: number | undefined;
  setEditIndex: (v: number | undefined) => void;
}

export const SlateFile = ({
  file,
  onEditFile,
  onDeleteFile,
  index,
  missingFilePaths,
  editIndex,
  setEditIndex,
}: Props) => {
  const [fileName, setFileName] = useState(file.title);
  const { t } = useTranslation();

  const isEditMode = editIndex === index;

  useEffect(() => {
    // We need to update the filename in case the order changes while in edit mode
    if (isEditMode) setFileName(file.title);
  }, [file, isEditMode]);

  const onToggleRenderInline = () => {
    onEditFile({ ...file, display: file.display === "block" ? "inline" : "block" }, index);
  };

  const onCommitFileName = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onEditFile({ ...file, title: fileName }, index);
      setEditIndex(undefined);
    },
    [file, fileName, index, onEditFile, setEditIndex],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        onEditFile({ ...file, title: fileName }, index);
        setEditIndex(undefined);
      }
    },
    [file, fileName, index, onEditFile, setEditIndex],
  );

  return (
    <StyledFileListItem asChild consumeCss>
      <div>
        {isEditMode ? (
          <StyledFieldRoot>
            <FieldLabel srOnly>{t("form.file.changeName")}</FieldLabel>
            <InputContainer>
              <FieldInput
                value={fileName}
                onKeyDown={onKeyDown}
                onChange={(e) => setFileName(e.currentTarget.value)}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
              <IconButton
                variant="tertiary"
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={onCommitFileName}
                size="small"
                aria-label={t("save")}
                title={t("save")}
              >
                <CheckboxCircleFill />
              </IconButton>
            </InputContainer>
          </StyledFieldRoot>
        ) : (
          <FileComponent
            title={file.title}
            url={file.url}
            fileExists={!missingFilePaths.find((mp) => mp === file.path)}
            fileType={file.type}
          />
        )}

        <ButtonWrapper>
          {isEditMode ? (
            <IconButton
              title={t("cancel")}
              aria-label={t("form.file.changeName")}
              onClick={() => setEditIndex(undefined)}
              variant="secondary"
              size="small"
            >
              <CloseLine />
            </IconButton>
          ) : (
            <>
              {file.type === "pdf" && (
                <StyledCheckboxRoot checked={file.display === "block"} onCheckedChange={onToggleRenderInline}>
                  <CheckboxControl>
                    <CheckboxIndicator asChild>
                      <CheckLine />
                    </CheckboxIndicator>
                  </CheckboxControl>
                  <CheckboxLabel>{t("form.file.showPdf")}</CheckboxLabel>
                  <CheckboxHiddenInput />
                </StyledCheckboxRoot>
              )}
              <IconButton
                title={t("form.file.changeName")}
                aria-label={t("form.file.changeName")}
                onClick={() => setEditIndex(index)}
                variant="tertiary"
                size="small"
              >
                <PencilFill />
              </IconButton>
            </>
          )}
          <IconButton
            title={t("form.file.removeFile")}
            aria-label={t("form.file.removeFile")}
            onClick={() => onDeleteFile(index)}
            variant="danger"
            size="small"
          >
            <DeleteBinLine />
          </IconButton>
        </ButtonWrapper>
      </div>
    </StyledFileListItem>
  );
};
