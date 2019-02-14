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

const validateFormik = (values, rules, t) => {
  const errors = {};
  Object.keys(rules).forEach(ruleKey => {
    if (rules[ruleKey].numeric && !isNumeric(values[ruleKey])) {
      errors[ruleKey] = label => t('validation.isNumeric', { label });
    } else if (rules[ruleKey].required && isEmpty(values[ruleKey])) {
      errors[ruleKey] = label => t('validation.isRequired', { label });
    } else if (rules[ruleKey].allObjectFieldsRequired) {
      if (values[ruleKey].filter(v => !objectHasBothField(v)).length > 0) {
        errors[ruleKey] = label =>
          t('validation.bothFields', { labelLowerCase: label.toLowerCase() });
      }
    } else if (rules[ruleKey].dateBefore) {
      const beforeDate = values[ruleKey];
      const afterKey = rules[ruleKey].afterKey;
      const afterDate = values[afterKey];
      if (!validDateRange(beforeDate, afterDate)) {
        errors[ruleKey] = label =>
          t('validation.dateBeforeInvalid', {
            label,
            afterLabel: t('form.validDate.to.label').toLowerCase(),
          });
      }
    } else if (rules[ruleKey].dateAfter) {
      const beforeKey = rules[ruleKey].beforeKey;
      const beforeDate = values[beforeKey];
      const afterDate = values[ruleKey];
      if (!validDateRange(beforeDate, afterDate)) {
        errors[ruleKey] = label =>
          t('validation.dateAfterInvalid', {
            label,
            beforeLabel: t('form.validDate.from.label').toLowerCase(),
          });
      }
    } else if (
      rules[ruleKey].minLength &&
      minLength(values[ruleKey], rules[ruleKey].minLength)
    ) {
      errors[ruleKey] = label =>
        t('validation.minLength', {
          label,
          minLength: rules[ruleKey].minLength,
        });
    } else if (
      rules[ruleKey].maxLength &&
      maxLength(values[ruleKey], rules[ruleKey].maxLength)
    ) {
      errors[ruleKey] = label =>
        t('validation.maxLength', {
          label,
          maxLength: rules[ruleKey].maxLength,
        });
    } else if (
      rules[ruleKey].minItems &&
      minItems(values[ruleKey], rules[ruleKey].minItems)
    ) {
      errors[ruleKey] = label =>
        t('validation.minItems', {
          label,
          labelLowerCase: label.toLowerCase(),
          minItems: rules[ruleKey].minItems,
        });
    } else if (rules[ruleKey].url && !isUrl(values[ruleKey])) {
      errors[ruleKey] = label => t('validation.url', { label });
    }
  });

  return errors;
};

export default validateFormik;
