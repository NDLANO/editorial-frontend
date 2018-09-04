/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { injectT } from 'ndla-i18n';
import { isEmpty } from '../../../validators';
import { Field, FocusLabel, FieldHelp } from '../../../Fields';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const SlateInputLabel = ({ label, focus, value }) => {
  if (!focus || isEmpty(value)) {
    return null;
  }
  return (
    <div {...classes('figure-focus-input-label')}>
      <span {...classes('figure-focus-input-text')}>{label}</span>
    </div>
  );
};

SlateInputLabel.propTypes = {
  label: PropTypes.string.isRequired,
  focus: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

class SlateInputField extends React.Component {
  constructor() {
    super();
    this.onFigureInputClick = this.onFigureInputClick.bind(this);
    this.onFigureInputBlur = this.onFigureInputBlur.bind(this);
    this.state = {
      focus: false,
    };
  }

  onFigureInputClick(e) {
    e.stopPropagation();
    this.setState({ focus: true });
  }

  onFigureInputBlur() {
    this.setState({ focus: false });
  }

  render() {
    const {
      t,
      label,
      required,
      submitted,
      className,
      name,
      value,
      ...rest
    } = this.props;
    return (
      <Field noBorder className={className || 'c-field--no-margin-top'}>
        <label className="u-hidden" htmlFor={name}>
          {label}
        </label>
        <FocusLabel name={name} hasFocus={() => this.state.focus} value={value}>
          {label}
        </FocusLabel>
        <input
          id={name}
          name={name}
          value={value}
          className="c-editor__figure-input-field"
          onClick={this.onFigureInputClick}
          onBlur={this.onFigureInputBlur}
          {...rest}
        />
        {isEmpty(value) &&
          required &&
          submitted && (
            <FieldHelp error>{t('validation.isRequired', { label })}</FieldHelp>
          )}
      </Field>
    );
  }
}

SlateInputField.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
};

SlateInputField.defaultProps = {
  required: false,
};

export default injectT(SlateInputField);
