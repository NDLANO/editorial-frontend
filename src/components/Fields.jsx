/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { uuid } from 'ndla-util';
import { FormHeader, FormSections } from 'ndla-forms';
import BEMHelper from 'react-bem-helper';
import get from 'lodash/fp/get';
import MultiSelect from './MultiSelect';
import { isEmpty } from './validators';
import PlainTextEditor from './SlateEditor/PlainTextEditor';
import DateTimeInput from './DateTime/DateTimeInput';
import ObjectSelector from './ObjectSelector';
import { AsyncDropdown, TaxonomyDropdown } from './Dropdown';

export const classes = new BEMHelper({
  name: 'field',
  prefix: 'c-',
});

export const Field = ({ children, className, noBorder, title, right }) => (
  <div {...classes('', { 'no-border': noBorder, right, title }, className)}>
    {children}
  </div>
);

Field.propTypes = {
  noBorder: PropTypes.bool,
  right: PropTypes.bool,
  title: PropTypes.bool,
};

Field.defaultProps = {
  noBorder: false,
};

export const FieldHelp = ({ children, error, right }) => (
  <span {...classes('help', { error, right })}>{children}</span>
);

FieldHelp.propTypes = {
  error: PropTypes.bool,
  right: PropTypes.bool,
};

export const getField = (name, schema) => get(name, schema.fields);
const hasError = field => field && !field.valid;
const showError = (field, submitted) =>
  hasError(field) && (field.dirty || submitted);

export const FieldErrorMessages = ({ field, submitted, label }) => {
  if (!field || !showError(field, submitted)) {
    return null;
  }

  return (
    <div>
      {field.errors.map(error => (
        <FieldHelp key={uuid()} error>
          {error(label)}
        </FieldHelp>
      ))}
    </div>
  );
};

FieldErrorMessages.propTypes = {
  label: PropTypes.string,
  field: PropTypes.shape({
    dirty: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
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

export const RemainingCharacters = ({
  value,
  maxLength,
  getRemainingLabel,
}) => (
  <FieldHelp right>
    {getRemainingLabel(maxLength, maxLength - value.length)}
  </FieldHelp>
);

RemainingCharacters.propTypes = {
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  getRemainingLabel: PropTypes.func.isRequired,
};

export const InputFileField = ({
  bindInput,
  name,
  label,
  submitted,
  schema,
  noBorder,
  title,
  ...rest
}) => (
  <Field noBorder={noBorder} title={title}>
    <input
      id="file"
      name={name}
      type="file"
      {...bindInput(name, 'file')}
      {...rest}
    />
    <FieldErrorMessages
      label={label}
      field={getField(name, schema)}
      submitted={submitted}
    />
  </Field>
);

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
};

InputFileField.defaultProps = {
  noBorder: true,
};

export const TextField = ({
  bindInput,
  name,
  label,
  submitted,
  schema,
  noBorder,
  title,
  fieldClassName,
  ...rest
}) => {
  const binded = bindInput(name);
  return (
    <Field noBorder={noBorder} title={title} className={fieldClassName}>
      {!noBorder ? (
        <label htmlFor={name}>{label}</label>
      ) : (
        <label className="u-hidden" htmlFor={name}>
          {label}
        </label>
      )}
      {noBorder && (
        <FocusLabel
          name={name}
          hasFocus={() => getField(name, schema).active}
          value={bindInput(name).value}>
          {label}
        </FocusLabel>
      )}
      <input
        id={name}
        type="text"
        className="form-control"
        {...binded}
        value={binded.value || ''}
        {...rest}
      />

      <FieldErrorMessages
        label={label}
        field={getField(name, schema)}
        submitted={submitted}
      />
    </Field>
  );
};

TextField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  fieldClassName: PropTypes.string,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
  title: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
};

TextField.defaultProps = {
  noBorder: false,
  fieldClassName: '',
};

export const FieldDescription = ({ obligatory, children }) => {
  const fieldDescriptionClasses = classes(
    'description',
    obligatory ? 'obligatory' : '',
  );
  return (
    <span {...classes('description--block')}>
      <p {...fieldDescriptionClasses}>{children}</p>
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
}) => (
  <Field noBorder={noBorder}>
    <label htmlFor={name}>{label}</label>
    {description && (
      <FieldDescription obligatory={obligatory}>{description}</FieldDescription>
    )}
    <textarea
      id={name}
      className="form-control"
      maxLength={maxLength}
      {...bindInput(name)}
      {...rest}
    />
    <FieldErrorMessages
      label={label}
      field={getField(name, schema)}
      submitted={submitted}
    />
    {children}
  </Field>
);

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
  submitted,
  schema,
  children,
  fieldClassName,
  ...rest
}) => {
  const { value, onChange } = bindInput(name);
  return (
    <Field noBorder={noBorder} className={fieldClassName}>
      {!noBorder ? (
        <label htmlFor={name}>{label}</label>
      ) : (
        <label className="u-hidden" htmlFor={name}>
          {label}
        </label>
      )}
      {noBorder && (
        <FocusLabel
          name={name}
          hasFocus={() => value.selection.isFocused}
          value={value}>
          {label}
        </FocusLabel>
      )}
      {description && (
        <FieldDescription obligatory={obligatory}>
          {description}
        </FieldDescription>
      )}
      <PlainTextEditor
        id={name}
        onChange={val =>
          onChange({
            target: { name, value: val.value, type: 'SlateEditorValue' },
          })
        }
        value={value}
        {...rest}
      />
      <FieldErrorMessages
        label={label}
        field={getField(name, schema)}
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
  fieldClassName: PropTypes.string,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
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
}) => (
  <Field>
    <label htmlFor={name}>{label}</label>
    {description && (
      <FieldDescription obligatory={obligatory}>{description}</FieldDescription>
    )}
    <MultiSelect {...bindInput(name)} {...rest} />
    <FieldErrorMessages
      label={label}
      field={getField(name, schema)}
      submitted={submitted}
    />
  </Field>
);

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

export const SelectObjectField = props => {
  const {
    name,
    obligatory,
    description,
    label,
    submitted,
    schema,
    fieldClassName,
    bindInput,
    ...rest
  } = props;
  return (
    <Field className={fieldClassName}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      {description && (
        <FieldDescription obligatory={obligatory}>
          {description}
        </FieldDescription>
      )}
      <ObjectSelector name={name} {...bindInput(name)} {...rest} />
      {label ? (
        <FieldErrorMessages
          label={label}
          field={getField(name, schema)}
          submitted={submitted}
        />
      ) : null}
    </Field>
  );
};

SelectObjectField.defaultProps = {
  fieldClassName: '',
};

SelectObjectField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  obligatory: PropTypes.bool,
  description: PropTypes.string,
  fieldClassName: PropTypes.string,
  label: PropTypes.string,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.string),
  submitted: PropTypes.bool.isRequired,
  idKey: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
};

export const TaxonomyFieldDropdown = ({
  bindInput,
  name,
  obligatory,
  description,
  label,
  submitted,
  schema,
  ...rest
}) => {
  const { onChange, value } = bindInput(name);
  return (
    <Field>
      <label htmlFor={name}>{label}</label>
      {description && (
        <FieldDescription obligatory={obligatory}>
          {description}
        </FieldDescription>
      )}
      <TaxonomyDropdown
        name={name}
        id={name}
        selectedItems={value}
        onChange={val =>
          onChange({
            target: { name, value: val },
          })
        }
        {...rest}
      />
      <FieldErrorMessages
        label={label}
        field={getField(name, schema)}
        submitted={submitted}
      />
    </Field>
  );
};
TaxonomyFieldDropdown.propTypes = {
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

export const DateField = ({
  bindInput,
  name,
  label,
  submitted,
  schema,
  noBorder,
  ...rest
}) => {
  const { onChange, value } = bindInput(name);
  return (
    <Field noBorder={noBorder}>
      <DateTimeInput
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={val =>
          onChange({
            target: { name, value: val, type: 'DateTime' },
          })
        }
        {...classes('date-picker')}
        {...rest}
      />

      <FieldErrorMessages
        label={label}
        field={getField(name, schema)}
        submitted={submitted}
      />
    </Field>
  );
};

DateField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
};

DateField.defaultProps = {
  noBorder: false,
};

export const AsyncDropdownField = ({
  bindInput,
  name,
  label,
  submitted,
  schema,
  noBorder,
  width,
  ...rest
}) => {
  const { onChange } = bindInput(name);
  return (
    <Fragment>
      <FormHeader title={label} width={width} />
      <FormSections>
        <div>
          <AsyncDropdown
            onChange={val =>
              onChange({ target: { name, value: val ? val.id : undefined } })
            }
            {...rest}
          />
          <FieldErrorMessages
            label={label}
            field={getField(name, schema)}
            submitted={submitted}
          />
        </div>
      </FormSections>
    </Fragment>
  );
};

AsyncDropdownField.propTypes = {
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
  width: PropTypes.number,
};

AsyncDropdownField.defaultProps = {
  noBorder: false,
  width: 1,
};
