/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { css } from '@emotion/core';
import { injectT, tType } from '@ndla/i18n';
import { spacing } from '@ndla/core';
import { UploadDropZone } from '@ndla/forms';
import { uploadFile } from '../../modules/draft/draftApi';
import { createFormData } from '../../util/formDataHelper';
import handleError from '../../util/handleError';
import { File } from '../../interfaces';

const wrapperCSS = css`
  padding: 0 ${spacing.large};
`;

interface Props {
  onFileSave: (files: Partial<File>[]) => void;
}

const FileUploader = ({ onFileSave, t }: Props & tType) => {
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const saveFile = async (file: string | Blob | undefined) => {
    const formData = await createFormData(file);
    return uploadFile(formData);
  };

  const onSave = async (files: (Blob & { name: string })[]) => {
    try {
      setSaving(true);
      const newFiles = await Promise.all(files.map(file => saveFile(file)));
      onFileSave(
        newFiles.map((file, i) => ({
          path: file.path,
          type: file.extension.substring(1),
          title: files[i].name.replace(/\..*/, ''),
        })),
      );
    } catch (err) {
      if (err && err.json && err.json.messages) {
        setErrorMessage(
          err.json.messages.map((message: { message: string }) => message.message).join(', '),
        );
      }
      handleError(err);
    }
    setSaving(false);
  };

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div css={wrapperCSS}>
      <UploadDropZone
        name="file"
        allowedFiles={allowedFiles}
        onAddedFiles={onSave}
        multiple
        loading={saving}
        ariaLabel={t('form.file.dragdrop.ariaLabel')}>
        <strong>{t('form.file.dragdrop.main')}</strong> {t('form.file.dragdrop.sub')}
      </UploadDropZone>
    </div>
  );
};

const allowedFiles = [
  '.csv',
  '.doc',
  '.docx',
  '.dwg',
  '.dxf',
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
  '.stl',
  '.tex',
  '.tsv',
  '.txt',
  '.xls',
  '.xlsx',
  '.xml',
  '.f3d',
];

export default injectT(FileUploader);
