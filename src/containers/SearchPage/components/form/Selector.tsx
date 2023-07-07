/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from 'react-i18next';
import { unreachable } from '../../../../util/guards';
import ObjectSelector from '../../../../components/ObjectSelector';
import CheckboxSelector from './CheckboxSelector';
import InlineDatePicker from '../../../FormikForm/components/InlineDatePicker';
import { SearchParams } from './SearchForm';
import { OnFieldChangeFunction } from './GenericSearchForm';

interface SearchFormSelectorBase {
  parameterName: keyof SearchParams;
  value?: string;
  width?: number;
}

/** These types are to extract keys of a specific type from SearchParams */
type RSP = Required<SearchParams>;
type SearchParamsWithOnlyType<P> = { [k in keyof RSP]: RSP[k] extends P ? k : never }[keyof RSP];
type SearchParamsOfType<O> = { [k in SearchParamsWithOnlyType<O>]: O };

export type SearchFormSelector =
  | CheckboxSelectorType
  | CheckboxReverseSelectorType
  | ObjectSelectorType
  | DatePickerSelectorType
  | TextInputSelectorType;

interface CheckboxSelectorType extends SearchFormSelectorBase {
  formElementType: 'check-box';
  parameterName: keyof SearchParamsOfType<boolean>;
}

interface CheckboxReverseSelectorType extends SearchFormSelectorBase {
  formElementType: 'check-box-reverse';
  parameterName: keyof SearchParamsOfType<boolean>;
}

interface ObjectSelectorType extends SearchFormSelectorBase {
  formElementType: 'dropdown';
  options: { id: string; name: string }[];
  parameterName: keyof SearchParamsOfType<string>;
}

interface DatePickerSelectorType extends SearchFormSelectorBase {
  formElementType: 'date-picker';
  parameterName: keyof SearchParamsOfType<string>;
}

interface TextInputSelectorType extends SearchFormSelectorBase {
  formElementType: 'text-input';
}

interface SelectorProps {
  selector: SearchFormSelector;
  onFieldChange: OnFieldChangeFunction;
  searchObject: SearchParams;
  formType: string;
}

const Selector = ({ formType, selector, onFieldChange, searchObject }: SelectorProps) => {
  const { t } = useTranslation();
  switch (selector.formElementType) {
    case 'text-input':
      return (
        <input
          name={selector.parameterName}
          placeholder={t(`searchForm.types.${formType}Query`)}
          value={selector.value}
          onChange={(e) => onFieldChange(selector.parameterName, e.currentTarget.value, e)}
        />
      );
    case 'date-picker': {
      const datePickerValue = searchObject[selector.parameterName];
      return (
        <InlineDatePicker
          name={selector.parameterName}
          onChange={(e) => onFieldChange(selector.parameterName, e.currentTarget.value, e)}
          placeholder={t(`searchForm.types.${selector.parameterName}`)}
          value={datePickerValue ?? ''}
        />
      );
    }
    case 'check-box': {
      const checkboxValue = searchObject[selector.parameterName];
      return (
        <CheckboxSelector
          name={selector.parameterName}
          checked={checkboxValue ?? false}
          onChange={(e) => onFieldChange(selector.parameterName, e.currentTarget.checked, e)}
        />
      );
    }
    case 'check-box-reverse': {
      const checkboxValue = searchObject[selector.parameterName];
      return (
        <CheckboxSelector
          name={selector.parameterName}
          checked={!(checkboxValue ?? false)}
          onChange={(e) => onFieldChange(selector.parameterName, !e.currentTarget.checked, e)}
        />
      );
    }
    case 'dropdown': {
      const dropdownValue = searchObject[selector.parameterName];
      return (
        <ObjectSelector
          name={selector.parameterName}
          value={dropdownValue ?? ''}
          options={selector.options}
          idKey="id"
          labelKey="name"
          emptyField
          onChange={(e) => onFieldChange(selector.parameterName, e.currentTarget.value, e)}
          placeholder={t(`searchForm.types.${selector.parameterName}`)}
        />
      );
    }
    default:
      return unreachable(selector);
  }
};

export default Selector;
