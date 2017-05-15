/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { RichTextEditor } from 'ndla-editor';
import MultiSelect from './MultiSelect';

const FieldMessage = ({ field, submitted, label }) =>
  (field && !field.isValid && (field.isDirty || submitted) ? <span>{field.errors[0](label)}</span> : null);

FieldMessage.propTypes = {
  label: PropTypes.string.isRequired,
  field: PropTypes.shape({
    isDirty: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    errors: PropTypes.arrayOf(PropTypes.func),
  }),
  submitted: PropTypes.bool.isRequired,
};

export const TextField = ({ bindInput, name, label, submitted, schema, ...rest }) => (
  <div style={{ marginTop: '3rem' }}>
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      type="text"
      className="form-control"
      {...bindInput(name)}
      {...rest}
    />
    <div>
      <FieldMessage label={label} field={schema.fields[name]} submitted={submitted} />
    </div>
  </div>
);

TextField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
};

const ShowRemainingCharacters = ({ value, maxLength, getMaxLengthRemaingLabel }) => (<span>{getMaxLengthRemaingLabel(maxLength, maxLength - value.length)}</span>);

ShowRemainingCharacters.propTypes = {
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  getMaxLengthRemaingLabel: PropTypes.func.isRequired,
};


export const TextAreaField = ({ bindInput, name, label, submitted, schema, maxLength, getMaxLengthRemaingLabel, ...rest }) => (
  <div style={{ marginTop: '3rem' }}>
    <label htmlFor={name}>{label}</label>
    <textarea
      id={name}
      className="form-control"
      maxLength={maxLength}
      {...bindInput(name)}
      {...rest}
    />
    <div>
      <FieldMessage label={label} field={schema.fields[name]} submitted={submitted} />
    </div>
    { getMaxLengthRemaingLabel ? <ShowRemainingCharacters maxLength={maxLength} getMaxLengthRemaingLabel={getMaxLengthRemaingLabel} value={bindInput(name).value} /> : null }
  </div>
);


TextAreaField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  maxLength: PropTypes.number,
  getMaxLengthRemaingLabel: PropTypes.func,
};

export const RichTextField = ({ bindInput, name, label, submitted, schema, ...rest }) => (
  <div style={{ marginTop: '3rem' }}>
    <label htmlFor={name}>{label}</label>
    <RichTextEditor
      {...bindInput(name)}
      onChange={value => bindInput(name).onChange({ target: { name, value, type: 'EditorState' } })}
      {...rest}
    />
    <div>
      <FieldMessage label={label} field={schema.fields[name]} submitted={submitted} />
    </div>
  </div>
);


RichTextField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
};

export const MultiSelectField = ({ bindInput, name, label, submitted, schema, ...rest }) => (
  <div style={{ marginTop: '3rem' }}>
    <label htmlFor={name}>{label}</label>
    <MultiSelect
      {...bindInput(name)}
      {...rest}
    />
    <div>
      <FieldMessage label={label} field={schema.fields[name]} submitted={submitted} />
    </div>
  </div>
);


MultiSelectField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  data: PropTypes.arrayOf(PropTypes.string),
  submitted: PropTypes.bool.isRequired,
};
