/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';
import { injectT } from '@ndla/i18n';
import { spacing } from '@ndla/core';
import Button from '@ndla/button';
import { FileListEditor } from '@ndla/editor';
import { UploadDropZone, FormHeader } from '@ndla/forms';
import { uploadFile } from '../../modules/draft/draftApi';
import { createFormData } from '../../util/formDataHelper';
import handleError from '../../util/handleError';

const wrapperCSS = css`
  padding: 0 ${spacing.large} ${spacing.large};
`;

const filesHeadingCSS = css`
  h1,
  h2 {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
`;

const buttonWrapperCSS = css`
  display: flex;
  margin-top: ${spacing.medium};

  > button {
    margin-right: ${spacing.small};
  }
`;

class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unsavedFiles: [],
      saving: false,
      addedFiles: props.addedFiles || [],
      changedData: false,
    };
    this.onSave = this.onSave.bind(this);
    this.onAddFiles = this.onAddFiles.bind(this);
    this.onUpdateFileName = this.onUpdateFileName.bind(this);
    this.onUpdateFiles = this.onUpdateFiles.bind(this);
  }

  onAddFiles(files) {
    this.setState(prevState => ({
      unsavedFiles: prevState.unsavedFiles.concat(files),
    }), () => {
      if (!this.state.saving) {
        this.onSave(this.state.unsavedFiles[0]);
        this.setState({
          saving: true,
        });
      }
    });
  }

  uploadedFile(storedFile) {
    this.setState(prevState => {
      const { unsavedFiles, addedFiles } = prevState;
      unsavedFiles.shift();
      const saving = unsavedFiles.length > 0;
      // Remove .[filetype] from title.
      const cleanFile = storedFile;
      cleanFile.title = cleanFile.title.replace(/\..*/,'');
      
      return {
        unsavedFiles: unsavedFiles,
        addedFiles: [cleanFile, ...addedFiles],
        saving,
        changedData: true,
      };
    }, () => {
      if (this.state.saving) {
        this.onSave(this.state.unsavedFiles[0]);
      }
    });
  }

  onUpdateFileName(index, value) {
    this.setState(prevState => {
      const { addedFiles } = prevState;
      addedFiles[index].title = value;
      return {
        addedFiles,
        changedData: true,
      };
    });
  }

  onUpdateFiles(addedFiles) {
    this.setState({
      addedFiles,
    });
  }

  async onSave(file) {
    // const { onFileSave } = this.props;
    try {
      const formData = await createFormData(file);
      const fileResult = await uploadFile(formData);
      this.uploadedFile({
        path: fileResult.path,
        title: file.name,
        type: fileResult.extension.substring(1),
      });
    } catch (err) {
      if (err && err.json.messages) {
        this.setState({
          errorMessage: err.json.messages
            .map(message => message.message)
            .join(', '),
        });
      }
      handleError(err);
    }
  }

  render() {
    const { t, onClose } = this.props;
    const { addedFiles, changedData, errorMessage, saving } = this.state;

    if (errorMessage) {
      return <p>{errorMessage}</p>
    }

    return (
      <div className={wrapperCSS}>
        <UploadDropZone
          allowedFiles={['application/*']}
          onAddedFiles={this.onAddFiles}
          multiple
          loading={saving}
          ariaLabel="Drag and drop files or click to upload"
        >
          <strong>Dra og slipp</strong> eller trykk for å laste opp file(r)
        </UploadDropZone>
        <FormHeader className={filesHeadingCSS} title="Added files:" />
        {addedFiles ? <FileListEditor
          files={addedFiles}
          onEditFileName={this.onUpdateFileName}
          onUpdateFiles={this.onUpdateFiles}
        /> : <span>No files added yet</span>}
        <div className={buttonWrapperCSS}>
          <Button disabled={!changedData} onClick={() => this.props.onFileSave(addedFiles)}>
            Lagre endringer
          </Button>
          <Button onClick={onClose}>
            Avbryt
          </Button>
        </div>
      </div>
    );
  }
}

FileUploader.propTypes = {
  onFileSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  addedFiles: PropTypes.any,
};

export default injectT(FileUploader);
