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
import { isEmpty } from '../validators';
import { Field, FieldHelp } from '../Fields';
import { FormActionButton } from '../../containers/Form';
import { uploadFile } from '../../modules/draft/draftApi';
import { createFormData } from '../../util/formDataHelper';
import handleError from '../../util/handleError';

class FileUploader extends React.Component {
  constructor() {
    super();
    this.onChangeField = this.onChangeField.bind(this);
    this.onSave = this.onSave.bind(this);
    this.state = {
      file: '',
      title: '',
      submitted: false,
      errorMessage: '',
    };
  }

  onChangeField(evt) {
    const { name, value, type } = evt.target;
    if (type === 'file') {
      const file = evt.target.files[0];
      this.setState({ [name]: file, submitted: false, errorMessage: '' });
    } else {
      this.setState({ [name]: value, submitted: false });
    }
  }

  async onSave() {
    const { onFileSave } = this.props;
    const { file, title } = this.state;
    if (isEmpty(title) || isEmpty(file)) {
      this.setState({ submitted: true });
    } else {
      try {
        const formData = await createFormData(file);
        const fileResult = await uploadFile(formData);
        this.setState({ submitted: false });
        onFileSave({
          path: fileResult.path,
          title,
          type: fileResult.extension.substring(1),
        });
      } catch (err) {
        if (err && err.json.messages) {
          this.setState({
            submitted: false,
            errorMessage: err.json.messages
              .map(message => message.message)
              .join(', '),
          });
        }
        handleError(err);
      }
    }
  }

  render() {
    const { t, onClose } = this.props;
    const { file, title, submitted, errorMessage } = this.state;
    return (
      <Fragment>
        <Field>
          <label htmlFor="file">{t('form.file.file.label')}</label>
          <input type="file" name="file" onChange={this.onChangeField} />
          {isEmpty(file) &&
            submitted && (
              <FieldHelp error>
                {t('validation.isRequired', {
                  label: t('form.file.file.label'),
                })}
              </FieldHelp>
            )}
          {errorMessage.length > 0 && (
            <FieldHelp error>{errorMessage}</FieldHelp>
          )}
        </Field>
        <Field>
          <label htmlFor="title">{t('form.file.title.label')}</label>
          <input
            name="title"
            value={title}
            onChange={this.onChangeField}
            placeholder={t('form.file.title.placeholder')}
          />
          {isEmpty(title) &&
            submitted && (
              <FieldHelp error>
                {t('validation.isRequired', {
                  label: t('form.file.title.label'),
                })}
              </FieldHelp>
            )}
        </Field>
        <Field right>
          <FormActionButton onClick={this.onSave}>
            {t('form.file.addFile')}
          </FormActionButton>
          <FormActionButton outline onClick={onClose}>
            {t('form.abort')}
          </FormActionButton>
        </Field>
      </Fragment>
    );
  }
}

FileUploader.propTypes = {
  onFileSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default injectT(FileUploader);
