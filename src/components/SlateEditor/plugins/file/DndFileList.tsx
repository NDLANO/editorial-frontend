/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { breakpoints, colors, fonts, mq, spacing } from '@ndla/core';
import { CheckboxItem } from '@ndla/forms';
import { Pencil } from '@ndla/icons/action';
import { DeleteForever, DragVertical } from '@ndla/icons/editor';
import { Format } from '@ndla/ui';
import EditFile from './EditFile';
import { File as FileType } from '../../../../interfaces';
import DndList from '../../../DndList';
import { DragHandle } from '../../../DraggableItem';

const FileContentWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  min-height: ${spacing.large};
  &[data-edit-mode='true'] {
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${spacing.normal};
  & label {
    font-size: ${fonts.size.text.button};
    font-weight: ${fonts.weight.semibold};
  }
`;

const File = styled.div`
  background: ${colors.brand.greyLighter};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${spacing.xsmall};
  padding: ${spacing.xsmall};
  ${mq.range({ from: breakpoints.tablet })} {
    padding: ${spacing.xsmall} ${spacing.normal};
  }
`;

const StyledButtonWrapper = styled.div`
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

interface Props {
  files: FileType[];
  onEditFileList: (data: FileType[]) => void;
  onDeleteFile: (indexToDelete: number) => void;
  missingFilePaths: string[];
}

const DndFileList = ({ files, onEditFileList, onDeleteFile, missingFilePaths = [] }: Props) => {
  const [editFileIndex, setEditFileIndex] = useState<number | undefined>();

  const { t } = useTranslation();

  const onToggleRenderInline = (index: number | undefined) => {
    if (index === undefined) return;
    const data = files.map((f, i) =>
      i === index ? { ...f, display: f.display === 'block' ? 'inline' : 'block' } : f,
    );
    onEditFileList(data);
  };

  const onMovedFile = (data: FileType[]) => {
    onEditFileList(data);
  };

  return (
    <>
      <DndList
        items={files.map((file, index) => ({ ...file, id: index + 1 }))}
        disabled={files.length < 2}
        onDragEnd={(_, newArray) => onMovedFile(newArray)}
        dragHandle={
          <DragHandle aria-label={t('form.file.changeOrder')} title={t('form.file.changeOrder')}>
            <DragVertical />
          </DragHandle>
        }
        renderItem={(file, index) => {
          const isEditMode = editFileIndex === index;
          return (
            <File>
              {!isEditMode && (
                <Format
                  format={{
                    url: file.url,
                    fileType: file.type,
                    tooltip: `${t('download')} ${file.url.split('/').pop()}`,
                  }}
                  isPrimary
                  title={file.title}
                  isDeadLink={!!missingFilePaths.find((mp) => mp === file.path)}
                />
              )}
              <FileContentWrapper data-edit-mode={isEditMode}>
                {isEditMode && (
                  <EditFile
                    index={index}
                    title={file.title}
                    files={files}
                    onEditFileList={onEditFileList}
                    setEditFileIndex={setEditFileIndex}
                  />
                )}
                <StyledButtonWrapper>
                  {file.type === 'pdf' && (
                    <CheckboxWrapper>
                      <CheckboxItem
                        label={t('form.file.showPdf')}
                        checked={file.display === 'block'}
                        id={index}
                        onChange={onToggleRenderInline}
                      />
                    </CheckboxWrapper>
                  )}
                  <IconButtonV2
                    title={t('form.file.changeName')}
                    aria-label={t('form.file.changeName')}
                    onClick={() => setEditFileIndex(index)}
                    variant="ghost"
                    size="xsmall"
                  >
                    <Pencil />
                  </IconButtonV2>
                  <IconButtonV2
                    title={t('form.file.removeFile')}
                    aria-label={t('form.file.removeFile')}
                    onClick={() => onDeleteFile(index)}
                    colorTheme="danger"
                    variant="ghost"
                    size="xsmall"
                  >
                    <DeleteForever />
                  </IconButtonV2>
                </StyledButtonWrapper>
              </FileContentWrapper>
            </File>
          );
        }}
      />
    </>
  );
};

export default DndFileList;
