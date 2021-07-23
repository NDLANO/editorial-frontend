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
import { MultiSelectDropdown } from '../../../components/Dropdown';
import AsyncSearchTags from '../../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import { MetaImageSearch } from '../../FormikForm';

import { SearchResult } from '../../../interfaces';
import { ConceptFormValues } from '../conceptInterfaces';
import InlineImageSearch from './InlineImageSearch';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from '../../../constants';
import { SubjectType } from '../../../modules/taxonomy/taxonomyApiInterfaces';

interface Props {
  subjects: SubjectType[];
  fetchTags: (input: string, language: string) => Promise<SearchResult>;
  inModal: boolean;
}

const ConceptMetaData = ({ subjects, fetchTags, inModal, t }: Props & tType) => {
  const { values } = useFormikContext<ConceptFormValues>();

  const conceptSubjects = subjects.filter(
    s => s.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] !== undefined,
  );

  return (
    <Fragment>
      {inModal ? (
        <InlineImageSearch name="metaImageId" />
      ) : (
        <FormikField name="metaImageId">
          {({ field, form }) => (
            <MetaImageSearch
              metaImageId={field.value}
              setFieldTouched={form.setFieldTouched}
              showRemoveButton
              {...field}
            />
          )}
        </FormikField>
      )}
      <FormikField
        name="subjects"
        label={t('form.subjects.label')}
        description={t('form.concept.subjects')}>
        {({ field }) => (
          <MultiSelectDropdown
            labelField="name"
            minSearchLength={1}
            initialData={conceptSubjects}
            {...field}
          />
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
