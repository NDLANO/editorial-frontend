/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import get from 'lodash/fp/get';
import { TFunction } from 'i18next';
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
import handleError from '../util/handleError';
import { bytesToSensibleFormat } from '../util/fileSizeUtil';

const appendError = (error: string, newError: string): string =>
  error ? `${error} \n ${newError}` : newError;

interface RuleObject<FormikValuesType, ApiType = any> {
  minItems?: number;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  allObjectFieldsRequired?: boolean;
  dateBefore?: boolean;
  dateAfter?: boolean;
  afterKey?: string;
  beforeKey?: string;
  numeric?: boolean;
  url?: boolean;
  urlOrNumber?: boolean;
  maxSize?: number;
  warnings?: {
    apiField?: keyof ApiType;
    languageMatch?: boolean;
  };
  test?: (
    value: FormikValuesType,
  ) =>
    | { translationKey: string; variables?: { [key: string]: string | boolean | number } }
    | undefined;
  onlyValidateIf?: (value: FormikValuesType) => boolean;
}

export type RulesType<FormikValuesType, ApiType = any> = Record<
  string,
  RuleObject<FormikValuesType, ApiType>
>;

const validateFormik = <FormikValuesType>(
  values: FormikValuesType,
  rules: RulesType<FormikValuesType>,
  t: TFunction,
  formType: string | undefined = undefined,
) => {
  const errors: Record<string, string> = {};
  try {
    Object.keys(rules).forEach(ruleKey => {
      const value = get(ruleKey, values);
      const label = formType ? t(`${formType}.${ruleKey}`) : t(`form.name.${ruleKey}`);

      if (rules[ruleKey].required && isEmpty(value)) {
        errors[ruleKey] = appendError(errors[ruleKey], t('validation.isRequired', { label }));
      }
      if (rules[ruleKey].allObjectFieldsRequired) {
        if (value.filter((v: any) => !objectHasBothField(v)).length > 0) {
          errors[ruleKey] = appendError(
            errors[ruleKey],
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
          errors[ruleKey] = appendError(
            errors[ruleKey],
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
          errors[ruleKey] = appendError(
            errors[ruleKey],
            t('validation.dateAfterInvalid', {
              label,
              beforeLabel: t('form.validDate.from.label').toLowerCase(),
            }),
          );
        }
      }

      if (rules[ruleKey].maxSize) {
        const maxSize = rules[ruleKey].maxSize!;
        const fileSize = get(ruleKey, values);
        if (fileSize > maxSize) {
          errors[ruleKey] = appendError(
            errors[ruleKey],
            t('validation.maxSizeExceeded', {
              maxSize: bytesToSensibleFormat(maxSize),
              fileSize: bytesToSensibleFormat(fileSize),
            }),
          );
        }
      }

      const ruleMinLength = rules[ruleKey].minLength;
      if (ruleMinLength && minLength(value, ruleMinLength)) {
        errors[ruleKey] = appendError(
          errors[ruleKey],
          t('validation.minLength', {
            label,
            minLength: ruleMinLength,
          }),
        );
      }
      const ruleMaxLength = rules[ruleKey].maxLength;
      if (ruleMaxLength && maxLength(value, ruleMaxLength)) {
        errors[ruleKey] = appendError(
          errors[ruleKey],
          t('validation.maxLength', {
            label,
            maxLength: ruleMaxLength,
          }),
        );
      }
      const ruleMinItems = rules[ruleKey].minItems;
      if (ruleMinItems && minItems(value, ruleMinItems)) {
        errors[ruleKey] = appendError(
          errors[ruleKey],
          t('validation.minItems', {
            label,
            labelLowerCase: label.toLowerCase(),
            minItems: ruleMinItems,
            count: ruleMinItems,
          }),
        );
      }
      if (rules[ruleKey].numeric && !isNumeric(value)) {
        errors[ruleKey] = appendError(errors[ruleKey], t('validation.isNumeric', { label }));
      }
      if (rules[ruleKey].url && !isUrl(value)) {
        errors[ruleKey] = appendError(errors[ruleKey], t('validation.url', { label }));
      }
      if (rules[ruleKey].urlOrNumber && !isUrl(value) && !isNumeric(value)) {
        errors[ruleKey] = appendError(errors[ruleKey], t('validation.urlOrNumber', { label }));
      }
      const testFunction = rules[ruleKey].test;
      if (testFunction) {
        const testError = testFunction(values);
        if (testError) {
          errors[ruleKey] = appendError(
            errors[ruleKey],
            t(`${testError.translationKey}`, testError.variables),
          );
        }
      }
      const onlyValidateIfFunction = rules[ruleKey].onlyValidateIf;
      if (onlyValidateIfFunction && !onlyValidateIfFunction(values)) {
        delete errors[ruleKey];
      }
    });
  } catch (e) {
    handleError(e);
  }
  return errors;
};

export const getWarnings = <FormikValuesType, ApiType>(
  values: FormikValuesType,
  rules: RulesType<FormikValuesType, ApiType>,
  t: TFunction,
  entity?: ApiType,
) => {
  let warnings: Record<string, string> = {};
  try {
    Object.keys(rules).forEach(ruleKey => {
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
