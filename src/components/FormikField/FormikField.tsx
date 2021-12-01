/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement } from 'react';
import { get } from 'lodash/fp';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Field,
  connect,
  FormikContextType,
  FieldAttributes,
  FormikValues,
  FieldProps,
} from 'formik';
import { Node } from 'slate';
import styled from '@emotion/styled';
import { FormikShape } from '../../shapes';
import FormikFieldLabel from './FormikFieldLabel';
import FormikFieldDescription from './FormikFieldDescription';
import { classes } from './';
import FormikFieldHelp from './FormikFieldHelp';
import FormikRemainingCharacters from './FormikRemainingCharacters';

const StyledErrorPreLine = styled.span`
  white-space: pre-line;
`;

interface Props {
  noBorder?: boolean;
  right?: boolean;
  title?: boolean;
  name: string;
  label?: string;
  showError?: boolean;
  obligatory?: boolean;
  description?: string;
  maxLength?: number;
  showMaxLength?: boolean;
  className?: string;
  children?: (props: FieldProps & FieldAttributes<any>) => ReactElement;
  placeholder?: string;
}

const FormikField = ({
  children,
  className,
  label,
  name,
  maxLength,
  showMaxLength,
  noBorder = false,
  title = false,
  right = false,
  description,
  obligatory,
  showError = true,
  formik: { values, handleBlur, errors },
  ...rest
}: Props & { formik: FormikContextType<FormikValues> }) => {
  const { t } = useTranslation();

  const isSlateValue = Node.isNodeList(values[name]);
  const fieldActions: FieldAttributes<any> = !isSlateValue
    ? {
        onBlur: (evt: Event) => {
          handleBlur(evt);
        },
      }
    : {};
  return (
    <div {...classes('', { 'no-border': noBorder, right, title }, className)}>
      <FormikFieldLabel label={label} name={name} noBorder={noBorder} />
      <FormikFieldDescription description={description} obligatory={obligatory} />
      <Field name={name} maxLength={maxLength} {...rest} {...fieldActions}>
        {children
          ? (formikProps: FormikValues) => {
              return children({
                ...formikProps,
                field: {
                  ...formikProps.field,
                  ...fieldActions,
                },
              });
            }
          : null}
      </Field>
      {showMaxLength && maxLength && (
        <FormikRemainingCharacters
          maxLength={maxLength}
          getRemainingLabel={(maxLength, remaining) =>
            t('form.remainingCharacters', { maxLength, remaining })
          }
          value={isSlateValue ? Node.string(values[name][0]) : values[name]}
        />
      )}
      {showError && get(name, errors) && (
        <FormikFieldHelp error={!!get(name, errors)}>
          <StyledErrorPreLine>{get(name, errors)}</StyledErrorPreLine>
        </FormikFieldHelp>
      )}
    </div>
  );
};

FormikField.propTypes = {
  noBorder: PropTypes.bool,
  right: PropTypes.bool,
  title: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  showError: PropTypes.bool,
  obligatory: PropTypes.bool,
  description: PropTypes.string,
  formik: FormikShape,
  maxLength: PropTypes.number,
  showMaxLength: PropTypes.bool,
  children: PropTypes.func,
};

FormikField.defaultProps = {
  noBorder: false,
  showError: true,
  showMaxLength: false,
};

export default connect<Props, any>(FormikField);
