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
    const label = t(`form.name.${ruleKey}`);

    if (rules[ruleKey].numeric && !isNumeric(values[ruleKey])) {
      errors[ruleKey] = t('validation.isNumeric', { label });
    }
    if (rules[ruleKey].required && isEmpty(values[ruleKey])) {
      errors[ruleKey] = t('validation.isRequired', { label });
    }
    if (rules[ruleKey].allObjectFieldsRequired) {
      if (values[ruleKey].filter(v => !objectHasBothField(v)).length > 0) {
        errors[ruleKey] = t('validation.bothFields', {
          labelLowerCase: label.toLowerCase(),
        });
      }
    }
    if (rules[ruleKey].dateBefore) {
      const beforeDate = values[ruleKey];
      const afterKey = rules[ruleKey].afterKey;
      const afterDate = values[afterKey];
      if (!validDateRange(beforeDate, afterDate)) {
        errors[ruleKey] = t('validation.dateBeforeInvalid', {
          label,
          afterLabel: t('form.validDate.to.label').toLowerCase(),
        });
      }
    }
    if (rules[ruleKey].dateAfter) {
      const beforeKey = rules[ruleKey].beforeKey;
      const beforeDate = values[beforeKey];
      const afterDate = values[ruleKey];
      if (!validDateRange(beforeDate, afterDate)) {
        errors[ruleKey] = t('validation.dateAfterInvalid', {
          label,
          beforeLabel: t('form.validDate.from.label').toLowerCase(),
        });
      }
    }
    if (
      rules[ruleKey].minLength &&
      minLength(values[ruleKey], rules[ruleKey].minLength)
    ) {
      errors[ruleKey] = t('validation.minLength', {
        label,
        minLength: rules[ruleKey].minLength,
      });
    }
    if (
      rules[ruleKey].maxLength &&
      maxLength(values[ruleKey], rules[ruleKey].maxLength)
    ) {
      errors[ruleKey] = t('validation.maxLength', {
        label,
        maxLength: rules[ruleKey].maxLength,
      });
    }
    if (
      rules[ruleKey].minItems &&
      minItems(values[ruleKey], rules[ruleKey].minItems)
    ) {
      errors[ruleKey] = t('validation.minItems', {
        label,
        labelLowerCase: label.toLowerCase(),
        minItems: rules[ruleKey].minItems,
      });
    }
    if (rules[ruleKey].url && !isUrl(values[ruleKey])) {
      errors[ruleKey] = t('validation.url', { label });
    }
    
    if (rules[ruleKey].onlyValidateIf && !rules[ruleKey].onlyValidateIf(values)) {
        errors[ruleKey] = '';
    }
  });

  return errors;
};

export default validateFormik;
