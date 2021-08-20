/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
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
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
} from '../../../../constants';
import { filterWrapper } from '../styles';
import { updateSubjectMetadata } from '../../../../modules/taxonomy/subjects';
import { updateTopicMetadata } from '../../../../modules/taxonomy/topics';
import ToggleExplanationSubject from './ToggleExplanationSubject';
import TaxonomyMetadataLanguageSelector from './TaxonomyMetadataLanguageSelector';
import EditOldSubjectId from './EditOldSubjectId';

interface Props extends TaxonomyElement {
  subjectId: string;
  saveSubjectItems: (subjectid: string, saveItems: Pick<TaxonomyElement, 'metadata'>) => void;
  updateLocalTopics: (
    subjectId: string,
    topicId: string,
    saveItems: Pick<TaxonomyElement, 'metadata'>,
  ) => void;
  type: 'topic' | 'subject';
}

const MenuItemCustomField = ({
  id,
  subjectId,
  metadata,
  saveSubjectItems,
  type,
  updateLocalTopics,
  t,
}: Props & tType) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [customFields, setCustomFields] = useState<TaxonomyMetadata['customFields']>(
    metadata.customFields,
  );

  useEffect(() => {
    const haveFieldsBeenUpdated = customFields !== metadata.customFields;
    if (type === 'subject' && haveFieldsBeenUpdated) {
      updateSubjectMetadata(id, { customFields }).then((res: TaxonomyMetadata) =>
        saveSubjectItems(id, { metadata: { ...metadata, customFields: res.customFields } }),
      );
    } else if (type === 'topic' && haveFieldsBeenUpdated) {
      updateTopicMetadata(id, { customFields }).then((res: TaxonomyMetadata) =>
        updateLocalTopics(subjectId, id, {
          metadata: { ...metadata, customFields: res.customFields },
        }),
      );
    }
  }, [customFields]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredSubjectFields = [
    TAXONOMY_CUSTOM_FIELD_LANGUAGE,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID,
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
            customFields={metadata.customFields}
            updateCustomFields={setCustomFields}
          />
          <ToggleExplanationSubject
            customFields={metadata.customFields}
            updateFields={setCustomFields}
          />
          <EditOldSubjectId
            updateFields={setCustomFields}
            initialVal={metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID]}
          />
        </>
      ) : (
        <GroupTopicResources
          metadata={metadata}
          topicId={id}
          subjectId={subjectId}
          updateLocalTopics={updateLocalTopics}
        />
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

export default injectT(MenuItemCustomField);
