import { TFunction } from 'i18next';
import { string, number, date, object, boolean } from 'yup';

export type YupType = 'string' | 'number' | 'date' | 'object' | 'boolean';

const toYupType = (type: YupType) => {
  switch (type) {
    case 'string':
      return string();
    case 'number':
      return number();
    case 'date':
      return date();
    case 'object':
      return object();
    case 'boolean':
      return boolean();
    default:
      return string();
  }
};

export const requiredFieldsT = (label: string, t: TFunction) =>
  t('validation.isRequired', { label: t(label) });

export const requiredField = (label: string, t: TFunction, type: YupType = 'string') =>
  toYupType(type).required(requiredFieldsT(label, t));
