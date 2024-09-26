/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyboardEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, fonts, spacing } from "@ndla/core";
import { CheckboxItem, InputContainer, InputV3, Label } from "@ndla/forms";
import { Cross, Pencil } from "@ndla/icons/action";
import { Check, DeleteForever } from "@ndla/icons/editor";
import { IconButton } from "@ndla/primitives";
import { File as FileComponent, FileListItem } from "@ndla/ui";
import { File as FileType } from "../../../../interfaces";
import { FormControl } from "../../../FormField";

const StyledButtonWrapper = styled.div`
  white-space: nowrap;
  display: flex;
  gap: ${spacing.xxsmall};
  align-items: center;
`;

const CheckboxFormControl = styled(FormControl)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.xsmall};
  margin-right: ${spacing.normal};
  & label {
    font-size: ${fonts.size.text.button};
    font-weight: ${fonts.weight.semibold};
  }
`;

const StyledInputContainer = styled(InputContainer)`
  background-color: ${colors.white};
  width: 100%;
`;

const StyledFormControl = styled(FormControl)`
  width: 100%;
`;

const StyledFileListItem = styled(FileListItem)`
  width: 100%;
`;

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
          <StyledFormControl id={"update-file-name"}>
            <Label visuallyHidden>{t("form.file.changeName")}</Label>
            <StyledInputContainer>
              <InputV3
                name="file-name"
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
                <Check />
              </IconButton>
            </StyledInputContainer>
          </StyledFormControl>
        ) : (
          <FileComponent
            title={file.title}
            url={file.url}
            fileExists={!missingFilePaths.find((mp) => mp === file.path)}
            fileType={file.type}
          />
        )}

        <StyledButtonWrapper>
          {isEditMode ? (
            <IconButton
              title={t("cancel")}
              aria-label={t("form.file.changeName")}
              onClick={() => setEditIndex(undefined)}
              variant="danger"
              size="small"
            >
              <Cross />
            </IconButton>
          ) : (
            <>
              {file.type === "pdf" && (
                <CheckboxFormControl>
                  <CheckboxItem checked={file.display === "block"} onCheckedChange={onToggleRenderInline} />
                  <Label margin="none" textStyle="label-small">
                    {t("form.file.showPdf")}
                  </Label>
                </CheckboxFormControl>
              )}
              <IconButton
                title={t("form.file.changeName")}
                aria-label={t("form.file.changeName")}
                onClick={() => setEditIndex(index)}
                variant="tertiary"
                size="small"
              >
                <Pencil />
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
            <DeleteForever />
          </IconButton>
        </StyledButtonWrapper>
      </div>
    </StyledFileListItem>
  );
};
