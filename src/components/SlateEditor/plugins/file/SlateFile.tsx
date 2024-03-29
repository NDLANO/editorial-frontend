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
import { IconButtonV2 } from "@ndla/button";
import { breakpoints, colors, fonts, mq, spacing } from "@ndla/core";
import { CheckboxItem, InputContainer, InputV3, Label } from "@ndla/forms";
import { Cross, Pencil } from "@ndla/icons/action";
import { Check, DeleteForever } from "@ndla/icons/editor";
import { Format } from "@ndla/ui";
import { File as FileType } from "../../../../interfaces";
import { FormControl } from "../../../FormField";

const FormatWrapper = styled.div`
  width: 100%;
  min-height: ${spacing.large};
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-width: 80px;
`;

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

const File = styled.div`
  background: ${colors.brand.greyLighter};
  display: flex;
  gap: ${spacing.xsmall};
  width: 100%;
  margin-bottom: ${spacing.xsmall};
  padding: ${spacing.xsmall};
  ${mq.range({ from: breakpoints.tablet })} {
    padding: ${spacing.xsmall} ${spacing.normal};
  }
`;

const StyledFormControl = styled(FormControl)`
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
    <File>
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
            <IconButtonV2
              variant="ghost"
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={onCommitFileName}
              size="xsmall"
              aria-label={t("save")}
              title={t("save")}
            >
              <Check />
            </IconButtonV2>
          </StyledInputContainer>
        </StyledFormControl>
      ) : (
        <FormatWrapper>
          <Format
            format={{
              url: file.url,
              fileType: file.type,
              tooltip: `${t("download")} ${file.url.split("/").pop()}`,
            }}
            isPrimary
            title={file.title}
            isDeadLink={!!missingFilePaths.find((mp) => mp === file.path)}
          />
        </FormatWrapper>
      )}

      <StyledButtonWrapper>
        {isEditMode ? (
          <IconButtonV2
            title={t("cancel")}
            aria-label={t("form.file.changeName")}
            onClick={() => setEditIndex(undefined)}
            variant="ghost"
            colorTheme="danger"
            size="xsmall"
          >
            <Cross />
          </IconButtonV2>
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
            <IconButtonV2
              title={t("form.file.changeName")}
              aria-label={t("form.file.changeName")}
              onClick={() => setEditIndex(index)}
              variant="ghost"
              size="xsmall"
            >
              <Pencil />
            </IconButtonV2>
          </>
        )}
        <IconButtonV2
          title={t("form.file.removeFile")}
          aria-label={t("form.file.removeFile")}
          onClick={() => onDeleteFile(index)}
          colorTheme="danger"
          variant="ghost"
          size="xsmall"
        >
          <DeleteForever />
        </IconButtonV2>
      </StyledButtonWrapper>
    </File>
  );
};
