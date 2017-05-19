/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { RichTextEditor, PlainTextEditor } from 'ndla-editor';
import BEMHelper from 'react-bem-helper';
import MultiSelect from './MultiSelect';
import { isEmpty } from './validators';

const classes = new BEMHelper({
  name: 'field',
  prefix: 'c-',
});

export const Field = ({ children, noBorder, big, className }) => (
  <div {...classes('', { 'no-border': noBorder, big }, className)}>
    {children}
  </div>
);

Field.propTypes = {
  noBorder: PropTypes.bool,
  big: PropTypes.bool,
};

Field.defaultProps = {
  noBorder: false,
};

export const FieldMessage = ({ field, submitted, label }) =>
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


export const FocusLabel = ({ name, value, hasFocus, children }) => {
  if (!hasFocus(name) || isEmpty(value)) {
    return null;
  }
  return (
    <div className="c-field__focus-label">
      <span className="c-field__focus-text">{children}</span>
    </div>
  );
};

FocusLabel.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ _immutable: PropTypes.object }),
  ]).isRequired,
  hasFocus: PropTypes.func.isRequired,
};

FocusLabel.defaultProps = {
  hasFocus: name => document.activeElement.id === name,
};

export const TextField = ({ bindInput, name, label, submitted, schema, noBorder, big, ...rest }) => (
  <Field noBorder big>
    { !noBorder ? <label htmlFor={name}>{label}</label> : <label className="u-hidden" htmlFor={name}>{label}</label> }
    { noBorder && <FocusLabel name={name} value={bindInput(name).value}>{label}</FocusLabel> }

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
  </Field>
);

TextField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
  big: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
};

const ShowRemainingCharacters = ({ value, maxLength, getMaxLengthRemaingLabel }) => (<span>{getMaxLengthRemaingLabel(maxLength, maxLength - value.length)}</span>);

ShowRemainingCharacters.propTypes = {
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  getMaxLengthRemaingLabel: PropTypes.func.isRequired,
};


export const TextAreaField = ({ bindInput, name, label, submitted, schema, maxLength, getMaxLengthRemaingLabel, ...rest }) => (
  <Field>
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
  </Field>
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

export const RichTextField = ({ bindInput, name, label, noBorder, submitted, schema, ...rest }) => {
  const { value, onChange } = bindInput(name);
  return (
    <Field noBorder>
      { !noBorder ? <label htmlFor={name}>{label}</label> : <label className="u-hidden" htmlFor={name}>{label}</label> }
      { noBorder && <FocusLabel name={name} hasFocus={() => value.getSelection().hasFocus} value={value}>{label}</FocusLabel> }
      <RichTextEditor
        id={name}
        onChange={val => onChange({ target: { name, value: val, type: 'EditorState' } })}
        value={value}
        {...rest}
      />
      <div>
        <FieldMessage label={label} field={schema.fields[name]} submitted={submitted} />
      </div>
    </Field>
  );
};


RichTextField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
};

export const PlainTextField = ({ bindInput, name, label, noBorder, submitted, schema, ...rest }) => {
  const { value, onChange } = bindInput(name);
  return (
    <Field noBorder>
      { !noBorder ? <label htmlFor={name}>{label}</label> : <label className="u-hidden" htmlFor={name}>{label}</label> }
      { noBorder && <FocusLabel name={name} hasFocus={() => value.getSelection().hasFocus} value={value}>{label}</FocusLabel> }
      <div {...classes('plain-text-editor')}>
        <PlainTextEditor
          id={name}
          onChange={val => onChange({ target: { name, value: val, type: 'EditorState' } })}
          value={value}
          {...rest}
        />
      </div>
      <div>
        <FieldMessage label={label} field={schema.fields[name]} submitted={submitted} />
      </div>
    </Field>
  );
};


PlainTextField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
};

export const MultiSelectField = ({ bindInput, name, label, submitted, schema, ...rest }) => (
  <Field>
    <label htmlFor={name}>{label}</label>
    <MultiSelect
      {...bindInput(name)}
      {...rest}
    />
    <div>
      <FieldMessage label={label} field={schema.fields[name]} submitted={submitted} />
    </div>
  </Field>
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
