/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { isEmpty } from '../validators';
import { Field, FieldHelp } from '../Fields';

class FileUploader extends React.Component {
  constructor() {
    super();
    this.onChangeField = this.onChangeField.bind(this);
    this.onSave = this.onSave.bind(this);
    this.state = {
      file: undefined,
      title: '',
      alt: '',
      submitted: false,
    };
  }

  onChangeField(evt) {
    const { name, value } = evt.target;
    this.setState({ [name]: value, submitted: false });
  }

  onSave() {
    const { onFileSave } = this.props;
    const { file, title, alt } = this.state;
    if (isEmpty(alt) || isEmpty(title) || isEmpty(alt)) {
      this.setState({ submitted: true });
    } else {
      const splittedPathString = file.split('.');
      this.setState({ submitted: false }, () =>
        onFileSave({
          path: file,
          title,
          type: splittedPathString[splittedPathString.length - 1],
          alt,
        }),
      );
    }
  }

  render() {
    const { t, onClose } = this.props;

    const { file, title, alt, submitted } = this.state;
    return (
      <Fragment>
        <Field>
          <label htmlFor="file">{t('form.file.file.label')}</label>
          <input
            id="file"
            type="file"
            name="file"
            value={file}
            onChange={this.onChangeField}
          />
          {isEmpty(file) &&
            submitted && (
              <FieldHelp error>
                {t('validation.isRequired', {
                  label: t('form.file.file.label'),
                })}
              </FieldHelp>
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
        <Field>
          <label htmlFor="alt">{t('form.file.alt.label')}</label>
          <input
            name="alt"
            value={alt}
            onChange={this.onChangeField}
            placeholder={t('form.file.alt.placeholder')}
          />
          {isEmpty(alt) &&
            submitted && (
              <FieldHelp error>
                {t('validation.isRequired', {
                  label: t('form.file.alt.label'),
                })}
              </FieldHelp>
            )}
        </Field>
        <Field className="c-form__form-actions" right>
          <Button onClick={this.onSave}>Legg til fil</Button>
          <Button onClick={onClose}>Avbryt</Button>
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
