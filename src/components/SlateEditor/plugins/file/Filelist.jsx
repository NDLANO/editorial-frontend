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
import BEMHelper from 'react-bem-helper';
import Tooltip from '@ndla/tooltip';
import { injectT } from '@ndla/i18n';
import { FormHeader } from '@ndla/forms';
import { uuid } from '@ndla/util';
import { FileListEditor } from '@ndla/editor';
import styled from 'react-emotion';
import { Cross } from '@ndla/icons/action';
import { CloudUploadOutline } from '@ndla/icons/editor'; 
import { EditorShape } from '../../../../shapes';
import { getSchemaEmbed } from '../../editorSchema';
import SingleFile from './SingleFile';
import AddFileToList from './AddFileToList';
import config from '../../../../config';

// const fileListClasses = BEMHelper('c-file-list');

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
    this.onFileInputChange = this.onFileInputChange.bind(this);
    this.onRemoveFileList = this.onRemoveFileList.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
    this.onAddFileToList = this.onAddFileToList.bind(this);
    this.onChangeFileData = this.onChangeFileData.bind(this);
  }

  onFileInputChange(e) {
    const { id, value, name } = e.target;
    const { t, node, editor } = this.props;

    const { files } = this.state;
    files[id][name] = value;

    // Update correct tooltip value in state as well
    if (name === 'title') {
      files[id].formats = files[id].formats.map(format => ({
        ...format,
        tooltip: `${t(`form.file.download`)} ${value}`,
      }));
    }

    this.setState({ files });

    const { nodes } = getSchemaEmbed(node);
    const properties = {
      data: {
        nodes: nodes.map(nodeItem => ({
          ...nodeItem,
          // URL as unique identifier for file embed until proper key/id is added
          [name]: files.filter(file => file.formats[0].url === nodeItem.url)[0][
            name
          ],
        })),
      },
    };

    editor.setNodeByKey(node.key, properties);
  }

  onRemoveFileList(evt) {
    evt.stopPropagation();
    const { node, editor } = this.props;
    editor.removeNodeByKey(node.key);
  }

  onRemoveFile(evt, removedFile) {
    this.setState(
      prevState => ({
        files: prevState.files.filter(file => file.id !== removedFile.id),
      }),
      this.onChangeFileData,
    );
  }

  onAddFileToList(files) {
    const { t } = this.props;
    const updatedFileList = files.map((file) => {
      if (file.format) {
        return file;
      }
      return formatFile(
        { ...file, url: config.ndlaApiUrl + file.path, resource: 'file' },
        uuid(),
        t,
      );
    });
    
    this.setState({
      showFileUploader: false,
      files: updatedFileList,
    }, this.onChangeFileData);
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
        <section>
          <FormHeader title={t('form.file.label')}>
            <Tooltip tooltip={t('form.file.addFile')}>
              <button type="button" onClick={this.onOpenFileUploader}>
                <CloudUploadOutline />
              </button>
            </Tooltip>
            <Tooltip tooltip={t('form.file.removeList')}>
              <button tabIndex={-1} type="button" onClick={this.onRemoveFileList}>
                <Cross />
              </button>
            </Tooltip>
          </FormHeader>
          <FileListEditor
            files={files}
            onEditFileName={(index, value) => { console.log(index, value); }}
            onUpdateOrder={updatedFiles => {
              if (updatedFiles.length === 0) {
                this.onRemoveFileList();
              } else {

              }
            }}
          />
        </section>
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
