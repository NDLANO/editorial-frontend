/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { FileListEditor } from '@ndla/editor';
import { UploadDropZone, FormInput } from '@ndla/forms';
import { isEmpty } from '../validators';
import { Field, FieldHelp } from '../Fields';
import { FormActionButton } from '../../containers/Form';
import { uploadFile } from '../../modules/draft/draftApi';
import { createFormData } from '../../util/formDataHelper';
import handleError from '../../util/handleError';

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
    this.onUpdateOrder = this.onUpdateOrder.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
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

  onUpdateOrder(addedFiles) {
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
      <Fragment>
        <UploadDropZone
          allowedFiles={['application/*']}
          onAddedFiles={this.onAddFiles}
          multiple
          loading={saving}
        >
          <strong>Dra og slipp</strong> eller trykk for å laste opp file(r)
        </UploadDropZone>
        <h1>Added files:</h1>
        {addedFiles && <FileListEditor
          files={addedFiles}
          onEditFileName={this.onUpdateFileName}
          onUpdateOrder={this.onUpdateOrder}
        />}
        <Button disabled={!changedData} onClick={() => this.props.onFileSave(addedFiles)}>
          Lagre
        </Button>
        <Button onClick={onClose}>
          Cancel
        </Button>
      </Fragment>
    );
  }
}

FileUploader.propTypes = {
  onFileSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  addedFiles: PropTypes.any,
};

export default injectT(FileUploader);
