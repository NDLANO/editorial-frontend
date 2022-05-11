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
import { spacing } from '@ndla/core';
import { css } from '@emotion/core';
import { Plus } from '@ndla/icons/action';
import { NodeType, SUBJECT_NODE } from '../../../../../modules/nodes/nodeApiTypes';
import {
  getNodeTypeFromNodeId,
  getRootIdForNode,
  isRootNode,
} from '../../../../../modules/nodes/nodeUtil';
import { TaxonomyMetadata } from '../../../../../modules/taxonomy/taxonomyApiInterfaces';
import { useUpdateNodeMetadataMutation } from '../../../../../modules/nodes/nodeMutations';
import {
  TAXONOMY_CUSTOM_FIELD_LANGUAGE,
  TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
} from '../../../../../constants';
import GroupTopicResources from '../../topicMenuOptions/GroupTopicResources';
import TaxonomyMetadataLanguageSelector from '../../subjectMenuOptions/TaxonomyMetadataLanguageSelector';
import SubjectCategorySelector from '../../subjectMenuOptions/SubjectCategorySelector';
import SubjectTypeSelector from '../../subjectMenuOptions/SubjectTypeSelector';
import ToggleExplanationSubject from '../../subjectMenuOptions/ToggleExplanationSubject';
import ConstantMetaField from './ConstantMetaField';
import CustomFieldComponent from './CustomFieldComponent';
import { useTaxonomyVersion } from '../../../../StructureVersion/TaxonomyVersionProvider';

interface Props {
  node: NodeType;
  onCurrentNodeChanged: (node: NodeType) => void;
}

const filterWrapper = css`
  background-color: white;
  padding: calc(${spacing.small} / 2);
  position: relative;
`;

const MenuItemCustomField = ({ node, onCurrentNodeChanged }: Props) => {
  const { t } = useTranslation();
  const { id, metadata } = node;
  const nodeType = getNodeTypeFromNodeId(id);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { taxonomyVersion } = useTaxonomyVersion();
  const [customFields, setCustomFields] = useState<TaxonomyMetadata['customFields']>(
    metadata.customFields,
  );

  const { mutateAsync: updateMetadata } = useUpdateNodeMetadataMutation();

  useEffect(() => {
    if (customFields !== metadata.customFields) {
      updateMetadata({
        id,
        metadata: { customFields },
        rootId: isRootNode(node) ? undefined : getRootIdForNode(node),
        taxonomyVersion,
      });
    }
  }, [customFields]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredRootFields = [
    TAXONOMY_CUSTOM_FIELD_LANGUAGE,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE,
    TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
  ];
  const filteredChildFields = [
    TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
    TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
  ];

  const filterHardcodedMetadataValues = () => {
    return Object.entries(customFields).filter(([taxonomyMetadataField, _]) => {
      const fieldsToFilter = nodeType === SUBJECT_NODE ? filteredRootFields : filteredChildFields;
      return !fieldsToFilter.includes(taxonomyMetadataField);
    });
  };

  const topicSettings = (
    <>
      <GroupTopicResources
        node={node}
        onChanged={partialMeta =>
          onCurrentNodeChanged({ ...node, metadata: { ...node.metadata, ...partialMeta } })
        }
      />
    </>
  );

  const subjectSettings = (
    <>
      <TaxonomyMetadataLanguageSelector
        customFields={customFields}
        updateCustomFields={setCustomFields}
      />
      <SubjectCategorySelector customFields={customFields} updateCustomFields={setCustomFields} />
      <SubjectTypeSelector customFields={customFields} updateCustomFields={setCustomFields} />
      <ToggleExplanationSubject customFields={customFields} updateFields={setCustomFields} />
      <ConstantMetaField
        keyPlaceholder={t('taxonomy.metadata.customFields.oldSubjectId')}
        valuePlaceholder={'urn:subject:***'}
        fieldKey={TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID}
        onSubmit={setCustomFields}
        initialVal={metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID]}
      />
    </>
  );

  return (
    <>
      {nodeType === SUBJECT_NODE ? subjectSettings : topicSettings}
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
    </>
  );
};

export default MenuItemCustomField;
