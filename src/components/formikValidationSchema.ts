/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from 'i18next';
import get from 'lodash/fp/get';
import {
  isUrl,
  isEmpty,
  minLength,
  minItems,
  maxLength,
  isNumeric,
  objectHasBothField,
  validDateRange,
} from './validators';
import { bytesToSensibleFormat } from '../util/fileSizeUtil';
import handleError from '../util/handleError';

// Taken directly from https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
// We don't really need spec compliance, but why not include it?
const EMAIL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const appendError = (error: string, newError: string): string => (error ? `${error} \n ${newError}` : newError);

const validateFormikField = <FormikValuesType, ApiTypes = any, FormikNestedValueType = {}>(
  errors: Record<string, string> = {},
  rules: RulesType<FormikValuesType, ApiTypes, FormikNestedValueType>,
  ruleKey: string,
  t: TFunction,
  values: FormikValuesType,
  label: string,
  _appendErrorKey?: string,
) => {
  const appendErrorKey = _appendErrorKey ?? ruleKey;

  const value = get(ruleKey, values);
  if (rules[ruleKey].required && isEmpty(value)) {
    errors[appendErrorKey] = appendError(errors[appendErrorKey], t('validation.isRequired', { label }));
  }

  if (rules[ruleKey].allObjectFieldsRequired) {
    if (value.filter((v: any) => !objectHasBothField(v)).length > 0) {
      errors[appendErrorKey] = appendError(
        errors[appendErrorKey],
        t('validation.bothFields', {
          labelLowerCase: label.toLowerCase(),
        }),
      );
    }
  }
  if (rules[ruleKey].dateBefore) {
    const beforeDate = value;
    const afterKey = rules[ruleKey].afterKey;
    const afterDate = get(afterKey!, values);
    if (!validDateRange(beforeDate, afterDate)) {
      errors[appendErrorKey] = appendError(
        errors[appendErrorKey],
        t('validation.dateBeforeInvalid', {
          label,
          afterLabel: t('form.validDate.to.label').toLowerCase(),
        }),
      );
    }
  }
  if (rules[ruleKey].dateAfter) {
    const beforeKey = rules[ruleKey].beforeKey;
    const beforeDate = get(beforeKey!, values);
    const afterDate = value;
    if (!validDateRange(beforeDate, afterDate)) {
      errors[appendErrorKey] = appendError(
        errors[appendErrorKey],
        t('validation.dateAfterInvalid', {
          label,
          beforeLabel: t('form.validDate.from.label').toLowerCase(),
        }),
      );
    }
  }

  if (rules[ruleKey].email) {
    const email = value;
    if (!email.match(EMAIL_REGEX)) {
      errors[appendErrorKey] = appendError(
        errors[appendErrorKey],
        t('validation.email', {
          label,
        }),
      );
    }
  }

  if (rules[ruleKey].maxSize) {
    const maxSize = rules[ruleKey].maxSize!;
    const fileSize = get(ruleKey, values);
    if (fileSize > maxSize) {
      errors[appendErrorKey] = appendError(
        errors[appendErrorKey],
        t('validation.maxSizeExceeded', {
          maxSize: bytesToSensibleFormat(maxSize),
          fileSize: bytesToSensibleFormat(fileSize),
        }),
      );
    }
  }

  const ruleMinLength = rules[ruleKey].minLength;
  if (ruleMinLength && minLength(value, ruleMinLength)) {
    errors[appendErrorKey] = appendError(
      errors[appendErrorKey],
      t('validation.minLength', {
        label,
        minLength: ruleMinLength,
      }),
    );
  }
  const ruleMaxLength = rules[ruleKey].maxLength;
  if (ruleMaxLength && maxLength(value, ruleMaxLength)) {
    errors[appendErrorKey] = appendError(
      errors[appendErrorKey],
      t('validation.maxLength', {
        label,
        maxLength: ruleMaxLength,
      }),
    );
  }
  const ruleMinItems = rules[ruleKey].minItems;
  if (ruleMinItems && minItems(value, ruleMinItems)) {
    errors[appendErrorKey] = appendError(
      errors[appendErrorKey],
      t('validation.minItems', {
        label,
        labelLowerCase: label.toLowerCase(),
        minItems: ruleMinItems,
        count: ruleMinItems,
      }),
    );
  }
  if (rules[ruleKey].numeric && !isNumeric(value)) {
    errors[appendErrorKey] = appendError(errors[appendErrorKey], t('validation.isNumeric', { label }));
  }
  if (rules[ruleKey].url && !isUrl(value)) {
    errors[appendErrorKey] = appendError(errors[appendErrorKey], t('validation.url', { label }));
  }
  if (rules[ruleKey].urlOrNumber && !isUrl(value) && !isNumeric(value)) {
    errors[appendErrorKey] = appendError(errors[appendErrorKey], t('validation.urlOrNumber', { label }));
  }

  const testFunction = rules[ruleKey].test;
  if (testFunction) {
    const testError = testFunction(values);
    if (testError) {
      errors[appendErrorKey] = appendError(
        errors[appendErrorKey],
        t(`${testError.translationKey}`, testError.variables),
      );
    }
  }
  const onlyValidateIfFunction = rules[ruleKey].onlyValidateIf;
  if (onlyValidateIfFunction && !onlyValidateIfFunction(values)) {
    delete errors[appendErrorKey];
  }

  return errors;
};

interface RuleObject<FormikValuesType, ApiType = any, FormikNestedValueType = {}> {
  minItems?: number;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  email?: boolean;
  allObjectFieldsRequired?: boolean;
  dateBefore?: boolean;
  dateAfter?: boolean;
  afterKey?: string;
  beforeKey?: string;
  numeric?: boolean;
  url?: boolean;
  urlOrNumber?: boolean;
  maxSize?: number;
  translationKey?: string;
  warnings?: {
    apiField?: keyof ApiType;
    languageMatch?: boolean;
  };
  nestedValidationRules?: Record<string, RuleObject<FormikNestedValueType, ApiType>>;
  test?: (
    value: FormikValuesType,
  ) => { translationKey: string; variables?: { [key: string]: string | boolean | number } } | undefined;
  onlyValidateIf?: (value: FormikValuesType) => boolean;
}

export type RulesType<FormikValuesType, ApiType = any, FormikNestedValueType = {}> = Record<
  string,
  RuleObject<FormikValuesType, ApiType, FormikNestedValueType>
>;

const validateFormik = <FormikValuesType, ApiTypes = any, FormikNestedValueType = {}>(
  values: FormikValuesType,
  rules: RulesType<FormikValuesType, ApiTypes, FormikNestedValueType>,
  t: TFunction,
  formType: string | undefined = undefined,
) => {
  let errors: Record<string, string> = {};
  try {
    Object.keys(rules).forEach((ruleKey) => {
      const value = get(ruleKey, values);
      const translationKey = rules[ruleKey]?.translationKey;
      const label = translationKey
        ? t(translationKey)
        : formType
          ? t(`${formType}.${ruleKey}`)
          : t(`form.name.${ruleKey}`);
      const nestedValidation = rules[ruleKey]?.nestedValidationRules;

      if (nestedValidation) {
        Object.keys(rules[ruleKey].nestedValidationRules!).forEach((nestedRuleKey) => {
          const validateFormikRecursively = (val: any, formikKey?: string) => {
            if (Array.isArray(val)) {
              val.forEach((v, i) => {
                // Match names used in nested formik forms
                const currentKey = formikKey ? `${formikKey}.${i}` : `${i}`;
                return validateFormikRecursively(v, currentKey);
              });
            } else {
              const generatedItemKey = `${ruleKey}.${formikKey}`;

              errors = {
                ...validateFormikField(
                  errors,
                  rules[ruleKey].nestedValidationRules!,
                  nestedRuleKey,
                  t,
                  val,
                  label,
                  generatedItemKey,
                ),
              };
            }
          };

          validateFormikRecursively(value, undefined);
        });
      } else {
        errors = { ...validateFormikField(errors, rules, ruleKey, t, values, label) };
      }
    });
  } catch (e) {
    handleError(e);
  }
  return errors;
};

export const getWarnings = <FormikValuesType, ApiType, FormikNestedValueType = {}>(
  values: FormikValuesType,
  rules: RulesType<FormikValuesType, ApiType, FormikNestedValueType>,
  t: TFunction,
  entity?: ApiType,
) => {
  let warnings: Record<string, string> = {};
  try {
    Object.keys(rules).forEach((ruleKey) => {
      if (rules[ruleKey].warnings) {
        const warningRules = rules[ruleKey].warnings;
        if (warningRules?.languageMatch) {
          const apiField = warningRules.apiField ?? ruleKey;
          const entityField = get([apiField], entity);
          const fieldLanguage = get('language', entityField);
          const formikLanguage = get('language', values);
          if (entity && fieldLanguage && formikLanguage !== fieldLanguage) {
            const edgeCaseWarning =
              apiField !== ruleKey
                ? {
                    [apiField]: t('warningMessage.fieldWithWrongLanguage', {
                      language: [fieldLanguage],
                    }),
                  }
                : {};
            warnings = {
              ...warnings,
              ...edgeCaseWarning,
              [ruleKey]: t('warningMessage.fieldWithWrongLanguage', { language: [fieldLanguage] }),
            };
          }
        }
      }
    });
  } catch (e) {
    handleError(e);
  }
  return warnings;
};

export default validateFormik;
