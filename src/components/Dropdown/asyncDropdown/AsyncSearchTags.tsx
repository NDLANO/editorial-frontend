/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { DropdownInput } from '@ndla/forms';
import { AsyncDropdown } from '../index';
import { SearchResult } from '../../../interfaces';

interface Props {
  language: string;
  value: string[];
  updateValue: (value: string[]) => void;
  fetchTags: (inp: string, language: string) => SearchResult;
}

interface AsyncDropdownProps {
  selectedItems: TagWithTitle[];
  value: string;
  removeItem: (tag: string) => void;
  onBlur: (event: any) => void;
  onChange: (event: any) => void;
  onKeyDown: (event: any) => void;
}

interface TagWithTitle {
  title: string;
}

const AsyncSearchTags = ({
  t,
  language,
  value,
  updateValue,
  fetchTags,
}: Props & tType) => {
  const convertToTagsWithTitle = (tagsWithoutTitle: string[]) => {
    return tagsWithoutTitle.map(tag => ({ title: tag }));
  };

  const [tags, setTags] = useState(value || []);

  useEffect(() => {
    setTags(value || []);
  }, [value]);

  const searchForTags = async (inp: string) => {
    const response = await fetchTags(inp, language);
    const tagsWithTitle = convertToTagsWithTitle(response.results);
    return { ...response, results: tagsWithTitle };
  };

  const addTag = (tag: TagWithTitle) => {
    if (tag && !tags.includes(tag.title)) {
      const temp = [...tags, tag.title];
      setTags(temp);
      updateValue(temp);
    }
  };

  const createNewTag = (newTag: string) => {
    if (newTag && !tags.includes(newTag.trim())) {
      const temp = [...tags, newTag.trim()];
      setTags(temp);
      updateValue(temp);
    }
  };

  const removeTag = (tag: string) => {
    const reduced_array = tags.filter(t => t !== tag);
    setTags(reduced_array);
    updateValue(reduced_array);
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
        testid="multiselect"
        value={props.value}
        removeItem={props.removeItem}
        onBlur={props.onBlur}
        onChange={props.onChange}
        onKeyDown={onKeyDown}
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
        removeItem={removeTag}>
        {(props: AsyncDropdownProps) => <AsyncDropdownInput {...props} />}
      </AsyncDropdown>
    </Fragment>
  );
};

export default injectT(AsyncSearchTags);
