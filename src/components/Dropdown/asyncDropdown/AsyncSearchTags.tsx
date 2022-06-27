/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
//@ts-ignore
import { DropdownInput } from '@ndla/forms';
import { FieldInputProps, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { SearchResultBase } from '../../../interfaces';

interface Props {
  language: string;
  initialTags: string[];
  field?: FieldInputProps<string[]>;
  form?: FormikHelpers<string[]>;
  fetchTags: (input: string, language: string) => Promise<SearchResultBase<string>>;
  updateValue?: (value: string[]) => void;
  disableCreate?: boolean;
  multiSelect?: boolean;
}

interface TagWithTitle {
  title: string;
}

const AsyncSearchTags = ({
  language,
  initialTags,
  field,
  form,
  fetchTags,
  updateValue,
  multiSelect,
  disableCreate,
}: Props) => {
  const { t } = useTranslation();
  const convertToTagsWithTitle = (tagsWithoutTitle: string[]) => {
    return tagsWithoutTitle.map(tag => ({ title: tag }));
  };

  const [tags, setTags] = useState<string[]>(initialTags);

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const searchForTags = async (inp: string) => {
    const response = await fetchTags(inp, language);
    const tagsWithTitle = convertToTagsWithTitle(response.results);
    return { ...response, results: tagsWithTitle };
  };

  const updateField = (newData: string[]) => {
    setTags(newData || []);
    if (form && field) {
      form.setFieldTouched(field.name, true, true);
      form.setFieldValue(field.name, newData || null, true);
    } else if (updateValue) {
      updateValue(newData);
    }
  };

  const addTag = (tag: TagWithTitle) => {
    if (tag && !tags.includes(tag.title)) {
      const temp = [...tags, tag.title];
      updateField(temp);
    }
  };

  const createNewTag = (newTag: string) => {
    if (newTag && !tags.includes(newTag.trim())) {
      const temp = [...tags, newTag.trim()];
      updateField(temp);
    }
  };

  const removeTag = (tag: string) => {
    const reduced_array = tags.filter(t => t !== tag);
    setTags(reduced_array);
    updateField(reduced_array);
  };

  return (
    <>
      <AsyncDropdown
        idField="title"
        labelField="title"
        placeholder={t('form.tags.searchPlaceholder')}
        apiAction={searchForTags}
        onChange={addTag}
        selectedItems={convertToTagsWithTitle(tags)}
        multiSelect={multiSelect}
        disableSelected
        saveOnEnter
        onCreate={!disableCreate ? createNewTag : undefined}
        removeItem={removeTag}>
        {({ selectedItems, value, removeItem, onBlur, onChange, onKeyDown }) => (
          <DropdownInput
            multiSelect
            idField={'title'}
            labelField={'title'}
            values={selectedItems}
            testid="multiselect"
            value={value}
            removeItem={removeItem}
            onBlur={onBlur}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
        )}
      </AsyncDropdown>
    </>
  );
};

export default AsyncSearchTags;
