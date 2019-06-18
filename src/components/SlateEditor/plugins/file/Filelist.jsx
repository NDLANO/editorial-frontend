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
import { arrMove } from '../../../../util/arrayHelpers';

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

function getFilesFromProps(props) {
  const { node, t } = props;
  const { nodes } = getSchemaEmbed(node);
  return nodes.map((file, id) => formatFile(file, id, t));
}

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
    const files = this.getFilesFromSlate();
    this.state = { showFileUploader: false, files, currentDebounce: false };
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props &&
      state.files &&
      !compareArray(getFilesFromProps(props), state.files) &&
      okToRevert
    ) {
      okToRevert = false;
      return { files: getFilesFromProps(props) };
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

  setStateAndUpdate(obj) {
    this.setState(obj, this.updateFilesToEditor);
  }

  updateFilesToEditor() {
    const { node, editor } = this.props;
    editor.setNodeByKey(node.key, {
      data: {
        nodes: this.state.files,
      },
    });
  }

  onRemoveFileList = evt => {
    evt.stopPropagation();
    const { node, editor } = this.props;
    editor.removeNodeByKey(node.key);
  };

  onDeleteFile = indexToDelete => {
    const { node, editor } = this.props;
    const files = this.state.files;
    if (files.length === 1) {
      editor.removeNodeByKey(node.key);
      this.setStateAndUpdate({ files: [] });
    } else {
      const newNodes = node.data
        .get('nodes')
        .filter((_, i) => i !== indexToDelete);
      this.setStateAndUpdate({ files: newNodes });
    }
  };

  onAddFileToList = files => {
    const { t } = this.props;
    this.setState({
      showFileUploader: false,
    });
    const existingFiles = this.state.files;
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
    this.setStateAndUpdate({ files: newNodes });
  };

  onMovedFile = (fromIndex, toIndex) => {
    this.setState(
      { files: arrMove(this.state.files, fromIndex, toIndex) },
      this.updateFilesToEditor,
    );
  };

  onOpenFileUploader = () => {
    this.setState({ showFileUploader: true });
  };

  onCloseFileUploader = () => {
    this.setState({ showFileUploader: false });
  };

  getFilesFromSlate = () => {
    const { node, t } = this.props;
    const { nodes } = getSchemaEmbed(node);
    return nodes.map((file, id) => formatFile(file, id, t));
  };

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
