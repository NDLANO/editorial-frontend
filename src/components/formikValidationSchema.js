/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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

const validateFormik = (values, rules, t, formType = undefined) => {
  const errors = {};
  Object.keys(rules).forEach(ruleKey => {
    const value = get(ruleKey, values);
    const label = formType
      ? t(`${formType}.${ruleKey}`)
      : t(`form.name.${ruleKey}`);

    if (rules[ruleKey].numeric && !isNumeric(value)) {
      errors[ruleKey] = t('validation.isNumeric', { label });
    }
    if (rules[ruleKey].required && isEmpty(value)) {
      errors[ruleKey] = t('validation.isRequired', { label });
    }
    if (rules[ruleKey].allObjectFieldsRequired) {
      if (value.filter(v => !objectHasBothField(v)).length > 0) {
        errors[ruleKey] = t('validation.bothFields', {
          labelLowerCase: label.toLowerCase(),
        });
      }
    }
    if (rules[ruleKey].dateBefore) {
      const beforeDate = value;
      const afterKey = rules[ruleKey].afterKey;
      const afterDate = get(afterKey, values);
      if (!validDateRange(beforeDate, afterDate)) {
        errors[ruleKey] = t('validation.dateBeforeInvalid', {
          label,
          afterLabel: t('form.validDate.to.label').toLowerCase(),
        });
      }
    }
    if (rules[ruleKey].dateAfter) {
      const beforeKey = rules[ruleKey].beforeKey;
      const beforeDate = get(beforeKey, values);
      const afterDate = value;
      if (!validDateRange(beforeDate, afterDate)) {
        errors[ruleKey] = t('validation.dateAfterInvalid', {
          label,
          beforeLabel: t('form.validDate.from.label').toLowerCase(),
        });
      }
    }
    if (
      rules[ruleKey].minLength &&
      minLength(value, rules[ruleKey].minLength)
    ) {
      errors[ruleKey] = t('validation.minLength', {
        label,
        minLength: rules[ruleKey].minLength,
      });
    }
    if (
      rules[ruleKey].maxLength &&
      maxLength(value, rules[ruleKey].maxLength)
    ) {
      errors[ruleKey] = t('validation.maxLength', {
        label,
        maxLength: rules[ruleKey].maxLength,
      });
    }
    if (rules[ruleKey].minItems && minItems(value, rules[ruleKey].minItems)) {
      errors[ruleKey] = t('validation.minItems', {
        label,
        labelLowerCase: label.toLowerCase(),
        minItems: rules[ruleKey].minItems,
      });
    }
    if (rules[ruleKey].url && !isUrl(value)) {
      errors[ruleKey] = t('validation.url', { label });
    }
    if (rules[ruleKey].test) {
      const errorTranslationKey = rules[ruleKey].test(value);
      if (errorTranslationKey) {
        errors[ruleKey] = t(`${errorTranslationKey}`);
      }
    }
    if (
      rules[ruleKey].onlyValidateIf &&
      !rules[ruleKey].onlyValidateIf(values)
    ) {
      delete errors[ruleKey];
    }
  });
  return errors;
};

export default validateFormik;
