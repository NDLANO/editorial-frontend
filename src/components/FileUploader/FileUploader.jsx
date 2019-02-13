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
import { UploadDropZone, FormHeader, StyledButtonWrapper } from '@ndla/forms';
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
    const { saving, unsavedFiles } = this.state;
    this.setState(
      prevState => ({
        unsavedFiles: prevState.unsavedFiles.concat(files),
      }),
      () => {
        if (!saving) {
          this.onSave(unsavedFiles[0]);
          this.setState({
            saving: true,
          });
        }
      },
    );
  }

  uploadedFile(storedFile) {
    const { saving, unsavedFiles } = this.state;
    this.setState(
      prevState => {
        const { unsavedFiles, addedFiles } = prevState;
        unsavedFiles.shift();
        const saving = unsavedFiles.length > 0;
        // Remove .[filetype] from title.
        const cleanFile = storedFile;
        cleanFile.title = cleanFile.title.replace(/\..*/, '');

        return {
          unsavedFiles: unsavedFiles,
          addedFiles: [cleanFile, ...addedFiles],
          saving,
          changedData: true,
        };
      },
      () => {
        if (saving) {
          this.onSave(unsavedFiles[0]);
        }
      },
    );
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
    const { t, onClose, onFileSave } = this.props;
    const { addedFiles, changedData, errorMessage, saving } = this.state;

    if (errorMessage) {
      return <p>{errorMessage}</p>;
    }

    return (
      <div className={wrapperCSS}>
        <UploadDropZone
          name="file"
          allowedFiles={['application/*']}
          onAddedFiles={this.onAddFiles}
          multiple
          loading={saving}
          ariaLabel={t('form.file.dragdrop.ariaLabel')}>
          <strong>{t('form.file.dragdrop.main')}</strong>{' '}
          {t('form.file.dragdrop.sub')}
        </UploadDropZone>
        <FormHeader
          className={filesHeadingCSS}
          title={`${t('form.file.filesAdded')}:`}
        />
        {addedFiles.length > 0 ? (
          <FileListEditor
            files={addedFiles}
            onEditFileName={this.onUpdateFileName}
            onUpdateFiles={this.onUpdateFiles}
          />
        ) : (
          <span>{t('form.file.dragdrop.noFilesAdded')}</span>
        )}
        <StyledButtonWrapper>
          <Button
            disabled={!changedData}
            onClick={() => onFileSave(addedFiles)}>
            {t('form.file.saveChanges')}
          </Button>
          <Button onClick={onClose}>{t('form.file.cancel')}</Button>
        </StyledButtonWrapper>
      </div>
    );
  }
}

FileUploader.propTypes = {
  onFileSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  addedFiles: PropTypes.arrayOf(PropTypes.shape),
};

export default injectT(FileUploader);
