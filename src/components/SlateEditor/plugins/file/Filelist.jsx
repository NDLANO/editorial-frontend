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
    const { node, t } = props;
    const { nodes } = getSchemaEmbed(node);

    const files = nodes.map((file, id) => formatFile(file, id, t));

    this.state = { files, showFileUploader: false };

    this.onOpenFileUploader = this.onOpenFileUploader.bind(this);
    this.onCloseFileUploader = this.onCloseFileUploader.bind(this);
    this.onRemoveFileList = this.onRemoveFileList.bind(this);
    this.onAddFileToList = this.onAddFileToList.bind(this);
    this.onChangeFileData = this.onChangeFileData.bind(this);
    this.onUpdateFileName = this.onUpdateFileName.bind(this);
    this.onUpdateFiles = this.onUpdateFiles.bind(this);
  }

  onUpdateFileName(index, value) {
    this.setState(prevState => {
      const { files } = prevState;
      files[index].title = value;
      return {
        files,
        changedData: true,
      };
    });
  }

  onRemoveFileList(evt) {
    evt.stopPropagation();
    const { node, editor } = this.props;
    editor.removeNodeByKey(node.key);
  }

  onUpdateFiles(files) {
    this.setState(
      {
        files,
      },
      () => {
        if (files.length === 0) {
          const { node, editor } = this.props;
          editor.removeNodeByKey(node.key);
        } else {
          this.onChangeFileData();
        }
      },
    );
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

  render() {
    const { files, showFileUploader } = this.state;
    if (!files.length === 0) {
      return null;
    }

    const { t } = this.props;

    return (
      <Fragment>
        <AddFileToList
          onFileSave={this.onAddFileToList}
          onClose={this.onCloseFileUploader}
          showFileUploader={showFileUploader}
          addedFiles={files}
        />
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
            usePortal
            files={files}
            onEditFileName={this.onUpdateFileName}
            onUpdateFiles={this.onUpdateFiles}
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
