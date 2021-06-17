/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { Transforms, Element } from 'slate';
import { ReactEditor } from 'slate-react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import { injectT } from '@ndla/i18n';
import { FieldHeader, FieldHeaderIconStyle } from '@ndla/forms';
import { uuid } from '@ndla/util';
import { FileListEditor } from '@ndla/editor';
import { Cross, Plus } from '@ndla/icons/action';
import { EditorShape } from '../../../../shapes';
import AddFileToList from './AddFileToList';
import config from '../../../../config';
import { arrMove } from '../../../../util/arrayHelpers';
import { headFileAtRemote } from '../../../../modules/draft/draftApi';
import { TYPE_FILE } from '.';

const StyledSection = styled.section`
  margin-bottom: ${spacing.normal};
  label > span {
    font-size: 1rem;
  }
`;

const formatFile = ({ title, type, url, ...rest }, id, t) => ({
  id,
  title,
  type,
  url,
  ...rest,
  formats: [{ url, fileType: type, tooltip: `${t(`form.file.download`)} ${title}` }],
});

function compareArray(arr1, arr2) {
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
}

let okToRevert = false;
document.addEventListener('keydown', event => {
  okToRevert = (event.ctrlKey || event.metaKey) && event.key === 'z';
});

class Filelist extends React.Component {
  constructor(props) {
    super(props);
    this.checkForRemoteFiles.bind(this);
    const files = this.props.element.data.map((file, id) => formatFile(file, id, this.props.t));
    this.state = { showFileUploader: false, files, currentDebounce: false };
    this.checkForRemoteFiles(files);
  }

  checkForRemoteFiles = async files => {
    const missingFiles = files.map(async file => {
      const exists = await headFileAtRemote(file.url);
      return { ...file, exists: !!exists };
    });
    const resolvedFiles = await Promise.all(missingFiles);
    const missingFilePaths = resolvedFiles.filter(f => !f.exists).map(f => f.path);
    this.setState({ missingFilePaths });
  };

  static getDerivedStateFromProps(props, state) {
    const files = props.element.data;
    if (props && state.files && !compareArray(files, state.files) && okToRevert) {
      okToRevert = false;
      return { files };
    }
    okToRevert = false;
    return null;
  }

  onUpdateFileName = (index, value) => {
    const { node } = this.props;

    const { currentDebounce } = this.state;
    if (currentDebounce) {
      currentDebounce.cancel();
    }
    // delay the save to editor until user have finished typing
    const debounced = debounce(() => this.updateFilesToEditor(), 500);
    debounced();
    const newNodes = node.data
      .get('nodes')
      .map((file, i) => (i === index ? { ...file, title: value } : file));
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

  onRemoveFileList = evt => {
    evt.stopPropagation();
    this.removeFileList();
  };

  onDeleteFile = indexToDelete => {
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

  onAddFileToList = files => {
    const { t } = this.props;
    this.setState({
      showFileUploader: false,
    });
    const newFiles = files.map(file => {
      if (file.format) {
        return file;
      }
      return formatFile(
        { ...file, url: config.ndlaApiUrl + file.path, resource: 'file' },
        uuid(),
        t,
      );
    });
    this.setState(
      prevState => ({
        files: prevState.files.concat(
          newFiles.map(file => ({
            path: file.path,
            type: file.type,
            title: file.title,
            resource: file.resource,
          })),
        ),
      }),
      this.updateFilesToEditor,
    );
  };

  onMovedFile = (fromIndex, toIndex) => {
    this.setState(
      prevState => ({ files: arrMove(prevState.files, fromIndex, toIndex) }),
      this.updateFilesToEditor,
    );
  };

  onToggleRenderInline = index => {
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
      <Fragment>
        <StyledSection {...attributes}>
          <FieldHeader title={t('form.file.label')}>
            <Tooltip tooltip={t('form.file.addFile')}>
              <button tabIndex={-1} type="button" onClick={this.onOpenFileUploader}>
                <Plus css={FieldHeaderIconStyle} />
              </button>
            </Tooltip>
            <Tooltip tooltip={t('form.file.removeList')}>
              <button tabIndex={-1} type="button" onClick={this.onRemoveFileList}>
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
      </Fragment>
    );
  }
}

Filelist.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  editor: EditorShape,
  node: PropTypes.any,
  element: PropTypes.any,
  locale: PropTypes.string,
};

export default injectT(Filelist);
