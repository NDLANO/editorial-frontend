/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import RichBlockTextEditor from './SlateEditor/RichBlockTextEditor';
import { Field, FieldErrorMessages, getField, classes } from './Fields';
import { PluginShape } from '../shapes';

export const RichBlockTextField = ({
  bindInput,
  name,
  label,
  submitted,
  schema,
  slateSchema,
  ...rest
}) => {
  const { value, ...inputs } = bindInput(name);
  return (
    <Field className={classes('', 'position-static').className}>
      <label htmlFor={name}>{label}</label>

      <RichBlockTextEditor
        id={name}
        name={name}
        value={value}
        schema={slateSchema}
        submitted={submitted}
        {...inputs}
        {...rest}
      />
      {submitted && ( // Only show if submitted
        <FieldErrorMessages
          label={label}
          field={getField(name, schema)}
          submitted={submitted}
        />
      )}
    </Field>
  );
};

RichBlockTextField.propTypes = {
  slateSchema: PropTypes.shape({}).isRequired,
  bindInput: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  noBorder: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
  plugins: PropTypes.arrayOf(PluginShape).isRequired,
};

RichBlockTextField.defaultProps = {
  noBorder: false,
};

export default RichBlockTextField;
