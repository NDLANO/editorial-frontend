/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// eslint-disable-next-line lodash/import-scope
import { DebouncedFunc } from 'lodash';
import debounce from 'lodash/debounce';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { CheckboxItem } from '@ndla/forms';
import { Pencil } from '@ndla/icons/action';
import { DeleteForever, DragVertical } from '@ndla/icons/editor';
import { SlateFile } from '@ndla/ui';
import EditFile from './EditFile';
import { File as FileType } from '../../../../interfaces';
import DndList from '../../../DndList';
import { DragHandle } from '../../../DraggableItem';

const FileContentWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  &[data-edit-mode='true'] {
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
`;

const StyledButtonWrapper = styled.div`
  white-space: nowrap;
`;

interface Props {
  files: FileType[];
  setFiles: (v: FileType[]) => void;
  onEditFileList: (data: FileType[]) => void;
  onDeleteFile: (indexToDelete: number) => void;
  missingFilePaths: string[];
}

const DndFileList = ({
  files,
  setFiles,
  onEditFileList,
  onDeleteFile,
  missingFilePaths = [],
}: Props) => {
  const [editFileIndex, setEditFileIndex] = useState<number | undefined>();

  const debounceFunc = useRef<DebouncedFunc<() => void> | null>(null);
  const { t } = useTranslation();

  const onToggleRenderInline = (index: number | undefined) => {
    if (index === undefined) return;
    const data = files.map((f, i) =>
      i === index ? { ...f, display: f.display === 'block' ? 'inline' : 'block' } : f,
    );
    setFiles(data);
    onEditFileList(data);
  };

  const onMovedFile = (data: FileType[]) => {
    setFiles(data);
    onEditFileList(data);
  };

  const onEditFileName = (index: number, value: string) => {
    debounceFunc.current?.cancel?.();
    const data = files.map((file, i) => (i === index ? { ...file, title: value } : file));
    setFiles(data);
    debounceFunc.current = debounce(() => onEditFileList(data), 500);
    debounceFunc.current?.();
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
        renderItem={(file, index) => (
          <SlateFile
            title={file.title}
            url={file.url}
            fileExists={!missingFilePaths.find((mp) => mp === file.path)}
            fileType={file.type}
            hiddenTitle={editFileIndex === index}
            key={index + 1}
          >
            <FileContentWrapper data-edit-mode={editFileIndex === index}>
              <EditFile
                onEditFileName={onEditFileName}
                index={index}
                title={file.title}
                editIndex={editFileIndex}
                setEditFileIndex={setEditFileIndex}
              />
              <StyledButtonWrapper>
                {file.type === 'pdf' && (
                  <CheckboxItem
                    label={t('form.file.showPdf')}
                    checked={file.display === 'block'}
                    id={index}
                    onChange={onToggleRenderInline}
                  />
                )}
                <IconButtonV2
                  title={t('form.file.changeName')}
                  aria-label={t('form.file.changeName')}
                  onClick={() => setEditFileIndex(index)}
                  variant="ghost"
                  size="xsmall"
                >
                  <Pencil aria-hidden="true" />
                </IconButtonV2>
                <IconButtonV2
                  title={t('form.file.removeFile')}
                  aria-label={t('form.file.removeFile')}
                  onClick={() => onDeleteFile(index)}
                  colorTheme="danger"
                  variant="ghost"
                  size="xsmall"
                >
                  <DeleteForever aria-hidden="true" />
                </IconButtonV2>
              </StyledButtonWrapper>
            </FileContentWrapper>
          </SlateFile>
        )}
      />
    </>
  );
};

export default DndFileList;
