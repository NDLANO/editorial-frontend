/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * A modified version of https://github.com/davezuko/react-reformed (MIT license)
 */

import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';
import { getComponentName } from 'ndla-util';
import { isEmpty, minLength, minItems, maxLength } from './validators';

const getValidationErrors = (schema, model, fields, t) =>
  Object.keys(schema).reduce(
    (acc, key) => {
      const errors = [];
      const value = model[key];
      const rules = schema[key];
      const field = get(key, fields);
      const isDirty = field ? field.isDirty : false;

      if (rules.required && isEmpty(value)) {
        errors.push(label => t('validation.isRequired', { label }));
      }

      if (rules.minLength && minLength(value, rules.minLength)) {
        errors.push(label =>
          t('validation.minLength', { label, minLength: rules.minLength }),
        );
      }

      if (rules.maxLength && maxLength(value, rules.maxLength)) {
        errors.push(label =>
          t('validation.maxLength', { label, maxLength: rules.maxLength }),
        );
      }

      if (rules.minItems && minItems(value, rules.minItems)) {
        errors.push(label =>
          t('validation.minItems', {
            label,
            labelLowerCase: label.toLowerCase(),
            minItems: rules.minItems,
          }),
        );
      }

      if (rules.test) {
        let error;
        rules.test(value, msg => {
          error = msg;
        });
        if (error) {
          errors.push(error);
        }
      }

      return {
        ...acc,
        isValid: !errors.length && acc.isValid,
        fields: set(
          key,
          { isValid: !errors.length, errors, isDirty },
          acc.fields,
        ),
      };
    },
    { isValid: true, fields: {} },
  );

const validateSchema = schema => WrappedComponent => {
  const validated = props => {
    const validationErrors = getValidationErrors(
      schema,
      props.model,
      props.fields,
      props.t,
    );

    return React.createElement(WrappedComponent, {
      ...props,
      schema: validationErrors,
    });
  };

  validated.propTypes = {
    model: PropTypes.object, //eslint-disable-line
    fields: PropTypes.object, //eslint-disable-line
  };
  validated.displayName = `ValidateSchema(${getComponentName(
    WrappedComponent,
  )})`;
  return hoistNonReactStatics(validated, WrappedComponent);
};

export default validateSchema;
