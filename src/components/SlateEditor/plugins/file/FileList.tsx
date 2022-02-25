/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component, ReactNode } from 'react';
import { Editor, Element, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';
import styled from '@emotion/styled';
import { withTranslation, TFunction } from 'react-i18next';
import { FieldHeader, FieldHeaderIconStyle } from '@ndla/forms';
import { FileListEditor } from '@ndla/editor';
import { Cross, Plus } from '@ndla/icons/action';
import Tooltip from '@ndla/tooltip';
import { spacing } from '@ndla/core';
import config from '../../../../config';
import { File, UnsavedFile } from '../../../../interfaces';
import { headFileAtRemote } from '../../../../modules/draft/draftApi';
import { arrMove } from '../../../../util/arrayHelpers';
import AddFileToList from './AddFileToList';
import { FileElement, TYPE_FILE } from '.';

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

const compareArray = (arr1: File[], arr2: File[]) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  const a1 = [...arr1];
  const a2 = [...arr2];
  return (
    a1.filter((item, key) => {
      if (!a2 || !a2[key]) {
        return false;
      }
      const a2Item = a2[key];
      return item.title === a2Item.title && item.path === a2Item.path;
    }).length === a1.length
  );
};

let okToRevert = false;
document.addEventListener('keydown', event => {
  okToRevert = (event.ctrlKey || event.metaKey) && event.key === 'z';
});

interface Props {
  attributes: RenderElementProps['attributes'];
  editor: Editor;
  element: FileElement;
  locale?: string;
  children: ReactNode;
  t: TFunction;
}

interface State {
  files: File[];
  missingFilePaths: string[];
  showFileUploader: boolean;
  currentDebounce?: DebouncedFunc<() => void>;
}

class FileList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.checkForRemoteFiles.bind(this);
    const { element, t } = this.props;
    const files = element.data.map(file => formatFile(file, t));
    this.state = { files, missingFilePaths: [], showFileUploader: false };
    this.checkForRemoteFiles(files);
  }

  checkForRemoteFiles = async (files: File[]) => {
    const missingFiles = files.map(async file => {
      const exists = await headFileAtRemote(file.url);
      return { ...file, exists: !!exists };
    });
    const resolvedFiles = await Promise.all(missingFiles);
    const missingFilePaths = resolvedFiles.filter(f => !f.exists).map(f => f.path);
    this.setState({ missingFilePaths });
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const files = props.element.data;
    if (props && state.files && !compareArray(files, state.files) && okToRevert) {
      okToRevert = false;
      return { files };
    }
    okToRevert = false;
    return null;
  }

  onUpdateFileName = (index: number, value: string) => {
    const { element } = this.props;

    const { currentDebounce } = this.state;
    if (currentDebounce) {
      currentDebounce.cancel();
    }
    // delay the save to editor until user have finished typing
    const debounced = debounce(() => this.updateFilesToEditor(), 500);
    debounced();
    const newNodes = element.data.map((file, i) =>
      i === index ? { ...file, title: value } : file,
    );
    this.setState({ currentDebounce: debounced, files: newNodes });
  };

  updateFilesToEditor() {
    const { editor, element } = this.props;
    Transforms.setNodes(
      editor,
      { data: this.state.files },
      { at: ReactEditor.findPath(editor, element) },
    );
  }

  removeFileList = () => {
    const { editor, element } = this.props;
    const path = ReactEditor.findPath(editor, element);
    ReactEditor.focus(editor);
    Transforms.removeNodes(editor, {
      at: path,
      match: node => Element.isElement(node) && node.type === TYPE_FILE,
    });
  };

  onDeleteFile = (indexToDelete: number) => {
    const files = this.state.files;
    if (files.length === 1) {
      this.removeFileList();
    } else {
      this.setState(prevState => {
        const newNodes = prevState.files.filter((_, i) => i !== indexToDelete);
        return { files: newNodes };
      }, this.updateFilesToEditor);
    }
  };

  onAddFileToList = (files: UnsavedFile[]) => {
    const { t } = this.props;
    this.setState({
      showFileUploader: false,
    });
    const newFiles = files.map(file => {
      return formatFile({ ...file, url: config.ndlaApiUrl + file.path, resource: 'file' }, t);
    });
    this.setState(
      prevState => ({
        files: prevState.files.concat(newFiles),
      }),
      this.updateFilesToEditor,
    );
  };

  onMovedFile = (fromIndex: number, toIndex: number) => {
    this.setState(
      prevState => ({ files: arrMove(prevState.files, fromIndex, toIndex) }),
      this.updateFilesToEditor,
    );
  };

  onToggleRenderInline = (index: number) => {
    this.setState(
      prevState => ({
        files: prevState.files.map((file, i) =>
          index === i ? { ...file, display: file.display === 'block' ? 'inline' : 'block' } : file,
        ),
      }),
      this.updateFilesToEditor,
    );
  };

  onOpenFileUploader = () => {
    this.setState({ showFileUploader: true });
  };

  onCloseFileUploader = () => {
    this.setState({ showFileUploader: false });
  };

  render() {
    const { t, attributes, children } = this.props;
    const { showFileUploader, files } = this.state;
    if (files.length === 0) {
      return null;
    }
    return (
      <>
        <StyledSection {...attributes} contentEditable={false}>
          <FieldHeader title={t('form.file.label')}>
            <Tooltip tooltip={t('form.file.addFile')}>
              <button tabIndex={-1} type="button" onClick={this.onOpenFileUploader}>
                <Plus css={FieldHeaderIconStyle} />
              </button>
            </Tooltip>
            <Tooltip tooltip={t('form.file.removeList')}>
              <button tabIndex={-1} type="button" onClick={this.removeFileList}>
                <Cross css={FieldHeaderIconStyle} />
              </button>
            </Tooltip>
          </FieldHeader>
          <FileListEditor
            files={files}
            missingFilePaths={this.state.missingFilePaths}
            usePortal={true}
            onEditFileName={this.onUpdateFileName}
            onDeleteFile={this.onDeleteFile}
            onMovedFile={this.onMovedFile}
            onToggleRenderInline={this.onToggleRenderInline}
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
          <AddFileToList
            onFileSave={this.onAddFileToList}
            onClose={this.onCloseFileUploader}
            showFileUploader={showFileUploader}
          />
          {children}
        </StyledSection>
      </>
    );
  }
}

export default withTranslation()(FileList);
