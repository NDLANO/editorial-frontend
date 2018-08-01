/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from './SlateEditor/RichTextEditor';
import { Field, FocusLabel, FieldErrorMessages, getField } from './Fields';
import { PluginShape } from '../shapes';

export const RichTextField = ({
  bindInput,
  name,
  label,
  noBorder,
  submitted,
  schema,
  slateSchema,
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
        <FocusLabel name={name} hasFocus={() => value.isFocused} value={value}>
          {label}
        </FocusLabel>
      )}
      <RichTextEditor
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        schema={slateSchema}
        submitted={submitted}
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

RichTextField.propTypes = {
  slateSchema: PropTypes.shape({}).isRequired,
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  fieldClassName: PropTypes.string,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
  plugins: PropTypes.arrayOf(PluginShape).isRequired,
};
