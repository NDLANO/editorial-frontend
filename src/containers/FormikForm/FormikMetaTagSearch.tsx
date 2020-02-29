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
import { AsyncDropdown } from '../../components/Dropdown';
import { fetchSearchTags } from '../../modules/draft/draftApi';

interface target {
  target: {
    name: string;
    value: string[] | null;
  };
}

interface props {
  t(lang: string): void;
  locale: string;
  initTags: string[];
  field: {
    onChange: (target: target) => void;
    name: string;
  };
  form: {
    setFieldTouched: (fieldName: string, a: boolean, b: boolean) => void;
  };
}

interface asyncDropdownProps {
  selectedItems: (tags: string[]) => tagWithTitle[];
  removeItem: (tag: string) => void;
  inpProps: any;
}

interface tagWithTitle {
  title: string;
}

const FormikMetaTagSearch = ({ t, locale, initTags, field, form }: props) => {
  const convertToTagsWithTitle = (tagsWithoutTitle: string[]): object[] => {
    return tagsWithoutTitle.map(c => ({ title: c }));
  };

  const [tags, setTags] = useState(initTags);

  const searchForTags = async (inp: string) => {
    const result = await fetchSearchTags(inp, locale);
    result.results = convertToTagsWithTitle(result.results);
    return result;
  };

  const updateFormik = (formikField: props['field'], newData: string[]) => {
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const addTag = (tag: tagWithTitle) => {
    if (tag) {
      if (!tags.includes(tag.title)) {
        const temp = [...tags, tag.title];
        setTags(temp);
        updateFormik(field, temp);
        form.setFieldTouched('tags', true, true);
      }
    }
  };

  const createNewTag = (newTag: string) => {
    if (newTag) {
      if (!tags.includes(newTag.trim())) {
        const temp = [...tags, newTag.trim()];
        setTags(temp);
        updateFormik(field, temp);
        form.setFieldTouched('tags', true, true);
      }
    }
  };

  const removeTag = (tag: string) => {
    const reduced_array = tags.filter(c => c !== tag);
    setTags(reduced_array);
    updateFormik(field, reduced_array);
    form.setFieldTouched('tags', true, true);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const AsyncDropdownInput = (props: asyncDropdownProps) => {
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
        {(props: asyncDropdownProps) => <AsyncDropdownInput {...props} />}
      </AsyncDropdown>
    </Fragment>
  );
};

export default injectT(FormikMetaTagSearch);
