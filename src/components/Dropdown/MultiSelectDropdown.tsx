/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Downshift, { StateChangeOptions } from "downshift";
import { FormikHandlers } from "formik";
import { ChangeEvent, useState } from "react";

//@ts-ignore
import { DropdownInput, DropdownMenu } from "@ndla/forms";
import { itemToString } from "../../util/downShiftHelpers";

interface Props<T> {
  initialData: T[];
  onChange: FormikHandlers["handleChange"];
  value: T[];
  name: string;
  labelField?: string;
  idField?: string;
  showCreateOption?: boolean;
  setFieldTouched?: (field: string, isTouched?: boolean | undefined, shouldValidate?: boolean | undefined) => void;
  minSearchLength?: number;
  shouldCreate?: (allValues: T[], newValue: T | { id: string }) => boolean;
}

export const MultiSelectDropdown = <T extends { id: string }>({
  onChange,
  value,
  name,
  initialData = [],
  setFieldTouched,
  labelField,
  minSearchLength = 2,
  idField = "id",
  showCreateOption,
  shouldCreate = (_, __) => true,
}: Props<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputvalue] = useState<string>("");

  const onValueChange = (newValue: T | { id: string }) => {
    onChange({
      target: {
        name,
        value: [...value, newValue],
      },
    });
    setInputvalue("");
    setIsOpen(false);
  };

  const onCreate = (evt?: Event) => {
    evt?.preventDefault();
    if (shouldCreate(value, { id: inputValue })) {
      onValueChange({ id: inputValue });
    }
  };

  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;

    if (value.length >= minSearchLength) {
      setIsOpen(true);
      setInputvalue(value);
      setData(
        initialData.filter((potentialResult: Record<string, any>) => {
          const string = labelField ? potentialResult[labelField] : potentialResult;
          if (typeof string === "string") {
            return string.toLowerCase().startsWith(value.toLowerCase());
          }
          return false;
        }),
      );
    } else {
      setIsOpen(false);
      setInputvalue(value);
    }
    triggerTouched();
  };

  const removeItem = (id: string) => {
    onChange({
      target: {
        name,
        value: value.filter((val: Record<string, any>) => (val[idField] ?? val) !== id),
      },
    });
    triggerTouched();
  };

  const handleStateChange = (changes: StateChangeOptions<T>) => {
    const { isOpen, type } = changes;
    if (type === Downshift.stateChangeTypes.mouseUp) {
      setIsOpen(isOpen ?? false);
    }

    if (type === Downshift.stateChangeTypes.keyDownEnter) {
      setInputvalue("");
    }
  };

  const triggerTouched = () => {
    setFieldTouched && setFieldTouched(name, true, true);
  };

  return (
    <Downshift
      onChange={onValueChange}
      isOpen={isOpen}
      inputValue={inputValue}
      onStateChange={handleStateChange}
      itemToString={(item) => itemToString(item, labelField)}
    >
      {({ getInputProps, ...downshiftProps }) => (
        <div style={{ position: "relative" }}>
          <DropdownInput
            multiSelect
            {...getInputProps({
              onChange: onInputChange,
              value: inputValue,
            })}
            idField={idField as keyof T}
            //@ts-ignore
            labelField={labelField}
            values={value}
            removeItem={removeItem}
            data-testid="multiselect"
          />
          <DropdownMenu
            multiSelect
            idField={idField}
            labelField={labelField}
            selectedItems={value}
            {...downshiftProps}
            isOpen={isOpen}
            items={data}
            onCreate={showCreateOption ? onCreate : undefined}
            positionAbsolute
            disableSelected
          />
        </div>
      )}
    </Downshift>
  );
};

export default MultiSelectDropdown;
