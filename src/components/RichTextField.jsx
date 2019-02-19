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
import { PluginShape, CommonFieldPropsShape } from '../shapes';

export class RichTextField extends React.PureComponent {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(change) {
    const {
      commonFieldProps: { bindInput },
      name,
    } = this.props;
    const { onChange } = bindInput(name);
    onChange({ target: { name, value: change.value } });
  }

  render() {
    const {
      commonFieldProps,
      name,
      label,
      noBorder,
      slateSchema,
      fieldClassName,
      ...rest
    } = this.props;
    const { submitted, schema, bindInput } = commonFieldProps;
    const { value } = bindInput(name);
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
        <RichTextEditor
          id={name}
          name={name}
          value={value}
          onChange={this.onChange}
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
  }
}

RichTextField.propTypes = {
  slateSchema: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  fieldClassName: PropTypes.string,
  noBorder: PropTypes.bool,
  plugins: PropTypes.arrayOf(PluginShape).isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
};
