/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { uuid } from 'ndla-util';
import BEMHelper from 'react-bem-helper';
import MultiSelect from './MultiSelect';
import { isEmpty } from './validators';
import RichTextEditor from '../components/SlateEditor/RichTextEditor';
import PlainTextEditor from '../components/SlateEditor/PlainTextEditor';
import RichBlockTextEditor from '../components/SlateEditor/RichBlockTextEditor';

export const classes = new BEMHelper({
  name: 'field',
  prefix: 'c-',
});

export const Field = ({
  children,
  noBorder,
  bigText,
  title,
  className,
  right,
}) =>
  <div
    {...classes(
      '',
      { 'no-border': noBorder, right, bigText, title },
      className,
    )}>
    {children}
  </div>;

Field.propTypes = {
  noBorder: PropTypes.bool,
  bigText: PropTypes.bool,
  right: PropTypes.bool,
  title: PropTypes.bool,
};

Field.defaultProps = {
  noBorder: false,
};

export const FieldHelp = ({ children, error, right }) =>
  <span {...classes('help', { error, right })}>
    {children}
  </span>;

FieldHelp.propTypes = {
  error: PropTypes.bool,
  right: PropTypes.bool,
};

const hasError = field => field && !field.isValid;
const showError = (field, submitted) =>
  hasError(field) && (field.isDirty || submitted);

export const FieldErrorMessages = ({ field, submitted, label }) => {
  if (!showError(field, submitted)) {
    return null;
  }
  return (
    <div>
      {field.errors.map(error =>
        <FieldHelp key={uuid()} error>
          {error(label)}
        </FieldHelp>,
      )}
    </div>
  );
};

FieldErrorMessages.propTypes = {
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
      <span className="c-field__focus-text">
        {children}
      </span>
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

export const RemainingCharacters = ({ value, maxLength, getRemainingLabel }) =>
  <FieldHelp right>
    {getRemainingLabel(maxLength, maxLength - value.length)}
  </FieldHelp>;

RemainingCharacters.propTypes = {
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  getRemainingLabel: PropTypes.func.isRequired,
};

export const InputFileField = ({
  bigText,
  bindInput,
  name,
  label,
  submitted,
  schema,
  noBorder,
  title,
  ...rest
}) =>
  <Field noBorder={noBorder} bigText={bigText} title={title}>
    <input name={name} type="file" {...bindInput(name, true)} {...rest} />
    <FieldErrorMessages
      label={label}
      field={schema.fields[name]}
      submitted={submitted}
    />
  </Field>;

InputFileField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  noBorder: PropTypes.bool,
  title: PropTypes.bool,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  bigText: PropTypes.bool,
};

InputFileField.defaultProps = {
  bigText: false,
  noBorder: true,
};

export const TextField = ({
  bindInput,
  name,
  label,
  submitted,
  schema,
  noBorder,
  bigText,
  title,
  ...rest
}) =>
  <Field noBorder={noBorder} bigText={bigText} title={title}>
    {!noBorder
      ? <label htmlFor={name}>
          {label}
        </label>
      : <label className="u-hidden" htmlFor={name}>
          {label}
        </label>}
    {noBorder &&
      <FocusLabel name={name} value={bindInput(name).value}>
        {label}
      </FocusLabel>}

    <input
      id={name}
      type="text"
      className="form-control"
      {...bindInput(name)}
      {...rest}
    />
    <FieldErrorMessages
      label={label}
      field={schema.fields[name]}
      submitted={submitted}
    />
  </Field>;

TextField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
  bigText: PropTypes.bool,
  title: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
};

TextField.defaultProps = {
  bigText: false,
  noBorder: false,
};

export const FieldDescription = ({ obligatory, children }) => {
  const fieldDescriptionClasses = classes(
    'description',
    obligatory ? 'obligatory' : '',
  );
  return (
    <span {...classes('description--block')}>
      <p {...fieldDescriptionClasses}>
        {children}
      </p>
    </span>
  );
};

FieldDescription.propTypes = {
  obligatory: PropTypes.bool,
};

export const TextAreaField = ({
  bindInput,
  name,
  description,
  obligatory,
  noBorder,
  label,
  submitted,
  schema,
  maxLength,
  children,
  getMaxLengthRemaingLabel,
  ...rest
}) =>
  <Field noBorder={noBorder}>
    <label htmlFor={name}>
      {label}
    </label>
    {description &&
      <FieldDescription obligatory={obligatory}>
        {description}
      </FieldDescription>}
    <textarea
      id={name}
      className="form-control"
      maxLength={maxLength}
      {...bindInput(name)}
      {...rest}
    />
    <FieldErrorMessages
      label={label}
      field={schema.fields[name]}
      submitted={submitted}
    />
    {children}
  </Field>;

TextAreaField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  obligatory: PropTypes.bool,
  noBorder: PropTypes.bool,
  description: PropTypes.string,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  maxLength: PropTypes.number,
  getMaxLengthRemaingLabel: PropTypes.func,
};

export const PlainTextField = ({
  bindInput,
  name,
  label,
  obligatory,
  description,
  noBorder,
  bigText,
  submitted,
  schema,
  children,
  ...rest
}) => {
  const { value, onChange } = bindInput(name);
  return (
    <Field noBorder={noBorder}>
      {!noBorder
        ? <label htmlFor={name}>
            {label}
          </label>
        : <label className="u-hidden" htmlFor={name}>
            {label}
          </label>}
      {noBorder &&
        <FocusLabel
          name={name}
          hasFocus={() => value.selection.isFocused}
          value={value}>
          {label}
        </FocusLabel>}
      <div
        {...classes('plain-text-editor', [
          noBorder ? 'no-border' : '',
          bigText ? 'bigText' : '',
        ])}>
        {description &&
          <FieldDescription obligatory={obligatory}>
            {description}
          </FieldDescription>}
        <PlainTextEditor
          id={name}
          onChange={val =>
            onChange({
              target: { name, value: val, type: 'SlateEditorState' },
            })}
          value={value}
          {...rest}
        />
      </div>
      <FieldErrorMessages
        label={label}
        field={schema.fields[name]}
        submitted={submitted}
      />
      {children}
    </Field>
  );
};

PlainTextField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  obligatory: PropTypes.bool,
  description: PropTypes.string,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
  bigText: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
};

export const MultiSelectField = ({
  bindInput,
  name,
  obligatory,
  description,
  label,
  submitted,
  schema,
  ...rest
}) =>
  <Field>
    <label htmlFor={name}>
      {label}
    </label>
    {description &&
      <FieldDescription obligatory={obligatory}>
        {description}
      </FieldDescription>}
    <MultiSelect {...bindInput(name)} {...rest} />
    <FieldErrorMessages
      label={label}
      field={schema.fields[name]}
      submitted={submitted}
    />
  </Field>;

MultiSelectField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  obligatory: PropTypes.bool,
  description: PropTypes.string,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  data: PropTypes.arrayOf(PropTypes.string),
  submitted: PropTypes.bool.isRequired,
};

export const RichBlockTextField = ({
  bindInput,
  name,
  label,
  noBorder,
  submitted,
  schema,
  ...rest
}) => {
  const { value, onChange } = bindInput(name);
  return (
    <Field noBorder={noBorder}>
      {!noBorder
        ? <label htmlFor={name}>
            {label}
          </label>
        : <label className="u-hidden" htmlFor={name}>
            {label}
          </label>}
      {noBorder &&
        value.map((val, i) =>
          <FocusLabel
            key={uuid()}
            name={name}
            hasFocus={() => val.state.isFocused}
            value={val.state}>
            {`${label} Blokk ${i + 1}`}
          </FocusLabel>,
        )}
      <RichBlockTextEditor
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <FieldErrorMessages
        label={label}
        field={schema.fields[name]}
        submitted={submitted}
      />
    </Field>
  );
};

RichBlockTextField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
};

export const RichTextField = ({
  bindInput,
  name,
  label,
  noBorder,
  submitted,
  schema,
  ...rest
}) => {
  const { value, onChange } = bindInput(name);
  return (
    <Field noBorder={noBorder}>
      {!noBorder
        ? <label htmlFor={name}>
            {label}
          </label>
        : <label className="u-hidden" htmlFor={name}>
            {label}
          </label>}
      {noBorder &&
        <FocusLabel
          key={uuid()}
          name={name}
          hasFocus={() => value.isFocused}
          value={value}>
          {label}
        </FocusLabel>}
      <RichTextEditor
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <FieldErrorMessages
        label={label}
        field={schema.fields[name]}
        submitted={submitted}
      />
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

export const SelectObjectField = props => {
  const {
    bindInput,
    name,
    idKey,
    labelKey,
    obligatory,
    description,
    label,
    submitted,
    schema,
    options,
    ...rest
  } = props;

  return (
    <Field>
      <label htmlFor={name}>
        {label}
      </label>
      {description &&
        <FieldDescription obligatory={obligatory}>
          {description}
        </FieldDescription>}
      <select {...bindInput(name)} {...rest}>
        {options.map(option =>
          <option
            key={option[idKey] ? option[idKey] : uuid()}
            value={option[idKey]}>
            {option[labelKey]}
          </option>,
        )}
      </select>
      <FieldErrorMessages
        label={label}
        field={schema.fields[name]}
        submitted={submitted}
      />
    </Field>
  );
};

SelectObjectField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  obligatory: PropTypes.bool,
  description: PropTypes.string,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.string),
  submitted: PropTypes.bool.isRequired,
  idKey: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
};
