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
import styled from 'react-emotion';
import { spacing } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import { injectT } from '@ndla/i18n';
import { FormHeader, FormHeaderIconClass } from '@ndla/forms';
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
  ...rest,
  formats: [
    { url, fileType: type, tooltip: `${t(`form.file.download`)} ${title}` },
  ],
});

class Filelist extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showFileUploader: false };

    this.onOpenFileUploader = this.onOpenFileUploader.bind(this);
    this.onCloseFileUploader = this.onCloseFileUploader.bind(this);
    this.onRemoveFileList = this.onRemoveFileList.bind(this);
    this.onAddFileToList = this.onAddFileToList.bind(this);
    this.onChangeFileData = this.onChangeFileData.bind(this);
    this.onUpdateFileName = this.onUpdateFileName.bind(this);
    this.getFilesFromSlate = this.getFilesFromSlate.bind(this);
    this.onDeleteFile = this.onDeleteFile.bind(this);
    this.onMovedFile = this.onMovedFile.bind(this);
  }

  onUpdateFileName(index, value) {
    const { node, editor } = this.props;
    editor.setNodeByKey(node.key, {
      data: {
        nodes: node.data.get('nodes').map((file, i) => {
          if (i === index) return { ...file, title: value };
          return file;
        }),
      },
    });
  }

  onRemoveFileList(evt) {
    evt.stopPropagation();
    const { node, editor } = this.props;
    editor.removeNodeByKey(node.key);
  }

  onDeleteFile(index) {
    const { node, editor } = this.props;
    const files = this.getFilesFromSlate();
    if (files.length === 0) {
      editor.removeNodeByKey(node.key);
    } else {
      editor.setNodeByKey(node.key, {
        data: {
          nodes: node.data.get('nodes').filter((_, i) => i !== index),
        },
      });
    }
  }

  onAddFileToList(files) {
    const { t } = this.props;
    const updatedFileList = files.map(file => {
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
      {
        showFileUploader: false,
        files: updatedFileList,
      },
      this.onChangeFileData,
    );
  }

  onMovedFile(from, to) {
    const { editor, node } = this.props;
    const files = node.data.get('nodes');
    editor.setNodeByKey(node.key, {
      data: {
        nodes: files.map((file, i) => {
          if (i === from) return files[to];
          if (i === to) return files[from];
          return file;
        }),
      },
    });
  }

  onChangeFileData() {
    const { node, editor } = this.props;
    const nodes = this.state.files.map(file => ({
      path: file.path,
      type: file.type,
      title: file.title,
      resource: file.resource,
    }));
    editor.setNodeByKey(node.key, {
      data: {
        nodes,
      },
    });
  }

  onOpenFileUploader() {
    this.setState({ showFileUploader: true });
  }

  onCloseFileUploader() {
    this.setState({ showFileUploader: false });
  }

  getFilesFromSlate() {
    const { node, t } = this.props;
    const { nodes } = getSchemaEmbed(node);

    return nodes.map((file, id) => formatFile(file, id, t));
  }

  render() {
    const { t } = this.props;
    const { showFileUploader } = this.state;
    const files = this.getFilesFromSlate();
    if (!files.length === 0) {
      return null;
    }
    return (
      <Fragment>
        <StyledSection>
          <FormHeader title={t('form.file.label')}>
            <Tooltip tooltip={t('form.file.addFile')}>
              <button
                tabIndex={-1}
                type="button"
                onClick={this.onOpenFileUploader}>
                <Plus className={FormHeaderIconClass} />
              </button>
            </Tooltip>
            <Tooltip tooltip={t('form.file.removeList')}>
              <button
                tabIndex={-1}
                type="button"
                onClick={this.onRemoveFileList}>
                <Cross className={FormHeaderIconClass} />
              </button>
            </Tooltip>
          </FormHeader>
          <FileListEditor
            files={files}
            usePortal
            onEditFileName={this.onUpdateFileName}
            onDeleteFile={this.onDeleteFile}
            onMovedFile={this.onMovedFile}
          />
          <AddFileToList
            onFileSave={this.onAddFileToList}
            onClose={this.onCloseFileUploader}
            showFileUploader={showFileUploader}
            addedFiles={files}
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
