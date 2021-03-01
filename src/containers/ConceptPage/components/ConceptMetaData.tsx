/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { useFormikContext } from 'formik';
import FormikField from '../../../components/FormikField';
import { FormikMetaImageSearch } from '../../FormikForm';
import { MultiSelectDropdown } from '../../../components/Dropdown';
import AsyncSearchTags from '../../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import { SubjectType, SearchResult } from '../../../interfaces';

interface Props {
  subjects: SubjectType[];
  fetchTags: (input: string, language: string) => Promise<SearchResult>;
}

interface MetaDataValues {
  metaImageId: string;
  subjects: SubjectType[];
  tags: string[];
  language: string;
}

const ConceptMetaData = ({ subjects, fetchTags, t }: Props & tType) => {
  const { values } = useFormikContext<MetaDataValues>();

  return (
    <Fragment>
      <FormikField name="metaImageId">
        {({ field, form }) => (
          <FormikMetaImageSearch
            metaImageId={field.value}
            setFieldTouched={form.setFieldTouched}
            showRemoveButton
            {...field}
          />
        )}
      </FormikField>
      <FormikField name="subjects" label={t('form.subjects.label')}>
        {({ field }) => (
          <MultiSelectDropdown labelField="name" minSearchLength={1} data={subjects} {...field} />
        )}
      </FormikField>
      <FormikField
        name="tags"
        label={t('form.categories.label')}
        description={t('form.categories.description')}>
        {({ field, form }) => (
          <AsyncSearchTags
            language={values.language}
            initialTags={values.tags}
            field={field}
            form={form}
            fetchTags={fetchTags}
          />
        )}
      </FormikField>
    </Fragment>
  );
};

export default injectT(ConceptMetaData);
