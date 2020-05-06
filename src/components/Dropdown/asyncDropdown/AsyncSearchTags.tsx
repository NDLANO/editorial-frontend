/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { DropdownInput } from '@ndla/forms';
import { FormikActions, FieldProps, FormikValues } from 'formik';
import { AsyncDropdown } from '../index';
import { TranslateType, SearchResult } from '../../../interfaces';

interface Props {
  t: TranslateType;
  language: string;
  initialTags: string[];
  field: FieldProps<string[]>['field'];
  form: {
    setFieldTouched: FormikActions<FormikValues>['setFieldTouched'];
  };
  fetchTags: (inp: string, language: string) => SearchResult;
}

interface AsyncDropdownProps {
  selectedItems: TagWithTitle[];
  removeItem: (tag: string) => void;
}

interface TagWithTitle {
  title: string;
}

const AsyncSearchTags = ({
  t,
  language,
  initialTags,
  field,
  form,
  fetchTags,
}: Props) => {
  const convertToTagsWithTitle = (tagsWithoutTitle: string[]) => {
    return tagsWithoutTitle.map(tag => ({ title: tag }));
  };

  const [tags, setTags] = useState(initialTags || []);

  const searchForTags = async (inp: string) => {
    const response = await fetchTags(inp, language);
    const tagsWithTitle = convertToTagsWithTitle(response.results);
    return { ...response, results: tagsWithTitle };
  };

  const updateFormik = (formikField: Props['field'], newData: string[]) => {
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const addTag = (tag: TagWithTitle) => {
    if (tag && !tags.includes(tag.title)) {
      const temp = [...tags, tag.title];
      setTags(temp);
      updateFormik(field, temp);
      form.setFieldTouched('tags', true, true);
    }
  };

  const createNewTag = (newTag: string) => {
    if (newTag && !tags.includes(newTag.trim())) {
      const temp = [...tags, newTag.trim()];
      setTags(temp);
      updateFormik(field, temp);
      form.setFieldTouched('tags', true, true);
    }
  };

  const removeTag = (tag: string) => {
    const reduced_array = tags.filter(t => t !== tag);
    setTags(reduced_array);
    updateFormik(field, reduced_array);
    form.setFieldTouched('tags', true, true);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const AsyncDropdownInput = (props: AsyncDropdownProps) => {
    return (
      <DropdownInput
        multiSelect
        idField={'title'}
        labelField={'title'}
        values={props.selectedItems}
        removeItem={props.removeItem}
        testid="multiselect"
        {...props}
      />
    );
  };

  return (
    <Fragment>
      <AsyncDropdown
        idField="title"
        name="TagSearch"
        labelField="title"
        placeholder={t('form.tags.searchPlaceholder')}
        label="label"
        apiAction={searchForTags}
        onChange={addTag}
        selectedItems={convertToTagsWithTitle(tags)}
        multiSelect
        disableSelected
        onCreate={createNewTag}
        onKeyDown={onKeyDown}
        removeItem={removeTag}>
        {(props: AsyncDropdownProps) => <AsyncDropdownInput {...props} />}
      </AsyncDropdown>
    </Fragment>
  );
};

export default injectT(AsyncSearchTags);
