/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { ITagsSearchResult } from '@ndla/types-concept-api';
import FormikField from '../../../components/FormikField';
import AsyncSearchTags from '../../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import { MetaImageSearch } from '../../FormikForm';
import { ConceptFormValues } from '../conceptInterfaces';
import InlineImageSearch from './InlineImageSearch';
import { SubjectType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import MultiSelectDropdown from '../../../components/Dropdown/MultiSelectDropdown';
import { onSaveAsVisualElement } from '../../FormikForm/utils';

interface Props {
  subjects: SubjectType[];
  fetchTags: (input: string, language: string) => Promise<ITagsSearchResult>;
  inModal: boolean;
}

const ConceptMetaData = ({ subjects, fetchTags, inModal }: Props) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ConceptFormValues>();
  const { values } = formikContext;

  return (
    <>
      {inModal ? (
        <InlineImageSearch name="metaImageId" />
      ) : (
        <FormikField name="metaImageId">
          {({ field, form }) => (
            <MetaImageSearch
              metaImageId={field.value}
              setFieldTouched={form.setFieldTouched}
              showRemoveButton
              showCheckbox={true}
              checkboxAction={image => onSaveAsVisualElement(image, formikContext)}
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
            initialData={subjects}
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
            multiSelect
            language={values.language}
            initialTags={values.tags}
            field={field}
            form={form}
            fetchTags={fetchTags}
          />
        )}
      </FormikField>
    </>
  );
};

export default ConceptMetaData;
