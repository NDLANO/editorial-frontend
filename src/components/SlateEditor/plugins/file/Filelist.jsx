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
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import styled from 'react-emotion';
import { EditorShape } from '../../../../shapes';
import { getSchemaEmbed } from '../../editorSchema';
import SingleFile from './SingleFile';
import AddFileToList from './AddFileToList';
import config from '../../../../config';

const fileListClasses = BEMHelper('c-file-list');

const StyledButtonDiv = styled('div')`
  display: flex;
  justify-content: space-between;
  & > * {
    width: 48%;
  }
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

  onAddFileToList(file) {
    const { t } = this.props;
    this.setState(
      prevState => ({
        showFileUploader: false,
        files: prevState.files.concat([
          formatFile(
            { ...file, url: config.ndlaApiUrl + file.path, resource: 'file' },
            prevState.files.length,
            t,
          ),
        ]),
      }),
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
        />
        <section {...fileListClasses()}>
          <h1 {...fileListClasses('heading')}>{t('form.file.label')}</h1>
          <StyledButtonDiv>
            <Button onClick={this.onOpenFileUploader}>
              {t('form.file.addFile')}
            </Button>
            <Button onClick={this.onRemoveFileList}>
              {t('form.file.removeList')}
            </Button>
          </StyledButtonDiv>
          <ul {...fileListClasses('files')}>
            {files.map(file => (
              <SingleFile
                key={`file-${file.id}-${file.formats[0].url}`}
                file={file}
                onFileInputChange={this.onFileInputChange}
                onRemoveFile={this.onRemoveFile}
              />
            ))}
          </ul>
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
