/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { injectT } from '@ndla/i18n';
import { spacing } from '@ndla/core';
import { UploadDropZone } from '@ndla/forms';
import { uploadFile } from '../../modules/draft/draftApi';
import { createFormData } from '../../util/formDataHelper';
import handleError from '../../util/handleError';

const wrapperCSS = css`
  padding: 0 ${spacing.large};
`;

class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
    };
    this.onSave = this.onSave.bind(this);
    this.saveFile = this.saveFile.bind(this);
  }

  async saveFile(file) {
    const formData = await createFormData(file);
    return uploadFile(formData);
  }

  async onSave(files) {
    try {
      this.setState({ saving: true });
      const newFiles = await Promise.all(
        files.map(file => this.saveFile(file)),
      );
      this.props.onFileSave(
        newFiles.map((file, i) => ({
          path: file.path,
          type: file.extension.substring(1),
          title: files[i].name.replace(/\..*/, ''),
        })),
      );
      this.setState({ saving: false });
    } catch (err) {
      if (err && err.json && err.json.messages) {
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
    const { t } = this.props;
    const { errorMessage, saving } = this.state;

    if (errorMessage) {
      return <p>{errorMessage}</p>;
    }

    return (
      <div css={wrapperCSS}>
        <UploadDropZone
          name="file"
          allowedFiles={[
            '.csv',
            '.doc',
            '.docx',
            '.dwg',
            '.ggb',
            '.ipynb',
            '.json',
            '.odp',
            '.ods',
            '.odt',
            '.pdf',
            '.pln',
            '.pro',
            '.ppt',
            '.pptx',
            '.pub',
            '.rtf',
            '.skp',
            '.tex',
            '.tsv',
            '.txt',
            '.xls',
            '.xlsx',
            '.xml',
            'application/*',
          ]}
          onAddedFiles={this.onSave}
          multiple
          loading={saving}
          ariaLabel={t('form.file.dragdrop.ariaLabel')}>
          <strong>{t('form.file.dragdrop.main')}</strong>{' '}
          {t('form.file.dragdrop.sub')}
        </UploadDropZone>
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
