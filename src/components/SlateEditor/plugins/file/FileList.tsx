/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
// eslint-disable-next-line lodash/import-scope
import { DebouncedFunc } from 'lodash';
import { Editor, Element, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { FieldHeader } from '@ndla/forms';
import { FileListEditor } from '@ndla/editor';
import { Cross, Plus } from '@ndla/icons/action';
import { spacing } from '@ndla/core';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from '@ndla/modal';
import { IconButtonV2 } from '@ndla/button';
import config from '../../../../config';
import { File, UnsavedFile } from '../../../../interfaces';
import { headFileAtRemote } from '../../../../modules/draft/draftApi';
import { FileElement } from '.';
import { TYPE_FILE } from './types';
import FileUploader from '../../../FileUploader';

const StyledSection = styled.section`
  margin-bottom: ${spacing.normal};
  label > span {
    font-size: 1rem;
  }
`;

const formatFile = (file: File, t: TFunction): File => ({
  ...file,
  formats: [
    { url: file.url, fileType: file.type, tooltip: `${t(`form.file.download`)} ${file.title}` },
  ],
});

interface Props {
  attributes: RenderElementProps['attributes'];
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

const FileList = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>(element.data);
  const debounceFunc = useRef<DebouncedFunc<() => void> | null>(null);
  const [missingFilePaths, setMissingFilePaths] = useState<string[]>([]);
  const [showFileUploader, setShowFileUploader] = useState(false);

  useEffect(() => {
    setFiles(element.data);
  }, [element.data]);

  useEffect(() => {
    getMissingFiles(files).then(setMissingFilePaths);
    // We only need to check this once, as adding further files guarantees them to "exist"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUpdateFileName = (index: number, value: string) => {
    debounceFunc.current?.cancel?.();
    const data = files.map((file, i) => (i === index ? { ...file, title: value } : file));
    setFiles(data);
    debounceFunc.current = debounce(
      () => Transforms.setNodes(editor, { data }, { at: ReactEditor.findPath(editor, element) }),
      500,
    );
    debounceFunc.current?.();
  };

  const removeFileList = () => {
    const path = ReactEditor.findPath(editor, element);
    ReactEditor.focus(editor);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_FILE,
    });
  };

  const onDeleteFile = (indexToDelete: number) => {
    if (files.length === 1) {
      removeFileList();
      return;
    }
    const data = files.filter((_, i) => i !== indexToDelete);
    setFiles(data);
    Transforms.setNodes(editor, { data }, { at: ReactEditor.findPath(editor, element) });
  };

  const onAddFileToList = (newFiles: UnsavedFile[]) => {
    setShowFileUploader(false);
    const data = files.concat(
      newFiles.map((file) => {
        return formatFile({ ...file, url: config.ndlaApiUrl + file.path, resource: 'file' }, t);
      }),
    );
    setFiles(data);
    Transforms.setNodes(editor, { data }, { at: ReactEditor.findPath(editor, element) });
  };

  const onMovedFile = (from: number, to: number) => {
    const fromElement = files[from];
    const toElement = files[to];
    const data = files.map((f, i) => (i === from ? toElement : i === to ? fromElement : f));
    setFiles(data);
    Transforms.setNodes(editor, { data }, { at: ReactEditor.findPath(editor, element) });
  };

  const onToggleRenderInline = (index: number) => {
    const data = files.map((f, i) =>
      i === index ? { ...f, display: f.display === 'block' ? 'inline' : 'block' } : f,
    );
    setFiles(data);
    Transforms.setNodes(editor, { data }, { at: ReactEditor.findPath(editor, element) });
  };

  if (files.length === 0) {
    return null;
  }
  return (
    <StyledSection {...attributes} contentEditable={false}>
      <FieldHeader title={t('form.file.label')}>
        <Modal open={showFileUploader} onOpenChange={setShowFileUploader}>
          <ModalTrigger>
            <IconButtonV2
              variant="ghost"
              title={t('form.file.addFile')}
              aria-label={t('form.file.addFile')}
            >
              <Plus />
            </IconButtonV2>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <FileUploader onFileSave={onAddFileToList} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <IconButtonV2
          variant="ghost"
          colorTheme="danger"
          title={t('form.file.removeList')}
          aria-label={t('form.file.removeList')}
          onClick={removeFileList}
        >
          <Cross />
        </IconButtonV2>
      </FieldHeader>
      <FileListEditor
        files={files}
        missingFilePaths={missingFilePaths}
        usePortal={true}
        onEditFileName={onUpdateFileName}
        onDeleteFile={onDeleteFile}
        onMovedFile={onMovedFile}
        onToggleRenderInline={onToggleRenderInline}
        showRenderInlineCheckbox={true}
        messages={{
          placeholder: t('form.file.placeholder'),
          changeName: t('form.file.changeName'),
          changeOrder: t('form.file.changeOrder'),
          removeFile: t('form.file.removeFile'),
          missingFileTooltip: t('form.file.missingFileTooltip'),
          missingTitle: t('form.file.missingTitle'),
          checkboxLabel: t('form.file.showPdf'),
          checkboxTooltip: t('form.file.showPdfTooltip'),
        }}
      />
      {children}
    </StyledSection>
  );
};

//@ts-ignore Temp fix. Replace this with a functional component
export default FileList;
