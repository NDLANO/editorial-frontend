/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { DropdownInput } from '@ndla/forms';
import AsyncDropdown from './AsyncDropdown';

const AsyncSearchTags = ({
  t,
  locale,
  initialTags,
  field,
  form,
  fetchTags,
}) => {
  const convertToTagsWithTitle = tagsWithoutTitle => {
    return tagsWithoutTitle.map(c => ({ title: c }));
  };

  const [tags, setTags] = useState(initialTags || []);

  const searchForTags = async inp => {
    const result = await fetchTags(inp, locale);
    result.results = convertToTagsWithTitle(result.results);
    return result;
  };

  const updateFormik = (formikField, newData) => {
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const addTag = tag => {
    if (tag) {
      if (!tags.includes(tag.title)) {
        const temp = [...tags, tag.title];
        setTags(temp);
        updateFormik(field, temp);
        form.setFieldTouched('tags', true, true);
      }
    }
  };

  const createNewTag = newTag => {
    if (newTag) {
      if (!tags.includes(newTag.trim())) {
        const temp = [...tags, newTag.trim()];
        setTags(temp);
        updateFormik(field, temp);
        form.setFieldTouched('tags', true, true);
      }
    }
  };

  const removeTag = tag => {
    const reduced_array = tags.filter(c => c !== tag);
    setTags(reduced_array);
    updateFormik(field, reduced_array);
    form.setFieldTouched('tags', true, true);
  };

  const onKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const AsyncDropdownInput = props => {
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
        placeholder={t('form.categories.searchPlaceholder')}
        label="label"
        apiAction={searchForTags}
        onChange={addTag}
        selectedItems={convertToTagsWithTitle(tags)}
        multiSelect
        disableSelected
        onCreate={createNewTag}
        onKeyDown={onKeyDown}
        removeItem={removeTag}>
        {props => <AsyncDropdownInput {...props} />}
      </AsyncDropdown>
    </Fragment>
  );
};

AsyncSearchTags.propTypes = {
  locale: PropTypes.string.isRequired,
  initialTags: PropTypes.array.isRequired,
  field: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  }),
  form: PropTypes.shape({
    setFieldTouched: PropTypes.func.isRequired,
  }),
  selectedItems: PropTypes.array,
  removeItem: PropTypes.func,
  fetchTags: PropTypes.func.isRequired,
};

export default injectT(AsyncSearchTags);
