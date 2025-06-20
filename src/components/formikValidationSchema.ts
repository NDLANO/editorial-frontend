/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { get, set } from "lodash-es";
import {
  isUrl,
  isEmpty,
  minLength,
  minItems,
  maxLength,
  isNumeric,
  objectHasBothField,
  validDateRange,
} from "./validators";
import { bytesToSensibleFormat } from "../util/fileSizeUtil";
import handleError from "../util/handleError";

// Taken directly from https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
// We don't really need spec compliance, but why not include it?
const EMAIL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const appendError = (error: string, newError: string): string => (error ? `${error} \n ${newError}` : newError);

interface ValidateFormikFieldType<FormikValuesType, ApiTypes = any> {
  errors: Record<string, string>;
  rules: RulesType<FormikValuesType, ApiTypes>;
  ruleKey: string;
  t: TFunction;
  values: FormikValuesType;
  label: string;
  valueKey: string;
}
const validateFormikField = <FormikValuesType, ApiTypes = any>({
  errors,
  ruleKey,
  rules,
  t,
  valueKey,
  label,
  values,
}: ValidateFormikFieldType<FormikValuesType, ApiTypes>) => {
  const rule = rules[ruleKey];

  const onlyValidateIfFunction = rule.onlyValidateIf;
  if (onlyValidateIfFunction && !onlyValidateIfFunction(values)) {
    return errors;
  }

  const value = get(values, valueKey);
  if (rule.required && isEmpty(value)) {
    const error = appendError(errors[valueKey], t("validation.isRequired", { label }));
    set(errors, valueKey, error);
  }

  if (rule.allObjectFieldsRequired) {
    if (value.filter((v: any) => !objectHasBothField(v)).length > 0) {
      const error = appendError(errors[valueKey], t("validation.bothFields", { labelLowerCase: label.toLowerCase() }));
      set(errors, valueKey, error);
    }
  }
  if (rule.dateBefore) {
    const beforeDate = value;
    const afterKey = rule.afterKey;
    const afterDate = get(values, afterKey!);
    if (!validDateRange(beforeDate, afterDate)) {
      const error = appendError(
        errors[valueKey],
        t("validation.dateBeforeInvalid", {
          label,
          afterLabel: t("form.validDate.to.label").toLowerCase(),
        }),
      );
      set(errors, valueKey, error);
    }
  }
  if (rule.dateAfter) {
    const beforeKey = rule.beforeKey;
    const beforeDate = get(values, beforeKey!);
    const afterDate = value;
    if (!validDateRange(beforeDate, afterDate)) {
      const error = appendError(
        errors[valueKey],
        t("validation.dateAfterInvalid", {
          label,
          beforeLabel: t("form.validDate.from.label").toLowerCase(),
        }),
      );
      set(errors, valueKey, error);
    }
  }

  if (rule.email) {
    const email = value;
    if (!email.match(EMAIL_REGEX)) {
      const error = appendError(errors[valueKey], t("validation.email", { label }));
      set(errors, valueKey, error);
    }
  }

  if (rule.maxSize) {
    const maxSize = rule.maxSize;
    const fileSize = get(values, valueKey);
    if (fileSize > maxSize) {
      const error = appendError(
        errors[valueKey],
        t("validation.maxSizeExceeded", {
          maxSize: bytesToSensibleFormat(maxSize),
          fileSize: bytesToSensibleFormat(fileSize),
        }),
      );
      set(errors, valueKey, error);
    }
  }

  const ruleMinLength = rule.minLength;
  if (ruleMinLength && minLength(value, ruleMinLength)) {
    const error = appendError(
      errors[valueKey],
      t("validation.minLength", {
        label,
        minLength: ruleMinLength,
      }),
    );
    set(errors, valueKey, error);
  }
  const ruleMaxLength = rule.maxLength;
  if (ruleMaxLength && maxLength(value, ruleMaxLength)) {
    const error = appendError(
      errors[valueKey],
      t("validation.maxLength", {
        label,
        maxLength: ruleMaxLength,
      }),
    );
    set(errors, valueKey, error);
  }
  const ruleMinItems = rule.minItems;
  if (ruleMinItems && minItems(value, ruleMinItems)) {
    const error = appendError(
      errors[valueKey],
      t("validation.minItems", {
        label,
        labelLowerCase: label.toLowerCase(),
        minItems: ruleMinItems,
        count: ruleMinItems,
      }),
    );
    set(errors, valueKey, error);
  }
  if (rule.numeric && !isNumeric(value)) {
    const error = appendError(errors[valueKey], t("validation.isNumeric", { label }));
    set(errors, valueKey, error);
  }
  if (rule.url && !isUrl(value)) {
    const error = appendError(errors[valueKey], t("validation.url", { label }));
    set(errors, valueKey, error);
  }
  if (rule.urlOrNumber && !isUrl(value) && !isNumeric(value)) {
    const error = appendError(errors[valueKey], t("validation.urlOrNumber", { label }));
    set(errors, valueKey, error);
  }

  const testFunction = rule.test;
  if (testFunction) {
    const testError = testFunction(values);
    if (testError) {
      const error = appendError(errors[valueKey], t(`${testError.translationKey}`, testError.variables));
      set(errors, valueKey, error);
    }
  }

  return errors;
};

interface RuleObject<FormikValuesType, ApiType = any> {
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
  isArray?: boolean;
  warnings?: {
    apiField?: keyof ApiType;
    languageMatch?: boolean;
  };
  rules?: RulesType<FormikValuesType, ApiType>;
  test?: (
    value: FormikValuesType,
  ) => { translationKey: string; variables?: { [key: string]: string | boolean | number } } | undefined;
  onlyValidateIf?: (value: FormikValuesType) => boolean;
}

export type RulesType<FormikValuesType, ApiType = any> = Record<string, RuleObject<FormikValuesType, ApiType>>;

interface ToLabelParams {
  t: TFunction;
  ruleKey: string;
  translationKey?: string;
  formType?: string;
}

const toLabel = ({ t, ruleKey, translationKey, formType }: ToLabelParams) => {
  return translationKey ? t(translationKey) : formType ? t(`${formType}.${ruleKey}`) : t(`form.name.${ruleKey}`);
};

const validateFormik = <FormikValuesType, ApiTypes = any>(
  values: FormikValuesType,
  rules: RulesType<FormikValuesType, ApiTypes>,
  t: TFunction,
  formType: string | undefined = undefined,
) => {
  let errors: Record<string, string> = {};
  try {
    Object.keys(rules).forEach((ruleKey) => {
      const value = get(values, ruleKey);
      const rule = rules[ruleKey];

      if (rule.rules && (rule.onlyValidateIf ? rule.onlyValidateIf(values) : true)) {
        Object.keys(rule.rules).forEach((nestedRuleKey) => {
          const validateFormikRecursively = (val: any, valueKey: string, ruleKey: string) => {
            if (Array.isArray(val)) {
              val.forEach((v, i) => {
                // Match names used in nested formik forms
                const currentKey = `${valueKey}.${i}`;
                return validateFormikRecursively(v, currentKey, `${ruleKey}.${nestedRuleKey}`);
              });
            } else {
              const generatedItemKey = `${valueKey}.${nestedRuleKey}`;

              const translationKey = rule.rules?.[nestedRuleKey]?.translationKey;
              const label = toLabel({ t, translationKey, ruleKey, formType });

              const newErrors = validateFormikField({
                errors,
                rules: rule.rules!,
                ruleKey: nestedRuleKey,
                t,
                values,
                label,
                valueKey: generatedItemKey,
              });

              if (Object.keys(newErrors).length > 0) {
                errors = {
                  ...newErrors,
                };
              }
            }
          };

          validateFormikRecursively(value, ruleKey, ruleKey);
        });
      } else {
        const translationKey = rule?.translationKey;
        const label = toLabel({ t, translationKey, ruleKey, formType });
        const newErrors = validateFormikField({
          errors,
          rules,
          ruleKey,
          t,
          values,
          label,
          valueKey: ruleKey,
        });
        if (Object.keys(newErrors).length > 0) {
          errors = { ...newErrors };
        }
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
  translatedFieldsToNN: string[],
  entity?: ApiType,
) => {
  let warnings: Record<string, string> = {};
  try {
    Object.keys(rules).forEach((ruleKey) => {
      const rule = rules[ruleKey];
      if (rule.warnings) {
        const warningRules = rule.warnings;
        if (warningRules?.languageMatch) {
          const apiField = (warningRules.apiField as string) ?? ruleKey;
          const entityField = get(entity, [apiField]);
          const fieldLanguage = get(entityField, "language");
          const formikLanguage = get(values, "language");
          if (entity && fieldLanguage && formikLanguage !== fieldLanguage) {
            const warningMessage = translatedFieldsToNN.includes(apiField)
              ? t("warningMessage.translatedField")
              : t("warningMessage.fieldWithWrongLanguage", {
                  language: [fieldLanguage],
                });
            const edgeCaseWarning =
              apiField !== ruleKey
                ? {
                    [apiField]: warningMessage,
                  }
                : {};
            warnings = {
              ...warnings,
              ...edgeCaseWarning,
              [ruleKey]: warningMessage,
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
