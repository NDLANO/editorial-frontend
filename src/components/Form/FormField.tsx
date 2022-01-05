/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ReactNode } from 'react';
import {
  ControllerFieldState,
  FieldValues,
  Noop,
  RefCallBack,
  useController,
  UseFormStateReturn,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Node } from 'slate';
import { classes } from './';
import FormFieldDescription from './FormFieldDescription';
import FormFieldHelp from './FormFieldHelp';
import FormFieldLabel from './FormFieldLabel';
import FormRemainingCharacters from './FormRemainingCharacters';

const StyledErrorPreLine = styled.span`
  white-space: pre-line;
`;

interface ControllerRenderProps<
  TFieldValues extends FieldValues,
  TName extends keyof TFieldValues & string
> {
  onChange: (...event: any[]) => void;
  onBlur: Noop;
  value: TFieldValues[TName];
  name: TName;
  ref: RefCallBack;
}

interface Props<TFieldValues extends FieldValues, TName extends keyof TFieldValues & string> {
  noBorder?: boolean;
  right?: boolean;
  title?: boolean;
  name: TName;
  label?: string;
  showError?: boolean;
  obligatory?: boolean;
  description?: string;
  maxLength?: number;
  showMaxLength?: boolean;
  className?: string;
  children: (
    props: ControllerRenderProps<TFieldValues, TName> &
      ControllerFieldState &
      UseFormStateReturn<TFieldValues>,
  ) => ReactNode;
  placeholder?: string;
}

const FormField = <TFieldValues extends FieldValues, TName extends keyof TFieldValues & string>({
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
  ...rest
}: Props<TFieldValues, TName>) => {
  const { t } = useTranslation();

  const { field, fieldState, formState } = useController<any, any>({
    name: name,
  });
  const isSlateValue = Node.isNodeList(field.value);

  return (
    <div {...classes('', { 'no-border': noBorder, right, title }, className)}>
      <FormFieldLabel label={label} name={name} noBorder={noBorder} />
      <FormFieldDescription description={description} obligatory={obligatory} />
      {children({ ...field, ...fieldState, ...formState })}
      {showMaxLength && maxLength && (
        <FormRemainingCharacters
          maxLength={maxLength}
          getRemainingLabel={(maxLength, remaining) =>
            t('form.remainingCharacters', { maxLength, remaining })
          }
          value={isSlateValue ? Node.string(field.value[0]) : field.value}
        />
      )}
      {showError && !!fieldState.error && (
        <FormFieldHelp error={!!fieldState.error.message}>
          <StyledErrorPreLine>{fieldState.error.message}</StyledErrorPreLine>
        </FormFieldHelp>
      )}
    </div>
  );
};

export default FormField;
