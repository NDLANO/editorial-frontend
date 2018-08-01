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
import RichBlockTextEditor from './SlateEditor/RichBlockTextEditor';
import {
  Field,
  FocusLabel,
  FieldErrorMessages,
  getField,
  classes,
} from './Fields';
import { PluginShape } from '../shapes';

export const RichBlockTextField = ({
  bindInput,
  name,
  label,
  noBorder,
  submitted,
  schema,
  slateSchema,
  ...rest
}) => {
  const { value, onChange } = bindInput(name);
  return (
    <Field
      noBorder={noBorder}
      className={classes('', 'position-static').className}>
      {!noBorder ? (
        <label htmlFor={name}>{label}</label>
      ) : (
        <label className="u-hidden" htmlFor={name}>
          {label}
        </label>
      )}
      {noBorder &&
        value.map((val, i) => (
          <FocusLabel
            key={uuid()}
            name={name}
            hasFocus={() => val.value.isFocused}
            value={val.value}>
            {`${label} Blokk ${i + 1}`}
          </FocusLabel>
        ))}
      <RichBlockTextEditor
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        schema={slateSchema}
        submitted={submitted}
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
