/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { Plus } from '@ndla/icons/action';
import GroupTopicResources from '../GroupTopicResources';
import {
  TaxonomyElement,
  TaxonomyMetadata,
} from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import CustomFieldComponent from './CustomFieldComponent';
import {
  TAXONOMY_CUSTOM_FIELD_LANGUAGE,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
} from '../../../../constants';
import { filterWrapper } from '../styles';
import ToggleExplanationSubject from './ToggleExplanationSubject';
import TaxonomyMetadataLanguageSelector from './TaxonomyMetadataLanguageSelector';
import ConstantMetaField from './ConstantMetaField';
import SubjectCategorySelector from './SubjectCategorySelector';
import { useUpdateSubjectMetadata } from '../../../../modules/taxonomy/subjects/subjectsQueries';
import { useTopicMetadataUpdateMutation } from '../../../../modules/taxonomy/topics/topicQueries';

interface Props extends TaxonomyElement {
  subjectId: string;
  type: 'topic' | 'subject';
}

const MenuItemCustomField = ({ id, subjectId, metadata, type }: Props) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [customFields, setCustomFields] = useState<TaxonomyMetadata['customFields']>(
    metadata.customFields,
  );

  const { mutate: updateSubjectMetadata } = useUpdateSubjectMetadata();
  const { mutate: updateTopicMetadata } = useTopicMetadataUpdateMutation();

  useEffect(() => {
    const func = type === 'subject' ? updateSubjectMetadata : updateTopicMetadata;
    if (customFields !== metadata.customFields) {
      func({ id, metadata: { customFields } });
    }
  }, [customFields]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredSubjectFields = [
    TAXONOMY_CUSTOM_FIELD_LANGUAGE,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  ];
  const [filteredTopicFields] = [TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES];

  const filterHardcodedMetadataValues = () => {
    return Object.entries(customFields).filter(([taxonomyMetadataField, _]) => {
      const fieldsToFilter = type === 'subject' ? filteredSubjectFields : filteredTopicFields;
      return !fieldsToFilter.includes(taxonomyMetadataField);
    });
  };

  return (
    <div>
      {type === 'subject' ? (
        <>
          <TaxonomyMetadataLanguageSelector
            customFields={customFields}
            updateCustomFields={setCustomFields}
          />
          <SubjectCategorySelector
            customFields={customFields}
            updateCustomFields={setCustomFields}
          />
          <ToggleExplanationSubject customFields={customFields} updateFields={setCustomFields} />
          <ConstantMetaField
            keyPlaceholder={t('taxonomy.metadata.customFields.oldSubjectId')}
            valuePlaceholder={'urn:subject:***'}
            fieldKey={TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID}
            onSubmit={setCustomFields}
            initialVal={metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID]}
          />
        </>
      ) : (
        <GroupTopicResources metadata={metadata} topicId={id} subjectId={subjectId} />
      )}
      {filterHardcodedMetadataValues()
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => (
          <CustomFieldComponent
            key={`unique-${key}`}
            onSubmit={setCustomFields}
            initialKey={key}
            initialVal={value}
          />
        ))}

      {isOpen ? (
        <CustomFieldComponent onSubmit={setCustomFields} onClose={() => setOpen(false)} />
      ) : (
        <div css={filterWrapper}>
          <Button
            stripped
            css={css`
              text-decoration: underline;
            `}
            data-testid="addCustomFieldButton"
            onClick={() => setOpen(true)}>
            <Plus />
            {t('taxonomy.metadata.customFields.addField')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuItemCustomField;
