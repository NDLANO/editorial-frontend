/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
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
import { getSchemaEmbed } from '../../editorSchema';
import AddFileToList from './AddFileToList';
import config from '../../../../config';

const StyledSection = styled.section`
  margin-bottom: ${spacing.normal};
`;

const formatFile = ({ title, type, url, ...rest }, id, t) => ({
  id,
  title,
  type,
  url,
  ...rest,
  formats: [
    { url, fileType: type, tooltip: `${t(`form.file.download`)} ${title}` },
  ],
});

class Filelist extends React.Component {
  constructor(props) {
    super(props);
    const files = this.getFilesFromSlate();
    this.state = { showFileUploader: false, files, currentDebounce: false };

    this.onOpenFileUploader = this.onOpenFileUploader.bind(this);
    this.onCloseFileUploader = this.onCloseFileUploader.bind(this);
    this.onRemoveFileList = this.onRemoveFileList.bind(this);
    this.onAddFileToList = this.onAddFileToList.bind(this);
    this.onUpdateFileName = this.onUpdateFileName.bind(this);
    this.getFilesFromSlate = this.getFilesFromSlate.bind(this);
    this.onDeleteFile = this.onDeleteFile.bind(this);
    this.onMovedFile = this.onMovedFile.bind(this);
  }

  onUpdateFileName(index, value) {
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
  }

  updateFilesToEditor() {
    const { node, editor } = this.props;
    editor.setNodeByKey(node.key, {
      data: {
        nodes: this.state.files,
      },
    });
  }

  onRemoveFileList(evt) {
    evt.stopPropagation();
    const { node, editor } = this.props;
    editor.removeNodeByKey(node.key);
  }

  onDeleteFile(indexToDelete) {
    const { node, editor } = this.props;
    const files = this.state.files;
    if (files.length === 1) {
      this.setState({ files: [] });
      editor.removeNodeByKey(node.key);
    } else {
      const newNodes = node.data
        .get('nodes')
        .filter((_, i) => i !== indexToDelete);
      this.setState({ files: newNodes });
      this.updateFilesToEditor();
    }
  }

  onAddFileToList(files) {
    const { t, node } = this.props;
    this.setState({
      showFileUploader: false,
    });
    const existingFiles = node.data.get('nodes');
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
    const newNodes = existingFiles.concat(
      newFiles.map(file => ({
        path: file.path,
        type: file.type,
        title: file.title,
        resource: file.resource,
      })),
    );
    this.setState({ files: newNodes });
    this.updateFilesToEditor();
  }

  onMovedFile(fromIndex, toIndex) {
    const { node } = this.props;
    const files = node.data.get('nodes');
    const newNodes = files.map((file, i) => {
      if (i === fromIndex) {
        return files[toIndex];
      }
      if (i === toIndex) {
        return files[fromIndex];
      }
      return file;
    });

    this.setState({ files: newNodes });
    this.updateFilesToEditor();
  }

  onOpenFileUploader() {
    this.setState({ showFileUploader: true });
    this.updateFilesToEditor();
  }

  onCloseFileUploader() {
    const files = this.getFilesFromSlate();
    this.setState({ showFileUploader: false, files });
  }

  getFilesFromSlate() {
    const { node, t } = this.props;
    const { nodes } = getSchemaEmbed(node);
    return nodes.map((file, id) => formatFile(file, id, t));
  }

  render() {
    const { t } = this.props;
    const { showFileUploader, files } = this.state;
    if (files.length === 0) {
      return null;
    }

    return (
      <Fragment>
        <StyledSection>
          <FieldHeader title={t('form.file.label')}>
            <Tooltip tooltip={t('form.file.addFile')}>
              <button
                tabIndex={-1}
                type="button"
                onClick={this.onOpenFileUploader}>
                <Plus css={FieldHeaderIconStyle} />
              </button>
            </Tooltip>
            <Tooltip tooltip={t('form.file.removeList')}>
              <button
                tabIndex={-1}
                type="button"
                onClick={this.onRemoveFileList}>
                <Cross css={FieldHeaderIconStyle} />
              </button>
            </Tooltip>
          </FieldHeader>
          <FileListEditor
            files={this.state.files}
            usePortal={true}
            onEditFileName={this.onUpdateFileName}
            onDeleteFile={this.onDeleteFile}
            onMovedFile={this.onMovedFile}
            messages={{
              placeholder: t('form.file.placeholder'),
              changeName: t('form.file.changeName'),
              changeOrder: t('form.file.changeOrder'),
              removeFile: t('form.file.removeFile'),
            }}
          />
          <AddFileToList
            onFileSave={this.onAddFileToList}
            onClose={this.onCloseFileUploader}
            showFileUploader={showFileUploader}
          />
        </StyledSection>
      </Fragment>
    );
  }
}

Filelist.propTypes = {
  editor: EditorShape,
  node: Types.node.isRequired,
  locale: PropTypes.string,
};

export default injectT(Filelist);
