/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { spacing } from '@ndla/core';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { Plus } from '@ndla/icons/action';
import styled from '@emotion/styled';
import { DeleteForever } from '@ndla/icons/editor';
import GroupTopicResources from '../GroupTopicResources';
import RoundIcon from '../../../../components/RoundIcon';
import { TaxonomyElement, TaxonomyMetadata } from '../../../../interfaces';
import { searchClasses } from '../../../../containers/SearchPage/SearchContainer';
import CustomFieldComponent from './CustomFieldComponent';
import {
  LOCALE_VALUES,
  TAXONOMY_CUSTOM_FIELD_LANGUAGE,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
} from '../../../../constants';
import { filterWrapper, StyledMenuItemEditField, StyledMenuItemInputField } from '../styles';
import { updateSubjectMetadata } from '../../../../modules/taxonomy/subjects';
import { updateTopicMetadata } from '../../../../modules/taxonomy/topics';
import MenuItemSaveButton from './MenuItemSaveButton';

const StyledSelect = styled('select')`
  padding: 0 ${spacing.nsmall} 0 calc(${spacing.nsmall} / 2);
  width: calc(${spacing.large} * 2);
  margin-left: 0;
  margin-right: 35%;
`;

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

  const filterHardcodedMetadataValues = () => {
    return Object.entries(customFields).filter(([taxonomyMetadataField, _]) => {
      const fieldToFilter =
        type === 'subject' ? TAXONOMY_CUSTOM_FIELD_LANGUAGE : TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES;
      return taxonomyMetadataField !== fieldToFilter;
    });
  };

  const TaxonomyMetadataLanguageSelector = () => {
    // eslint-disable-next-line react/prop-types
    const languageValue = metadata.customFields[TAXONOMY_CUSTOM_FIELD_LANGUAGE];
    return (
      <StyledMenuItemEditField>
        <RoundIcon open small />
        <StyledMenuItemInputField
          placeholder={t('taxonomy.metadata.customFields.languagePlaceholder')}
          disabled
        />
        <StyledSelect
          {...searchClasses('filters-select')}
          onChange={e => {
            e.persist();
            return setCustomFields((prevState: TaxonomyMetadata['customFields']) => ({
              ...prevState,
              [TAXONOMY_CUSTOM_FIELD_LANGUAGE]: e.target.value,
            }));
          }}
          value={customFields[TAXONOMY_CUSTOM_FIELD_LANGUAGE]}>
          {languageValue || (
            <option selected disabled hidden>
              {t('searchForm.types.language')}
            </option>
          )}
          {LOCALE_VALUES.map(option => (
            <option key={`sortoptions_${option}`} value={option}>
              {option}
            </option>
          ))}
        </StyledSelect>
        <MenuItemSaveButton
          onClick={() =>
            setCustomFields((prevState: TaxonomyMetadata['customFields']) => {
              delete prevState[TAXONOMY_CUSTOM_FIELD_LANGUAGE];
              return { ...prevState };
            })
          }
          css={{ marginLeft: `${spacing.xxsmall}` }}>
          <DeleteForever />
        </MenuItemSaveButton>
      </StyledMenuItemEditField>
    );
  };

  return (
    <div>
      {type === 'subject' ? (
        TaxonomyMetadataLanguageSelector()
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
            onClose={() => {}}
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
